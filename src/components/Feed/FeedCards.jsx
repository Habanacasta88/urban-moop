import { MapPin, Users, Zap, Clock, Heart, ArrowRight, Check, Star, Calendar, Map as MapIcon, Bookmark, Share2, Navigation } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useActivity } from '../../context/ActivityContext';
import { useState, useMemo } from 'react';

// ============================================
// SISTEMA DE MODOS SOCIALES (🟢🟡🔴)
// ============================================
const MODE_CONFIG = {
    social: { color: 'bg-green-500', border: 'border-green-400', label: 'Social', icon: '🟢', description: 'Charlar' },
    activity: { color: 'bg-yellow-500', border: 'border-yellow-400', label: 'Actividad', icon: '🟡', description: 'Hacer juntos' },
    ghost: { color: 'bg-red-500', border: 'border-red-400', label: 'Fantasma', icon: '🔴', description: 'Sin compromiso' }
};

// ============================================
// CARD "AHORA" (Estado actual de lugar)
// ============================================
export const LiveCard = ({ item, onClick, onSave }) => {
    const { savedItems, toggleSaveItem } = useActivity();
    const isSaved = useMemo(() => savedItems.some(i => String(i.id) === String(item.id)), [savedItems, item.id]);

    const handleInterest = (e) => {
        e.stopPropagation();
        toggleSaveItem(item);
    };

    return (
        <div onClick={onClick} className="relative w-full rounded-3xl overflow-hidden mb-4 bg-surface shadow-lg border border-red-500/30 active:scale-[0.98] transition-transform">
            {/* Imagen principal */}
            <div className="relative aspect-[16/10]">
                <ImageWithFallback src={item.imageUrl || item.image_url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Badge AHORA pulsante */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="relative flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        AHORA
                    </span>
                </div>

                {/* Distancia */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 flex items-center gap-1">
                    <MapPin size={10} className="text-white" />
                    <span className="text-[10px] font-bold text-white">{item.distance || item.location?.distance || '0.2km'}</span>
                </div>

                {/* Contenido sobre imagen */}
                <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/80 text-xs font-medium mb-1">{item.place || item.business?.name || 'Lugar'}</p>
                    <h3 className="text-white font-black text-xl leading-tight mb-1">{item.title}</h3>
                    <p className="text-white/70 text-xs line-clamp-1">{item.description || 'Terraza activa y buen ambiente'}</p>
                </div>
            </div>

            {/* Barra de acción inferior */}
            <div className="bg-surface p-4 flex items-center justify-between border-t border-border">
                {/* Señal social */}
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-200 to-brand-400 border-2 border-surface" />
                        ))}
                    </div>
                    <span className="text-xs text-muted">
                        <span className="font-bold text-text">{item.attendees || 12}</span> personas van
                    </span>
                </div>

                {/* CTA primario */}
                <button
                    onClick={handleInterest}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${isSaved
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/30'}`}
                >
                    {isSaved ? <Check size={16} /> : <Heart size={16} fill={isSaved ? "currentColor" : "none"} />}
                    {isSaved ? 'Apuntado' : 'Me interesa'}
                </button>
            </div>
        </div>
    );
};

// ============================================
// CARD MOOP (Quedada social con indicador de modo)
// ============================================
export const SocialCard = ({ item, onClick }) => {
    const mode = item.mode || 'social'; // social | activity | ghost
    const modeConfig = MODE_CONFIG[mode] || MODE_CONFIG.social;

    return (
        <div
            onClick={onClick}
            className={`relative flex items-center gap-4 p-4 bg-surface rounded-2xl border-2 ${modeConfig.border} mb-3 shadow-sm active:bg-surface-2 transition-all`}
        >
            {/* Avatar con indicador de modo */}
            <div className="relative w-14 h-14 flex-shrink-0">
                <ImageWithFallback
                    src={item.user?.avatar || item.creator?.avatar}
                    className="w-full h-full rounded-full object-cover border-2 border-surface shadow-md"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${modeConfig.color} rounded-full border-2 border-surface flex items-center justify-center`}>
                    <span className="text-[8px]">{modeConfig.icon}</span>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black text-muted uppercase tracking-wide">MOOP {modeConfig.label.toUpperCase()}</span>
                    <span className={`w-2 h-2 rounded-full ${modeConfig.color}`}></span>
                </div>
                <h3 className="text-text font-bold text-base leading-tight truncate">{item.target || item.title}</h3>
                <p className="text-xs text-muted truncate">
                    con <span className="font-medium text-text">{item.user?.name || item.creator?.name}</span> y más
                </p>
            </div>

            {/* Flecha */}
            <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted">
                <ArrowRight size={16} />
            </div>
        </div>
    );
};

// ============================================
// CARD FLASH/PROMO (Fondo amarillo destacado)
// ============================================
export const FlashCard = ({ item, onClick }) => {
    return (
        <div onClick={onClick} className="relative w-full rounded-2xl overflow-hidden mb-3 bg-gradient-to-r from-yellow-400 to-amber-500 p-1 active:scale-[0.98] transition-transform shadow-lg shadow-yellow-500/30">
            <div className="bg-gray-900 rounded-xl p-4 flex gap-4 items-center relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-yellow-500/30 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />

                {/* Imagen */}
                <div className="w-16 h-16 rounded-xl bg-gray-800 flex-shrink-0 overflow-hidden border border-yellow-500/30">
                    <ImageWithFallback src={item.imageUrl || item.image_url} className="w-full h-full object-cover" />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0 z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap size={12} className="text-yellow-400" fill="currentColor" />
                        <span className="text-yellow-400 text-[10px] font-black tracking-wide uppercase animate-pulse">
                            FLASH · Quedan {item.timeLeft || item.endsIn || '45m'}
                        </span>
                    </div>
                    <h3 className="text-white font-black text-lg leading-tight mb-0.5">{item.title}</h3>
                    <p className="text-gray-400 text-xs">{item.place || item.business?.name}</p>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center justify-center px-3 py-2 border-l border-white/10 z-10">
                    <span className="text-yellow-400 text-[10px] font-black uppercase mb-1">IR YA</span>
                    <ArrowRight size={18} className="text-white" />
                </div>
            </div>
        </div>
    );
};

// ============================================
// CARD EVENTO/CONCIERTO
// ============================================
export const EventCard = ({ item, onClick, onSave, onShare }) => {
    const { savedItems, toggleSaveItem } = useActivity();
    const isSaved = useMemo(() => savedItems.some(i => String(i.id) === String(item.id)), [savedItems, item.id]);

    const handleSave = (e) => {
        e.stopPropagation();
        toggleSaveItem(item);
    };

    const handleShare = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({ title: item.title, url: window.location.href });
        }
    };

    const handleGo = (e) => {
        e.stopPropagation();
        const url = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;
        window.open(url, '_blank');
    };

    // Categoría badge
    const categoryConfig = {
        music: { icon: '🎵', label: 'MÚSICA', color: 'bg-purple-500' },
        culture: { icon: '🎨', label: 'CULTURA', color: 'bg-blue-500' },
        sport: { icon: '🏃', label: 'DEPORTE', color: 'bg-green-500' },
        food: { icon: '🍽️', label: 'GASTRO', color: 'bg-orange-500' },
        kids: { icon: '👨‍👩‍👧', label: 'FAMILIA', color: 'bg-pink-500' },
        default: { icon: '📅', label: 'EVENTO', color: 'bg-brand-500' }
    };
    const cat = categoryConfig[item.category] || categoryConfig.default;

    return (
        <div onClick={onClick} className="relative w-full rounded-2xl overflow-hidden mb-4 bg-surface border border-border shadow-sm active:scale-[0.98] transition-transform">
            {/* Imagen */}
            <div className="relative aspect-[16/9]">
                <ImageWithFallback src={item.imageUrl || item.image_url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Badge categoría */}
                <div className={`absolute top-3 left-3 ${cat.color} text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1`}>
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4">
                <h3 className="text-text font-bold text-lg leading-tight mb-2">{item.title}</h3>

                {/* Metadatos */}
                <div className="flex items-center gap-3 text-xs text-muted mb-3">
                    <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {item.distance || '800m'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.time || 'Hoy 22:00'}
                    </span>
                </div>

                {/* Señales sociales */}
                <div className="flex items-center gap-4 text-xs text-muted mb-4">
                    <span className="flex items-center gap-1">
                        <Bookmark size={12} />
                        {item.saves || 23} guardados
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={12} />
                        {item.interested || 45} interesados
                    </span>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all ${isSaved
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-surface-2 text-text border border-border hover:bg-surface-3'
                            }`}
                    >
                        {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
                        {isSaved ? 'Guardado' : 'Guardar'}
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-surface-2 text-text border border-border hover:bg-surface-3 transition-all"
                    >
                        <Share2 size={16} />
                    </button>
                    <button
                        onClick={handleGo}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-brand-600 text-white shadow-lg shadow-brand-500/30 transition-all"
                    >
                        <Navigation size={16} />
                        Ir
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================
// CARD RUTA (Itinerario curado)
// ============================================
export const RouteCard = ({ item, onClick }) => {
    return (
        <div onClick={onClick} className="relative w-full rounded-2xl overflow-hidden mb-4 bg-surface border border-blue-200 shadow-sm active:scale-[0.98] transition-transform">
            {/* Badge RUTA */}
            <div className="absolute top-3 left-3 z-10 bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                <MapIcon size={10} />
                <span>RUTA</span>
            </div>

            {/* Imagen */}
            <div className="relative aspect-[2/1]">
                <ImageWithFallback src={item.imageUrl || item.image_url} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Contenido */}
            <div className="p-4">
                <h3 className="text-text font-bold text-lg leading-tight mb-1">{item.title}</h3>
                <p className="text-muted text-xs mb-3">
                    {item.stops || 4} paradas · {item.duration || '45 min'} · {item.distance || '2.3 km'}
                </p>

                {/* Autor */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold">U</div>
                    <span className="text-xs text-muted">
                        Por <span className="font-medium text-text">@{item.author || 'urbanmoop_editorial'}</span>
                    </span>
                    <span className="text-[10px] text-green-600 font-bold">✓ Verificado</span>
                </div>

                {/* CTA */}
                <button className="w-full py-2.5 rounded-xl text-sm font-bold bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-600">
                    Ver ruta
                </button>
            </div>
        </div>
    );
};

// ============================================
// CARD DISCOVER (Nuevo en el barrio)
// ============================================
export const DiscoverCard = ({ item, onClick }) => {
    return (
        <div onClick={onClick} className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-3 bg-surface-2 active:scale-[0.98] transition-transform group">
            <ImageWithFallback src={item.imageUrl || item.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <span>✨</span> NUEVO EN EL BARRIO
            </div>

            <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-gray-200 text-xs line-clamp-1 opacity-90">{item.description}</p>
                    <span className="text-xs font-bold text-white underline decoration-white/30 ml-2 flex-shrink-0">Ver →</span>
                </div>
            </div>
        </div>
    );
};
