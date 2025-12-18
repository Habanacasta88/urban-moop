
import { useState, useMemo } from 'react';
import { Filter, Flame, MapPin, Zap, Music, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNavigation from './Navigation/BottomNavigation';
import { EventDetailScreen } from './EventDetailScreen';
import { LiveCard, SocialCard, FlashCard, DiscoverCard } from './Feed/FeedCards';

// --- ENRICHED MOCK DATA FOR BLOCKS ---
const FEED_DATA = {
    live: [
        {
            id: 'live-1',
            type: 'live',
            title: 'Cañas Afterwork',
            imageUrl: 'https://images.unsplash.com/photo-1572116469696-9a04635e02e2?w=1080',
            business: { name: 'Bar La Plaza' },
            location: { distance: '500 m' },
            attendees: 12,
            vibe: '🔥', // Used for sorting or visuals
            description: 'El ambiente está animándose. Perfectas para desconectar.',
        },
        // More live items can be added here
    ],
    social: [
        {
            id: 'moop-1',
            type: 'moop',
            title: 'Café & charla creativa',
            creator: { name: 'Ana', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
            location: { distance: '300 m' },
            attendees: 6,
            vibe: '😌',
        },
        {
            id: 'moop-2',
            type: 'moop',
            title: 'Running suave 5k',
            creator: { name: 'Pol', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
            location: { distance: '800 m' },
            attendees: 3,
            vibe: '⚡',
        }
    ],
    flash: [
        {
            id: 'flash-1',
            type: 'flash',
            title: '2x1 Cervezas Artesana',
            imageUrl: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=1080',
            business: { name: 'Hoppy Craft' },
            endsIn: '45 min',
        },
        {
            id: 'flash-2',
            type: 'flash',
            title: 'Tapas Gratis con Vermut',
            imageUrl: 'https://images.unsplash.com/photo-1541544744-37570a19a225?w=1080',
            business: { name: 'Bodega 1900' },
            endsIn: '1h 20m',
        }
    ],
    discover: [
        {
            id: 'new-1',
            title: 'SkyBar SBD',
            imageUrl: '/feed/rooftop.png',
            description: 'El nuevo rooftop con las mejores vistas de la ciudad.',
            isNew: true
        },
        {
            id: 'event-3',
            title: 'Exposición Arte Urbano',
            imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1080',
            description: 'Murales en vivo y DJs locales.',
        }
    ]
};

const QuickFilter = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${active
            ? 'bg-white text-black border-white shadow-md'
            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
            } `}
    >
        {label}
    </button>
);

export const FeedScreen = ({ activeTab, onTabChange }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Ahora');

    return (
        <div className="relative w-full min-h-screen bg-gray-950 pb-24 font-sf">

            {/* 1. HEADER (Fixed) */}
            <div className="sticky top-0 z-30 bg-gray-950/95 backdrop-blur-xl border-b border-white/5 pb-2">
                <div className="px-5 pt-14 pb-3 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest">Live ahora · Sabadell</h2>
                        </div>
                        <h1 className="text-xl font-black text-white leading-tight">
                            Lo que está pasando<br />cerca de ti.
                        </h1>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2 overflow-x-auto px-5 pb-2 no-scrollbar scroll-pl-5">
                    <QuickFilter label="🔥 Ahora" active={activeFilter === 'Ahora'} onClick={() => setActiveFilter('Ahora')} />
                    <QuickFilter label="👥 Moops" active={activeFilter === 'Moops'} onClick={() => setActiveFilter('Moops')} />
                    <QuickFilter label="🍔 Comer" active={activeFilter === 'Comer'} onClick={() => setActiveFilter('Comer')} />
                    <QuickFilter label="🎵 Música" active={activeFilter === 'Música'} onClick={() => setActiveFilter('Música')} />
                    <QuickFilter label="⚡ Flash" active={activeFilter === 'Flash'} onClick={() => setActiveFilter('Flash')} />
                </div>
            </div>

            {/* 2. FEED CONTENT (Blocks) */}
            <div className="px-4 pt-4 space-y-8">

                {/* BLOCK 1: LIVE NOW (Hero) */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-white font-black text-lg">🔥 Lo más vivo ahora</h3>
                        <span className="text-xs font-bold text-gray-500">Ver todo</span>
                    </div>
                    {FEED_DATA.live.map(item => (
                        <LiveCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />
                    ))}
                </section>

                {/* BLOCK 2: SOCIAL MOOPS */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-white font-black text-lg">👥 Gente del barrio</h3>
                        <span className="text-xs font-bold text-gray-500">Unirse</span>
                    </div>
                    {FEED_DATA.social.map(item => (
                        <SocialCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />
                    ))}
                </section>

                {/* BLOCK 3: FLASH PROMOS */}
                <section>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                        <h3 className="text-white font-black text-lg italic">FLASH PROMOS</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {FEED_DATA.flash.map(item => (
                            <FlashCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />
                        ))}
                    </div>
                </section>

                {/* BLOCK 4: DISCOVER */}
                <section>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-white font-black text-lg">✨ Nuevo en Sabayork</h3>
                    </div>
                    {FEED_DATA.discover.map(item => (
                        <DiscoverCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />
                    ))}
                </section>

                {/* FINAL BLOCK: INSPIRATIONAL */}
                <section className="text-center py-8 opacity-50">
                    <p className="text-xs text-gray-500 font-medium">Estás al día.<br />Sal y disfruta.</p>
                </section>

            </div>

            {/* 3. BOTTOM BAR */}
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

