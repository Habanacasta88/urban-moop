import { motion } from 'motion/react';
import { Clock, MapPin, Zap, Calendar, ArrowRight, Music, Utensils, Beer, Sparkles, Users, Heart } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// -----------------------------------------------------------------------------
// HELPER: Category Badge Logic
// -----------------------------------------------------------------------------
const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
        case 'música': return <Music size={12} />;
        case 'comida': return <Utensils size={12} />;
        case 'fiesta': return <Beer size={12} />;
        case 'cultura': return <Sparkles size={12} />;
        default: return <Zap size={12} />;
    }
};

// -----------------------------------------------------------------------------
// 1. LIVE CARD (Premium Design - Glassmorphism)
// -----------------------------------------------------------------------------
export const LiveCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full rounded-[28px] overflow-hidden mb-5 cursor-pointer group relative"
        >
            {/* Background Image */}
            <div className="h-72 relative">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Animated Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-brand-500/20 to-purple-500/10" />

                {/* LIVE Badge with Pulse */}
                <div className="absolute top-4 left-4">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex items-center gap-2 bg-red-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full shadow-lg shadow-red-500/30 border border-white/20"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-[11px] font-black tracking-wider uppercase">AHORA</span>
                    </motion.div>
                </div>

                {/* Interest Count Badge */}
                {item.attendees && (
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                        <Users size={12} className="text-white" />
                        <span className="text-white text-[11px] font-bold">{item.attendees}</span>
                    </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    {/* Category Tag */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">{item.emoji || '🔥'}</span>
                        <span className="bg-white/10 backdrop-blur-sm text-white/90 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
                            {item.category || item.place || 'Moop'}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-white leading-tight mb-2 drop-shadow-lg">
                        {item.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-white/80">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                            <MapPin size={14} className="text-brand-300" />
                            <span>{item.distance || 'Cerca'}</span>
                        </div>
                        {item.time && (
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                                <Clock size={14} className="text-brand-300" />
                                <span>{item.time}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 2. FLASH CARD (Urgent - Yellow/Black with Glow)
// -----------------------------------------------------------------------------
export const FlashCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(item)}
            className="w-full bg-gradient-to-br from-yellow-400 via-yellow-400 to-amber-500 rounded-[28px] p-5 mb-5 shadow-xl shadow-yellow-500/30 relative overflow-hidden cursor-pointer"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-black/20" />
                <div className="absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-black/10" />
            </div>

            {/* Zap Icon Background */}
            <div className="absolute -right-4 -top-4 text-yellow-300/40">
                <Zap size={100} fill="currentColor" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                        <Zap size={10} fill="currentColor" /> FLASH
                    </span>
                    <span className="text-black/60 text-xs font-bold uppercase tracking-wide">
                        ⏱ {item.timeLeft || item.expiresIn || '45min'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-black leading-tight mb-3">
                    {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm font-bold text-black/70 mb-4 leading-snug">
                    {item.description || item.place || 'Oferta por tiempo limitado'}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-black/60 text-sm font-bold">
                        <MapPin size={14} />
                        <span>{item.distance || 'Muy cerca'}</span>
                    </div>
                    <div className="bg-black text-white px-5 py-2.5 rounded-full font-black text-sm flex items-center gap-2 shadow-lg">
                        Ir ya <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 3. EVENT CARD (Cultural - Elegant Design)
// -----------------------------------------------------------------------------
export const EventCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full rounded-[28px] overflow-hidden mb-5 cursor-pointer group relative bg-white border border-gray-100 shadow-sm"
        >
            {/* Image */}
            <div className="h-52 relative overflow-hidden">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                        {getCategoryIcon(item.category)}
                        {item.category || 'Evento'}
                    </span>
                </div>

                {/* Date Badge */}
                <div className="absolute top-4 right-4 bg-brand-500 text-white px-3 py-1.5 rounded-xl text-center min-w-[50px] shadow-lg">
                    <div className="text-[10px] font-bold uppercase opacity-80">
                        {item.month || 'ENE'}
                    </div>
                    <div className="text-lg font-black leading-none">
                        {item.day || '15'}
                    </div>
                </div>

                {/* Title on Image */}
                <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-black text-white leading-tight drop-shadow-lg line-clamp-2">
                        {item.title}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <MapPin size={14} className="text-brand-500" />
                        <span className="line-clamp-1">{item.location || item.place || 'Ver ubicación'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                        <Heart size={12} />
                        <span>{item.interested || Math.floor(Math.random() * 50) + 10}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 4. ROUTE CARD (Itinerary - Dark Premium)
// -----------------------------------------------------------------------------
export const RouteCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[28px] overflow-hidden mb-5 cursor-pointer relative group"
        >
            {/* Background Image */}
            <div className="h-56 relative">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    className="w-full h-full object-cover opacity-40 mix-blend-overlay grayscale transition-all duration-500 group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 z-10">
                {/* Badge */}
                <div className="flex justify-between items-start">
                    <span className="bg-white text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md transform -rotate-1">
                        🗺️ RUTA
                    </span>
                    <div className="bg-brand-500/20 text-brand-300 px-3 py-1 rounded-lg text-[10px] font-bold border border-brand-500/30">
                        {item.stops || 4} paradas
                    </div>
                </div>

                {/* Title & Meta */}
                <div>
                    <h3 className="text-2xl font-black text-white leading-tight mb-3 border-l-4 border-brand-500 pl-4">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-4 pl-5">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                            <Clock size={12} className="text-brand-400" />
                            <span>{item.duration || '2h 30min'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                            <MapPin size={12} className="text-brand-400" />
                            <span>{item.distance || '3.2 km'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
