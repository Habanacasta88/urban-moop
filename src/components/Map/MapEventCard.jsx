import { Heart, Clock, Users, ChevronLeft, ChevronRight, X, MapPin, Star, Bookmark, Share2, Zap, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useVibe } from '../../context/VibeContext';

const MapEventCard = ({ event, onClose }) => {
    const { openVibeCheck } = useVibe();

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
            <div className="relative h-64 bg-gray-200">
                <ImageWithFallback src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40">
                    <X size={20} />
                </button>
            </div>

            <div className="relative -mt-6 bg-white rounded-t-3xl p-6 min-h-[500px] pb-64">
                {/* Drag Handle */}
                <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="text-3xl mr-2">{event.emoji}</span>
                        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">{event.category}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => openVibeCheck('local', event.id, event.title)}
                            className="p-2 rounded-full bg-yellow-50 hover:bg-yellow-100 text-yellow-500 border border-yellow-200"
                        >
                            <Zap size={18} fill="currentColor" />
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"><Share2 size={18} /></button>
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"><Bookmark size={18} /></button>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{event.title}</h1>
                <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>

                {/* Info Blocks */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><MapPin size={16} /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Ubicación</p>
                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{event.location}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><Clock size={16} /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Tiempo</p>
                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{event.time}</p>
                        </div>
                    </div>
                    <div className="col-span-2 bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500"><Users size={16} /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Asistentes</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-800">{event.attendees} personas van</p>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full bg-gray-300 border-2 border-white" />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vibe Status Section - NEW */}
                <div className="bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-4 mb-8 border border-primary/20">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                                <Zap size={16} fill="currentColor" />
                            </div>
                            <span className="font-bold text-gray-900">Vibe Actual</span>
                        </div>
                        <span className="text-xs font-bold bg-white text-primary px-2 py-1 rounded-lg border border-primary/20 shadow-sm">
                            🔥 A tope
                        </span>
                    </div>

                    <div className="flex gap-1 mb-4">
                        <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
                        <div className="h-1.5 flex-1 bg-primary rounded-full"></div>
                        <div className="h-1.5 flex-1 bg-primary/30 rounded-full"></div>
                        <div className="h-1.5 flex-1 bg-primary/30 rounded-full"></div>
                    </div>

                    <button
                        onClick={() => openVibeCheck('local', event.id, event.title)}
                        className="w-full bg-white hover:bg-gray-50 text-secondary font-bold py-3 rounded-xl border border-secondary shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                        <Activity size={18} />
                        Valorar el ambiente
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-2">
                        Tu opinión ayuda a otros en tiempo real.
                    </p>
                </div>

                {/* Primary Action Button */}
                <div className="fixed bottom-28 left-6 right-6 z-50">
                    <button className="w-full bg-secondary hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/20 transition-all transform active:scale-95">
                        <Star size={20} fill="currentColor" className="text-white" />
                        ¡Me interesa!
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default MapEventCard;
