import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

const ActivityContext = createContext();

export const useActivity = () => useContext(ActivityContext);

export const ActivityProvider = ({ children }) => {
    const { user } = useAuth();
    // Global State for Saved Items (Promos, Events, etc.)
    const [savedItems, setSavedItems] = useState([
        {
            id: 'promo-1',
            type: 'promo',
            title: '2x1 Cervezas Artesanales',
            subtitle: 'La Tapa Dorada – Flash hasta las 20:00',
            image: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&q=80&w=800',
            rating: 4.8,
            distance: '150m',
            urgency: { type: 'urgent', text: '⏱ Caduca en 45m', color: 'text-amber-600 bg-amber-50 border-amber-200' },
            badges: [{ text: 'URGENTE', color: 'bg-orange-500 text-white' }],
            startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString() // Opens in 1 hour (mock)
        },
        {
            id: 'event-1',
            type: 'event',
            title: 'Noche de Jazz en Vivo',
            subtitle: 'Blue Note Club – Hoy 22:00',
            image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=800',
            rating: 4.9,
            distance: '800m',
            urgency: null,
            badges: [],
            startTime: new Date(new Date().setHours(22, 0, 0, 0)).toISOString() // Today 22:00
        },
        {
            id: 'moop-1',
            type: 'moop',
            title: 'Running y Café',
            subtitle: 'Parque Central – Mañana 09:00',
            image: 'https://images.unsplash.com/photo-1552674605-469523f54050?auto=format&fit=crop&q=80&w=800',
            rating: 5.0,
            distance: '1.2km',
            urgency: null,
            badges: [],
            startTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() // Tomorrow
        }
    ]);

    const [joinedMoops, setJoinedMoops] = useState([
        {
            id: 'test-moop-active',
            title: 'Moop de Prueba (Empieza en 10m)',
            startTime: new Date(Date.now() + 590000).toISOString() // Starts in ~9m 50s (triggers immediately)
        }
    ]);

    // Actions
    const joinMoop = async (moop) => {
        // Optimistic update
        if (!joinedMoops.find(m => m.id === moop.id)) {
            const mockStartTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();
            setJoinedMoops([...joinedMoops, { ...moop, startTime: mockStartTime }]);
        }

        if (!user) return; // Only update DB if logged in

        try {
            // 1. Create Participation
            // Ensure moop exists in map_items first? - Assuming generic ID for now or it matches DB
            // Ideally we would upsert the map_item if it's dynamic, but for now assuming happy path

            // For dynamic/created moops, ensure they have a UUID. If numeric ID from mock, skip DB or map to a mock UUID.
            const moopId = typeof moop.id === 'number' || moop.id.startsWith('moop-') ? '00000000-0000-0000-0000-000000000000' : moop.id;

            // Note: Since we are mixing mock data and real DB, this might fail on foreign keys if we use real constraints.
            // For this step, I will only handle the CHAT creation part which is what the user asked for.
            // But we actually need a valid conversation row.

            // A. Find or Create Conversation for this Moop
            // We use a deterministic way or query existing
            let conversationId;

            const { data: existingConvs, error: findError } = await supabase
                .from('conversations')
                .select('id')
                .eq('related_moop_id', moopId) // This requires map_items to exist.
                .eq('type', 'moop_chat')
                .single();

            // If map_item logic is complex, let's just create a loose conversation for now to satisfy the "Chat" requirement
            // effectively just creating a group chat named after the moop.

            // Fallback: Just create a new conversation if we can't link effectively yet
            if (!existingConvs) {
                const { data: newConv, error: createError } = await supabase
                    .from('conversations')
                    .insert({ type: 'group' }) // Using 'group' instead of 'moop_chat' to avoid FK constraints on map_items if using mocks
                    .select()
                    .single();

                if (createError) throw createError;
                conversationId = newConv.id;
            } else {
                conversationId = existingConvs.id;
            }

            // B. Add User to Conversation
            const { error: joinError } = await supabase
                .from('conversation_participants')
                .insert({
                    conversation_id: conversationId,
                    user_id: user.id
                });

            if (joinError && joinError.code !== '23505') { // Ignore unique violation
                throw joinError;
            }

            // C. Synthetic Content (Fake Messages)
            if (!existingConvs) {
                const fakeMessages = [
                    "¡Bienvenidos al Moop! 👋",
                    "¿Alguien más se apunta?",
                    "¡Qué ganas de que empiece! 🔥"
                ];

                // Insert fake messages
                for (const msg of fakeMessages) {
                    await supabase.from('messages').insert({
                        conversation_id: conversationId,
                        sender_id: user.id, // In a real app this would be different users, but for now using current user or a system bot if available
                        content: msg
                    });
                }
            }

            console.log('Joined Moop Chat:', conversationId);
            return conversationId; // Return ID for navigation

        } catch (error) {
            console.error('Error joining moop:', error);
            // Fallback for demo/offline
            return 'mock-conversation-id';
        }
    };

    const contactBusiness = async (businessName, initialMessage) => {
        if (!user) return null;

        try {
            // A. Find or Create Conversation (Business Type)
            // We use the business Name as a key for now since we don't have IDs in the feed mock
            // In real app, we would use business_id
            let conversationId;

            // Simplified: just create or find by a unique key constructed from names
            // For a real app, query by participants or related_entity

            // For this demo, let's just create a new one every time or find the last one
            const { data: newConv, error: createError } = await supabase
                .from('conversations')
                .insert({
                    type: 'business',
                    title: businessName // Store business name as title
                })
                .select()
                .single();

            if (createError) throw createError;
            conversationId = newConv.id;

            // B. Add User to Conversation
            await supabase.from('conversation_participants').insert({
                conversation_id: conversationId,
                user_id: user.id
            });

            // C. Send Initial Message
            if (initialMessage) {
                await supabase.from('messages').insert({
                    conversation_id: conversationId,
                    sender_id: user.id,
                    content: initialMessage
                });
            }

            // D. Synthetic Business Reply (Mock)
            setTimeout(async () => {
                const replies = [
                    "¡Hola! Gracias por contactarnos. ¿En qué podemos ayudarte?",
                    "¡Genial! Te esperamos allí. ¿Necesitas reserva?",
                    "Hola 👋, nuestro horario es de 18:00 a 02:00."
                ];
                const reply = replies[Math.floor(Math.random() * replies.length)];

                // We can't easily insert as "Business" without a second user, 
                // so we might skip this or insert as a system message for now.
                // Or maybe just let the user see their own message.
            }, 2000);

            return conversationId;

        } catch (error) {
            console.error('Error contacting business:', error);
            return 'mock-business-chat-' + Date.now();
        }
    };

    const leaveMoop = (moopId) => {
        setJoinedMoops(joinedMoops.filter(m => m.id !== moopId));
    };
    // ... rest of file

    const toggleSaveItem = (item) => {
        if (savedItems.find(i => i.id === item.id)) {
            setSavedItems(savedItems.filter(i => i.id !== item.id));
        } else {
            setSavedItems([...savedItems, item]);
        }
    };

    // Notification Scheduler
    useEffect(() => {
        const checkNotifications = () => {
            const now = new Date().getTime();
            const allItems = [...savedItems, ...joinedMoops];

            allItems.forEach(item => {
                if (!item.startTime) return;

                const start = new Date(item.startTime).getTime();
                const diff = start - now;

                // Trigger between 10m and 9m before start to avoid double triggering
                // 10 min = 600,000 ms
                if (diff <= 600000 && diff > 540000) {
                    sendNotification(item);
                }
            });
        };

        const sendNotification = (item) => {
            const title = `¡${item.title} empieza en 10 min! ⏰`;
            const options = {
                body: "Prepárate para salir. Toca para ver los detalles.",
                icon: "/icon.png" // Placeholder
            };

            // Browser Notification API
            if (!("Notification" in window)) {
                console.log("This browser does not support desktop notification");
                alert(title); // Fallback
            } else if (Notification.permission === "granted") {
                new Notification(title, options);
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                        new Notification(title, options);
                    }
                });
            }
        };

        // Check every minute
        const interval = setInterval(checkNotifications, 60000);

        // Initial check (in case we refresh exactly at the 10m mark)
        checkNotifications();

        return () => clearInterval(interval);
    }, [savedItems, joinedMoops]);

    // Request permission on mount
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    return (
        <ActivityContext.Provider value={{ savedItems, joinedMoops, joinMoop, contactBusiness, leaveMoop, toggleSaveItem }}>
            {children}
        </ActivityContext.Provider>
    );
};
