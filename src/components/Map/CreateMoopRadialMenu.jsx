import { motion, AnimatePresence } from 'motion/react';
import { Coffee, MonitorPlay, Palette, Beer, Activity, Dog, X } from 'lucide-react';

const MENU_ITEMS = [
    { id: 'coffee', label: 'Café', icon: Coffee, color: 'bg-amber-100 text-amber-600' },
    { id: 'run', label: 'Running', icon: Activity, color: 'bg-green-100 text-green-600' },
    { id: 'drink', label: 'Vermut', icon: Beer, color: 'bg-orange-100 text-orange-600' },
    { id: 'create', label: 'Creativo', icon: Palette, color: 'bg-purple-100 text-purple-600' },
    { id: 'dog', label: 'Paseo', icon: Dog, color: 'bg-blue-100 text-blue-600' },
    { id: 'game', label: 'Gamer', icon: MonitorPlay, color: 'bg-indigo-100 text-indigo-600' },
];

export const CreateMoopRadialMenu = ({ isOpen, onClose, onSelect }) => {
    // Radial positioning logic
    const radius = 120; // Distance from center
    const totalItems = MENU_ITEMS.length;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center">
                    {/* Backdrop Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-white/60 backdrop-blur-xl"
                    />

                    {/* Central Close Button */}
                    <motion.button
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        onClick={onClose}
                        className="relative z-20 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 border border-gray-200"
                    >
                        <X size={32} />
                    </motion.button>

                    {/* Radial Items */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {MENU_ITEMS.map((item, index) => {
                            const angle = (index / totalItems) * 2 * Math.PI - Math.PI / 2; // Start from top (-90deg)
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;

                            return (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                    animate={{
                                        opacity: 1,
                                        x,
                                        y,
                                        scale: 1,
                                        transition: { delay: index * 0.05, type: 'spring', stiffness: 200 }
                                    }}
                                    exit={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                                    onClick={() => onSelect(item.id)}
                                    className={`pointer-events-auto absolute w-20 h-20 rounded-full shadow-xl flex flex-col items-center justify-center gap-1 border-2 border-white cursor-pointer active:scale-90 transition-transform ${item.color}`}
                                >
                                    <item.icon size={24} />
                                    <span className="text-[10px] font-bold">{item.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 300 }} // Push down text
                        className="absolute text-center"
                    >
                        <h2 className="text-xl font-black text-gray-800">¿Qué quieres crear?</h2>
                        <p className="text-gray-500 text-sm">Elige una vibra para empezar</p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
