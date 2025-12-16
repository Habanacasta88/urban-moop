import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Pizza, Users, Palette, AlertTriangle, Coffee, Volume2, User, Activity, ArrowRight, Check } from 'lucide-react';

const emotions = [
    { id: 'chill', label: 'Chill', icon: <Coffee size={24} />, color: 'bg-teal-100 text-teal-600 border-teal-200' },
    { id: 'energy', label: 'Energía', icon: <Zap size={24} />, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { id: 'foodie', label: 'Foodie', icon: <Pizza size={24} />, color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { id: 'social', label: 'Social', icon: <Users size={24} />, color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { id: 'creative', label: 'Creativo', icon: <Palette size={24} />, color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { id: 'avoid', label: 'Evitar', icon: <AlertTriangle size={24} />, color: 'bg-red-100 text-red-600 border-red-200' }
];

const tagsList = [
    'Buen rollo', 'Tranquilo', 'Creativo',
    'Petado', 'Música top', 'A gusto',
    'Aesthetic', 'Social', 'Cozy',
    'Afterwork', 'Ideal solo', 'Energético'
];

export const VibeCheckModal = ({ isOpen, onClose, entityName = "este sitio", onSubmit }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        emotion: null,
        sliders: { noise: 50, crowd: 50, intensity: 50 },
        tags: []
    });

    const handleEmotionSelect = (id) => {
        setData(prev => ({ ...prev, emotion: id }));
    };

    const handleSliderChange = (key, val) => {
        setData(prev => ({ ...prev, sliders: { ...prev.sliders, [key]: val } }));
    };

    const toggleTag = (tag) => {
        if (data.tags.includes(tag)) {
            setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
        } else {
            if (data.tags.length < 3) {
                setData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
            }
        }
    };

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleFinalSubmit = () => {
        onSubmit(data);
        setStep(4);
        setTimeout(() => {
            onClose();
            // Reset after closing animation
            setTimeout(() => setStep(1), 500);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-sm rounded-3xl shadow-2xl relative"
            >
                {/* Close Button */}
                {step < 4 && (
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10">
                        <X size={20} />
                    </button>
                )}

                <div className="p-6">
                    {/* STEP 1: EMOTION */}
                    {step === 1 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                            <h2 className="text-xl font-black text-gray-900 mb-6 text-center leading-tight">
                                ¿Cómo vibra <span className="text-primary">{entityName}</span>?
                            </h2>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {emotions.map(emo => (
                                    <button
                                        key={emo.id}
                                        onClick={() => handleEmotionSelect(emo.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${data.emotion === emo.id
                                            ? `${emo.color} border-current ring-2 ring-offset-1 ring-current`
                                            : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="mb-2">{emo.icon}</div>
                                        <span className="text-xs font-bold uppercase tracking-wide">{emo.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button onClick={onClose} className="flex-1 py-3 text-gray-400 font-bold text-sm">Saltar</button>
                                <button
                                    onClick={handleNext}
                                    disabled={!data.emotion}
                                    className="flex-[2] bg-gray-900 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Continuar <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: SLIDERS */}
                    {step === 2 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">Ajusta el ambiente</h2>
                            <p className="text-center text-xs text-gray-500 mb-6 font-medium uppercase tracking-wider">(Opcional)</p>

                            <div className="space-y-6 mb-8">
                                {/* Noise Slider */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                        <span className="flex items-center gap-1"><Volume2 size={12} /> Silencioso</span>
                                        <span>Ruidoso</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100"
                                        value={data.sliders.noise}
                                        onChange={(e) => handleSliderChange('noise', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                {/* Crowd Slider */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                        <span className="flex items-center gap-1"><User size={12} /> Poca gente</span>
                                        <span>Mucha</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100"
                                        value={data.sliders.crowd}
                                        onChange={(e) => handleSliderChange('crowd', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                {/* Intensity Slider */}
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                                        <span className="flex items-center gap-1"><Activity size={12} /> Relajado</span>
                                        <span>Intenso</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100"
                                        value={data.sliders.intensity}
                                        onChange={(e) => handleSliderChange('intensity', e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={handleNext} className="flex-1 py-3 text-gray-400 font-bold text-sm">Saltar</button>
                                <button onClick={handleNext} className="flex-[2] bg-gray-900 text-white py-3 rounded-xl font-bold text-sm">
                                    Continuar
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: TAGS */}
                    {step === 3 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">Describe el vibe</h2>
                            <p className="text-center text-xs text-gray-500 mb-6 font-medium uppercase tracking-wider">Elige hasta 3</p>

                            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                                {tagsList.map(tag => {
                                    const active = data.tags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${active
                                                ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleFinalSubmit}
                                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-black transition-colors"
                            >
                                <Check size={18} /> Enviar Valoración
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <Sparkles size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">¡Gracias! ✨</h2>
                            <p className="text-gray-500 text-sm px-6">
                                Tu aporte mejora el Mapa Emocional de UrbanMoop.
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Progress Bar (Optional) */}
                {step < 4 && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Helper Icon for Success
import { Sparkles } from 'lucide-react';
