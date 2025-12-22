// ... imports
import { useState, useMemo } from 'react';
import { Filter, Flame, MapPin, Zap, Music, Coffee, Search, Globe, Sparkles } from 'lucide-react'; // Added Icons
import { motion, AnimatePresence } from 'motion/react';
import BottomNavigation from './Navigation/BottomNavigation';
import { EventDetailScreen } from './EventDetailScreen';
import { LiveCard, SocialCard, FlashCard, DiscoverCard } from './Feed/FeedCards';
import { getSmartFeed } from '../utils/feedAlgorithm';
import { SearchService } from '../services/SearchService'; // Added Service

// Hardcoded Mock Data for Feed
const RAW_FEED_ITEMS = [
    {
        id: '1',
        type: 'live',
        title: 'Jazz Night & Cocktails',
        place: 'Blue Note Club',
        distance: '0.4 km',
        attendees: 12,
        image_url: 'https://images.unsplash.com/photo-1514525253440-b393452de23e?q=80&w=1000',
        vibes: ['chill', 'music'],
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7200000).toISOString()
    },
    {
        id: '2',
        type: 'moop',
        user: { name: 'Carla', avatar: 'https://i.pravatar.cc/150?u=carla' },
        action: 'va a',
        target: 'Mercat Central',
        time: 'hace 5 min',
        comment: '¡Alguien para unos pinchos? 🍢',
        place_image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1000'
    },
    {
        id: '3',
        type: 'flash',
        title: '2x1 en Mojitos 🍹',
        place: 'La Terraza',
        timeLeft: '45m',
        distance: '0.2 km',
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000'
    },
    {
        id: '4',
        type: 'new',
        title: 'Nuevo: "El Taller"',
        description: 'Tapas creativas en el centro.',
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000',
        rating: 4.8
    }
];

const QuickFilter = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${active
            ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/20'
            : 'bg-surface text-text-2 border-border hover:bg-surface-2 hover:border-brand-200'
            } `}
    >
        {label}
    </button>
);

export const FeedScreen = ({ activeTab, onTabChange }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Para ti');

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false); // UI state
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null);

    // SEARCH HANDLER
    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setSearchLoading(true);
            setSearchResults(null);
            try {
                // Call Edge Function
                const response = await SearchService.search(searchQuery);
                setSearchResults(response);
            } catch (err) {
                console.error("Search failed", err);
                // Fallback / Error state
            } finally {
                setSearchLoading(false);
            }
        }
    };

    // ALGORITHM CORE
    const feedItems = useMemo(() => {
        // If searching, show nothing here (handled in render) or filter local if needed
        // For now, we prefer replacing the feed with search results.

        // 1. Get Smart Sorted Feed
        let items = getSmartFeed(RAW_FEED_ITEMS);

        // 2. Apply Manual Filters
        if (activeFilter === 'Para ti') return items;
        if (activeFilter === 'Moops') return items.filter(i => i.type === 'moop');
        if (activeFilter === 'Flash') return items.filter(i => i.type === 'flash');
        if (activeFilter === 'Comer') return items.filter(i => i.category === 'food' || i.category === 'drink');

        return items;
    }, [activeFilter, RAW_FEED_ITEMS]);

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
            <div className="sticky top-0 z-30 bg-bg/95 backdrop-blur-xl border-b border-border pb-2 transition-all">
                <div className="px-5 pt-14 pb-3">
                    {/* Dynamic Header: Smart Radar OR Search Bar */}
                    {!isSearching ? (
                        <div className="flex justify-between items-start transition-all">
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
                            <button
                                onClick={() => setIsSearching(true)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-muted hover:text-brand-600 hover:border-brand-200 transition-all shadow-sm"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="relative flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500" size={18} />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="¿Qué te apetece hoy? (ej: cena romántica)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="w-full pl-10 pr-4 py-3 bg-surface rounded-xl border border-brand-200 text-text font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-lg shadow-brand-500/5"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setIsSearching(false);
                                    setSearchResults(null);
                                    setSearchQuery('');
                                }}
                                className="text-sm font-bold text-muted hover:text-text px-2"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>

                {/* Quick Filters (Hide if searching/results active?) -> Maybe keep them as fallback context */}
                {!isSearching && (
                    <div className="flex gap-2 overflow-x-auto px-5 pb-2 no-scrollbar scroll-pl-5">
                        <QuickFilter label="⚡ Para ti" active={activeFilter === 'Para ti'} onClick={() => setActiveFilter('Para ti')} />
                        <QuickFilter label="👥 Moops" active={activeFilter === 'Moops'} onClick={() => setActiveFilter('Moops')} />
                        <QuickFilter label="🍔 Comer" active={activeFilter === 'Comer'} onClick={() => setActiveFilter('Comer')} />
                        <QuickFilter label="⚡ Flash" active={activeFilter === 'Flash'} onClick={() => setActiveFilter('Flash')} />
                    </div>
                )}
            </div>

            {/* 2. FEED CONTENT or SEARCH RESULTS */}
            <div className="px-4 pt-4 pb-10 min-h-[50vh]">

                {/* A. SEARCH RESULTS MODE */}
                {isSearching && (
                    <div className="space-y-4">
                        {/* Loading State */}
                        {searchLoading && (
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                                <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin"></div>
                                <div>
                                    <p className="font-bold text-brand-700">Explorando la ciudad...</p>
                                    <p className="text-xs text-muted">Buscando las mejores vibras para ti.</p>
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {!searchLoading && searchResults && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Result Header */}
                                <div className="flex items-center justify-between mb-4 px-1">
                                    <h3 className="font-bold text-text flex items-center gap-2">
                                        <Sparkles size={16} className="text-brand-500" />
                                        Resultados para "{searchQuery}"
                                    </h3>
                                    {searchResults.source === 'external' && (
                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 font-bold flex items-center gap-1">
                                            <Globe size={10} /> Web Search
                                        </span>
                                    )}
                                </div>

                                {searchResults.message && !searchResults.results && (
                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 text-center animate-in fade-in zoom-in">
                                        <div className="text-3xl mb-2">🌱</div>
                                        <h3 className="font-bold text-green-800">Sistema Actualizado</h3>
                                        <p className="text-sm text-green-700">{searchResults.message}</p>
                                        <p className="text-xs text-green-600 mt-2">Ahora borra "!SEED" y busca algo normal.</p>
                                    </div>
                                )}

                                {/* List */}
                                {searchResults.results && searchResults.results.length > 0 ? (
                                    searchResults.results.map((item, idx) => (
                                        <div key={idx} className="mb-4">
                                            {/* Reuse DiscoverCard style structure but adapted for simple search result */}
                                            <div className="bg-white rounded-2xl p-3 shadow-lg border border-border flex gap-3 group active:scale-98 transition-transform">
                                                <div className="w-20 h-24 rounded-xl bg-gray-100 shrink-0 overflow-hidden relative">
                                                    <img
                                                        src={item.image_url || `https://source.unsplash.com/random/200x200?${item.category || 'place'}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div>
                                                        <h4 className="font-black text-text leading-tight mb-1">{item.name}</h4>
                                                        <p className="text-xs text-muted line-clamp-2">{item.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-100">
                                                            {(item.match_score * 100).toFixed(0)}% Match
                                                        </span>
                                                        {item.is_external && (
                                                            <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1">
                                                                <Globe size={10} /> Web
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 p-6 bg-surface rounded-3xl border border-dashed border-border mx-2">
                                        <p className="text-sm font-medium text-text">No encontramos nada exacto.</p>
                                        <p className="text-xs text-muted mt-1">Prueba con palabras clave diferentes.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* B. NORMAL FEED MODE */}
                {!isSearching && (
                    <>
                        {feedItems.map(item => (
                            <div key={item.id} className="mb-0">
                                {renderCard(item)}
                            </div>
                        ))}

                        <div className="text-center py-8 opacity-50">
                            <p className="text-xs text-gray-500 font-medium">Estás al día.<br />Sal y disfruta.</p>
                        </div>
                    </>
                )}
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
