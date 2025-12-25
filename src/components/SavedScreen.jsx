import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Star, Share2, Trash2, Zap, Calendar, Heart, ArrowRight, Flame, LogIn } from 'lucide-react';
import BottomNavigation from './Navigation/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { LoginModal } from './LoginModal';

const FILTERS = [
    { id: 'all', label: 'Todo' },
    { id: 'event', label: 'Eventos' },
    { id: 'promo', label: 'Promos' },
    { id: 'moop', label: 'Moops' },
];

export const SavedScreen = ({ activeTab, onTabChange, onItemClick }) => {
    const { user } = useAuth();
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);

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
                const { data, error } = await supabase
                    .from('saved_items')
                    .select(`
                        *,
                        map_items!inner (
                            id,
                            title,
                            description,
                            category,
                            image_url,
                            lat,
                            lng,
                            location_name,
                            tags,
                            hours
                        )
                    `)
                    .eq('user_id', user.id)
                    .order('saved_at', { ascending: false });

                if (error) throw error;

                // Transform data to match UI expectations
                const transformedItems = (data || []).map(item => ({
                    id: item.id,
                    itemId: item.item_id,
                    type: item.item_type || item.map_items?.category || 'event',
                    title: item.map_items?.title || 'Sin título',
                    subtitle: item.map_items?.description || '',
                    image: item.map_items?.image_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400',
                    distance: item.map_items?.location_name || 'Ubicación',
                    rating: 4.5,
                    savedAt: item.saved_at,
                    mapItem: item.map_items
                }));

                setSavedItems(transformedItems);
            } catch (error) {
                console.error('Error fetching saved items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedItems();
    }, [user]);

    // Handle delete
    const handleDelete = async (savedItemId) => {
        try {
            const { error } = await supabase
                .from('saved_items')
                .delete()
                .eq('id', savedItemId);

            if (error) throw error;

            // Update local state
            setSavedItems(prev => prev.filter(item => item.id !== savedItemId));
        } catch (error) {
            console.error('Error deleting saved item:', error);
        }
    };

    const filteredItems = savedItems.filter(item => {
        const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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

    // Not logged in view
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
                        <h2 className="text-2xl font-black text-text mb-3">
                            Inicia sesión para guardar
                        </h2>
                        <p className="text-sm text-muted mb-6">
                            Guarda tus lugares, eventos y promos favoritos para acceder a ellos cuando quieras.
                        </p>
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
                        >
                            <LogIn size={20} />
                            Iniciar Sesión
                        </button>
                    </div>
                </div>

                {showLoginModal && (
                    <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
                )}

                <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="relative w-full h-[100dvh] bg-bg flex flex-col overflow-hidden font-sf text-text">
                <div className="bg-bg/95 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-border">
                    <h1 className="text-3xl font-black text-brand-700 tracking-tight">Guardados</h1>
                    <p className="text-sm text-muted font-medium mt-1">Cargando...</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin"></div>
                </div>
                <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
            </div>
        );
    }

    return (
        <div className="relative w-full h-[100dvh] bg-bg flex flex-col overflow-hidden font-sf text-text">
            {/* Header Fixed */}
            <div className="bg-bg/95 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-border z-10 transition-colors">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-brand-700 tracking-tight">Guardados</h1>
                        <p className="text-sm text-muted font-medium mt-1">Tu colección personal</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center overflow-hidden border border-border shadow-md">
                        {user.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex gap-3 mb-6">
                    <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                        <span className="text-sm font-bold text-green-600">{savedItems.length} guardados</span>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar guardados..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-2xl border border-border text-text font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6">
                    {FILTERS.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeFilter === filter.id
                                ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/30'
                                : 'bg-surface text-text-2 border-border hover:bg-surface-2'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-32">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart size={48} className="mx-auto text-muted mb-4" />
                        <h3 className="text-lg font-bold text-text mb-2">No tienes guardados</h3>
                        <p className="text-sm text-muted">
                            {searchQuery ? 'No encontramos resultados' : 'Empieza a guardar tus lugares favoritos'}
                        </p>
                    </div>
                ) : (
                    filteredItems.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-3 shadow-lg border border-border relative overflow-hidden group hover:border-brand-200 transition-colors"
                        >
                            <div className="flex gap-4">
                                {/* Image */}
                                <div className="w-28 h-36 rounded-2xl overflow-hidden shrink-0 relative border border-border shadow-sm">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                                                {item.type}
                                            </span>
                                            <span className="text-[10px] font-medium text-muted flex items-center gap-1">
                                                <MapPin size={10} /> {item.distance}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-black text-text leading-tight mb-1">{item.title}</h3>
                                        <p className="text-xs text-muted font-medium line-clamp-2">{item.subtitle}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        <button
                                            onClick={() => onItemClick && onItemClick(item.mapItem)}
                                            className="flex-1 bg-black text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
                                        >
                                            Ver Detalles <ArrowRight size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleShare(item)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface text-muted hover:text-text hover:bg-surface-2 transition-all border border-border"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface text-muted hover:text-red-500 hover:bg-red-50 transition-all border border-border hover:border-red-200"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
        </div>
    );
};


const FILTERS = [
    { id: 'all', label: 'Todo' },
    { id: 'event', label: 'Eventos' },
    { id: 'promo', label: 'Promos' },
    { id: 'moop', label: 'Moops' },
    { id: 'service', label: 'Servicios' }
];

export const SavedScreen = ({ activeTab, onTabChange, onItemClick }) => {
    const { savedItems, toggleSaveItem } = useActivity();
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = savedItems.filter(item => {
        const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const activeCount = savedItems.length;
    const urgentCount = savedItems.filter(i => i.urgency).length;

    const handleShare = async (item) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item.title,
                    text: `¡Mira esto en UrbanMoop! ${item.title} - ${item.subtitle}`,
                    url: window.location.href, // Or a deep link if available
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback for desktop or non-supported
            console.log('Share not supported');
            // Suggestion: Copy to clipboard logic could go here
        }
    };

    return (
        <div className="relative w-full h-[100dvh] bg-bg flex flex-col overflow-hidden font-sf text-text">
            {/* Header Fixed */}
            <div className="bg-bg/95 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-border z-10 transition-colors">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-brand-700 tracking-tight">Guardados</h1>
                        <p className="text-sm text-muted font-medium mt-1">Tu colección personal</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center overflow-hidden border border-border shadow-md">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" alt="User" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex gap-3 mb-6">
                    <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                        <span className="text-sm font-bold text-green-600">{activeCount} activos</span>
                    </div>
                    {urgentCount > 0 && (
                        <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                            <Flame size={14} className="text-orange-500" fill="currentColor" />
                            <span className="text-sm font-bold text-orange-600">{urgentCount} urgentes</span>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar guardados..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-surface rounded-2xl border border-border text-text font-medium placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6">
                    {FILTERS.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeFilter === filter.id
                                ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/30'
                                : 'bg-surface text-text-2 border-border hover:bg-surface-2'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-32">
                {filteredItems.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl p-3 shadow-lg border border-border relative overflow-hidden group hover:border-brand-200 transition-colors"
                    >
                        {/* Urgency Badge Absolute */}
                        {item.badges.map((badge, idx) => (
                            <div key={idx} className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide z-10 shadow-lg backdrop-blur-md ${badge.text === 'URGENTE' ? 'bg-orange-500 text-white' : 'bg-brand-600 text-white'}`}>
                                {badge.text}
                            </div>
                        ))}

                        <div className="flex gap-4">
                            {/* Image */}
                            <div className="w-28 h-36 rounded-2xl overflow-hidden shrink-0 relative border border-border shadow-sm">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100">
                                            {item.type}
                                        </span>
                                        <span className="text-border text-[10px]">•</span>
                                        <span className="text-[10px] font-medium text-muted flex items-center gap-1">
                                            <MapPin size={10} /> {item.distance}
                                        </span>
                                        <span className="text-border text-[10px]">•</span>
                                        <span className="text-[10px] font-bold text-text flex items-center gap-1">
                                            <Star size={10} className="text-yellow-400 fill-yellow-400" /> {item.rating}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-text leading-tight mb-1">{item.title}</h3>
                                    <p className="text-xs text-muted font-medium line-clamp-2">{item.subtitle}</p>
                                </div>

                                {/* Expiry & Actions */}
                                <div>
                                    {item.urgency && (
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold mb-3 border ${item.urgency.text.includes('Caduca') ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' : 'bg-surface text-muted border-border'}`}>
                                            {item.urgency.text}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        <button className="flex-1 bg-black text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
                                            {item.type === 'promo' ? 'Activar Promo' : 'Ver Detalles'} <ArrowRight size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleShare(item)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface text-muted hover:text-text hover:bg-surface-2 transition-all border border-border"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSaveItem(item);
                                            }}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface text-muted hover:text-red-500 hover:bg-red-50 transition-all border border-border hover:border-red-200"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
        </div>
    );
};

