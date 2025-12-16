import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MAP_DATA as MOCK_DATA } from '../components/Map/MapData'; // Fallback

export const useSupabaseMapItems = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('map_items')
                    .select('*');

                if (error) throw error;

                if (data && data.length > 0) {
                    // Map DB snake_case to frontend camelCase
                    const mappedEvents = data.map(item => ({
                        id: item.id,
                        type: item.type,
                        title: item.title,
                        emoji: item.emoji,
                        location: item.location_name, // DB: location_name -> UI: location
                        lat: item.lat,
                        lng: item.lng,
                        attendees: item.attendees,
                        category: item.category,
                        image: item.image_url || MOCK_DATA.find(m => m.title === item.title)?.image || 'https://images.unsplash.com/photo-1512350500250-882df4f6630c?q=80&w=1080', // Fallback to mock image or default
                        time: item.start_time ? new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ahora', // Format time
                        description: item.description,
                        tags: item.tags || [],
                        badges: item.badges || [],
                        isLive: item.is_live, // DB: is_live -> UI: isLive
                        isFlash: item.is_flash, // DB: is_flash -> UI: isFlash
                        flashExpiresAt: item.is_flash && item.start_time ? new Date(new Date(item.start_time).getTime() + 3600000).toISOString() : null, // Mock expiration based on start time + 1h if not DB field
                        rawStartTime: item.start_time // Keep raw for logic
                    }));
                    // MERGE: Combine DB items with local Mock/Static items to ensure recent additions are visible
                    // This creates a hybrid mode good for dev/demos
                    const uniqueEvents = [...mappedEvents, ...MOCK_DATA.filter(m => !mappedEvents.find(d => d.id === m.id))];
                    setEvents(uniqueEvents);
                } else {
                    // Fallback to mock data if DB is empty (optional, but good for testing)
                    console.warn('Supabase returned no data, using fallback mock data.');
                    setEvents(MOCK_DATA);
                }

            } catch (err) {
                console.error('Error fetching map items:', err);
                setError(err.message);
                // Fallback on error
                setEvents(MOCK_DATA);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { events, loading, error };
};
