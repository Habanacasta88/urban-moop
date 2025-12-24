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
            match_threshold: 0.6, // More selective threshold
            match_count: 10
        })

        if (rpcError) {
            console.error("RPC Error:", rpcError);
            throw new Error(`Database Error: ${rpcError.message}`);
        }

        console.log("Internal Search Results:", internalResults?.length || 0);

        // 5. Hybrid Logic: Fallback to Web Search if <3 results
        let externalResults = [];

        if (!internalResults || internalResults.length < 3) {
            console.log("Triggering web search fallback...");
            try {
                externalResults = await performWebSearch(query, genAI, supabase);
                console.log("Web Search Results:", externalResults.length);
            } catch (webError) {
                console.error("Web Search Error:", webError);
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

// Web Search with Gemini Search Grounding + Auto-Cache
async function performWebSearch(query: string, genAI: any, supabase: any) {
    try {
        // 1. Use Gemini with Search Grounding
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp",
            tools: [{ googleSearch: {} }]
        });

        // 2. Structured Prompt
        const prompt = `Busca lugares reales en Sabadell, España que coincidan con: "${query}".

IMPORTANTE:
- SOLO lugares que estén en Sabadell
- Que estén abiertos o sean relevantes HOY
- Máximo 3 resultados
- Información verificable y actual

Devuelve un JSON array con este formato exacto:
[
  {
    "title": "Nombre exacto del lugar",
    "description": "Descripción breve (max 100 caracteres)",
    "category": "cafe|restaurant|park|culture|bar|shop",
    "location": "Dirección completa en Sabadell",
    "tags": ["tag1", "tag2", "tag3"],
    "hours": "Horario de hoy o 'Consultar horarios'",
    "lat": 41.5xxx,
    "lng": 2.1xxx
  }
]

Si no encuentras lugares relevantes, devuelve un array vacío: []`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 3. Parse JSON (handle markdown code blocks)
        let jsonText = responseText.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const places = JSON.parse(jsonText);

        if (!Array.isArray(places) || places.length === 0) {
            return [];
        }

        // 4. Generate embeddings and prepare for DB
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const enrichedPlaces = [];

        for (const place of places.slice(0, 3)) { // Max 3 results
            try {
                // Generate embedding
                const text = `${place.title}: ${place.description} ${place.tags?.join(' ') || ''}`;
                const embeddingResult = await embeddingModel.embedContent(text);

                // Prepare DB object
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
                    source: 'web_discovery',
                    discovered_at: new Date().toISOString(),
                    image_url: null // Will be added later if needed
                };

                // 5. Insert into DB (cache)
                const { data: inserted, error: insertError } = await supabase
                    .from('map_items')
                    .insert(dbPlace)
                    .select()
                    .single();

                if (insertError) {
                    console.error("Cache Insert Error:", insertError);
                    // Still return the result even if caching fails
                    enrichedPlaces.push({
                        ...place,
                        similarity: 0.85, // High similarity for web results
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
                console.error(`Error processing place ${place.title}:`, placeError);
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
