import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';

export const ContactBusinessModal = ({ isOpen, onClose, businessName, onChatCreated }) => {
    const { contactBusiness } = useActivity();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (message) => {
        if (!user) {
            // If checking from App, auth modal should have triggered before, but double check
            alert("Necesitas iniciar sesión para chatear.");
            return;
        }

        setIsLoading(true);
        try {
            const convId = await contactBusiness(businessName, message);
            if (convId && onChatCreated) {
                onClose();
                onChatCreated(convId);
            }
        } catch (error) {
            console.error("Failed to start chat", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="bg-[#1a1a1a] w-full p-6 pb-12 rounded-t-[2rem] border-t border-white/10 relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white text-xl font-bold leading-tight">
                                Enviar mensaje a <br />
                                <span className="text-indigo-400">{businessName}</span>
                            </h3>
                            <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleSendMessage("👋 ¡Hola! Me interesa el evento")}
                                    className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-white flex items-center gap-3 font-medium border border-white/5"
                                >
                                    <span className="text-xl">👋</span>
                                    <span>¡Hola! Me interesa el evento</span>
                                </button>

                                <button
                                    onClick={() => handleSendMessage("📍 ¿Cómo llego al lugar?")}
                                    className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-white flex items-center gap-3 font-medium border border-white/5"
                                >
                                    <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                        <MapPin size={14} />
                                    </span>
                                    <span>¿Cómo llego al lugar?</span>
                                </button>

                                <button
                                    onClick={() => handleSendMessage("🕒 ¿Cuál es el horario?")}
                                    className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-white flex items-center gap-3 font-medium border border-white/5"
                                >
                                    <span className="text-xl">🕒</span>
                                    <span>¿Cuál es el horario?</span>
                                </button>
                            </div>
                        )}

                        <p className="text-center text-xs text-gray-500 mt-6">
                            Al enviar un mensaje aceptas los términos de uso.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
