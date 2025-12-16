
import { useState, useEffect, useMemo } from 'react';
import { Heart, MapPin, Users, Zap, Clock, TrendingUp, Music, Coffee, Compass, Filter, Star, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNavigation from './Navigation/BottomNavigation';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { EventDetailScreen } from './EventDetailScreen';

// --- DATA & UTILS ---

const parseDistance = (distStr) => {
    if (!distStr) return 99999;
    const clean = distStr.toLowerCase().replace(' ', '');
    if (clean.includes('km')) return parseFloat(clean) * 1000;
    if (clean.includes('m')) return parseFloat(clean);
    return 99999;
};

// Mock Data enriched for specific card types
// Mock Data enriched for specific card types
const FEED_PUBLICATIONS = [
    // --- PROMOS / FLASH (Flash) ---
    {
        id: 'promo-1',
        type: 'flash',
        title: '2x1 Smash Burgers',
        imageUrl: '/feed/burger.png',
        business: { name: 'Viena Centre', avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100' },
        location: { distance: '120m' },
        endsIn: '30 min',
        isFlash: true,
        category: 'food'
    },
    {
        id: 'flash-1',
        type: 'flash',
        title: '¡Hora Feliz! -50% Cervezas',
        imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=1080',
        business: { name: 'La Taberna', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
        location: { distance: '150m' },
        endsIn: '45 min',
        isFlash: true,
        category: 'drink'
    },
    {
        id: 'flash-2',
        type: 'flash',
        title: 'Chupitos Gratis',
        imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1080',
        business: { name: 'NightBar', avatar: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=100' },
        location: { distance: '300m' },
        endsIn: '15 min',
        isFlash: true,
        category: 'drink'
    },
    {
        id: 'flash-3',
        type: 'flash',
        title: 'Postre Regalado',
        imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1080',
        business: { name: 'Sweet Spot', avatar: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=100' },
        location: { distance: '500m' },
        endsIn: '1h 20m',
        isFlash: true,
        category: 'food'
    },

    // --- MOOPS ---
    {
        id: 'moop-1',
        type: 'moop',
        title: 'Café y charla creativa',
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1080',
        creator: { name: 'Ana M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        location: { distance: '300m' },
        attendees: 3,
        maxAttendees: 6,
        time: 'En 20 min',
        isLive: true,
        category: 'social'
    },
    {
        id: 'moop-2',
        type: 'moop',
        title: 'Running 5k Suave',
        imageUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e0fd716?w=1080',
        creator: { name: 'Carlos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
        location: { distance: '1.2km' },
        attendees: 2,
        maxAttendees: 4,
        time: 'Empieza ya',
        category: 'sport'
    },
    {
        id: 'moop-3',
        type: 'moop',
        title: 'Paseo de Perros',
        imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1080',
        creator: { name: 'Laura', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
        location: { distance: '800m' },
        attendees: 5,
        maxAttendees: 8,
        time: 'En 10 min',
        category: 'pets'
    },
    {
        id: 'moop-4',
        type: 'moop',
        title: 'Clase de Yoga al Aire Libre',
        imageUrl: '/feed/yoga.png',
        creator: { name: 'Marta', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
        location: { distance: '400m' },
        attendees: 6,
        maxAttendees: 10,
        time: 'En 30 min',
        category: 'sport'
    },

    // --- TRENDING / EVENTS ---
    {
        id: 'event-1',
        type: 'event',
        title: 'Jazz Night Live 🎷',
        imageUrl: '/feed/jazz.png',
        business: { name: 'Jazz Club', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
        location: { distance: '800m' },
        time: 'Esta noche, 22h',
        likes: 450,
        category: 'music'
    },
    {
        id: 'event-2',
        type: 'event',
        title: 'Festival de Street Food',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1080',
        business: { name: 'Sabadell City', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100' },
        location: { distance: '2km' },
        time: 'Todo el día',
        likes: 890,
        category: 'food'
    },
    {
        id: 'event-3',
        type: 'event',
        title: 'Exposición Arte Urbano',
        imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1080',
        business: { name: 'Gallery X', avatar: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?w=100' },
        location: { distance: '500m' },
        time: 'Hasta las 20h',
        likes: 320,
        category: 'culture'
    },
    {
        id: 'event-4',
        type: 'event',
        title: 'Concierto Rock Local',
        imageUrl: 'https://images.unsplash.com/photo-1459749411177-0473ef7191ea?w=1080',
        business: { name: 'Sala Garage', avatar: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=100' },
        location: { distance: '1.5km' },
        time: '23:00h',
        likes: 560,
        category: 'music'
    },

    // --- NEW ---
    {
        id: 'new-1',
        type: 'new',
        title: 'Nuevo RoofTop: SkyBar SBD',
        imageUrl: '/feed/rooftop.png',
        location: { distance: '500m' },
        description: 'Vistas increíbles y cócteles de autor. ¡Recién inaugurado!',
        likes: 200
    },
    {
        id: 'new-2',
        type: 'new',
        title: 'Inauguración: Gamer Zone',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1080',
        location: { distance: '1km' },
        description: 'El mayor centro de eSports de la ciudad. ¡Ven a jugar gratis!',
        likes: 150
    }
];

// --- COMPONENTS ---

const QuickFilter = ({ label, icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items - center gap - 1.5 px - 4 py - 2 rounded - full text - sm font - bold whitespace - nowrap transition - all duration - 200 border ${active
            ? 'bg-white text-black border-white shadow-lg scale-105'
            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            } `}
    >
        {Icon && <Icon size={14} className={active ? 'text-black' : 'text-gray-400'} />}
        {label}
    </button>
);

const FeedCard = ({ item, onClick, variant = 'standard' }) => {
    // VARIANT: STANDARD (Vertical)
    if (variant === 'standard' || variant === 'event' || variant === 'promo') {
        return (
            <div onClick={onClick} className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-gray-900 group active:scale-95 transition-transform">
                <ImageWithFallback src={item.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                {/* Distance Badge */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                    <MapPin size={10} className="text-white" />
                    <span className="text-[10px] font-bold text-white">{item.location?.distance}</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src={item.business?.avatar} className="w-5 h-5 rounded-full border border-white/30" />
                            <span className="text-xs text-gray-300 truncate max-w-[80px]">{item.business?.name}</span>
                        </div>
                        {item.likes && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Heart size={10} /> {item.likes}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // VARIANT: MOOP (Social Focus)
    if (variant === 'moop') {
        return (
            <div onClick={onClick} className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-3 bg-gray-800 group active:scale-95 transition-transform border border-white/5">
                <ImageWithFallback src={item.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Social Badge */}
                <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Users size={10} className="text-black" />
                    <span className="text-[10px] font-black text-black">{item.attendees}/{item.maxAttendees}</span>
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="bg-gray-900/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={item.creator?.avatar} className="w-6 h-6 rounded-full border border-primary" />
                            <span className="text-xs text-gray-300">por {item.creator?.name}</span>
                        </div>
                        <h3 className="text-white font-bold text-md leading-tight mb-1">{item.title}</h3>
                        <p className="text-xs text-primary font-bold mb-3">⏰ {item.time}</p>

                        <button className="w-full bg-primary text-black text-xs font-black py-2 rounded-lg hover:bg-white transition-colors">
                            Apuntarme
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // VARIANT: FLASH (Urgency)
    if (variant === 'flash') {
        return (
            <div onClick={onClick} className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-black group active:scale-95 transition-transform border border-yellow-500/30">
                <ImageWithFallback src={item.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>

                <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded border-b-2 border-yellow-600 shadow-lg transform -rotate-2">
                    <span className="text-xs font-black flex items-center gap-1"><Zap size={10} fill="black" /> FLASH</span>
                </div>

                <div className="absolute bottom-0 p-4 w-full">
                    <div className="flex items-center gap-2 mb-1 text-yellow-400">
                        <Clock size={12} />
                        <span className="text-xs font-bold animate-pulse">Quedan {item.endsIn}</span>
                    </div>
                    <h3 className="text-white font-black text-xl italic leading-none mb-1">{item.title}</h3>
                </div>
            </div>
        );
    }

    return null;
};

// VARIANT: NEW (Horizontal)
const NewItemCard = ({ item, onClick }) => (
    <div onClick={onClick} className="relative w-full h-48 rounded-2xl overflow-hidden mb-3 group active:scale-95 transition-transform bg-gray-900">
        <ImageWithFallback src={item.imageUrl} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent"></div>

        <div className="absolute top-3 left-3 bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-pink-500/50 shadow-lg">
            ✨ NUEVO
        </div>

        <div className="absolute inset-0 flex flex-col justify-center px-6 w-2/3">
            <h3 className="text-2xl font-black text-white leading-tight mb-2">{item.title}</h3>
            <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
            <div className="mt-3 flex items-center gap-1 text-pink-400 text-xs font-bold">
                <MapPin size={12} /> {item.location.distance}
            </div>
        </div>

        <div className="absolute right-4 bottom-4">
            <button className="bg-white/10 backdrop-blur text-white p-2 rounded-full border border-white/20">
                <TrendingUp size={16} />
            </button>
        </div>
    </div>
);


export const FeedScreen = ({ activeTab, onTabChange }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Hoy');

    const feedItems = useMemo(() => {
        if (activeFilter === 'Hoy' || activeFilter === 'Ahora') return FEED_PUBLICATIONS;
        if (activeFilter === 'Trending') return FEED_PUBLICATIONS.filter(i => (i.likes > 100 || i.attendees > 4));
        if (activeFilter === 'Flash') return FEED_PUBLICATIONS.filter(i => i.type === 'flash');
        if (activeFilter === 'Moops') return FEED_PUBLICATIONS.filter(i => i.type === 'moop');
        if (activeFilter === 'Comida') return FEED_PUBLICATIONS.filter(i => i.category === 'food' || i.title.includes('Burgers') || i.title.includes('Food'));
        if (activeFilter === 'Música') return FEED_PUBLICATIONS.filter(i => i.category === 'music' || i.title.includes('Music') || i.title.includes('Concierto'));
        return FEED_PUBLICATIONS;
    }, [activeFilter]);

    // Layout Logic: Separate "Horizontal" items from "Masonry" items
    // This is a naive implementation where we hardcode the order for the demo
    const masonryItems = feedItems.filter(i => i.type !== 'new');
    const fullWidthItems = feedItems.filter(i => i.type === 'new');

    const leftCol = masonryItems.filter((_, i) => i % 2 === 0);
    const rightCol = masonryItems.filter((_, i) => i % 2 !== 0);

    return (
        <div className="relative w-full min-h-screen bg-gray-950 pb-24 font-sf">

            {/* 1. HEADER */}
            <div className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur-xl border-b border-white/5 pb-2">
                <div className="px-5 pt-14 pb-2 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-black text-white flex items-center gap-2">
                            Live Feed <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                        </h1>
                        <p className="text-gray-400 text-xs font-medium mt-1">Descubre lo que pasa ahora mismo.</p>
                    </div>
                    <button className="p-2 bg-gray-900 rounded-full border border-white/10 text-white">
                        <Filter size={20} />
                    </button>
                </div>

                {/* 2. QUICK FILTERS */}
                <div className="flex gap-2 overflow-x-auto px-5 pb-2 no-scrollbar scroll-pl-5">
                    <QuickFilter label="📅 Hoy" active={activeFilter === 'Hoy'} onClick={() => setActiveFilter('Hoy')} />
                    <QuickFilter label="👥 Moops" active={activeFilter === 'Moops'} onClick={() => setActiveFilter('Moops')} />
                    <QuickFilter label="⏰ Ahora" active={activeFilter === 'Ahora'} onClick={() => setActiveFilter('Ahora')} />
                    <QuickFilter label="🔥 Trending" active={activeFilter === 'Trending'} onClick={() => setActiveFilter('Trending')} />
                    <QuickFilter label="🍔 Comida" active={activeFilter === 'Comida'} onClick={() => setActiveFilter('Comida')} />
                    <QuickFilter label="🎵 Música" active={activeFilter === 'Música'} onClick={() => setActiveFilter('Música')} />
                    <QuickFilter label="⚡ Flash" active={activeFilter === 'Flash'} onClick={() => setActiveFilter('Flash')} />
                </div>
            </div>

            {/* 3. MAIN GRID */}
            <div className="px-2 pt-4">
                {/* Horizontal Items First (Demo) */}
                {fullWidthItems.map(item => (
                    <NewItemCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />
                ))}

                <div className="flex gap-2">
                    <div className="flex-1 flex flex-col gap-0">
                        {leftCol.map(item => (
                            <FeedCard key={item.id} item={item} variant={item.type} onClick={() => setSelectedEvent(item)} />
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col gap-0 pt-8">
                        {rightCol.map(item => (
                            <FeedCard key={item.id} item={item} variant={item.type} onClick={() => setSelectedEvent(item)} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. BOTTOM BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-30">
                <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
            </div>

            {/* DETAIL OVERLAY */}
            <AnimatePresence>
                {selectedEvent && (
                    <EventDetailScreen
                        event={selectedEvent}
                        onBack={() => setSelectedEvent(null)}
                        onSave={() => console.log('Saved', selectedEvent.id)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
