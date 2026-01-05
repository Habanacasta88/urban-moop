import { motion } from 'motion/react';
import { Clock, MapPin, Zap, Calendar, ArrowRight, Music, Utensils, Beer } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// -----------------------------------------------------------------------------
// HELPER: Category Badge Logic
// -----------------------------------------------------------------------------
const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
        case 'música': return <Music size={12} />;
        case 'comida': return <Utensils size={12} />;
        case 'fiesta': return <Beer size={12} />;
        default: return <Zap size={12} />;
    }
};

// -----------------------------------------------------------------------------
// 1. LIVE CARD (Standard Moop - No Social Features)
// -----------------------------------------------------------------------------
export const LiveCard = ({ item, onClick }) => {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6 cursor-pointer group"
        >
            {/* Image Header with LIVE Badge */}
            <div className="h-56 relative">
                <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                {/* LIVE Badge */}
                <div className="absolute top-4 left-4">
                    <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full shadow-lg shadow-red-600/20 backdrop-blur-md border border-white/10">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                        </span>
                        <span className="text-[10px] font-black tracking-widest uppercase">LIVE</span>
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide opacity-80 border border-white/30 px-2 py-0.5 rounded-md">
                            {item.category || 'Moop'}
                        </span>
                    </div>
                    <h3 className="text-2xl font-black leading-none mb-1 shadow-sm">{item.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-200 font-medium">
                        <MapPin size={12} className="opacity-80" />
                        <span>{item.time || 'Ahora mismo'} · {item.distance || 'Cerca'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 2. FLASH CARD (Yellow/Black - Urgent - Unique Action)
// -----------------------------------------------------------------------------
export const FlashCard = ({ item, onClick }) => {
    // Flash opens specific "Ir ya" logic, passed via onClick from parent but handled distinctively visually
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(item)} // Flash might need specific handling upstream, but standard click usually works
            className="w-full bg-yellow-400 rounded-3xl p-5 mb-6 shadow-xl shadow-yellow-400/20 relative overflow-hidden cursor-pointer border border-yellow-300"
        >
            <div className="absolute -right-6 -top-6 text-yellow-300 opacity-50 rotate-12">
                <Zap size={120} fill="currentColor" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                            <Zap size={8} fill="currentColor" /> FLASH
                        </span>
                        <span className="text-[10px] font-bold text-black/60 uppercase tracking-wide">
                            Solo {item.expiresIn || '1h'}
                        </span>
                    </div>
                    <h3 className="text-2xl font-black text-black leading-tight mb-3">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-black">
                            <Clock size={14} />
                        </div>
                        <p className="text-xs font-bold text-black/70 leading-tight">
                            {item.description || 'Oferta por tiempo limitado'}
                        </p>
                    </div>
                </div>

                {/* Visual Action Indicator */}
                <div className="bg-black text-white p-3 rounded-full flex items-center justify-center shadow-lg">
                    <ArrowRight size={20} />
                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 3. EVENT CARD (Cultural/General - Standard Click)
// -----------------------------------------------------------------------------
export const EventCard = ({ item, onClick }) => {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6 cursor-pointer group"
        >
            <div className="h-56 relative">
                <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wide border border-white/20 flex items-center gap-1.5">
                        {getCategoryIcon(item.category)}
                        {item.category}
                    </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white">
                    <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-brand-200">
                        <Calendar size={12} />
                        <span className="uppercase tracking-wide">{item.date}</span>
                    </div>
                    <h3 className="text-2xl font-black leading-tight mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-300 font-medium">
                            <MapPin size={12} />
                            <span>{item.location}</span>
                        </div>
                        {/* Subtle arrow to indicate clickable */}
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight size={14} />
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// 4. ROUTE CARD (Itinerary - Standard Click)
// -----------------------------------------------------------------------------
export const RouteCard = ({ item, onClick }) => {
    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="w-full bg-gray-900 rounded-3xl overflow-hidden shadow-md mb-6 cursor-pointer relative group"
        >
            <div className="h-64 relative opacity-60 mix-blend-overlay">
                <ImageWithFallback src={item.image} className="w-full h-full object-cover grayscale" />
            </div>

            <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                <div className="flex justify-between items-start">
                    <span className="bg-white text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-black transform -rotate-2">
                        RUTA
                    </span>
                </div>

                <div>
                    <h3 className="text-2xl font-black text-white leading-tight mb-2 border-l-4 border-brand-500 pl-3">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-4 text-gray-300 text-xs font-bold uppercase tracking-wide pl-4">
                        <span className="flex items-center gap-1"><Clock size={12} /> {item.duration}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {item.stops} Paradas</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
