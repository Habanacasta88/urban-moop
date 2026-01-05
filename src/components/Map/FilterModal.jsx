import { motion } from 'motion/react';
import { X, Zap, Users, Landmark, Sparkles, Grid } from 'lucide-react';
import { useState } from 'react';

export const FilterModal = ({ isOpen, onClose, onApply, currentFilters }) => {

    // Intents Definition
    const INTENTS = [
        {
            id: 'you',
            label: 'Para ti',
            subtitle: 'Smart Radar + Tus intereses',
            icon: Sparkles,
            color: 'brand',
            filterConfig: { categories: [], sort: 'recommended', activeFilter: 'live' }
        },
        {
            id: 'moop',
            label: 'Moops',
            subtitle: 'Activaciones de locales',
            icon: Users,
            color: 'purple',
            filterConfig: { categories: [], sort: 'distance', activeFilter: 'moop' }
        },
        {
            id: 'culture',
            label: 'Cultura',
            subtitle: 'Espacios y eventos culturales',
            icon: Landmark,
            color: 'pink',
            filterConfig: { categories: ['culture', 'art'], sort: 'recommended', activeFilter: 'todo' }
        },
        {
            id: 'flash',
            label: 'Flash',
            subtitle: 'Solo urgencias reales',
            icon: Zap,
            color: 'yellow',
            filterConfig: { categories: [], sort: 'distance', activeFilter: 'flash' }
        }
    ];

    if (!isOpen) return null;

    const handleIntentSelect = (intent) => {
        // Apply logic to parent
        onApply(intent.filterConfig);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[6000] flex items-end justify-center pointer-events-none font-sf">
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
                className="bg-white w-full rounded-t-3xl p-6 pb-12 shadow-2xl pointer-events-auto relative max-h-[85vh] overflow-y-auto"
            >
                {/* Drag Handle */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Explorar</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-8">Elige qué quieres ver en el mapa hoy.</p>

                {/* Intent Grid */}
                <div className="grid grid-cols-1 gap-3">
                    {INTENTS.map((intent) => (
                        <button
                            key={intent.id}
                            onClick={() => handleIntentSelect(intent)}
                            className="w-full bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 hover:bg-gray-50 active:scale-95 transition-all shadow-sm hover:shadow-md group"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${intent.color === 'brand' ? 'bg-brand-50 text-brand-600' :
                                    intent.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                                        intent.color === 'pink' ? 'bg-pink-50 text-pink-600' :
                                            'bg-yellow-50 text-yellow-600'
                                }`}>
                                <intent.icon size={24} />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-brand-600 transition-colors">
                                    {intent.label}
                                </h3>
                                <p className="text-xs font-bold text-gray-400">
                                    {intent.subtitle}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                                <Grid size={16} />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        UrbanMoop Navigation
                    </p>
                </div>

            </motion.div>
        </div>
    );
};
