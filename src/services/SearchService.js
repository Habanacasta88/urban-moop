import { supabase } from '../lib/supabaseClient';

export const SearchService = {
    /**
     * Performs a smart search using the search-orchestrator Edge Function.
     * @param {string} query - The natural language query from the user.
     * @returns {Promise<{source: 'internal'|'external', results: Array, message?: string}>}
     */
    async search(query) {
        try {
            const { data, error } = await supabase.functions.invoke('search-orchestrator', {
                body: { query }
            });

            if (error) {
                console.error('Smart Search Error:', error);
                throw error;
            }

            return data;
        } catch (err) {
            console.error('Search Service Exception:', err);
            // Fallback empty response or rethrow
            throw err;
        }
    }
};
