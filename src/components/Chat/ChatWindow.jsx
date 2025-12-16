import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, Send } from 'lucide-react';
import './Chat.css';

const ChatWindow = ({ conversationId, onBack }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch initial messages and subscribe
    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data || []);
            }
            setLoading(false);
        };

        fetchMessages();

        // Subscribe to new messages
        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    const newMsg = payload.new;
                    setMessages(prev => [...prev, newMsg]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const text = newMessage.trim();
        setNewMessage(''); // Optimistic clear

        const { error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                content: text
            });

        if (error) {
            console.error('Error sending message:', error);
            // Could restore text here if failed
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-700">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-sm">
                        C
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Chat</h2>
                        <p className="text-xs text-green-400">En línea</p>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {loading && <div className="text-center text-gray-500 mt-4">Cargando mensajes...</div>}

                {!loading && messages.length === 0 && (
                    <div className="text-center text-gray-600 mt-10 text-sm">
                        Escribe el primer mensaje...
                    </div>
                )}

                {messages.map(msg => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                        <div key={msg.id} className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                            {msg.content}
                            <span className="text-[10px] opacity-50 block text-right mt-1">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
