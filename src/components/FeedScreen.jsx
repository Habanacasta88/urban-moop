// ... imports
import { useState, useMemo } from 'react';
import { Filter, Flame, MapPin, Zap, Music, Coffee, Search, Globe, Sparkles } from 'lucide-react'; // Added Icons
import { motion, AnimatePresence } from 'motion/react';
import BottomNavigation from './Navigation/BottomNavigation';
import { EventDetailScreen } from './EventDetailScreen';
import { LiveCard, FlashCard, EventCard, RouteCard } from './Feed/FeedCards';
import { ResultCard } from './Feed/ResultCard';
import { getSmartFeed } from '../utils/feedAlgorithm';
import { SearchService } from '../services/SearchService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { LoginModal } from './LoginModal';

// Hardcoded Mock Data for Feed (Enhanced with new card types)
const RAW_FEED_ITEMS = [
    {
        id: '1',
        type: 'live',
        title: 'Terraza activa con DJ',
        place: 'La Terraza del Mar',
        category: 'Fiesta',
        emoji: '🎧',
        description: 'Sesión sunset con el mejor ambiente del barrio',
        distance: '0.4 km',
        time: 'Ahora',
        attendees: 18,
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
        vibes: ['chill', 'social'],
    },
    {
        id: '2',
        type: 'event',
        title: 'Mercado de Navidad',
        category: 'Cultura',
        location: 'Plaça Major',
        day: '15',
        month: 'ENE',
        interested: 156,
        image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=800&h=600&fit=crop',
    },
    {
        id: '3',
        type: 'flash',
        title: '2x1 en Mojitos 🍹',
        place: 'La Terraza',
        description: 'Solo hasta las 20:00',
        timeLeft: '45m',
        distance: '0.2 km',
        image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop'
    },
    {
        id: '4',
        type: 'live',
        title: 'Vermut Popular',
        place: 'Mercat Central',
        category: 'Gastronomía',
        emoji: '🍷',
        distance: '350 m',
        time: 'Ahora',
        attendees: 24,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
    },
    {
        id: '5',
        type: 'event',
        title: 'Concierto Indie - Sala Esferic',
        category: 'Música',
        location: 'Sala Esferic',
        day: '18',
        month: 'ENE',
        interested: 89,
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=450&fit=crop',
    },
    {
        id: '6',
        type: 'route',
        title: 'Ruta del Vermut ☀️',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
        stops: 4,
        duration: '2h 30min',
        distance: '1.8 km',
    },
    {
        id: '7',
        type: 'event',
        title: 'Exposición Arte Urbano',
        category: 'Cultura',
        location: 'Centre d\'Art',
        day: '20',
        month: 'ENE',
        interested: 45,
        image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=600&fit=crop',
    },
    {
        id: '8',
        type: 'flash',
        title: 'Happy Hour -50%',
        place: 'Rooftop Bar',
        description: 'Cócteles premium a mitad de precio',
        timeLeft: '1h 30m',
        distance: '0.5 km',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop'
    },
    {
        id: '9',
        type: 'event',
        title: 'Taller de Cerámica',
        category: 'Cultura',
        location: 'Espai Creatiu',
        day: '22',
        month: 'ENE',
        interested: 28,
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop',
    },
    {
        id: '10',
        type: 'live',
        title: 'Yoga al Atardecer',
        place: 'Parc Catalunya',
        category: 'Bienestar',
        emoji: '🧘',
        distance: '1.2 km',
        time: '18:30',
        attendees: 12,
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=600&fit=crop',
    },
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
    const { user } = useAuth();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeFilter, setActiveFilter] = useState('Para ti');
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null);

    // SEARCH HANDLER
    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setSearchLoading(true);
            setSearchResults(null);
            try {
                const response = await SearchService.search(searchQuery);
                console.log('🔍 Search Response:', JSON.stringify(response, null, 2));
                setSearchResults(response);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setSearchLoading(false);
            }
        }
    };

    // VIEW HANDLER - Show detail modal
    const handleView = (item) => {
        setSelectedEvent(item);
    };

    // SAVE HANDLER - Save to favorites with auth check
    const handleSave = async (item) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        // Verify item has ID
        if (!item.id) {
            console.error('Cannot save item without ID:', item);
            return;
        }

        try {
            // Check if already saved
            const { data: existing } = await supabase
                .from('saved_items')
                .select('id')
                .eq('user_id', user.id)
                .eq('item_id', item.id)
                .single();

            if (existing) {
                // Already saved, optionally show message
                console.log('Already saved');
                return;
            }

            // Save to favorites
            const { error } = await supabase
                .from('saved_items')
                .insert({
                    user_id: user.id,
                    item_id: item.id,
                    item_type: item.source === 'web_discovery' ? 'web_place' : 'map_item',
                    saved_at: new Date().toISOString()
                });

            if (error) throw error;

            console.log('Item saved successfully');
        } catch (error) {
            console.error('Error saving item:', error);
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

    // RENDER FACTORY - Enhanced with new card types
    const renderCard = (item) => {
        switch (item.type) {
            case 'live':
                return <LiveCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            case 'moop':
                return <LiveCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            case 'flash':
                return <FlashCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            case 'event':
                return <EventCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            case 'route':
                return <RouteCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            case 'new':
                return <EventCard key={item.id} item={item} onClick={() => setSelectedEvent(item)} />;
            default:
                return null;
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
                                {/* !SEED Message */}
                                {searchResults.message && (
                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 text-center">
                                        <div className="text-3xl mb-2">🌱</div>
                                        <h3 className="font-bold text-green-800">Sistema Actualizado</h3>
                                        <p className="text-sm text-green-700">{searchResults.message}</p>
                                    </div>
                                )}

                                {/* Internal Results Section */}
                                {searchResults.internal && searchResults.internal.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                                            <Sparkles size={16} className="text-brand-600" />
                                            En UrbanMoop ({searchResults.internal.length})
                                        </h3>
                                        {searchResults.internal.map((item, idx) => (
                                            <ResultCard
                                                key={item.id || idx}
                                                item={item}
                                                type="internal"
                                                onView={handleView}
                                                onSave={handleSave}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* External Results Section */}
                                {searchResults.external && searchResults.external.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
                                            <Globe size={16} className="text-blue-600" />
                                            Encontramos en la web ({searchResults.external.length})
                                        </h3>
                                        {searchResults.external.map((item, idx) => (
                                            <ResultCard
                                                key={item.id || idx}
                                                item={item}
                                                type="external"
                                                onView={handleView}
                                                onSave={handleSave}
                                            />
                                        ))}

                                        {/* Feedback Loop */}
                                        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                            <p className="text-xs text-blue-800 mb-2">¿Estos lugares son útiles?</p>
                                            <div className="flex gap-2">
                                                <button className="text-xs px-3 py-1 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                                                    👍 Sí
                                                </button>
                                                <button className="text-xs px-3 py-1 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                                                    👎 No
                                                </button>
                                                <button className="text-xs px-3 py-1 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                                                    📝 Añadir info
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* No Results Fallback */}
                                {(!searchResults.internal || searchResults.internal.length === 0) &&
                                    (!searchResults.external || searchResults.external.length === 0) &&
                                    !searchResults.message && (
                                        <div className="text-center py-10 px-6">
                                            <div className="text-4xl mb-3">🔍</div>
                                            <h3 className="font-bold text-text mb-2">
                                                No encontramos "{searchQuery}" ahora cerca
                                            </h3>
                                            <p className="text-sm text-muted mb-4">
                                                Pero puedes:
                                            </p>
                                            <div className="space-y-2">
                                                <button className="w-full py-3 bg-surface rounded-xl border hover:bg-surface-2 transition-colors text-sm font-medium">
                                                    🗺️ Ver lugares similares
                                                </button>
                                                <button className="w-full py-3 bg-surface rounded-xl border hover:bg-surface-2 transition-colors text-sm font-medium">
                                                    ➕ Crear Moop aquí
                                                </button>
                                                <button className="w-full py-3 bg-surface rounded-xl border hover:bg-surface-2 transition-colors text-sm font-medium">
                                                    🔔 Avísame cuando haya algo
                                                </button>
                                            </div>
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

            {/* Login Modal */}
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                />
            )}

        </div>
    );
};
