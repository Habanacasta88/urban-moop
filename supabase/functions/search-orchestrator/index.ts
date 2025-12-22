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

        // 1. Init Clients
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const geminiKey = Deno.env.get('GEMINI_API_KEY')

        if (!supabaseUrl || !supabaseKey || !geminiKey) {
            throw new Error('Missing Environment Variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY)')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)
        const genAI = new GoogleGenerativeAI(geminiKey)

        // 2. Intent Parsing (Gemini Flash)
        // TODO: Implement intent parsing
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // parseUserIntent(query) ...

        // 3. Generate Embedding (Gemini Embedding)
        const modelEmbedding = genAI.getGenerativeModel({ model: "embedding-001" });
        const resultEmbedding = await modelEmbedding.embedContent(query);
        const embedding = resultEmbedding.embedding.values;

        // 4. Internal Search (Supabase RPC)
        const { data: internalResults, error: rpcError } = await supabase.rpc('search_venues', {
            query_embedding: embedding,
            match_threshold: 0.7, // Adjust threshold
            match_count: 5,
            filter_vibes: null, // extracted from intent
            filter_price_max: null // extracted from intent
        })

        if (rpcError) throw rpcError

        // 5. Fallback Check
        if (!internalResults || internalResults.length < 3) {
            // 6. External Search (Gemini Pro)
            // const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro", tools: [{ googleSearch: {} }] });
            // ...
            // For now, return what we have with a flag
            return new Response(JSON.stringify({
                source: 'internal',
                results: internalResults,
                message: 'Low confidence, external search not yet implemented'
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
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
