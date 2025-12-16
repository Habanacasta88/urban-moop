import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Zap, Users, Flame, MapPin } from 'lucide-react';
import { useVibe } from '../../context/VibeContext';

export const RadarHeader = ({ onFilterChange, activeFilter, events = [] }) => {
    const { openVibeCheck } = useVibe();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    // Calculate Real Stats
    const stats = useMemo(() => {
        const now = new Date();
        const liveEvents = events.filter(e => {
            // Assume live if it's happening now OR it's a 'music'/'party' event that started recently
            // specific logic depends on data shape, simplified here:
            if (!e.end_time) return false;
            const start = new Date(e.start_time);
            const end = new Date(e.end_time);
            return (now >= start && now <= end) || e.type === 'moop';
        }).length;

        const flashPromos = events.filter(e => e.isFlash).length;
        const activeMoops = events.filter(e => e.type === 'moop').length;

        return { live: liveEvents, flash: flashPromos, moops: activeMoops };
    }, [events]);

    return (
        <div className="flex flex-col gap-2 pointer-events-auto">
            {/* 1. TOP BAR (Logo + Location) */}
            <div className="flex items-center justify-between pointer-events-auto mb-2">
                <div className="flex gap-2 items-center">
                    {/* Logo */}
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg border border-white/50 overflow-hidden">
                        <img src="/logo_full.png" alt="Logo" className="w-full h-full object-contain p-1" />
                    </div>

                    {/* Location Selector */}
                    <button
                        onClick={() => openVibeCheck('zone', 'sabadell-center', 'Centro de Sabadell')}
                        className="bg-white/90 backdrop-blur-md pl-3 pr-4 py-1.5 rounded-xl shadow-sm border border-white/50 flex flex-col items-start transition-transform active:scale-95"
                    >
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">AHORA EN:</span>
                        <div className="flex items-center gap-1 text-sm font-black text-gray-900 leading-none">
                            Sabadell <ChevronLeft size={10} className="-rotate-90 text-gray-400" />
                        </div>
                    </button>
                </div>
            </div>

            {/* 2. RADAR NOTIFICATION (Animates Height) */}
            <div className="relative pointer-events-auto" onClick={toggleExpand}>
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/60 overflow-hidden"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                <h3 className="text-sm font-black text-gray-900">Sabadell ahora:</h3>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600"><Flame size={12} fill="currentColor" /></span>
                                    <span><b>{stats.live}</b> eventos en vivo</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><Zap size={12} fill="currentColor" /></span>
                                    <span><b>{stats.flash}</b> promos expiran &lt;1h</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
                                    <span className="w-5 h-5 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600"><Users size={12} /></span>
                                    <span><b>{stats.moops}</b> Moops activos</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/50 flex items-center gap-3 w-fit"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <div className="text-[11px] font-medium text-gray-600 flex gap-3">
                                <span><b>{stats.live}</b> LIVE</span>
                                <span className="text-gray-300">•</span>
                                <span><b>{stats.flash}</b> Flash</span>
                                <span className="text-gray-300">•</span>
                                <span><b>{stats.moops}</b> Moops</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
