import { useState } from 'react';
import { Filter, Users, Clock, MapPin, Heart, Zap, User, Plus, TrendingUp, Sparkles, Coffee, Shield, Check, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CreateMoopWizard } from './CreateMoopWizard';
import { useActivity } from '../../context/ActivityContext';
import './Moops.css';

// EMOTIONAL FILTERS DATA
const filterChips = [
    { id: 'tranquilo', label: '😊 Tranquilos' },
    { id: 'activo', label: '🔥 Activos' },
    { id: 'social', label: '🎉 Sociales' },
    { id: 'near', label: '📍 Cerca de mí' },
    { id: 'soon', label: '⏱ Empiezan pronto' },
    { id: 'affinity', label: '✨ Alta afinidad' }
];

// RENOVATED MOMENT CARD
const MomentCard = ({ moop, onJoin, onChat }) => {
    // Colors logic
    const getColors = (tag) => {
        if (tag.includes('Tranquilo')) return { bg: 'bg-orange-50/50', border: 'border-orange-100', text: 'text-orange-700', badge: 'bg-orange-100' };
        if (tag.includes('Activo')) return { bg: 'bg-red-50/50', border: 'border-red-100', text: 'text-red-700', badge: 'bg-red-100' };
        return { bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-700', badge: 'bg-blue-100' };
    };
    const colors = getColors(moop.tag);

    const handleAction = async () => {
        if (moop.joined) {
            const convId = await onJoin(moop);
            if (convId && onChat) onChat(convId);
        } else {
            const convId = await onJoin(moop);
            if (convId && onChat) onChat(convId);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            className={`rounded-[2rem] p-5 mb-4 relative bg-white border border-gray-100 shadow-sm overflow-hidden`}
        >
            {/* Identity Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${colors.bg}`}>
                        {moop.emoji}
                    </div>
                    <div>
                        <h3 className="font-black text-gray-900 text-lg leading-tight mb-1">{moop.title}</h3>
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${colors.badge} ${colors.text}`}>
                                {moop.tag}
                            </span>
                            <span className="text-xs font-bold text-gray-400">
                                {moop.affinity}% afinidad
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Host Section with Security Proof */}
            <div className="flex items-center gap-3 mb-5 px-1">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
                        <img src={moop.host.avatar} alt={moop.host.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 border-2 border-white">
                        <Shield size={10} fill="currentColor" />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">{moop.host.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">Afinidad: {moop.host.personalAffinity}%</span>
                        <span className="flex items-center gap-0.5 text-emerald-600"><Check size={10} /> Modo seguro</span>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-600 mb-6 bg-gray-50/80 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="font-bold text-gray-800">{moop.time}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="font-medium truncate">{moop.location}</span>
                </div>

                {/* Visual Capacity Bar */}
                <div className="col-span-2 mt-1">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                        <span>Capacidad</span>
                        <span className="text-gray-800">{moop.spots} de {moop.totalSpots} plazas libres</span>
                    </div>
                    <div className="flex gap-1">
                        {Array.from({ length: moop.totalSpots }).map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 flex-1 rounded-full ${i < (moop.totalSpots - moop.spots) ? 'bg-gray-200' : 'bg-[#5B4B8A]'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={handleAction}
                className={`w-full py-4 rounded-xl font-black text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm ${moop.joined ? 'bg-green-500 shadow-green-500/20' : 'bg-[#5B4B8A] shadow-indigo-500/20'}`}
            >
                {moop.joined ? (
                    <>
                        <MessageCircle size={18} /> Ver Chat de Grupo
                    </>
                ) : (
                    <>
                        👉 Unirme ahora
                    </>
                )}
            </button>
        </motion.div>
    );
};

const MoopsList = ({ onNavigateToChat }) => {
    const [wizardOpen, setWizardOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]);
    const { joinMoop, joinedMoops } = useActivity();

    const toggleFilter = (id) => {
        setActiveFilters(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const handleCreateMoop = (data) => {
        console.log("Moop Created:", data);
        setWizardOpen(false);
        // Auto-join created moop in global state (mock ID)
        joinMoop({
            id: 'my-new-moop-' + Date.now(),
            title: data.category?.label || 'Nuevo Moop',
            emoji: data.category?.emoji || '✨',
            tag: data.energy ? (data.energy === 'chill' ? '😊 Tranquilo' : '🔥 Activo') : '✨ General', // simplified
            affinity: 100,
            time: 'En 15 min',
            location: 'Tu ubicación actual',
            distance: '0 m',
            spots: data.spots,
            totalSpots: data.spots,
            host: {
                name: 'Tú',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                personalAffinity: 100
            }
        });
    };

    const moops = [
        {
            id: 1,
            title: 'Café y charla tranqui',
            emoji: '☕',
            tag: '😊 Tranquilo',
            affinity: 92,
            time: 'Empieza en 15 min',
            location: 'Café\'ina (Centro) · 240 m',
            distance: '240 m',
            spots: 2,
            totalSpots: 4,
            host: {
                name: 'Ana M.',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
                personalAffinity: 98
            }
        },
        {
            id: 2,
            title: 'Running 5km',
            emoji: '🏃',
            tag: '🔥 Activo',
            affinity: 87,
            time: 'Empieza en 30 min',
            location: 'Parc Catalunya · 450 m',
            distance: '450 m',
            spots: 3,
            totalSpots: 5,
            host: {
                name: 'Marc R.',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
                personalAffinity: 95
            }
        }
    ];

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col relative">

            <AnimatePresence>
                {wizardOpen && <CreateMoopWizard onCancel={() => setWizardOpen(false)} onComplete={handleCreateMoop} />}
            </AnimatePresence>

            {/* 1. HEADER */}
            <div className="bg-white px-6 pt-12 pb-4 rounded-b-3xl shadow-sm z-10 sticky top-0">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-1 text-[#5B4B8A] font-black text-xs tracking-widest uppercase mb-1">
                            <Zap size={12} fill="currentColor" /> Moops Espontáneos
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 leading-none">¿Plan rápido hoy? 🔥</h1>
                    </div>
                </div>



                {/* Actions Tabs */}
                <div className="flex gap-2">
                    <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2">
                        <User size={16} /> Descubrir Moops
                    </button>
                    <button
                        onClick={() => setWizardOpen(true)}
                        className="flex-1 bg-white text-gray-900 border border-gray-100 py-3 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <Plus size={16} /> Crear Moop
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-24">

                {/* 2. STATS & FILTERS */}
                <div className="mb-6">
                    {/* Live Stats */}
                    <div className="flex justify-between items-end mb-4 px-2">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">En vivo ahora</p>
                            <p className="text-xl font-black text-gray-900">5 Moops activos</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg text-xs">
                            <TrendingUp size={12} /> +3 última hora
                        </div>
                    </div>

                    {/* Emotional Chips */}
                    <div className="flex flex-wrap gap-2">
                        {filterChips.map(chip => (
                            <button
                                key={chip.id}
                                onClick={() => toggleFilter(chip.id)}
                                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${activeFilters.includes(chip.id)
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat Highlight Banner */}
            <div className="mx-2 mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MessageCircle size={100} />
                </div>
                <div className="relative z-10 flex gap-4 items-start">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                        <MessageCircle size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg mb-1">Moops con chat en tiempo real</h3>
                        <p className="text-indigo-100 text-xs font-medium leading-relaxed">
                            Conéctate con el grupo antes de quedar. Coordina, habla, comparte ubicación y siente la energía del plan.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. MOOP CARDS LIST */}
            <div>
                {moops.map(moop => (
                    <MomentCard
                        key={moop.id}
                        moop={{ ...moop, joined: joinedMoops.some(jm => jm.id === moop.id) }}
                        onJoin={(m) => joinMoop(m)}
                        onChat={onNavigateToChat}
                    />
                ))}
            </div>

            {/* Empty State / Encouragement */}
            <div className="mt-8 text-center px-8">
                <p className="text-gray-400 text-sm font-medium">¿No te convence ninguno?</p>
                <button onClick={() => setWizardOpen(true)} className="text-[#5B4B8A] font-bold text-sm mt-1 hover:underline">
                    Crea el tuyo en 30 segundos
                </button>
            </div>

        </div>
    );
};

export default MoopsList;
