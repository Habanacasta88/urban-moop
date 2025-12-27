// Setup instructions:
// 1. Install Deno extension in VSCode if editing here.
// 2. npm install -g supabase
// 3. supabase functions deploy search-orchestrator --no-verify-jwt

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.21.0'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ============================================
// CONFIGURACIÓN DE CATEGORÍAS Y FILTROS
// ============================================

const CATEGORY_CONFIG = {
    fiesta: {
        keywords: ['fiesta', 'discoteca', 'club', 'concierto', 'música en vivo', 'dj', 'noche', 'copas', 'bailar'],
        geminiContext: 'locales de ocio nocturno, discotecas, bares con música, conciertos, eventos de fiesta',
        vibes: ['energético', 'social', 'nocturno'],
        timePreference: 'noche'
    },
    gastronomia: {
        keywords: ['restaurante', 'comida', 'cena', 'almuerzo', 'brunch', 'tapas', 'vermut', 'café', 'desayuno', 'sushi', 'pizza', 'burger'],
        geminiContext: 'restaurantes, bares de tapas, cafeterías, sitios para comer, brunch, vermut',
        vibes: ['gastronómico', 'social', 'relax'],
        timePreference: 'flexible'
    },
    deporte: {
        keywords: ['deporte', 'gimnasio', 'running', 'yoga', 'padel', 'futbol', 'piscina', 'senderismo', 'bici'],
        geminiContext: 'instalaciones deportivas, gimnasios, rutas de running, parques para deporte, actividades fitness',
        vibes: ['activo', 'saludable', 'energético'],
        timePreference: 'mañana'
    },
    cultura: {
        keywords: ['museo', 'exposición', 'teatro', 'cine', 'biblioteca', 'galería', 'arte', 'historia', 'arquitectura'],
        geminiContext: 'museos, teatros, exposiciones, galerías de arte, espacios culturales, monumentos',
        vibes: ['cultural', 'tranquilo', 'educativo'],
        timePreference: 'tarde'
    },
    familia: {
        keywords: ['niños', 'familia', 'parque infantil', 'actividades familiares', 'zoo', 'acuario', 'taller infantil', 'niño'],
        geminiContext: 'parques infantiles, actividades para niños, planes familiares, espacios kid-friendly',
        vibes: ['familiar', 'divertido', 'seguro'],
        timePreference: 'mañana-tarde'
    },
    relax: {
        keywords: ['tranquilo', 'relax', 'spa', 'terraza', 'paseo', 'lectura', 'café tranquilo', 'naturaleza'],
        geminiContext: 'cafés tranquilos, terrazas relajadas, parques, espacios para desconectar, spas',
        vibes: ['tranquilo', 'chill', 'relax'],
        timePreference: 'flexible'
    },
    social: {
        keywords: ['quedada', 'conocer gente', 'networking', 'afterwork', 'vermut', 'terraza', 'buen ambiente'],
        geminiContext: 'bares con buen ambiente, terrazas sociales, espacios para conocer gente, afterwork',
        vibes: ['social', 'animado', 'buen rollo'],
        timePreference: 'tarde-noche'
    }
};

const TIME_CONFIG = {
    hoy: {
        label: 'hoy',
        searchWindow: 'las próximas horas de hoy',
        urgency: 'inmediato'
    },
    manana: {
        label: 'mañana',
        searchWindow: 'mañana durante todo el día',
        urgency: 'planificado'
    },
    semana: {
        label: 'esta semana',
        searchWindow: 'los próximos 7 días',
        urgency: 'flexible'
    },
    finde: {
        label: 'este fin de semana',
        searchWindow: 'este sábado y domingo',
        urgency: 'planificado'
    }
};

// ============================================
// GEOCODING CON NOMINATIM
// ============================================

async function geocodeAddress(placeName: string, address: string): Promise<{ lat: number, lng: number }> {
    try {
        const searchQuery = `${placeName}, ${address}, Sabadell, Spain`;
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;

        const response = await fetch(url, {
            headers: { 'User-Agent': 'UrbanMoop/1.0' }
        });

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }

        // Fallback: buscar solo el nombre en Sabadell
        const fallbackUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName + ', Sabadell, Spain')}&format=json&limit=1`;
        const fallbackResponse = await fetch(fallbackUrl, {
            headers: { 'User-Agent': 'UrbanMoop/1.0' }
        });
        const fallbackData = await fallbackResponse.json();

        if (fallbackData && fallbackData.length > 0) {
            return {
                lat: parseFloat(fallbackData[0].lat),
                lng: parseFloat(fallbackData[0].lon)
            };
        }

        return { lat: 41.5463, lng: 2.1086 }; // Centro de Sabadell

    } catch (error) {
        console.error(`Geocoding error:`, error);
        return { lat: 41.5463, lng: 2.1086 };
    }
}

// ============================================
// GENERADOR DE PROMPTS INTELIGENTE
// ============================================

function buildSmartPrompt(filters: SearchFilters): string {
    const today = new Date();
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const currentHour = today.getHours();
    const formatDate = (d: Date) => `${dayNames[d.getDay()]} ${d.getDate()} de ${monthNames[d.getMonth()]}`;

    // Determinar contexto temporal
    const timeConfig = TIME_CONFIG[filters.when] || TIME_CONFIG.hoy;
    let temporalContext = '';

    if (filters.when === 'hoy') {
        if (currentHour < 12) {
            temporalContext = `hoy ${formatDate(today)} por la MAÑANA (ahora son las ${currentHour}:00)`;
        } else if (currentHour < 18) {
            temporalContext = `hoy ${formatDate(today)} por la TARDE (ahora son las ${currentHour}:00)`;
        } else {
            temporalContext = `hoy ${formatDate(today)} por la NOCHE (ahora son las ${currentHour}:00)`;
        }
    } else if (filters.when === 'manana') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        temporalContext = `mañana ${formatDate(tomorrow)}`;
    } else if (filters.when === 'finde') {
        const saturday = new Date(today);
        saturday.setDate(saturday.getDate() + (6 - saturday.getDay()));
        const sunday = new Date(saturday);
        sunday.setDate(sunday.getDate() + 1);
        temporalContext = `este fin de semana: ${formatDate(saturday)} y ${formatDate(sunday)}`;
    } else {
        temporalContext = `esta semana (desde ${formatDate(today)})`;
    }

    // Obtener configuración de categoría
    const categoryConfig = CATEGORY_CONFIG[filters.category] || CATEGORY_CONFIG.social;

    // Construir prompt optimizado
    const prompt = `Eres un experto local de Sabadell, España. Tu misión es recomendar lugares y actividades REALES que existan.

📅 CONTEXTO TEMPORAL: ${temporalContext}
🎯 CATEGORÍA: ${filters.category?.toUpperCase() || 'GENERAL'}
🔍 BUSCANDO: ${categoryConfig.geminiContext}

${filters.freeText ? `💬 NOTA ADICIONAL DEL USUARIO: "${filters.freeText}"` : ''}

INSTRUCCIONES CRÍTICAS:
1. SOLO lugares que EXISTAN REALMENTE en Sabadell
2. Que estén ABIERTOS o tengan actividad en ${timeConfig.searchWindow}
3. Prioriza lugares POPULARES y bien valorados
4. Incluye la dirección REAL y completa
5. Si es un EVENTO, incluye fecha y hora específica

${filters.when === 'hoy' && currentHour >= 18 ? '⚠️ ES DE NOCHE: Prioriza lugares abiertos en horario nocturno' : ''}
${filters.category === 'fiesta' ? '⚠️ FIESTA: Incluye horario de cierre y si hay eventos especiales' : ''}
${filters.category === 'familia' ? '⚠️ FAMILIA: Verifica que sea apto para niños' : ''}

RESPONDE ÚNICAMENTE con este JSON (sin texto adicional):
[
  {
    "title": "Nombre OFICIAL del lugar",
    "description": "Qué lo hace especial para ${filters.category || 'planes'} (máx 80 chars)",
    "category": "${mapCategoryToDb(filters.category)}",
    "location": "Calle Real 123, 08201 Sabadell",
    "tags": ["tag1", "tag2", "tag3"],
    "hours": "Horario relevante para ${timeConfig.label}",
    "vibe": "${categoryConfig.vibes[0]}",
    "price_level": "€|€€|€€€",
    "best_for": "${timeConfig.label}"
  }
]

MÁXIMO 5 resultados. Si no conoces lugares reales, devuelve: []`;

    return prompt;
}

function mapCategoryToDb(category: string): string {
    const mapping: Record<string, string> = {
        'fiesta': 'bar',
        'gastronomia': 'restaurant',
        'deporte': 'sport',
        'cultura': 'culture',
        'familia': 'kids',
        'relax': 'cafe',
        'social': 'bar'
    };
    return mapping[category] || 'other';
}

// ============================================
// INTERFACES
// ============================================

interface SearchFilters {
    when: 'hoy' | 'manana' | 'semana' | 'finde';
    category: 'fiesta' | 'gastronomia' | 'deporte' | 'cultura' | 'familia' | 'relax' | 'social';
    orderBy: 'relevance' | 'distance';
    freeText?: string;
    userLat?: number;
    userLng?: number;
}

// ============================================
// HANDLER PRINCIPAL
// ============================================

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json();

        // Soportar tanto query simple como filtros estructurados
        const query = body.query;
        const filters: SearchFilters = body.filters || {
            when: 'hoy',
            category: 'social',
            orderBy: 'relevance'
        };

        // Si viene query libre, intentar inferir categoría
        if (query && !body.filters) {
            filters.freeText = query;
            filters.category = inferCategory(query);
            filters.when = inferTemporal(query);
        }

        if (query === '!SEED') {
            return await handleSeeding(req);
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const geminiKey = Deno.env.get('GEMINI_API_KEY')

        if (!supabaseUrl || !supabaseKey || !geminiKey) {
            throw new Error('Missing Environment Variables')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)
        const genAI = new GoogleGenerativeAI(geminiKey)

        // Generar embedding para búsqueda en DB
        const searchText = filters.freeText || `${filters.category} ${filters.when}`;
        const modelEmbedding = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const resultEmbedding = await modelEmbedding.embedContent(searchText);
        const embedding = resultEmbedding.embedding.values;

        // Búsqueda en DB con filtros
        const categoryFilter = mapCategoryToDb(filters.category);
        const { data: internalResults, error: rpcError } = await supabase.rpc('search_map_items', {
            query_embedding: embedding,
            match_threshold: 0.25,
            match_count: 15
        });

        if (rpcError) {
            console.error("RPC Error:", rpcError);
            throw new Error(`Database Error: ${rpcError.message}`);
        }

        console.log("Internal Search Results:", internalResults?.length || 0);

        // Filtrar por categoría si hay resultados
        let filteredResults = internalResults || [];
        if (categoryFilter && filteredResults.length > 0) {
            const categoryMatches = filteredResults.filter((r: any) => r.category === categoryFilter);
            if (categoryMatches.length >= 2) {
                filteredResults = categoryMatches;
            }
        }

        // Calcular si necesitamos fallback a IA
        const avgSimilarity = filteredResults.length > 0
            ? filteredResults.reduce((sum: number, r: any) => sum + (r.similarity || 0), 0) / filteredResults.length
            : 0;

        console.log("Average Similarity:", avgSimilarity.toFixed(2));

        let externalResults = [];
        const shouldFallback = filteredResults.length < 3 || avgSimilarity < 0.4;

        if (shouldFallback) {
            console.log(`Fallback to AI: ${filteredResults.length} results, avg similarity: ${avgSimilarity.toFixed(2)}`);
            try {
                externalResults = await performSmartSearch(filters, genAI, supabase);
                console.log("AI Suggestion Results:", externalResults.length);
            } catch (e) {
                console.error("AI Search Error:", e);
            }
        }

        // Ordenar resultados
        let allResults = [...filteredResults, ...externalResults];

        if (filters.orderBy === 'distance' && filters.userLat && filters.userLng) {
            allResults = allResults.sort((a: any, b: any) => {
                const distA = calculateDistance(filters.userLat!, filters.userLng!, a.lat, a.lng);
                const distB = calculateDistance(filters.userLat!, filters.userLng!, b.lat, b.lng);
                return distA - distB;
            });
        }

        return new Response(JSON.stringify({
            internal: filteredResults.slice(0, 10),
            external: externalResults,
            total: allResults.length,
            filters_applied: filters,
            meta: {
                avg_similarity: avgSimilarity.toFixed(2),
                used_ai_fallback: shouldFallback
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});

// ============================================
// BÚSQUEDA INTELIGENTE CON GEMINI
// ============================================

async function performSmartSearch(filters: SearchFilters, genAI: any, supabase: any) {
    try {
        const prompt = buildSmartPrompt(filters);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Calling Gemini with smart prompt...");
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Parse JSON
        let jsonText = responseText.trim();
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.log("No JSON found in response");
            return [];
        }

        const places = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(places) || places.length === 0) return [];

        console.log(`Gemini returned ${places.length} places for ${filters.category}/${filters.when}`);

        // Geocodificar y guardar
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const enrichedPlaces = [];

        for (const place of places.slice(0, 5)) {
            try {
                // Geocodificar
                const coords = await geocodeAddress(place.title, place.location || '');
                await new Promise(resolve => setTimeout(resolve, 1100)); // Rate limit Nominatim

                // Generar embedding
                const text = `${place.title}: ${place.description} ${place.tags?.join(' ') || ''}`;
                const embeddingResult = await embeddingModel.embedContent(text);

                const dbPlace = {
                    title: place.title,
                    description: place.description,
                    category: place.category || mapCategoryToDb(filters.category),
                    location_name: place.location,
                    tags: place.tags || [],
                    hours: place.hours,
                    lat: coords.lat,
                    lng: coords.lng,
                    embedding: embeddingResult.embedding.values,
                    source: 'ai_suggestion',
                    discovered_at: new Date().toISOString(),
                    image_url: null
                };

                // Verificar duplicados
                const { data: existing } = await supabase
                    .from('map_items')
                    .select('id, lat, lng')
                    .eq('title', place.title)
                    .single();

                if (existing) {
                    // Actualizar coords si necesario
                    if (coords.lat !== 41.5463 && existing.lat === 41.5463) {
                        await supabase
                            .from('map_items')
                            .update({ lat: coords.lat, lng: coords.lng })
                            .eq('id', existing.id);
                    }

                    enrichedPlaces.push({
                        ...place,
                        id: existing.id,
                        lat: coords.lat,
                        lng: coords.lng,
                        similarity: 0.85,
                        is_external: true
                    });
                    continue;
                }

                const { data: inserted, error } = await supabase
                    .from('map_items')
                    .insert(dbPlace)
                    .select()
                    .single();

                if (error) {
                    console.error("Insert error:", error.message);
                }

                enrichedPlaces.push({
                    ...(inserted || place),
                    lat: coords.lat,
                    lng: coords.lng,
                    similarity: 0.85,
                    is_external: true
                });

            } catch (e) {
                console.error(`Error processing ${place.title}:`, e);
            }
        }

        return enrichedPlaces;
    } catch (error) {
        console.error("Smart Search Error:", error);
        return [];
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function inferCategory(query: string): SearchFilters['category'] {
    const q = query.toLowerCase();

    for (const [category, config] of Object.entries(CATEGORY_CONFIG)) {
        if (config.keywords.some(kw => q.includes(kw))) {
            return category as SearchFilters['category'];
        }
    }

    return 'social'; // Default
}

function inferTemporal(query: string): SearchFilters['when'] {
    const q = query.toLowerCase();

    if (q.includes('mañana')) return 'manana';
    if (q.includes('fin de semana') || q.includes('finde')) return 'finde';
    if (q.includes('semana') || q.includes('próximos días')) return 'semana';

    return 'hoy';
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ============================================
// SEEDING
// ============================================

async function handleSeeding(req: Request) {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiKey = Deno.env.get('GEMINI_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    const { data: items, error: fetchError } = await supabase
        .from('map_items')
        .select('id, title, description, category, tags')
        .limit(50);

    if (fetchError) throw new Error(`Fetch Error: ${fetchError.message}`);
    if (!items || items.length === 0) {
        return new Response(JSON.stringify({ message: "No items to seed" }), { headers: corsHeaders });
    }

    const results: string[] = [];

    for (const item of items) {
        try {
            const textToEmbed = `${item.title}: ${item.description || ''} ${item.category || ''} ${item.tags ? item.tags.join(' ') : ''}`;
            const embeddingResult = await model.embedContent(textToEmbed);
            const embedding = embeddingResult.embedding.values;

            const { error: updateError } = await supabase
                .from('map_items')
                .update({ embedding })
                .eq('id', item.id);

            if (!updateError) results.push(item.title);
        } catch (e) {
            console.error(`Embedding Error for ${item.title}`, e);
        }
    }

    return new Response(JSON.stringify({
        message: "Seeding Complete",
        seeded_count: results.length,
        items: results
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}
