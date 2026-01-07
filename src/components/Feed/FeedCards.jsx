import { motion } from 'motion/react';
import { Clock, MapPin, Zap, Calendar, ArrowRight, Music, Utensils, Beer, Sparkles, Users, Heart, Navigation } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// -----------------------------------------------------------------------------
// HELPER: Category Badge Logic
// -----------------------------------------------------------------------------
const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
        case 'música': return <Music size={12} />;
        case 'gastronomía':
        case 'comida': return <Utensils size={12} />;
        case 'fiesta': return <Beer size={12} />;
        case 'cultura': return <Sparkles size={12} />;
        default: return <Zap size={12} />;
    }
};

// Get type label
const getTypeLabel = (type, category) => {
    if (type === 'moop' || type === 'live') return 'MOOP';
    if (type === 'flash') return 'FLASH';
    if (type === 'route') return 'RUTA';
    if (category?.toLowerCase().includes('cultura')) return 'CULTURA';
    return 'EVENTO';
};

// -----------------------------------------------------------------------------
// 1. LIVE CARD (Moop - Full Info Card)
// -----------------------------------------------------------------------------
export const LiveCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full rounded-[24px] overflow-hidden mb-5 cursor-pointer group relative bg-white shadow-lg shadow-gray-200/50"
        >
            {/* Image Section */}
            <div className="h-56 relative">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* AHORA Badge with Pulse */}
                <div className="absolute top-4 left-4">
                    <motion.div
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-[10px] font-black tracking-wider uppercase">AHORA</span>
                    </motion.div>
                </div>

                {/* Attendees Badge */}
                {item.attendees && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 flex items-center gap-1.5">
                        <Users size={12} className="text-white" />
                        <span className="text-white text-[11px] font-bold">{item.attendees}</span>
                    </div>
                )}

                {/* Category Badge on Image */}
                <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                        {getCategoryIcon(item.category)}
                        {item.category || 'Gastronomía'}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-xl font-black text-gray-900 leading-tight mb-3">
                    {item.title}
                </h3>

                {/* Info Row */}
                <div className="flex items-center gap-4 text-gray-500">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                        <MapPin size={14} className="text-brand-500" />
                        <span>{item.distance || '350 m'}</span>
                    </div>
                    {/* Time */}
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Clock size={14} className="text-brand-500" />
                        <span>{item.time || 'Ahora'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 2. FLASH CARD (Urgent - Yellow/Black)
// -----------------------------------------------------------------------------
export const FlashCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(item)}
            className="w-full bg-gradient-to-br from-yellow-400 via-yellow-400 to-amber-500 rounded-[24px] p-5 mb-5 shadow-xl shadow-yellow-500/30 relative overflow-hidden cursor-pointer"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-black/20" />
                <div className="absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-black/10" />
            </div>

            <div className="absolute -right-4 -top-4 text-yellow-300/40">
                <Zap size={100} fill="currentColor" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                            <Zap size={10} fill="currentColor" /> FLASH
                        </span>
                        <span className="text-black/60 text-xs font-bold uppercase tracking-wide">
                            ⏱ Queda {item.timeLeft || item.expiresIn || '45min'}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black text-black leading-tight mb-2">
                    {item.title}
                </h3>

                {/* Location */}
                <p className="text-sm font-bold text-black/70 mb-4">
                    📍 {item.place || item.location || 'La Terraza'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-black/60 text-sm font-bold">
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {item.distance || '200 m'}
                        </span>
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
// 3. EVENT CARD (Cultural/General)
// -----------------------------------------------------------------------------
export const EventCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full rounded-[24px] overflow-hidden mb-5 cursor-pointer group relative bg-white shadow-lg shadow-gray-200/50"
        >
            {/* Image */}
            <div className="h-48 relative overflow-hidden">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-purple-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                        <Sparkles size={10} />
                        CULTURA
                    </span>
                </div>

                {/* Date Badge */}
                <div className="absolute top-4 right-4 bg-white text-gray-900 px-3 py-1.5 rounded-xl text-center min-w-[50px] shadow-lg">
                    <div className="text-[10px] font-bold uppercase text-gray-500">
                        {item.month || 'ENE'}
                    </div>
                    <div className="text-lg font-black leading-none">
                        {item.day || '15'}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">
                    {item.title}
                </h3>

                {/* Info Row */}
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                    {/* Location */}
                    <div className="flex items-center gap-1.5 font-medium">
                        <MapPin size={14} className="text-brand-500" />
                        <span className="line-clamp-1">{item.location || item.place || 'Centro'}</span>
                    </div>
                    {/* Distance */}
                    <div className="flex items-center gap-1.5 font-medium text-gray-400">
                        <Navigation size={12} />
                        <span>{item.distance || '1.2 km'}</span>
                    </div>
                </div>

                {/* Interest */}
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold mt-2">
                    <Heart size={12} className="text-pink-400" />
                    <span>{item.interested || Math.floor(Math.random() * 50) + 10} interesados</span>
                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 4. ROUTE CARD (Itinerary)
// -----------------------------------------------------------------------------
export const RouteCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[24px] overflow-hidden mb-5 cursor-pointer relative group"
        >
            {/* Background Image */}
            <div className="h-48 relative">
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
                    <span className="bg-white text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">
                        🗺️ RUTA
                    </span>
                    <div className="bg-brand-500/20 text-brand-300 px-3 py-1 rounded-lg text-[10px] font-bold border border-brand-500/30">
                        {item.stops || 4} paradas
                    </div>
                </div>

                {/* Title & Meta */}
                <div>
                    <h3 className="text-xl font-black text-white leading-tight mb-3 border-l-4 border-brand-500 pl-4">
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
