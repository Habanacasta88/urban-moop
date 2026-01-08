import { motion } from 'motion/react';
import { Clock, MapPin, Zap, Calendar, ArrowRight, Music, Utensils, Beer, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// -----------------------------------------------------------------------------
// HELPER: Category Icon
// -----------------------------------------------------------------------------
const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
        case 'música': return <Music size={12} />;
        case 'gastronomía':
        case 'comida': return <Utensils size={12} />;
        case 'fiesta': return <Beer size={12} />;
        case 'cultura': return <Sparkles size={12} />;
        default: return null;
    }
};

// -----------------------------------------------------------------------------
// 1. LIVE CARD (Moop) - Feed version: More info, NO CTA on card
// -----------------------------------------------------------------------------
export const LiveCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full rounded-[24px] overflow-hidden mb-4 cursor-pointer group relative bg-white shadow-md shadow-gray-200/50"
        >
            {/* Image */}
            <div className="h-48 relative">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Single Badge - Category only */}
                <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                        {getCategoryIcon(item.category)}
                        {item.category || 'Moop'}
                    </span>
                </div>
            </div>

            {/* Content - Hierarchy: Title → Time → Location */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">
                    {item.title}
                </h3>

                {/* Time */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-brand-600 mb-1">
                    <Clock size={14} />
                    <span>{item.time || 'Ahora disponible'}</span>
                </div>

                {/* Location + Distance */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{item.place || item.location || 'Centro'}</span>
                    {item.distance && (
                        <span className="text-gray-400 ml-1">· {item.distance}</span>
                    )}
                </div>

                {/* Neutral Activity Signal */}
                {item.attendees > 0 && (
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                        Varias personas interesadas
                    </p>
                )}
            </div>
            {/* NO CTA - Click opens detail */}
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 2. FLASH CARD - Urgent, keeps CTA "Ir ya"
// -----------------------------------------------------------------------------
export const FlashCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(item)}
            className="w-full bg-gradient-to-br from-yellow-400 via-yellow-400 to-amber-500 rounded-[24px] p-5 mb-4 shadow-xl shadow-yellow-500/25 relative overflow-hidden cursor-pointer"
        >
            {/* Background Icon */}
            <div className="absolute -right-4 -top-4 text-yellow-300/30">
                <Zap size={100} fill="currentColor" />
            </div>

            <div className="relative z-10">
                {/* Single Badge */}
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5">
                        <Zap size={10} fill="currentColor" /> FLASH
                    </span>
                    <span className="text-black/60 text-xs font-bold">
                        ⏱ Queda {item.timeLeft || '45min'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-black leading-tight mb-2">
                    {item.title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm font-bold text-black/70 mb-4">
                    <MapPin size={14} />
                    <span>{item.place || 'Cerca de ti'}</span>
                    {item.distance && <span className="ml-1">· {item.distance}</span>}
                </div>

                {/* CTA - Flash keeps "Ir ya" */}
                <div className="flex justify-end">
                    <div className="bg-black text-white px-5 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                        Ir ya <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 3. EVENT CARD (Cultura) - More context, NO CTA on card
// -----------------------------------------------------------------------------
export const EventCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full rounded-[24px] overflow-hidden mb-4 cursor-pointer group relative bg-white shadow-md shadow-gray-200/50"
        >
            {/* Image */}
            <div className="h-44 relative overflow-hidden">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Single Badge - CULTURA */}
                <div className="absolute top-3 left-3">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                        <Sparkles size={10} /> Cultura
                    </span>
                </div>

                {/* Date Badge */}
                <div className="absolute top-3 right-3 bg-white text-gray-900 px-2.5 py-1.5 rounded-xl text-center min-w-[44px] shadow-md">
                    <div className="text-[9px] font-bold uppercase text-gray-500">
                        {item.month || 'ENE'}
                    </div>
                    <div className="text-base font-black leading-none">
                        {item.day || '15'}
                    </div>
                </div>
            </div>

            {/* Content - Hierarchy: Title → When → Where */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">
                    {item.title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 mb-1">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{item.location || item.place || 'Ver ubicación'}</span>
                </div>

                {/* Neutral Signal */}
                {item.interested && (
                    <p className="text-xs text-gray-400 mt-2 font-medium">
                        Varias personas interesadas
                    </p>
                )}
            </div>
            {/* NO CTA - Click opens detail */}
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 4. ROUTE CARD - Itinerary, NO CTA on card
// -----------------------------------------------------------------------------
export const RouteCard = ({ item, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[24px] overflow-hidden mb-4 cursor-pointer relative group"
        >
            {/* Background Image */}
            <div className="h-44 relative">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    className="w-full h-full object-cover opacity-40 mix-blend-overlay grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-5 z-10">
                {/* Single Badge */}
                <div className="flex justify-between items-start">
                    <span className="bg-white text-black px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md">
                        🗺️ RUTA
                    </span>
                    <span className="text-brand-300 text-xs font-bold">
                        {item.stops || 4} paradas
                    </span>
                </div>

                {/* Title & Info */}
                <div>
                    <h3 className="text-xl font-black text-white leading-tight mb-2 border-l-4 border-brand-500 pl-3">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-4 pl-4">
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
            {/* NO CTA - Click opens detail */}
        </motion.div>
    );
};
