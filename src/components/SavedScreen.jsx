import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, ChevronRight, Bookmark, Settings } from 'lucide-react';
import BottomNavigation from './Navigation/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import { LoginModal } from './LoginModal';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const SavedScreen = ({ activeTab, onTabChange, onItemClick }) => {
    const { user } = useAuth();
    const { savedItems, toggleSaveItem } = useActivity();

    // UI State
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Grouping State
    const [groupedItems, setGroupedItems] = useState({
        today: [],
        upcoming: [],
        spaces: [],
        past: []
    });

    useEffect(() => {
        if (savedItems) {
            setLoading(false);
            categorizeItems(savedItems);
        }
    }, [savedItems]);

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

        setGroupedItems(groups);
    };

    const handleDelete = (item) => {
        toggleSaveItem(item);
    };

    // Non-authenticated state
    if (!user) {
        return (
            <div className="relative w-full min-h-screen bg-[#0a0a0a] pb-24 font-sans">
                <Header />
                <div className="flex flex-col items-center justify-center px-6 pt-20">
                    <div className="w-20 h-20 rounded-full bg-[#171717] flex items-center justify-center mb-6">
                        <Bookmark size={32} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Tu Agenda Viva</h3>
                    <p className="text-gray-400 text-sm text-center mb-8">
                        Inicia sesión para guardar eventos y acceder a tu agenda personal.
                    </p>
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="bg-white text-black font-bold px-8 py-3 rounded-xl"
                    >
                        Iniciar Sesión
                    </button>
                </div>
                <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
                {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="relative w-full min-h-screen bg-[#0a0a0a] pb-24 font-sans flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Empty state
    const isEmpty = groupedItems.today.length === 0 && groupedItems.upcoming.length === 0 && groupedItems.spaces.length === 0;

    return (
        <div className="relative w-full min-h-screen bg-[#0a0a0a] pb-32 font-sans text-white">
            {/* Sticky Header */}
            <Header />

            <main className="max-w-2xl mx-auto">
                {isEmpty ? (
                    <EmptyState />
                ) : (
                    <>
                        {/* HOY Section */}
                        {groupedItems.today.length > 0 && (
                            <section className="mt-4">
                                <div className="flex items-center justify-between px-5 mb-3">
                                    <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">Hoy</h3>
                                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-500 px-2.5 py-1 rounded-full">
                                        {groupedItems.today.length} Evento{groupedItems.today.length > 1 ? 's' : ''}
                                    </span>
                                </div>

                                {/* Featured Card for first item */}
                                {groupedItems.today[0] && (
                                    <FeaturedCard
                                        item={groupedItems.today[0]}
                                        onDelete={handleDelete}
                                        onClick={() => onItemClick?.(groupedItems.today[0])}
                                    />
                                )}

                                {/* Compact cards for remaining */}
                                {groupedItems.today.slice(1).map(item => (
                                    <CompactCard
                                        key={item.id}
                                        item={item}
                                        onDelete={handleDelete}
                                        onClick={() => onItemClick?.(item)}
                                    />
                                ))}
                            </section>
                        )}

                        {/* PRÓXIMAMENTE Section */}
                        {groupedItems.upcoming.length > 0 && (
                            <section className="mt-8">
                                <h3 className="text-xs font-bold tracking-widest uppercase px-5 mb-3 text-gray-500">Próximamente</h3>
                                {groupedItems.upcoming.map(item => (
                                    <CompactCard
                                        key={item.id}
                                        item={item}
                                        onDelete={handleDelete}
                                        onClick={() => onItemClick?.(item)}
                                        showDate
                                    />
                                ))}
                            </section>
                        )}

                        {/* LUGARES GUARDADOS Section */}
                        {groupedItems.spaces.length > 0 && (
                            <section className="mt-8">
                                <h3 className="text-xs font-bold tracking-widest uppercase px-5 mb-3 text-gray-500">Lugares Guardados</h3>
                                <div className="flex overflow-x-auto gap-3 px-4 pb-6 no-scrollbar snap-x">
                                    {groupedItems.spaces.map(item => (
                                        <PlaceCard
                                            key={item.id}
                                            item={item}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EVENTOS PASADOS Button */}
                        {groupedItems.past.length > 0 && (
                            <div className="mt-2 px-4 mb-8">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#171717]/50 border border-transparent hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/10 p-2 rounded-full">
                                            <Clock size={20} className="text-gray-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-sm text-white">Eventos Pasados</p>
                                            <p className="text-xs text-gray-500">{groupedItems.past.length} guardados</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </div>
    );
};

// Header Component
const Header = () => (
    <div className="sticky top-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center px-5 justify-between h-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-white">Guardados</h2>
            <button className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-white/10 transition-colors">
                <Settings size={22} className="text-white" />
            </button>
        </div>
    </div>
);

// Empty State
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center px-6 pt-20">
        <div className="w-20 h-20 rounded-full bg-[#171717] flex items-center justify-center mb-6">
            <Bookmark size={32} className="text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Nada guardado aún</h3>
        <p className="text-gray-400 text-sm text-center">
            Explora el mapa y guarda los eventos que te interesen.
        </p>
    </div>
);

// Featured Card (Large, for live/today events)
const FeaturedCard = ({ item, onDelete, onClick }) => (
    <div className="px-4 mb-4">
        <div
            onClick={onClick}
            className="group relative rounded-3xl overflow-hidden bg-[#1e1e1e] shadow-lg border border-white/5 transition-transform active:scale-[0.99] cursor-pointer"
        >
            {/* Image */}
            <div className="w-full h-48 bg-gray-800 relative">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* EN VIVO Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-black/80 backdrop-blur text-red-500 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        EN VIVO
                    </span>
                </div>

                {/* Remove Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                    className="absolute top-3 right-3 h-8 w-8 bg-black/20 hover:bg-red-500 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="text-lg font-bold leading-tight mb-1 text-white">{item.title}</h4>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                            {item.location || item.place || item.subtitle}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#171717] rounded-xl px-3 py-2 flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" />
                        <span className="text-xs font-medium text-blue-500">
                            {item.time || 'Termina pronto'}
                        </span>
                    </div>
                    <button className="flex-none bg-white text-black rounded-xl px-6 py-2 text-sm font-bold shadow-lg hover:opacity-90 transition-opacity">
                        Ir ahora
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Compact Card (List item style)
const CompactCard = ({ item, onDelete, onClick, showDate }) => (
    <div className="px-4 mb-2">
        <div
            onClick={onClick}
            className="group flex gap-3 p-2 rounded-2xl bg-[#1e1e1e] shadow-lg border border-white/5 hover:border-blue-500/20 transition-all cursor-pointer"
        >
            {/* Thumbnail */}
            <div className="h-24 w-24 aspect-square rounded-xl shrink-0 overflow-hidden relative bg-gray-800">
                <ImageWithFallback
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
                {showDate && (
                    <div className="absolute bottom-1 left-1 right-1">
                        <div className="bg-black/80 backdrop-blur rounded-lg py-1 flex flex-col items-center justify-center">
                            <span className="text-[8px] font-bold uppercase text-gray-400">
                                {new Date(item.startTime).toLocaleDateString('es', { weekday: 'short' })}
                            </span>
                            <span className="text-xs font-bold leading-none text-white">
                                {new Date(item.startTime).getDate()}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between py-1 pr-1">
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="text-base font-bold leading-tight text-white">{item.title}</h4>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                            className="text-gray-500 hover:text-red-500 transition-colors -mt-1 -mr-1 p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">{item.location || item.place || item.subtitle}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-white text-xs font-bold">{item.time || ''}</p>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                        {showDate ? 'Detalles' : 'Ver ticket'}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Place Card (Horizontal scroll)
const PlaceCard = ({ item, onDelete }) => (
    <div className="snap-center min-w-[200px] w-[200px] rounded-2xl bg-[#1e1e1e] shadow-lg border border-white/5 overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
        <div className="h-32 bg-gray-800 relative overflow-hidden">
            <ImageWithFallback
                src={item.image || item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
            />
            <button
                onClick={() => onDelete(item)}
                className="absolute top-2 right-2 h-7 w-7 bg-white/20 hover:bg-red-500 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"
            >
                <X size={14} />
            </button>
        </div>
        <div className="p-3">
            <h4 className="font-bold text-sm truncate text-white">{item.title}</h4>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.location || item.place}</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded text-[10px] font-bold">
                Guardado
            </div>
        </div>
    </div>
);

export default SavedScreen;
