import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { MessageSquare, ArrowLeft, Plus } from 'lucide-react';
import './Chat.css';

const ConversationsList = ({ onSelectConversation, onBack }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchConversations();
    }, [user]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            // 1. Get IDs of conversations I'm in
            const { data: myConvos, error: partError } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('user_id', user.id);

            if (partError) throw partError;

            if (!myConvos || myConvos.length === 0) {
                setConversations([]);
                return;
            }

            const conversationIds = myConvos.map(c => c.conversation_id);

            // 2. Get conversation details
            const { data: convDetails, error: convError } = await supabase
                .from('conversations')
                .select('*')
                .in('id', conversationIds);

            if (convError) throw convError;

            setConversations(convDetails || []);

        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const createTestConversation = async () => {
        try {
            // Create conversation
            const { data: conv, error: convError } = await supabase
                .from('conversations')
                .insert({ type: 'direct' })
                .select()
                .single();

            if (convError) throw convError;

            // Add me as participant
            const { error: partError } = await supabase
                .from('conversation_participants')
                .insert({
                    conversation_id: conv.id,
                    user_id: user.id
                });

            if (partError) throw partError;

            fetchConversations();
        } catch (error) {
            console.error('Error creating test chat:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-700">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold">Mensajes</h2>
                <div className="flex-1" />
                <button onClick={createTestConversation} className="p-2 rounded-full hover:bg-gray-700 bg-gray-800 border border-gray-600">
                    <Plus size={20} />
                </button>
            </div>

            <div className="chat-messages p-0">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Cargando chats...</div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-70">
                        <MessageSquare size={48} className="mb-4 text-gray-600" />
                        <p>No tienes mensajes aún.</p>
                        <button onClick={createTestConversation} className="mt-4 text-primary text-sm font-bold">
                            Crear Chat de Prueba (Echo)
                        </button>
                    </div>
                ) : (
                    conversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => onSelectConversation(conv.id)}
                            className="conv-item"
                        >
                            <div className="avatar-placeholder">
                                {conv.type === 'direct' ? 'U' : conv.type === 'business' ? 'B' : 'G'}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white">
                                    {conv.title || (conv.type === 'direct' ? 'Chat Personal' : 'Grupo')}
                                </h3>
                                <p className="text-sm text-gray-400">Pulsa para ver mensajes...</p>
                            </div>
                            <span className="text-xs text-gray-600">
                                {new Date(conv.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationsList;
