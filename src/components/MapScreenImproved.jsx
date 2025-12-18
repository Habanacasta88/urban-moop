import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, List, Map as MapIcon, Layers, Zap, Search, Bookmark, Users, Clock, Flame, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import EmotionalMap from './Map/EmotionalMap';
import BottomNavigation from './Navigation/BottomNavigation';
import { useSupabaseMapItems } from '../hooks/useSupabaseMapItems';
import MapEventCard from './Map/MapEventCard';
import { useVibe } from '../context/VibeContext';
import { RadarHeader } from './Map/RadarHeader';
import { SwipeableEventCard } from './Map/SwipeableEventCard';

import { FilterModal } from './Map/FilterModal';

export const MapScreen = ({ activeTab, onTabChange, onNavigateToMoops, showOnboardingHint, onCloseHint }) => {
    const { events: fetchedEvents, loading } = useSupabaseMapItems();
    const { openVibeCheck } = useVibe();
    const [activeFilter, setActiveFilter] = useState('todo'); // todo, flash, moop, nuevo, trending
    const [viewMode, setViewMode] = useState('map'); // map, list
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [filters, setFilters] = useState({ time: 'any', categories: [], sort: 'recommended' });
    const [showColorHint, setShowColorHint] = useState(showOnboardingHint);

    // Filter Logic
    const filteredEvents = fetchedEvents.filter(evt => {
        // 1. Text Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesText =
                evt.title?.toLowerCase().includes(query) ||
                evt.description?.toLowerCase().includes(query) ||
                evt.category?.toLowerCase().includes(query) ||
                evt.tags?.some(tag => tag.toLowerCase().includes(query));
            if (!matchesText) return false;
        }

        // 2. Quick Filters (Top Bar)
        if (activeFilter !== 'todo') {
            if (activeFilter === 'live') {
                const now = new Date();
                // Simple live check: start_time <= now <= end_time
                if (!evt.start_time || !evt.end_time) return false;
                const start = new Date(evt.start_time);
                const end = new Date(evt.end_time);
                if (now < start || now > end) return false;
            }
            if (activeFilter === 'moop' && evt.type !== 'moop') return false;
        }

        // 3. Modal Filters - Categories
        if (filters.categories.length > 0) {
            // Map generic categories to specific DB types if needed, or just match against evt.type/category
            // Assuming evt.category or evt.type matches the IDs 'party', 'food', 'sport', 'culture' roughly
            // For MVP: Simple include check if evt.category is one of them OR evt.tags has it
            const catMatch = filters.categories.some(c =>
                evt.category?.toLowerCase().includes(c) ||
                evt.type?.toLowerCase().includes(c) ||
                evt.tags?.some(t => t.toLowerCase().includes(c))
            );
            if (!catMatch) return false;
        }

        // 4. Modal Filters - Time
        if (filters.time !== 'any') {
            const evtDate = new Date(evt.rawStartTime || evt.time); // Assuming rawStartTime is ISO
            const now = new Date();
            const today = new Date();
            const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

            if (filters.time === 'Hoy') {
                if (evtDate.getDate() !== today.getDate()) return false;
            }
            if (filters.time === 'Mañana') {
                if (evtDate.getDate() !== tomorrow.getDate()) return false;
            }
            if (filters.time === 'Esta semana') {
                const endOfWeek = new Date(today); endOfWeek.setDate(today.getDate() + 7);
                if (evtDate > endOfWeek || evtDate < today) return false;
            }
            if (filters.time === 'Finde') {
                // Simplified: Friday/Saturday/Sunday
                const day = evtDate.getDay();
                if (day !== 5 && day !== 6 && day !== 0) return false;
            }
        }

        return true;
    }).sort((a, b) => {
        // 5. Sorting
        if (filters.sort === 'distance') {
            // Mock distance sort if we don't have user location: use alphabetical as fallback or random
            return 0; // In a real app, calculate distance from userCoords
        }
        // Recommended (Default)
        return 0;
    });

    // Carousel/Swipe Logic
    const [carouselIndex, setCarouselIndex] = useState(0);
    const currentSwipeEvent = filteredEvents.length > 0 ? filteredEvents[carouselIndex % filteredEvents.length] : null;

    useEffect(() => {
        setCarouselIndex(0);
    }, [activeFilter, filteredEvents.length]);

    const handleNext = () => setCarouselIndex((prev) => (prev + 1) % filteredEvents.length);
    const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);

    const handleMapSelect = (evt) => {
        setShowColorHint(false); // Dismiss color hint on interaction
        if (currentSwipeEvent?.id === evt.id) {
            setSelectedEvent(evt);
        } else {
            const idx = filteredEvents.findIndex(e => e.id === evt.id);
            if (idx !== -1) setCarouselIndex(idx);
        }
    };

    // Intercept 'publish' action to show Radial Menu
    // NOW DELEGATED TO APP.JSX GLOBAL HANDLER
    const handleNavigation = (tabId) => {
        onTabChange(tabId);
    };

    if (loading && fetchedEvents.length === 0) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-500">Cargando mapa...</div>;
    }

    return (
        <div className="relative w-full h-[100dvh] bg-gray-100 overflow-hidden font-sf">

            {/* 1. Header & Filters (Z-Index 50) */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4">
                <RadarHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} events={fetchedEvents} />

                {/* Search Bar */}
                <div className="pointer-events-auto flex gap-3 mt-3">
                    <div className="relative flex-1 group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Search size={22} /></div>
                        <input
                            type="text"
                            placeholder="¿Qué buscas hoy?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white rounded-2xl py-3.5 pl-12 pr-4 shadow-xl shadow-indigo-500/5 border border-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-gray-400"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><X size={16} /></button>
                        )}
                    </div>
                    {/* Filters Toggle */}
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="w-12 bg-white rounded-2xl shadow-xl shadow-indigo-500/5 border border-gray-100 flex items-center justify-center text-gray-500 active:scale-95 transition-transform"
                    >
                        <List size={22} />
                    </button>
                </div>

                {/* Filters Horizontal Scroll */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-3 pointer-events-auto no-scrollbar scroll-pl-4">
                    <div className="flex items-center gap-2">
                        {/* Static "Todo" */}
                        <button
                            onClick={() => setActiveFilter('todo')}
                            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all ${activeFilter === 'todo' ? 'bg-black text-white scale-105' : 'bg-white text-gray-900 border border-gray-100'}`}
                        >
                            Todo
                        </button>

                        {/* "Ahora" (Live) */}
                        <button
                            onClick={() => setActiveFilter('live')}
                            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all ${activeFilter === 'live' ? 'bg-black text-white scale-105' : 'bg-white text-gray-900 border border-gray-100 text-red-600'}`}
                        >
                            🔴 Ahora
                        </button>

                        {/* "Moops" */}
                        <button
                            onClick={() => setActiveFilter('moop')}
                            className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all ${activeFilter === 'moop' ? 'bg-black text-white scale-105' : 'bg-white text-gray-900 border border-gray-100 text-indigo-600'}`}
                        >
                            👥 Moops
                        </button>

                        {/* "Más" (Trigger Modal) */}
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all bg-white text-gray-500 border border-gray-100 flex items-center gap-1 active:scale-95"
                        >
                            Más...
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Map Layer (Z-Index 0) */}
            <div className="absolute inset-0 z-0">
                <EmotionalMap
                    events={filteredEvents}
                    selectedId={currentSwipeEvent?.id}
                    onSelect={handleMapSelect}
                />
                {/* Initial Blur Overlay */}
                <motion.div
                    initial={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(255,255,255,0.1)' }}
                    animate={{ backdropFilter: 'blur(0px)', backgroundColor: 'rgba(255,255,255,0)' }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0 pointer-events-none z-10"
                />
            </div>

            {/* 3. Swipeable Card (Z-Index 40) */}
            <AnimatePresence>
                {viewMode === 'map' && currentSwipeEvent && !selectedEvent && (
                    <SwipeableEventCard
                        key="swipe-card"
                        event={currentSwipeEvent}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        onClick={() => setSelectedEvent(currentSwipeEvent)}
                    />
                )}
            </AnimatePresence>

            {/* 6. Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <MapEventCard
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </AnimatePresence>

            {/* 7. Filter Modal */}
            <AnimatePresence>
                <FilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    currentFilters={filters}
                    onApply={setFilters}
                />
            </AnimatePresence>

            {/* Onboarding Hint (Cards) */}
            <AnimatePresence>
                {showOnboardingHint && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onAnimationComplete={() => setTimeout(onCloseHint, 2500)}
                        className="absolute bottom-24 left-4 right-4 z-[45] pointer-events-none"
                    >
                        <div className="bg-black/90 text-white p-4 rounded-2xl shadow-2xl border border-white/20 relative">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl animate-bounce">👇</span>
                                <div>
                                    <h4 className="font-bold text-sm mb-1">👋 Empieza por aquí:</h4>
                                    <p className="text-xs text-gray-300">
                                        Mira qué está pasando ahora mismo cerca de ti.
                                    </p>
                                </div>
                            </div>
                            {/* Arrow pointing down */}
                            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-black/90 rotate-45 border-r border-b border-white/20"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Map Color Context Tooltip (Dismiss on Interaction) */}
            <AnimatePresence>
                {showColorHint && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onAnimationComplete={() => setTimeout(() => setShowColorHint(false), 4000)}
                        className="absolute top-48 left-1/2 -translate-x-1/2 z-[40] pointer-events-none max-w-[280px]"
                    >
                        <div className="bg-white/90 backdrop-blur-md text-gray-900 p-3 rounded-2xl shadow-xl border border-white/50 flex flex-col items-center text-center gap-2">
                            <span className="text-2xl">🗺️</span>
                            <p className="text-xs font-medium leading-relaxed">
                                <span className="font-bold text-indigo-600">Los colores muestran la vibra</span> de cada zona ahora mismo.
                                <br />
                                <span className="text-gray-500 font-normal">Toca un punto para ver qué pasa.</span>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Nav */}
            <BottomNavigation currentView={activeTab} onNavigate={handleNavigation} />
        </div>
    );
};
