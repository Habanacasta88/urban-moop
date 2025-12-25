import { supabase } from '../lib/supabaseClient';

export const SearchService = {
    /**
     * Performs a smart search using the search-orchestrator Edge Function.
     * Includes retry logic and validation.
     * @param {string} query - The natural language query from the user.
     * @param {number} retries - Number of retry attempts (default: 2)
     * @returns {Promise<{internal: Array, external: Array, total: number}>}
     */
    async search(query, retries = 2) {
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            console.warn('Invalid search query');
            return { internal: [], external: [], total: 0 };
        }

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const { data, error } = await supabase.functions.invoke('search-orchestrator', {
                    body: { query: query.trim() }
                });

                if (error) {
                    console.error(`Search Error (attempt ${attempt + 1}):`, error);
                    if (attempt === retries) throw error;
                    continue;
                }

                // Validate response structure
                if (!data || typeof data !== 'object') {
                    console.warn('Invalid search response structure');
                    return { internal: [], external: [], total: 0 };
                }

                // Ensure arrays exist
                return {
                    internal: Array.isArray(data.internal) ? data.internal : [],
                    external: Array.isArray(data.external) ? data.external : [],
                    total: data.total || 0
                };

            } catch (err) {
                if (attempt < retries) {
                    // Wait before retry (exponential backoff)
                    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                } else {
                    console.error('Search Service Exception after retries:', err);
                    return { internal: [], external: [], total: 0 };
                }
            }
        }

        return { internal: [], external: [], total: 0 };
    }
};
