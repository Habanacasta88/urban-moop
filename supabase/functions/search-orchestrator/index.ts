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
            match_threshold: 0.1, // Ultra-low threshold to verify ANY data
            match_count: 5
        })

        if (rpcError) {
            console.error("RPC Error:", rpcError);
            throw new Error(`Database Error: ${rpcError.message}`);
        }

        console.log("Search Results:", internalResults?.length || 0);

        // 5. Fallback Check
        if (!internalResults || internalResults.length < 1) {
            return new Response(JSON.stringify({
                source: 'internal',
                results: [],
                message: 'No relevant results found. (External search disabled)'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        return new Response(JSON.stringify({
            source: 'internal',
            results: internalResults
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
