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
// CONFIGURACIÓN DE INFERENCIA
// ============================================

const CATEGORY_KEYWORDS = {
    gastronomia: ['restaurante', 'comida', 'cena', 'almuerzo', 'brunch', 'tapas', 'vermut', 'café', 'desayuno', 'sushi', 'pizza', 'burger', 'comer'],
    fiesta: ['fiesta', 'discoteca', 'club', 'concierto', 'música', 'dj', 'noche', 'copas', 'bailar'],
    deporte: ['deporte', 'gimnasio', 'running', 'yoga', 'padel', 'futbol', 'piscina', 'senderismo', 'bici'],
    cultura: ['museo', 'exposición', 'teatro', 'cine', 'biblioteca', 'galería', 'arte', 'historia'],
    familia: ['niños', 'familia', 'parque infantil', 'niño', 'actividades familiares'],
    relax: ['tranquilo', 'relax', 'spa', 'terraza', 'paseo', 'naturaleza']
};

function inferCategory(query: string): string {
    const q = query.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(kw => q.includes(kw))) {
            return category;
        }
    }
    return 'general';
}

function inferTemporal(query: string): { context: string, timeframe: string } {
    const q = query.toLowerCase();
    const today = new Date();
    const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const formatDate = (d: Date) => `${dayNames[d.getDay()]} ${d.getDate()} de ${monthNames[d.getMonth()]}`;

    if (q.includes('mañana')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return { context: `mañana ${formatDate(tomorrow)}`, timeframe: 'mañana' };
    }
    if (q.includes('fin de semana') || q.includes('finde')) {
        const saturday = new Date(today);
        saturday.setDate(saturday.getDate() + (6 - saturday.getDay()));
        const sunday = new Date(saturday);
        sunday.setDate(sunday.getDate() + 1);
        return { context: `fin de semana: ${formatDate(saturday)} y ${formatDate(sunday)}`, timeframe: 'este fin de semana' };
    }
    if (q.includes('semana') || q.includes('próximos días')) {
        return { context: `esta semana desde ${formatDate(today)}`, timeframe: 'los próximos 7 días' };
    }

    const currentHour = today.getHours();
    let partOfDay = 'hoy';
    if (currentHour < 12) partOfDay = 'hoy por la mañana';
    else if (currentHour < 18) partOfDay = 'hoy por la tarde';
    else partOfDay = 'hoy por la noche';

    return { context: `${partOfDay} (${formatDate(today)}, ${currentHour}:00h)`, timeframe: 'hoy' };
}

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
            console.log(`Geocoded "${placeName}": ${data[0].lat}, ${data[0].lon}`);
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }

        // Fallback
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

        return { lat: 41.5463, lng: 2.1086 };

    } catch (error) {
        console.error(`Geocoding error:`, error);
        return { lat: 41.5463, lng: 2.1086 };
    }
}

// ============================================
// HANDLER PRINCIPAL
// ============================================

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { query } = await req.json()
        if (!query) throw new Error('Query is required')

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

        // Inferir categoría y temporalidad
        const category = inferCategory(query);
        const temporal = inferTemporal(query);
        console.log(`Query: "${query}" -> Category: ${category}, Temporal: ${temporal.timeframe}`);

        // Generate Embedding
        const modelEmbedding = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const resultEmbedding = await modelEmbedding.embedContent(query);
        const embedding = resultEmbedding.embedding.values;

        // Internal Search
        const { data: internalResults, error: rpcError } = await supabase.rpc('search_map_items', {
            query_embedding: embedding,
            match_threshold: 0.25,
            match_count: 15
        })

        if (rpcError) {
            console.error("RPC Error:", rpcError);
            throw new Error(`Database Error: ${rpcError.message}`);
        }

        console.log("Internal Search Results:", internalResults?.length || 0);

        // Fallback to AI suggestions if few or low quality results
        let externalResults = [];
        const avgSimilarity = internalResults?.length > 0
            ? internalResults.reduce((sum: number, r: any) => sum + (r.similarity || 0), 0) / internalResults.length
            : 0;

        console.log("Average Similarity:", avgSimilarity.toFixed(2));

        const shouldFallback = !internalResults || internalResults.length < 3 || avgSimilarity < 0.4;

        if (shouldFallback) {
            console.log("Triggering AI fallback...");
            try {
                externalResults = await performAISuggestions(query, category, temporal, genAI, supabase);
                console.log("AI Results:", externalResults.length);
            } catch (e) {
                console.error("AI Suggestion Error:", e);
            }
        }

        return new Response(JSON.stringify({
            internal: internalResults || [],
            external: externalResults,
            total: (internalResults?.length || 0) + externalResults.length,
            meta: {
                category_detected: category,
                temporal_context: temporal.timeframe,
                avg_similarity: avgSimilarity.toFixed(2),
                used_ai_fallback: shouldFallback
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

// ============================================
// AI SUGGESTIONS
// ============================================

async function performAISuggestions(query: string, category: string, temporal: { context: string, timeframe: string }, genAI: any, supabase: any) {
    try {
        const categoryContextMap: Record<string, string> = {
            gastronomia: 'restaurantes, bares de tapas, cafeterías, sitios para comer',
            fiesta: 'bares con música, discotecas, locales nocturnos, sitios para salir',
            deporte: 'gimnasios, instalaciones deportivas, parques para hacer deporte',
            cultura: 'museos, teatros, exposiciones, espacios culturales',
            familia: 'parques infantiles, actividades para niños, planes familiares',
            relax: 'cafés tranquilos, terrazas, espacios para desconectar',
            general: 'lugares interesantes y populares'
        };

        const categoryContext = categoryContextMap[category] || categoryContextMap.general;

        const prompt = `Eres un experto local de Sabadell, España. Sugiere 3 lugares REALES que existan para: "${query}".

📅 CONTEXTO TEMPORAL: ${temporal.context}
🎯 CATEGORÍA DETECTADA: ${category.toUpperCase()}
🔍 BUSCANDO: ${categoryContext}

INSTRUCCIONES CRÍTICAS:
1. SOLO lugares que EXISTAN REALMENTE en Sabadell
2. Que estén ABIERTOS o disponibles ${temporal.timeframe}
3. Incluye la dirección REAL y completa
4. El nombre debe ser el nombre OFICIAL del establecimiento
${category === 'familia' ? '5. Verifica que sea APTO PARA NIÑOS' : ''}
${category === 'fiesta' && temporal.timeframe === 'hoy' ? '5. Solo lugares abiertos de NOCHE' : ''}

RESPONDE ÚNICAMENTE con JSON válido (sin explicaciones):
[
  {
    "title": "Nombre OFICIAL del lugar",
    "description": "Descripción breve (máx 60 chars)",
    "category": "cafe|restaurant|park|culture|bar|shop|event|kids|sport",
    "location": "Calle Real 123, Sabadell",
    "tags": ["tag1", "tag2"]
  }
]

Si no conoces lugares reales en Sabadell, devuelve: []`;

        // Usar gemini-1.5-flash (más estable que 2.0-flash)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Calling Gemini 1.5 Flash...");
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("Gemini response preview:", responseText.substring(0, 200));

        // Parse JSON
        let jsonText = responseText.trim();
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.log("No JSON array found");
            return [];
        }

        const places = JSON.parse(jsonMatch[0]);
        if (!Array.isArray(places) || places.length === 0) return [];

        console.log(`Gemini returned ${places.length} suggestions`);

        // Geocode y guardar
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const enrichedPlaces = [];

        for (const place of places.slice(0, 3)) {
            try {
                const coords = await geocodeAddress(place.title, place.location || '');
                await new Promise(resolve => setTimeout(resolve, 1100)); // Rate limit

                const text = `${place.title}: ${place.description} ${place.tags?.join(' ') || ''}`;
                const embeddingResult = await embeddingModel.embedContent(text);

                const dbPlace = {
                    title: place.title,
                    description: place.description,
                    category: place.category || 'other',
                    location_name: place.location,
                    tags: place.tags || [],
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
                    if (existing.lat === 41.5463 && coords.lat !== 41.5463) {
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
                    console.error(`Insert error:`, error.message);
                    enrichedPlaces.push({
                        ...place,
                        lat: coords.lat,
                        lng: coords.lng,
                        similarity: 0.85,
                        is_external: true
                    });
                } else {
                    enrichedPlaces.push({
                        ...inserted,
                        similarity: 0.85,
                        is_external: true
                    });
                }
            } catch (e) {
                console.error(`Error processing ${place.title}:`, e);
            }
        }

        return enrichedPlaces;
    } catch (error) {
        console.error("AI Suggestions Error:", error);
        return [];
    }
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
