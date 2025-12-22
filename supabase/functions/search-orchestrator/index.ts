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
        const { data: internalResults, error: rpcError } = await supabase.rpc('search_venues', {
            query_embedding: embedding,
            match_threshold: 0.5, // Lowered threshold for testing
            match_count: 5,
            filter_vibes: null,
            filter_price_max: null
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

    const SAMPLE_VENUES = [
        {
            name: "Biblioteca Vapor Badia",
            description: "Un sitio tranquilo para leer y estudiar con silencio absoluto. Ideal para concentrarse.",
            category: "culture",
            vibes: ["quiet", "study", "chill"],
            price_level: 0,
            location: "Carrer de les Tres Creus, Sabadell"
        },
        {
            name: "Bar La Terraza 2",
            description: "Terraza animada para tomar algo con amigos. Música alta y ambiente festivo.",
            category: "bar",
            vibes: ["party", "social", "music"],
            price_level: 2,
            location: "Plaça Major, Sabadell"
        },
        {
            name: "Parc Catalunya",
            description: "Gran parque verde para pasear al perro, hacer picnic o salir con niños.",
            category: "park",
            vibes: ["nature", "kids", "pet_friendly"],
            price_level: 0,
            location: "Eix Macià, Sabadell"
        },
        {
            name: "Cines Imperial",
            description: "Cine clásico en el centro. Perfecto para una cita romántica o ver estrenos.",
            category: "cinema",
            vibes: ["romantic", "movie", "indoor"],
            price_level: 2,
            location: "Rambla, Sabadell"
        }
    ];

    const results = [];

    for (const venue of SAMPLE_VENUES) {
        // Generate embedding
        const embeddingResult = await model.embedContent(`${venue.name}: ${venue.description} ${venue.vibes.join(' ')}`);
        const embedding = embeddingResult.embedding.values;

        // Insert
        const { data, error } = await supabase.from('venues').insert({
            ...venue,
            embedding
        }).select();

        if (error) console.error("Insert Error", error);
        results.push(data ? data[0] : null);
    }

    return new Response(JSON.stringify({ message: "Seeding Complete", seeded: results.length }), {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    });
}
