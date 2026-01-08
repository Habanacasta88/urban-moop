import { Heart, Clock, Users, ChevronLeft, ChevronRight, X, MapPin, Star, Bookmark, Share2, Zap, Activity, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useVibe } from '../../context/VibeContext';
import { useActivity } from '../../context/ActivityContext';
import { useState, useMemo } from 'react';

const MapEventCard = ({ event, distance, onClose }) => {
    const { openVibeCheck } = useVibe();
    const { savedItems, toggleSaveItem } = useActivity();

    // UI State for overlays (Toast, Rating Modal, Social Modal)
    const [overlayMode, setOverlayMode] = useState('none'); // 'none' | 'toast' | 'rating' | 'social' | 'rated'

    // Derived Interest State from Context
    const isSaved = useMemo(() => savedItems.some(i => String(i.id) === String(event.id)), [savedItems, event.id]);

    // Mock Data for "People Going"
    const attendees = [
        { id: 1, name: 'Laura', vibe: '😌', distance: '300 m', avatar: 'https://i.pravatar.cc/150?u=1' },
        { id: 2, name: 'Marc', vibe: '🔥', distance: '150 m', avatar: 'https://i.pravatar.cc/150?u=2' },
        { id: 3, name: 'Sonia', vibe: '🙂', distance: '500 m', avatar: 'https://i.pravatar.cc/150?u=3' },
        { id: 4, name: 'Pol', vibe: '🤯', distance: '600 m', avatar: 'https://i.pravatar.cc/150?u=4' },
    ];

    const handleInterestClick = () => {
        if (isSaved) {
            // Unsave
            toggleSaveItem(event);
            setOverlayMode('none');
        } else {
            // Save & Show Toast
            // Normalize event for SavedScreen (add defaults if missing)
            const savedEvent = {
                ...event,
                type: event.type || 'event',
                subtitle: event.description || event.location, // Fallback
                badges: event.isFlash ? [{ text: 'FLASH', color: 'bg-yellow-400 text-black' }] : [],
                distance: distance || 'Cerca',
                // Keep other props
            };
            toggleSaveItem(savedEvent);
            setOverlayMode('toast');
        }
    };

    const handleRateClick = () => {
        setOverlayMode('rating');
    };

    const handleSocialClick = () => {
        setOverlayMode('social');
    };

    const handleVibeSubmit = (vibe) => {
        setOverlayMode('rated');
        // Show confirmation or close
        setTimeout(() => onClose(), 1500); // Close card after rating for "Habit Loop" effect
    };

    const dismissOverlay = () => {
        setOverlayMode('none');
    };

    if (!event) return null;

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-white z-[2000] overflow-y-auto"
        >
            {/* Header Image */}
            <div className="relative h-72 bg-gray-200">
                <ImageWithFallback src={event.image || event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors z-10">
                    <X size={20} />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{event.emoji}</span>
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border border-white/30">
                            {event.category || 'Evento'}
                        </span>
                    </div>
                    <h1 className="text-3xl font-black leading-tight mb-1 shadow-sm">{event.title}</h1>
                </div>
            </div>

            <div className="relative bg-white -mt-4 rounded-t-3xl px-6 pt-8 min-h-[500px] pb-32">

                {/* Info Blocks */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {/* Location */}
                    <div className="bg-gray-50 p-3 rounded-2xl flex flex-col gap-1 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin size={14} className="text-gray-400" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Ubicación</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{event.location?.name || event.location}</p>
                        {distance && <p className="text-xs text-indigo-600 font-bold mt-0.5">a {distance} de ti</p>}
                    </div>

                    {/* Countdown */}
                    <div className="bg-gray-50 p-3 rounded-2xl flex flex-col gap-1 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock size={14} className="text-orange-500" />
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Tiempo</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">Quedan 2h 39min</p>
                    </div>

                    {/* Activity Signal - Neutral, no exact numbers */}
                    <div className="col-span-2 bg-brand-50 p-4 rounded-2xl flex items-center gap-3 border border-brand-100">
                        <div className="relative">
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <Activity size={18} className="text-brand-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-brand-900 leading-none">Actividad ahora</p>
                            <p className="text-xs text-brand-600 font-medium mt-0.5 opacity-80">Hay interés en este plan</p>
                        </div>
                    </div>

                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-2">Sobre este plan</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                </div>

                {/* Removed: Valorar ambiente - Users can only rate after participating */}
                <div className="mb-24" />

            </div>

            {/* FIXED BOTTOM CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-[2010] pb-8">
                <button
                    onClick={handleInterestClick}
                    className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95 ${isSaved ? 'bg-green-100 text-green-700 shadow-none' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'}`}
                >
                    {isSaved ? (
                        <>
                            <Check size={20} />
                            Te avisaremos
                        </>
                    ) : (
                        <>
                            <Star size={20} fill="currentColor" className="text-white opacity-90" />
                            Me interesa
                        </>
                    )}
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-2 font-medium">
                    No te compromete. Te avisamos si el plan se mueve.
                </p>
            </div>

            {/* TOAST OVERLAY (State 1) */}
            <AnimatePresence>
                {overlayMode === 'toast' && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-32 left-4 right-4 z-[2020]"
                    >
                        <div className="bg-gray-900 text-white p-5 rounded-2xl shadow-2xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black flex-shrink-0">
                                    <Check size={18} strokeWidth={3} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm mb-1">Listo. Te avisamos si pasa algo.</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">Este plan está activo. Puedes ir cuando quieras.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSocialClick}
                                    className="flex-1 bg-white text-black text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                                >
                                    <Users size={14} className="text-indigo-600" />
                                    Personas interesadas
                                </button>
                                <button
                                    onClick={dismissOverlay}
                                    className="flex-1 bg-gray-800 text-white text-xs font-bold py-3 rounded-lg active:scale-95 transition-transform"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* VIBE RATING MODAL (State 2) */}
            <AnimatePresence>
                {overlayMode === 'rating' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2030] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
                        onClick={dismissOverlay}
                    >
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-sm rounded-3xl p-6"
                        >
                            <div className="text-center mb-6">
                                <Zap size={32} className="text-yellow-500 fill-yellow-500 mx-auto mb-3" />
                                <h3 className="font-bold text-xl text-gray-900 mb-1">¿Cómo está el ambiente?</h3>
                                <p className="text-sm text-gray-500">Marca lo que sientes. Se actualiza ya.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { label: '😌 Tranquilo', id: 'chill' },
                                    { label: '🙂 Buen rollo', id: 'good' },
                                    { label: '🔥 A tope', id: 'fire' },
                                    { label: '🤯 Muy lleno', id: 'full' },
                                    { label: '😕 Flojo', id: 'meh' }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleVibeSubmit(opt.id)}
                                        className="w-full bg-gray-50 hover:bg-gray-100 text-left px-5 py-4 rounded-xl font-bold text-gray-800 flex items-center justify-between active:scale-95 transition-transform"
                                    >
                                        <span>{opt.label}</span>
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SOCIAL LIST MODAL (State 3) */}
            <AnimatePresence>
                {overlayMode === 'social' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2030] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
                        onClick={dismissOverlay}
                    >
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-sm rounded-3xl p-6 min-h-[50vh]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-gray-900">👥 Personas interesadas</h3>
                                <button onClick={dismissOverlay} className="p-2 bg-gray-100 rounded-full"><X size={16} /></button>
                            </div>

                            <div className="space-y-4">
                                {attendees.map(user => (
                                    <div key={user.id} className="flex items-center gap-3">
                                        <div className="relative">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                            <span className="absolute -bottom-1 -right-1 text-xs">{user.vibe}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-indigo-500 font-medium">a {user.distance}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default MapEventCard;
