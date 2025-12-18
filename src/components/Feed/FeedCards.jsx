import { MapPin, Users, Zap, Clock, Heart, ArrowRight, Check, Star } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useActivity } from '../../context/ActivityContext';
import { useState, useMemo } from 'react';

// --- BLOCK 1: LIVE CARD (Action First) ---
export const LiveCard = ({ item, onClick }) => {
    const { savedItems, toggleSaveItem } = useActivity();
    const isSaved = useMemo(() => savedItems.some(i => String(i.id) === String(item.id)), [savedItems, item.id]);

    const handleInterest = (e) => {
        e.stopPropagation();
        toggleSaveItem(item);
    };

    return (
        <div onClick={onClick} className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden mb-4 bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform">
            <div className="absolute inset-0 h-3/4">
                <ImageWithFallback src={item.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Floating Stats */}
            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 z-10">
                <MapPin size={10} className="text-white" />
                <span className="text-[10px] font-bold text-white">{item.location?.distance}</span>
            </div>

            {/* Content overlay on image */}
            <div className="absolute top-[50%] left-0 right-0 p-5 transform -translate-y-1/4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">AHORA</span>
                    <span className="text-xs text-white/90 font-bold shadow-sm">{item.business?.name || 'Evento'}</span>
                </div>
                <h3 className="text-white font-black text-2xl leading-none shadow-sm mb-1">{item.title}</h3>
                <p className="text-gray-300 text-xs font-medium line-clamp-1">{item.description || 'Pásate ahora y disfruta del ambiente.'}</p>
            </div>

            {/* Bottom Action Bar (White bg) */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white flex items-center justify-between px-5 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border border-white" />
                        ))}
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold">
                        <span className="text-black">{item.attendees || 12} personas</span> van
                    </div>
                </div>

                <button
                    onClick={handleInterest}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-colors ${isSaved ? 'bg-green-100 text-green-700' : 'bg-black text-white'}`}
                >
                    {isSaved ? <Check size={14} /> : <Star size={14} fill={isSaved ? "currentColor" : "none"} />}
                    {isSaved ? 'Apuntado' : 'Me interesa'}
                </button>
            </div>
        </div>
    );
};

// --- BLOCK 2: SOCIAL CARD (Human Connection) ---
export const SocialCard = ({ item, onClick }) => {
    return (
        <div onClick={onClick} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 mb-3 shadow-sm active:bg-gray-50 transition-colors">
            {/* Avatar Cluster */}
            <div className="relative w-16 h-16 flex-shrink-0">
                <ImageWithFallback src={item.creator?.avatar || item.business?.avatar} className="w-full h-full rounded-full object-cover border-2 border-white shadow-md z-10 relative" />
                <div className="absolute -bottom-1 -right-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                    {item.vibe || '😌'}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Moop Social</span>
                    <span className="text-[10px] font-bold text-indigo-500">• a {item.location?.distance}</span>
                </div>
                <h3 className="text-gray-900 font-bold text-lg leading-tight truncate">{item.title}</h3>
                <p className="text-xs text-gray-500 truncate">con {item.creator?.name} y {item.attendees} más</p>
            </div>

            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                <ArrowRight size={16} />
            </div>
        </div>
    );
};

// --- BLOCK 3: FLASH CARD (Urgency) ---
export const FlashCard = ({ item, onClick }) => {
    return (
        <div onClick={onClick} className="relative w-full rounded-2xl overflow-hidden mb-3 bg-yellow-400 p-1 active:scale-95 transition-transform">
            <div className="bg-black/90 rounded-xl p-4 flex gap-4 items-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none" />

                <div className="w-16 h-16 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden border border-white/10">
                    <ImageWithFallback src={item.imageUrl} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 text-yellow-400 animate-pulse">
                        <Zap size={12} fill="currentColor" />
                        <span className="text-[10px] font-black tracking-wide uppercase">FLASH · Quedan {item.endsIn}</span>
                    </div>
                    <h3 className="text-white font-black text-lg leading-tight mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-xs line-clamp-1">{item.business?.name}</p>
                </div>

                <div className="flex flex-col items-center justify-center pl-2 border-l border-white/10">
                    <span className="text-yellow-400 text-xs font-bold text-center leading-tight mb-1">IR<br />YA</span>
                    <ArrowRight size={14} className="text-white" />
                </div>
            </div>
        </div>
    );
};

// --- BLOCK 4: DISCOVER CARD (New / Editorial) ---
export const DiscoverCard = ({ item, onClick }) => {
    return (
        <div onClick={onClick} className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-3 bg-gray-100 active:scale-95 transition-transform group">
            <ImageWithFallback src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                ✨ NUEVO EN EL BARRIO
            </div>

            <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-gray-200 text-xs line-clamp-1 opacity-90">{item.description}</p>
                    <span className="text-xs font-bold text-white underline decoration-white/30">Ver</span>
                </div>
            </div>
        </div>
    );
};
