// Setup instructions:
// 1. Install Deno extension in VSCode if editing here.
// 2. npm install -g supabase
// 3. supabase functions deploy search-orchestrator --no-verify-jwt (or with verify if using auth)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { query } = await req.json()
        if (!query) throw new Error('Query is required')

        if (query === '!SEED') {
            return await handleSeeding(req);
        }

        // 1. Init Clients
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const geminiKey = Deno.env.get('GEMINI_API_KEY')

        console.log("Environment Check:", {
            url: !!supabaseUrl,
            key: !!supabaseKey,
            gemini: !!geminiKey,
        })

        if (!supabaseUrl || !supabaseKey || !geminiKey) {
            throw new Error(`Missing Environment Variables: ${!supabaseUrl ? 'SUPABASE_URL ' : ''}${!supabaseKey ? 'SUPABASE_SERVICE_ROLE_KEY ' : ''}${!geminiKey ? 'GEMINI_API_KEY' : ''}`)
        }

        const supabase = createClient(supabaseUrl, supabaseKey)
        const genAI = new GoogleGenerativeAI(geminiKey)

        // 2. Intent Parsing (TODO)
        // const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 3. Generate Embedding
        // Using newer text-embedding-004
        const modelEmbedding = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const resultEmbedding = await modelEmbedding.embedContent(query);
        const embedding = resultEmbedding.embedding.values;

        // 4. Internal Search (Supabase RPC)
        const { data: internalResults, error: rpcError } = await supabase.rpc('search_map_items', {
            query_embedding: embedding,
            match_threshold: 0.3, // Balanced threshold (was 0.1, 0.6 too strict)
            match_count: 10
        })

        if (rpcError) {
            console.error("RPC Error:", rpcError);
            throw new Error(`Database Error: ${rpcError.message}`);
        }

        console.log("Internal Search Results:", internalResults?.length || 0);
        if (internalResults && internalResults.length > 0) {
            console.log("Sample result:", JSON.stringify(internalResults[0]));
        }

        // 5. Hybrid Logic: Fallback to AI suggestions if:
        //    - Less than 3 results, OR
        //    - Average similarity is low (< 0.5) meaning poor quality matches
        let externalResults = [];

        const avgSimilarity = internalResults && internalResults.length > 0
            ? internalResults.reduce((sum: number, r: any) => sum + (r.similarity || 0), 0) / internalResults.length
            : 0;

        console.log("Average Similarity:", avgSimilarity.toFixed(2));

        const shouldFallback = !internalResults || internalResults.length < 3 || avgSimilarity < 0.5;

        if (shouldFallback) {
            console.log("Triggering AI suggestions fallback...");
            try {
                externalResults = await performWebSearch(query, genAI, supabase);
                console.log("AI Suggestion Results:", externalResults.length);
            } catch (webError) {
                console.error("AI Suggestion Error:", webError);
                // Continue with internal results only
            }
        }

        // 6. Return Mixed Results
        return new Response(JSON.stringify({
            internal: internalResults || [],
            external: externalResults,
            total: (internalResults?.length || 0) + externalResults.length
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        console.error("Orchestrator Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})

// Web Search with Gemini - with fallback for Search Grounding
async function performWebSearch(query: string, genAI: any, supabase: any) {
    try {
        // 1. Parse temporal context from query
        const today = new Date();
        const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const formatDate = (d: Date) => `${dayNames[d.getDay()]} ${d.getDate()} de ${monthNames[d.getMonth()]}`;

        let temporalContext = `hoy (${formatDate(today)})`;
        let searchTimeframe = 'hoy';

        const queryLower = query.toLowerCase();

        if (queryLower.includes('mañana')) {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            temporalContext = `mañana (${formatDate(tomorrow)})`;
            searchTimeframe = 'mañana';
        } else if (queryLower.includes('fin de semana') || queryLower.includes('finde')) {
            const saturday = new Date(today);
            saturday.setDate(saturday.getDate() + (6 - saturday.getDay()));
            const sunday = new Date(saturday);
            sunday.setDate(sunday.getDate() + 1);
            temporalContext = `este fin de semana (${formatDate(saturday)} y ${formatDate(sunday)})`;
            searchTimeframe = 'este fin de semana';
        } else if (queryLower.includes('esta semana') || queryLower.includes('próximos días')) {
            const endWeek = new Date(today);
            endWeek.setDate(endWeek.getDate() + 7);
            temporalContext = `esta semana (del ${formatDate(today)} al ${formatDate(endWeek)})`;
            searchTimeframe = 'los próximos 7 días';
        } else if (queryLower.includes('este mes')) {
            temporalContext = `este mes (${monthNames[today.getMonth()]} ${today.getFullYear()})`;
            searchTimeframe = 'este mes';
        }

        console.log("Temporal Context:", temporalContext);

        // 2. Create prompt for Gemini (works without Search Grounding)
        const prompt = `Eres un experto local de Sabadell, España. Basándote en tu conocimiento de lugares reales y populares de Sabadell, sugiere lugares que coincidan con: "${query}".

CONTEXTO: ${temporalContext}

REQUISITOS:
- SOLO lugares reales que existan en Sabadell
- Que sean relevantes para ${searchTimeframe}
- Máximo 3 sugerencias
- Prioriza lugares populares y bien valorados
${queryLower.includes('niño') || queryLower.includes('familia') ? '- Enfócate en actividades familiares y para niños' : ''}

RESPONDE SOLO con un JSON array (sin explicaciones):
[
  {
    "title": "Nombre del lugar",
    "description": "Descripción breve (50 caracteres max)",
    "category": "cafe|restaurant|park|culture|bar|shop|event|kids|sport",
    "location": "Dirección en Sabadell",
    "tags": ["tag1", "tag2"],
    "hours": "Horario aproximado",
    "lat": 41.54,
    "lng": 2.10
  }
]

Si no conoces lugares relevantes en Sabadell, devuelve: []`;

        // 3. Try with gemini-1.5-flash (fast and reliable)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Calling Gemini for local suggestions...");
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("Gemini response received");

        // 4. Parse JSON response
        let jsonText = responseText.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const places = JSON.parse(jsonText);

        if (!Array.isArray(places) || places.length === 0) {
            console.log("No places returned from Gemini");
            return [];
        }

        console.log(`Gemini returned ${places.length} places`);

        // 5. Generate embeddings and cache in DB
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const enrichedPlaces = [];

        for (const place of places.slice(0, 3)) {
            try {
                const text = `${place.title}: ${place.description} ${place.tags?.join(' ') || ''}`;
                const embeddingResult = await embeddingModel.embedContent(text);

                const dbPlace = {
                    title: place.title,
                    description: place.description,
                    category: place.category || 'other',
                    location_name: place.location,
                    tags: place.tags || [],
                    hours: place.hours,
                    lat: place.lat || 41.5475,
                    lng: place.lng || 2.1088,
                    embedding: embeddingResult.embedding.values,
                    source: 'ai_suggestion',
                    discovered_at: new Date().toISOString(),
                    image_url: null
                };

                const { data: inserted, error: insertError } = await supabase
                    .from('map_items')
                    .insert(dbPlace)
                    .select()
                    .single();

                if (insertError) {
                    console.error("Cache Insert Error:", insertError.message);
                    enrichedPlaces.push({
                        ...place,
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
            } catch (placeError) {
                console.error(`Error processing ${place.title}:`, placeError);
            }
        }

        return enrichedPlaces;

    } catch (error) {
        console.error("Web Search Error:", error);
        return [];
    }
}

async function handleSeeding(req: Request) {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiKey = Deno.env.get('GEMINI_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    // 1. Fetch existing items that need embedding
    // For now, just fetch recent 50 items to ensure we cover the map
    const { data: items, error: fetchError } = await supabase
        .from('map_items')
        .select('id, title, description, category, tags')
        .limit(50);

    if (fetchError) throw new Error(`Fetch Error: ${fetchError.message}`);
    if (!items || items.length === 0) return new Response(JSON.stringify({ message: "No items to seed" }), { headers: corsHeaders });

    const results = [];

    // 2. Generate and Update
    for (const item of items) {
        try {
            const textToEmbed = `${item.title}: ${item.description || ''} ${item.category || ''} ${item.tags ? item.tags.join(' ') : ''}`;

            const embeddingResult = await model.embedContent(textToEmbed);
            const embedding = embeddingResult.embedding.values;

            // Update row
            const { error: updateError } = await supabase
                .from('map_items')
                .update({ embedding })
                .eq('id', item.id);

            if (updateError) console.error(`Update Error for ${item.title}`, updateError);
            else results.push(item.title);

        } catch (e) {
            console.error(`Embedding Error for ${item.title}`, e);
        }
    }

    return new Response(JSON.stringify({
        message: "Smart Embedding Complete",
        seeded_count: results.length,
        items: results
    }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
}
