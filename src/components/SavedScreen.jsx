import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Star, Share2, Trash2, Zap, Calendar, Heart, ArrowRight, Flame } from 'lucide-react';
import BottomNavigation from './Navigation/BottomNavigation';
import { useActivity } from '../context/ActivityContext';

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
        <div className="relative w-full h-[100dvh] bg-gray-950 flex flex-col overflow-hidden font-sf text-white">
            {/* Header Fixed */}
            <div className="bg-gray-950/80 backdrop-blur-xl px-6 pt-12 pb-4 border-b border-white/5 z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Guardados</h1>
                        <p className="text-sm text-gray-400 font-medium mt-1">Tu colección personal</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-white/20 shadow-lg">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" alt="User" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex gap-3 mb-6">
                    <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                        <span className="text-sm font-bold text-green-400">{activeCount} activos</span>
                    </div>
                    {urgentCount > 0 && (
                        <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                            <Flame size={14} className="text-orange-400" fill="currentColor" />
                            <span className="text-sm font-bold text-orange-400">{urgentCount} urgentes</span>
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar guardados..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-900/50 rounded-2xl border border-white/10 text-white font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6">
                    {FILTERS.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${activeFilter === filter.id
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
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
                        className="bg-gray-900/40 backdrop-blur-md rounded-3xl p-3 shadow-xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors"
                    >
                        {/* Urgency Badge Absolute */}
                        {item.badges.map((badge, idx) => (
                            <div key={idx} className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide z-10 shadow-lg backdrop-blur-md ${badge.text === 'URGENTE' ? 'bg-orange-500 text-white' : 'bg-indigo-500 text-white'}`}>
                                {badge.text}
                            </div>
                        ))}

                        <div className="flex gap-4">
                            {/* Image */}
                            <div className="w-28 h-36 rounded-2xl overflow-hidden shrink-0 relative border border-white/5">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                                            {item.type}
                                        </span>
                                        <span className="text-gray-600 text-[10px]">•</span>
                                        <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                                            <MapPin size={10} /> {item.distance}
                                        </span>
                                        <span className="text-gray-600 text-[10px]">•</span>
                                        <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                                            <Star size={10} className="text-yellow-400 fill-yellow-400" /> {item.rating}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-white leading-tight mb-1">{item.title}</h3>
                                    <p className="text-xs text-gray-400 font-medium line-clamp-2">{item.subtitle}</p>
                                </div>

                                {/* Expiry & Actions */}
                                <div>
                                    {item.urgency && (
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold mb-3 border ${item.urgency.text.includes('Caduca') ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-gray-800 text-gray-300 border-white/5'}`}>
                                            {item.urgency.text}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        <button className="flex-1 bg-white text-black rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg shadow-white/5">
                                            {item.type === 'promo' ? 'Activar Promo' : 'Ver Detalles'} <ArrowRight size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleShare(item)}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                        >
                                            <Share2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSaveItem(item);
                                            }}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5 hover:border-red-500/20"
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

