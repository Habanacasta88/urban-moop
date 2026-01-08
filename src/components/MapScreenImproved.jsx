import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Menu, Map as MapIcon, Layers, Zap, Search, Bookmark, Users, Clock, Flame, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
    const [viewMode, setViewMode] = useState('map'); // map, list
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Filter State
    // activeFilter (Intent): 'live' (Para ti), 'moop', 'flash', 'culture' (Mapped via modal)
    const [activeIntent, setActiveIntent] = useState('live');
    const [filters, setFilters] = useState({
        time: 'Hoy', // DEFAULT: HOY
        categories: [],
        sort: 'recommended'
    });

    // Handle updates from Intent Menu
    const handleIntentApply = (newConfig) => {
        // newConfig contains categories, sort, activeFilter
        setFilters(prev => ({
            ...prev,
            categories: newConfig.categories,
            sort: newConfig.sort
        }));
        if (newConfig.activeFilter) {
            setActiveIntent(newConfig.activeFilter);
        }
    };

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

        // 2. Intent Filtering (activeIntent)
        if (activeIntent !== 'todo') { // 'todo' is generous fallback
            if (activeIntent === 'live') {
                // "Para ti" / Smart Radar: 
                // Currently simplified to showing everything relevant, or high quality matches
                // For MVP, if it triggers 'live' we might just show high relevance or time-based
                // Let's assume 'live' behaves like standard view unless refined
            }
            if (activeIntent === 'moop' && evt.type !== 'moop') return false;
            if (activeIntent === 'flash' && !evt.isFlash) return false;
            // Culture Intent often maps to specific categories, handled below in 3.
        }

        // 3. Category Filtering (From Intent Menu Config)
        if (filters.categories.length > 0) {
            const catMatch = filters.categories.some(c =>
                evt.category?.toLowerCase().includes(c) ||
                evt.type?.toLowerCase().includes(c) ||
                evt.tags?.some(t => t.toLowerCase().includes(c))
            );
            if (!catMatch) return false;
        }

        // 4. Time Filtering (From Top Bar)
        if (filters.time !== 'any') {
            const evtDate = new Date(evt.rawStartTime || evt.time || evt.start_time);
            // Mock Date handling if raw not avail
            // If invalid date, we might show it if it's generic, but let's try strict

            const now = new Date();
            const today = new Date();
            const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

            // Comparison Helper (ignores time for day match)
            const isSameDay = (d1, d2) =>
                d1.getDate() === d2.getDate() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getFullYear() === d2.getFullYear();

            if (filters.time === 'Hoy') {
                if (!isSameDay(evtDate, today)) return false;
            }
            if (filters.time === 'Mañana') {
                if (!isSameDay(evtDate, tomorrow)) return false;
            }
            if (filters.time === 'Esta semana') {
                const endOfWeek = new Date(today); endOfWeek.setDate(today.getDate() + 7);
                if (evtDate > endOfWeek || evtDate < today) return false;
            }
            if (filters.time === 'Finde') {
                // Friday (5), Saturday (6), Sunday (0)
                const day = evtDate.getDay();
                if (day !== 5 && day !== 6 && day !== 0) return false;
            }
        }

        return true;
    }).sort((a, b) => {
        // 5. Sorting
        if (filters.sort === 'distance') return 0; // Handled by simple map proximity usually or we add logic
        // Recommended Default
        if (a.type === 'moop' && b.type !== 'moop') return -1;
        if (a.type !== 'moop' && b.type === 'moop') return 1;
        return 0;
    });

    // Carousel/Swipe Logic
    const [carouselIndex, setCarouselIndex] = useState(0);
    const currentSwipeEvent = filteredEvents.length > 0 ? filteredEvents[carouselIndex % filteredEvents.length] : null;

    useEffect(() => {
        setCarouselIndex(0);
    }, [activeIntent, filters.time, filteredEvents.length]);

    const handleNext = () => setCarouselIndex((prev) => (prev + 1) % filteredEvents.length);
    const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + filteredEvents.length) % filteredEvents.length);

    const handleMapSelect = (evt) => {
        if (currentSwipeEvent?.id === evt.id) {
            setSelectedEvent(evt);
        } else {
            const idx = filteredEvents.findIndex(e => e.id === evt.id);
            if (idx !== -1) setCarouselIndex(idx);
        }
    };

    const handleNavigation = (tabId) => {
        onTabChange(tabId);
    };

    if (loading && fetchedEvents.length === 0) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-500">Cargando mapa...</div>;
    }

    const USER_LOCATION = { lat: 41.54329, lng: 2.10942 };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        if (d < 1) return `${Math.round(d * 1000)} m`;
        return `${d.toFixed(1)} km`;
    };

    const getEventDistance = (evt) => {
        if (!evt) return null;
        if (evt.lat && evt.lng) {
            return calculateDistance(USER_LOCATION.lat, USER_LOCATION.lng, evt.lat, evt.lng);
        }
        return null;
    };


    return (
        <div className="relative w-full h-[100dvh] bg-gray-900 overflow-hidden font-sans">

            {/* 1. Header & Filters (Z-Index 50) - Glass Theme */}
            <div className="absolute top-0 left-0 right-0 z-50 flex flex-col gap-3 pt-4 pointer-events-none">

                {/* Glass Search Bar */}
                <div className="px-5 pointer-events-auto">
                    <div className="w-full h-14 bg-white/95 backdrop-blur-xl rounded-full shadow-lg flex items-center justify-between px-2 pr-2 border border-white/50">
                        <div className="flex items-center gap-3 pl-4 flex-1">
                            <Search size={20} className="text-gray-400" />
                            <div className="flex flex-col justify-center">
                                <span className="text-sm font-bold text-gray-900 leading-tight">Sabadell</span>
                                <span className="text-[10px] font-medium text-gray-500 leading-tight">Explorar eventos cercanos</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="size-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors pointer-events-auto"
                        >
                            <Menu size={20} className="text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* Time Filter Pills */}
                <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide py-2 pointer-events-auto">
                    {['Hoy', 'Mañana', 'Este finde', 'Cultura'].map((timeLabel) => {
                        const stateKey = timeLabel === 'Este finde' ? 'Finde' : timeLabel;
                        const isActive = filters.time === stateKey;

                        return (
                            <button
                                key={stateKey}
                                onClick={() => setFilters(prev => ({ ...prev, time: stateKey }))}
                                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-transform active:scale-95 ${isActive
                                        ? 'bg-black text-white shadow-lg'
                                        : 'bg-white text-gray-600 border border-gray-100 shadow-sm hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-xs font-bold">{timeLabel}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. Map Layer (Z-Index 0) */}
            <div className="absolute inset-0 z-0">
                <EmotionalMap
                    events={filteredEvents}
                    selectedId={currentSwipeEvent?.id}
                    onSelect={handleMapSelect}
                />
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
                        distance={getEventDistance(currentSwipeEvent)}
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
                        distance={getEventDistance(selectedEvent)}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </AnimatePresence>

            {/* 7. Intent Menu (Filter Modal) */}
            <AnimatePresence>
                <FilterModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    currentFilters={filters}
                    onApply={handleIntentApply}
                />
            </AnimatePresence>

            {/* Onboarding Hint */}
            <AnimatePresence>
                {showOnboardingHint && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        onAnimationComplete={() => setTimeout(onCloseHint, 3000)}
                        className="absolute bottom-64 left-1/2 -translate-x-1/2 z-[45] pointer-events-none w-max max-w-[90%]"
                    >
                        <div className="bg-white/90 backdrop-blur-md text-gray-900 px-5 py-3 rounded-2xl shadow-lg border border-white/50 text-center">
                            <h4 className="font-semibold text-sm mb-0.5">🔥 Esto está pasando ahora cerca de ti</h4>
                            <p className="text-xs text-gray-600 font-normal">
                                Toca un plan y sal ahí fuera.
                            </p>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 rotate-45 border-r border-b border-white/50"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Nav */}
            <BottomNavigation currentView={activeTab} onNavigate={handleNavigation} />
        </div>
    );
};
