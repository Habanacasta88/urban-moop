import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Share2, Trash2, Heart, ArrowRight, LogIn, Calendar, Clock, ChevronDown, ChevronUp, Map as MapIcon, Zap } from 'lucide-react';
import BottomNavigation from './Navigation/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { LoginModal } from './LoginModal';
import { LoadingSpinner } from './common/LoadingSpinner';

export const SavedScreen = ({ activeTab, onTabChange, onItemClick }) => {
    const { user } = useAuth();
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showPast, setShowPast] = useState(false);

    // Grouping State
    const [groupedItems, setGroupedItems] = useState({
        today: [],
        upcoming: [],
        spaces: [],
        past: []
    });

    // Fetch saved items from Supabase
    useEffect(() => {
        if (!user) {
            setLoading(false);
            setSavedItems([]);
            return;
        }

        const fetchSavedItems = async () => {
            try {
                setLoading(true);
                // Attempt to fetch start_time if it exists in map_items, 
                // otherwise we rely on what we get.
                const { data, error } = await supabase
                    .from('saved_items')
                    .select(`
                        *,
                        map_items!inner (
                            *
                        )
                    `)
                    .eq('user_id', user.id)
                    .order('saved_at', { ascending: false });

                if (error) throw error;

                // Transform data
                const items = (data || []).map(item => {
                    const mapItem = item.map_items;
                    // Try to find a date field. Adjust 'start_time' key if your DB uses different naming (e.g. starts_at)
                    // If map_items doesn't have it, we check if it was saved with metadata (unlikely for current schema)
                    // For now, assume mapItem has start_time or we fallback to 'spaces' if null.

                    return {
                        id: item.id,
                        itemId: item.item_id,
                        type: item.item_type || mapItem.category || 'event',
                        title: mapItem.title || 'Sin título',
                        subtitle: mapItem.description || '',
                        image: mapItem.image_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400',
                        distance: mapItem.location_name || 'Ubicación',
                        date: mapItem.start_time || mapItem.created_at, // Fallback to created_at if start_time missing, but logic below handles it
                        startTime: mapItem.start_time ? new Date(mapItem.start_time) : null,
                        category: mapItem.category,
                        mapItem: mapItem
                    };
                });

                setSavedItems(items);
                categorizeItems(items);

            } catch (error) {
                console.error('Error fetching saved items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedItems();
    }, [user]);

    // Categorize Logic
    const categorizeItems = (items) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const groups = {
            today: [],
            upcoming: [],
            spaces: [],
            past: []
        };

        items.forEach(item => {
            if (!item.startTime) {
                // If no specific start time, treat as "Space" / "Place" unless specifically an event without date
                // For MVP, items without valid start_time go to Spaces
                groups.spaces.push(item);
                return;
            }

            const itemDate = new Date(item.startTime);
            itemDate.setHours(0, 0, 0, 0);

            if (itemDate.getTime() < today.getTime()) {
                groups.past.push(item);
            } else if (itemDate.getTime() === today.getTime()) {
                groups.today.push(item);
            } else {
                groups.upcoming.push(item);
            }
        });

        // Debug fallback: If everything ends up in Spaces because DB lacks start_time, 
        // randomly distribute for demo if specifically requested, but better to show real state.
        // For now, we trust the DB or fallback to spaces.

        setGroupedItems(groups);
    };

    // Filter Logic (Search only for simplicity in this view)
    const filterGroup = (group) => {
        if (!searchQuery) return group;
        return group.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const handleDelete = async (savedItemId) => {
        try {
            const { error } = await supabase
                .from('saved_items')
                .delete()
                .eq('id', savedItemId);

            if (error) throw error;

            const newItems = savedItems.filter(item => item.id !== savedItemId);
            setSavedItems(newItems);
            categorizeItems(newItems);
        } catch (error) {
            console.error('Error deleting saved item:', error);
        }
    };

    const handleShare = async (item) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item.title,
                    text: `¡Mira esto en UrbanMoop! ${item.title}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        }
    };

    if (!user) {
        return (
            <div className="relative w-full h-[100dvh] bg-bg flex flex-col overflow-hidden font-sf text-text">
                <div className="bg-bg/95 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-border">
                    <h1 className="text-3xl font-black text-brand-700 tracking-tight">Guardados</h1>
                    <p className="text-sm text-muted font-medium mt-1">Tu colección personal</p>
                </div>
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center max-w-sm">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-50 flex items-center justify-center">
                            <Heart size={40} className="text-brand-600" />
                        </div>
                        <h2 className="text-2xl font-black text-text mb-3">Inicia sesión</h2>
                        <p className="text-sm text-muted mb-6">Guarda tus planes favoritos para no perderte nada.</p>
                        <button onClick={() => setShowLoginModal(true)} className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30">
                            <LogIn size={20} /> Iniciar Sesión
                        </button>
                    </div>
                </div>
                {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />}
                <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="relative w-full h-[100dvh] bg-bg flex flex-col overflow-hidden font-sf text-text">
                <div className="bg-bg/95 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-border">
                    <h1 className="text-3xl font-black text-brand-700 tracking-tight">Guardados</h1>
                    <LoadingSpinner message="Organizando tus planes..." />
                </div>
                <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
            </div>
        );
    }

    const filteredToday = filterGroup(groupedItems.today);
    const filteredUpcoming = filterGroup(groupedItems.upcoming);
    const filteredSpaces = filterGroup(groupedItems.spaces);
    const filteredPast = filterGroup(groupedItems.past);

    const hasNoResults = !filteredToday.length && !filteredUpcoming.length && !filteredSpaces.length && !filteredPast.length;

    return (
        <div className="relative w-full h-[100dvh] bg-bg flex flex-col overflow-hidden font-sf text-text">
            {/* Header */}
            <div className="bg-bg/95 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-border z-10">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-brand-700 tracking-tight">Guardados</h1>
                        <p className="text-sm text-muted font-medium mt-1">
                            {savedItems.length} planes en tu lista
                        </p>
                    </div>
                    {/* Search Trigger */}
                    <button className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-muted">
                        <Search size={20} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-8 pt-6">

                {hasNoResults && (
                    <div className="text-center py-20 opacity-50">
                        <Heart size={48} className="mx-auto text-muted mb-4" />
                        <p className="font-bold text-lg">Nada por aquí aún</p>
                        <p className="text-sm">¡Explora y guarda planes!</p>
                    </div>
                )}

                {/* 1. SECCIÓN HOY (High Priority) */}
                {filteredToday.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <h2 className="text-xl font-black text-text uppercase tracking-tight">Hoy</h2>
                        </div>
                        <div className="space-y-4">
                            {filteredToday.map(item => (
                                <div key={item.id} className="relative w-full bg-white rounded-3xl overflow-hidden shadow-lg border border-red-100 group">
                                    <div className="h-48 relative">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                                                <span className="text-xs font-bold uppercase tracking-wide text-yellow-400">Ocurriendo ahora</span>
                                            </div>
                                            <h3 className="text-2xl font-black leading-none mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-300 flex items-center gap-1">
                                                <MapPin size={12} /> {item.distance}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-4 flex items-center gap-3">
                                        <button
                                            onClick={() => onItemClick && onItemClick(item.mapItem)}
                                            className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                        >
                                            Ir ahora <ArrowRight size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 2. SECCIÓN PRÓXIMAMENTE */}
                {filteredUpcoming.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <Clock size={18} className="text-brand-500" />
                            <h2 className="text-lg font-black text-text tracking-tight">Próximamente</h2>
                        </div>
                        {/* Horizontal Scroll or Vertical List? User asked for structure. Let's keep vertical for simplicity but styled differently */}
                        <div className="space-y-3">
                            {filteredUpcoming.map(item => (
                                <div key={item.id} className="bg-white p-3 rounded-2xl flex gap-3 border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                        <img src={item.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="font-bold text-text leading-tight mb-1 line-clamp-1">{item.title}</h3>
                                        <p className="text-xs text-muted font-medium mb-2 flex items-center gap-1">
                                            <Calendar size={10} />
                                            {item.startTime ? new Date(item.startTime).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }) : 'Pronto'}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onItemClick && onItemClick(item.mapItem)}
                                                className="px-3 py-1.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg"
                                            >
                                                Ver detalle
                                            </button>
                                            <button onClick={() => handleShare(item)} className="p-1.5 text-gray-400 hover:text-gray-600">
                                                <Share2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 3. SECCIÓN ESPACIOS (No Date) */}
                {filteredSpaces.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4 px-2">
                            <MapIcon size={18} className="text-blue-500" />
                            <h2 className="text-lg font-black text-text tracking-tight">Lugares y Espacios</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {filteredSpaces.map(item => (
                                <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
                                    <div className="h-28 bg-gray-100 relative">
                                        <img src={item.image} className="w-full h-full object-cover" />
                                        <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:bg-red-500 hover:text-white transition-colors">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-sm text-text leading-tight mb-1 line-clamp-2">{item.title}</h3>
                                            <p className="text-[10px] text-muted">{item.distance}</p>
                                        </div>
                                        <button
                                            onClick={() => onItemClick && onItemClick(item.mapItem)}
                                            className="mt-3 w-full py-1.5 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            Ver espacio
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 4. SECCIÓN PASADO (Collapsed) */}
                {filteredPast.length > 0 && (
                    <section className="pt-4 border-t border-dashed border-gray-200">
                        <button
                            onClick={() => setShowPast(!showPast)}
                            className="w-full flex items-center justify-between text-muted text-sm font-medium py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <span>⌛ Pasado ({filteredPast.length})</span>
                            {showPast ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence>
                            {showPast && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-3 pt-2 opacity-60 grayscale hover:grayscale-0 transition-all">
                                        {filteredPast.map(item => (
                                            <div key={item.id} className="flex gap-3 p-2">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm text-text">{item.title}</h3>
                                                    <p className="text-xs text-muted">Finalizado</p>
                                                </div>
                                                <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                )}

            </div>

            <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
        </div>
    );
};
