
import { useState, useMemo } from 'react';
import { Filter, Flame, MapPin, Zap, Music, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNavigation from './Navigation/BottomNavigation';
import { EventDetailScreen } from './EventDetailScreen';
import { LiveCard, SocialCard, FlashCard, DiscoverCard } from './Feed/FeedCards';
import { getSmartFeed } from '../utils/feedAlgorithm';

// --- ENRICHED MOCK DATA (Single Source) ---
const RAW_FEED_ITEMS = [
    // LIVE (High Value)
    {
        id: 'live-1',
        type: 'live',
        title: 'Cañas Afterwork',
        imageUrl: 'https://images.unsplash.com/photo-1572116469696-9a04635e02e2?w=1080',
        business: { name: 'Bar La Plaza' },
        location: { distance: '120 m' }, // Very close
        attendees: 12, // Popular
        endsIn: '2 h',
        description: 'El ambiente está animándose. Perfectas para desconectar.',
    },
    {
        id: 'live-2',
        type: 'live',
        title: 'Concierto Jazz Improvisado',
        imageUrl: '/feed/jazz.png',
        business: { name: 'Jazz Club' },
        location: { distance: '450 m' },
        attendees: 8,
        endsIn: '3 h',
    },

    // SOCIAL MOOPS
    {
        id: 'moop-1',
        type: 'moop',
        title: 'Café & charla creativa',
        creator: { name: 'Ana', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
        location: { distance: '300 m' },
        attendees: 6,
        time: 'En 1 h',
        category: 'social',
        vibe: '😌',
    },
    {
        id: 'moop-2',
        type: 'moop',
        title: 'Running suave 5k',
        creator: { name: 'Pol', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
        location: { distance: '800 m' },
        attendees: 3,
        time: 'En 30 min',
        category: 'sport',
        vibe: '⚡',
    },
    {
        id: 'moop-3',
        type: 'moop',
        title: 'Paseo de Perros',
        creator: { name: 'Laura', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100' },
        location: { distance: '500 m' },
        attendees: 4,
        time: 'En 15 min',
        category: 'social',
        imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1080',
        vibe: '🐶'
    },

    // FLASH (Urgency)
    {
        id: 'flash-1',
        type: 'flash',
        title: '2x1 Cervezas Artesana',
        imageUrl: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=1080',
        business: { name: 'Hoppy Craft' },
        endsIn: '45 min',  // Urgent
        location: { distance: '250 m' }, // Close
        category: 'drink'
    },
    {
        id: 'flash-2',
        type: 'flash',
        title: 'Tapas Gratis con Vermut',
        imageUrl: 'https://images.unsplash.com/photo-1541544744-37570a19a225?w=1080',
        business: { name: 'Bodega 1900' },
        endsIn: '1h 20m',
        location: { distance: '600 m' },
        category: 'food'
    },

    // DISCOVER
    {
        id: 'new-1',
        type: 'new',
        title: 'SkyBar SBD',
        imageUrl: '/feed/rooftop.png',
        location: { distance: '1.2 km' },
        description: 'El nuevo rooftop con las mejores vistas de la ciudad.',
        isNew: true,
        likes: 120
    },
    {
        id: 'event-3',
        type: 'event', // Treated as discover base
        title: 'Exposición Arte Urbano',
        imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=1080',
        location: { distance: '500 m' },
        description: 'Murales en vivo y DJs locales.',
        likes: 60
    }
];

const QuickFilter = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${active
            ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/20' // Active: Brand Purple (Gradient-ish via solid for now or use bg-[image:var(--cta-gradient)])
            : 'bg-surface text-text-2 border-border hover:bg-surface-2 hover:border-brand-200' // Inactive: Light Gray
            } `}
    >
        {label}
    </button>
);

export const FeedScreen = ({ activeTab, onTabChange }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Para ti');

    // ALGORITHM CORE
    const feedItems = useMemo(() => {
        // 1. Get Smart Sorted Feed
        let items = getSmartFeed(RAW_FEED_ITEMS);

        // 2. Apply Manual Filters (On top of smart order)
        if (activeFilter === 'Para ti') return items; // Default Smart Order

        if (activeFilter === 'Moops') return items.filter(i => i.type === 'moop');
        if (activeFilter === 'Flash') return items.filter(i => i.type === 'flash');
        if (activeFilter === 'Comer') return items.filter(i => i.category === 'food' || i.category === 'drink');

        return items;
    }, [activeFilter]);

    // RENDER FACTORY
    const renderCard = (item) => {
        switch (item.type) {
            case 'live': return <LiveCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            case 'moop': return <SocialCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            case 'flash': return <FlashCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            case 'new':
            case 'event':
                return <DiscoverCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            default: return null;
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-bg pb-24 font-sf text-text">

            {/* 1. HEADER (Fixed) */}
            <div className="sticky top-0 z-30 bg-bg/95 backdrop-blur-xl border-b border-border pb-2">
                <div className="px-5 pt-14 pb-3 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                            </span>
                            <h2 className="text-xs font-bold text-brand-700 uppercase tracking-widest">Live ahora · Sabadell</h2>
                        </div>
                        <h1 className="text-xl font-black text-brand-700 leading-tight">
                            Smart Radar
                        </h1>
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2 overflow-x-auto px-5 pb-2 no-scrollbar scroll-pl-5">
                    <QuickFilter label="⚡ Para ti" active={activeFilter === 'Para ti'} onClick={() => setActiveFilter('Para ti')} />
                    <QuickFilter label="👥 Moops" active={activeFilter === 'Moops'} onClick={() => setActiveFilter('Moops')} />
                    <QuickFilter label="🍔 Comer" active={activeFilter === 'Comer'} onClick={() => setActiveFilter('Comer')} />
                    <QuickFilter label="⚡ Flash" active={activeFilter === 'Flash'} onClick={() => setActiveFilter('Flash')} />
                </div>
            </div>

            {/* 2. SMART FEED LIST */}
            <div className="px-4 pt-4 pb-10">
                {/* Debug Info (Optional - remove for prod) */}
                {/* <div className="mb-4 text-[10px] text-gray-500 font-mono">
                    Algorithm: Score DESC + Diversity (Max 2 same)
                </div> */}

                {feedItems.map(item => (
                    // Wrapper for layout margins if needed
                    <div key={item.id} className="mb-0">
                        {renderCard(item)}
                    </div>
                ))}

                {/* Empty State / End */}
                <div className="text-center py-8 opacity-50">
                    <p className="text-xs text-gray-500 font-medium">Estás al día.<br />Sal y disfruta.</p>
                </div>
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
