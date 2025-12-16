import { motion } from 'motion/react';
import { X, Calendar, Music, Coffee, Dumbbell, Palette, Clock, MapPin, Zap } from 'lucide-react';

import { useState, useEffect } from 'react';

export const FilterModal = ({ isOpen, onClose, onApply, currentFilters }) => {
    const [selectedTime, setSelectedTime] = useState('any');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSort, setSelectedSort] = useState('recommended');

    useEffect(() => {
        if (isOpen && currentFilters) {
            setSelectedTime(currentFilters.time || 'any');
            setSelectedCategories(currentFilters.categories || []);
            setSelectedSort(currentFilters.sort || 'recommended');
        }
    }, [isOpen, currentFilters]);

    if (!isOpen) return null;

    const handleCategoryToggle = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat)
                ? prev.filter(c => c !== cat)
                : [...prev, cat]
        );
    };

    const handleApply = () => {
        onApply({
            time: selectedTime,
            categories: selectedCategories,
            sort: selectedSort
        });
        onClose();
    };

    const handleClear = () => {
        setSelectedTime('any');
        setSelectedCategories([]);
        setSelectedSort('recommended');
    };

    const categories = [
        { id: 'party', label: 'Fiesta', icon: Music, color: 'purple' },
        { id: 'food', label: 'Gastronomía', icon: Coffee, color: 'orange' },
        { id: 'sport', label: 'Deporte', icon: Dumbbell, color: 'blue' },
        { id: 'culture', label: 'Cultura', icon: Palette, color: 'pink' }
    ];

    return (
        <div className="fixed inset-0 z-[6000] flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal Sheet */}
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white w-full rounded-t-3xl p-6 pb-10 shadow-2xl pointer-events-auto relative max-h-[85vh] overflow-y-auto"
            >
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Filtros</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                {/* 1. Time Filters */}
                <section className="mb-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Clock size={14} /> ¿Cuándo?
                    </h3>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar">
                        {['Hoy', 'Mañana', 'Esta semana', 'Finde'].map(t => (
                            <button
                                key={t}
                                onClick={() => setSelectedTime(selectedTime === t ? 'any' : t)}
                                className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-colors whitespace-nowrap ${selectedTime === t
                                    ? 'bg-black text-white border-black'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. Category Filters */}
                <section className="mb-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Zap size={14} /> ¿Qué plan?
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map(cat => {
                            const isSelected = selectedCategories.includes(cat.id);
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryToggle(cat.id)}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${isSelected
                                        ? `bg-${cat.color}-100 border-${cat.color}-500 text-${cat.color}-900 ring-2 ring-${cat.color}-500/20`
                                        : `bg-${cat.color}-50 border-${cat.color}-100 text-${cat.color}-900`
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full bg-${cat.color}-200 flex items-center justify-center text-${cat.color}-700`}>
                                        <cat.icon size={18} />
                                    </div>
                                    <span className="font-bold">{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* 3. Sort By */}
                <section className="mb-8">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MapPin size={14} /> Ordenar por
                    </h3>
                    <div className="flex flex-col gap-2">
                        <div
                            onClick={() => setSelectedSort('recommended')}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer ${selectedSort === 'recommended' ? 'bg-gray-50 border-black' : 'bg-white border-gray-100'
                                }`}
                        >
                            <span className="font-bold text-gray-900">Recomendados para ti</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSort === 'recommended' ? 'border-black' : 'border-gray-300'}`}>
                                {selectedSort === 'recommended' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                            </div>
                        </div>
                        <div
                            onClick={() => setSelectedSort('distance')}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer ${selectedSort === 'distance' ? 'bg-gray-50 border-black' : 'bg-white border-gray-100'
                                }`}
                        >
                            <span className="font-medium text-gray-600">Más cercanos</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedSort === 'distance' ? 'border-black' : 'border-gray-300'}`}>
                                {selectedSort === 'distance' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTAs */}
                <div className="flex gap-4">
                    <button onClick={handleClear} className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100">
                        Borrar
                    </button>
                    <button onClick={handleApply} className="flex-[2] py-4 rounded-2xl font-bold text-white bg-black shadow-xl shadow-black/20">
                        Mostrar resultados
                    </button>
                </div>

            </motion.div>
        </div>
    );
};
