import { Map, Home, Plus, FileText, User } from 'lucide-react';
import { motion } from 'motion/react';
import './Navigation.css';

const BottomNavigation = ({ currentView, onNavigate }) => {
    const tabs = [
        { id: 'map', icon: Map, label: 'Mapa' },
        { id: 'feed', icon: Home, label: 'Feed' },
        { id: 'publish', icon: Plus, label: 'Publicar', isFab: true },
        { id: 'saved', icon: FileText, label: 'Guardados' },
        { id: 'profile', icon: User, label: 'Perfil' },
    ];

    return (
        <div className="bottom-nav">
            {tabs.map(tab => {
                const isActive = currentView === tab.id;
                const Icon = tab.icon;

                if (tab.isFab) {
                    return (
                        <div key={tab.id} className="relative -top-5">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onNavigate(tab.id)}
                                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-white"
                            >
                                <Icon size={28} color="#000" strokeWidth={2.5} />
                            </motion.button>
                        </div>
                    );
                }

                return (
                    <button
                        key={tab.id}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => onNavigate(tab.id)}
                    >
                        <motion.div
                            whileTap={{ scale: 0.8 }}
                            animate={{
                                scale: isActive ? 1.1 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="flex flex-col items-center gap-1"
                        >
                            <Icon
                                size={24}
                                color={isActive ? "var(--color-primary)" : "#4B5563"}
                                fill={isActive ? "var(--color-primary)" : "none"}
                                fillOpacity={isActive ? 0.2 : 0}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={`nav-label ${isActive ? 'text-primary font-bold' : 'text-gray-600 font-medium'}`}>
                                {tab.label}
                            </span>
                        </motion.div>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNavigation;
