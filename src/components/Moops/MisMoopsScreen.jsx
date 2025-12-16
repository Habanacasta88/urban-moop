import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Calendar, Clock, RotateCcw, Zap, ChevronLeft, Plus } from 'lucide-react';
import { MoopCard } from './MoopCard';
import { CreateMoopWizard } from './CreateMoopWizard';
import './Moops.css'; // Reuse styles

// TABS CONFIG
const TABS = [
    { id: 'created', label: 'Creados', icon: Zap },
    { id: 'joined', label: 'Inscrito', icon: Calendar },
    { id: 'suggested', label: 'Sugeridos', icon: User },
    { id: 'history', label: 'Historial', icon: RotateCcw },
];

// MOCK DATA GENERATOR (Temporary until Supabase fetch)
const MOCK_MOOPS = [
    {
        id: 'm1',
        title: 'Café y Charla en el Born',
        emoji: '☕',
        category: 'coffee_chat',
        host: { name: 'Yo (Tú)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', level: 'power' },
        timeText: 'En 30 min',
        distance: 'A 200m',
        attendees: 3,
        maxAttendees: 6,
        attendeesList: [{ avatar: 'https://i.pravatar.cc/150?u=1' }, { avatar: 'https://i.pravatar.cc/150?u=2' }],
        isMyMoop: true,
        status: 'open'
    },
    {
        id: 'm2',
        title: 'Paseo Aesthetic',
        emoji: '📸',
        category: 'aesthetic_walk',
        host: { name: 'Ana M.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', level: 'ambassador' },
        timeText: 'Mañana 10:00',
        distance: 'A 1.2km',
        attendees: 5,
        maxAttendees: 6,
        attendeesList: [],
        joined: true,
        status: 'open'
    },
    {
        id: 'm3',
        title: 'Running Suave',
        emoji: '🏃‍♂️',
        category: 'running',
        host: { name: 'Carlos', avatar: 'https://i.pravatar.cc/150?u=3', level: 'normal' },
        timeText: 'Ahora mismo',
        distance: 'A 450m',
        attendees: 2,
        maxAttendees: 6,
        attendeesList: [],
        joined: false,
        status: 'open'
    },
    {
        id: 'm4',
        title: 'Vermut en Gràcia',
        emoji: '🍹',
        category: 'vermut',
        host: { name: 'Yo (Tú)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', level: 'power' },
        timeText: 'Ayer',
        distance: 'Gràcia',
        attendees: 6,
        maxAttendees: 6,
        attendeesList: [],
        isMyMoop: true,
        status: 'closed'
    }
];

export const MisMoopsScreen = ({ onBack, onNavigateToChat }) => {
    const [activeTab, setActiveTab] = useState('created');
    const [myMoops, setMyMoops] = useState([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    useEffect(() => {
        // Here we would fetch from Supabase
        // For now, filtering Mock Data
        setMyMoops(MOCK_MOOPS);
    }, []);

    const getFilteredMoops = () => {
        switch (activeTab) {
            case 'created':
                return myMoops.filter(m => m.isMyMoop);
            case 'joined':
                return myMoops.filter(m => m.joined && !m.isMyMoop);
            case 'suggested':
                return myMoops.filter(m => !m.joined && !m.isMyMoop && m.status === 'open');
            case 'history':
                return myMoops.filter(m => (m.isMyMoop || m.joined) && m.status === 'closed'); // Simplified history logic
            default:
                return [];
        }
    };

    const handleCreateMoop = (data) => {
        console.log("New Moop Data:", data);
        setIsWizardOpen(false);
        // Optimistically add to list (Mock)
        setMyMoops(prev => [
            {
                id: 'new-' + Date.now(),
                title: data.title || data.category.label,
                emoji: data.category.emoji,
                category: data.category.id,
                host: { name: 'Yo (Tú)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', level: 'normal' },
                timeText: 'En ' + data.time + ' min',
                distance: 'Tu ubicación',
                attendees: 1,
                maxAttendees: data.spots,
                attendeesList: [],
                isMyMoop: true,
                status: 'open'
            },
            ...prev
        ]);
        setActiveTab('created');
    };

    const filteredList = getFilteredMoops();

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col relative">
            <AnimatePresence>
                {isWizardOpen && (
                    <CreateMoopWizard
                        onCancel={() => setIsWizardOpen(false)}
                        onComplete={handleCreateMoop}
                    />
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-4 rounded-b-3xl shadow-sm z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <h1 className="text-2xl font-black text-gray-900">Mis Moops</h1>
                    </div>

                    {/* Floating Add Button in Header for Quick Access */}
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="w-10 h-10 bg-[#5B4B8A] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    >
                        <Plus size={24} className="text-white" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[80px] py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${isActive ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-[#5B4B8A]' : 'currentColor'} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[10px] uppercase font-bold tracking-wide ${isActive ? 'text-[#5B4B8A]' : ''}`}>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 content-start pb-24">
                <AnimatePresence mode='popLayout'>
                    {filteredList.length > 0 ? (
                        filteredList.map(moop => (
                            <MoopCard
                                key={moop.id}
                                moop={moop}
                                showStatus={activeTab === 'created' || activeTab === 'joined'}
                                onChat={onNavigateToChat}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-4xl grayscale">
                                😶
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Nada por aquí</h3>
                            <p className="text-sm text-gray-500 max-w-[200px]">
                                No hay Moops en esta categoría todavía.
                            </p>
                            {activeTab === 'created' && (
                                <button
                                    onClick={() => setIsWizardOpen(true)}
                                    className="mt-4 flex items-center gap-2 bg-[#5B4B8A] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg"
                                >
                                    <Plus size={16} /> Crear mi primer Moop
                                </button>
                            )}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
