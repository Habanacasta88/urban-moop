import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, X, Coffee, Activity, Users, MapPin, Zap, ArrowRight, Check, MessageCircle, Dog, Palette, Camera, Beer } from 'lucide-react';

// NEW: The 7 "High Conversion" Categories
const NEW_CATEGORIES = [
    { id: 'coffee_chat', label: 'Café & Charla', emoji: '☕', desc: 'Conversación tranquila', icon: Coffee, color: 'bg-orange-100 text-orange-600' },
    { id: 'aesthetic_walk', label: 'Paseo Aesthetic', emoji: '📸', desc: 'Urban Walk & Fotos', icon: Camera, color: 'bg-pink-100 text-pink-600' },
    { id: 'running', label: 'Running Suave', emoji: '🏃‍♂️', desc: 'Deporte sin presión', icon: Activity, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'vermut', label: 'Vermut / Chill', emoji: '🍹', desc: 'Afterwork relajado', icon: Beer, color: 'bg-red-100 text-red-600' },
    { id: 'dog_walk', label: 'Dog Friendly', emoji: '🐶', desc: 'Paseo con peludos', icon: Dog, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'creative', label: 'Creativo', emoji: '🎨', desc: 'Arte, lectura, dibujo', icon: Palette, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'express', label: 'Moop Express', emoji: '⚡', desc: '¡Nos vemos ya!', icon: Zap, color: 'bg-blue-100 text-blue-600' }
];

export const CreateMoopWizard = ({ onClose, onComplete, initialCategory }) => {
    // Mapping from Radial Menu IDs to Wizard IDs
    const RADIAL_MAP = {
        'coffee': 'coffee_chat',
        'run': 'running',
        'drink': 'vermut',
        'create': 'creative',
        'dog': 'dog_walk',
        'game': 'coffee_chat', // Fallback/Map for now
    };

    // Determine initial state based on props
    const initCatId = initialCategory ? (RADIAL_MAP[initialCategory] || initialCategory) : null;
    const initCatObj = initCatId ? NEW_CATEGORIES.find(c => c.id === initCatId) : null;

    // If we have a valid initial category, start at Step 2
    const [step, setStep] = useState(initCatObj ? 2 : 1);
    const [data, setData] = useState({
        category: initCatObj || null,
        title: '',
        description: '',
        time: '30', // Default 30 min (Rule 2: Short Duration)
        spots: 4, // Default (Rule 1: Micro size)
        who: 'all'
    });

    const updateData = (key, value) => setData(prev => ({ ...prev, [key]: value }));
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleCategorySelect = (cat) => {
        setData(prev => ({
            ...prev,
            category: cat,
            title: '' // Reset title to suggest default later
        }));
        setStep(2);
    };

    return (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100 z-10">
                <button onClick={step === 1 ? onClose : prevStep} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ChevronLeft size={24} className="text-gray-700" />
                </button>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-[#5B4B8A]' : 'bg-gray-200'}`} />
                    ))}
                </div>
                <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 text-gray-400">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-32">
                <AnimatePresence mode="wait">

                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h1 className="text-2xl font-black text-gray-900 mb-2">Crear nuevo Moop</h1>
                            <p className="text-gray-600 mb-8 font-medium">Elige una de las 7 categorías ganadoras.</p>

                            <div className="grid grid-cols-1 gap-3">
                                {NEW_CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat)}
                                            className="p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-300 hover:shadow-md transition-all flex items-center gap-4 text-left group active:scale-98"
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${cat.color}`}>
                                                {cat.emoji}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#5B4B8A] transition-colors">{cat.label}</h3>
                                                <p className="text-sm text-gray-500 font-medium">{cat.desc}</p>
                                            </div>
                                            <div className="ml-auto text-gray-300">
                                                <ChevronLeft size={20} className="rotate-180" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: CONFIGURATION */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${data.category?.color}`}>
                                    {data.category?.emoji}
                                </div>
                                <div>
                                    <h2 className="font-black text-xl text-gray-900">{data.category?.label}</h2>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Configurando Detalles</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Title Input */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Título del Plan</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => updateData('title', e.target.value)}
                                        placeholder={`Ej: ${data.category?.label} en...`}
                                        className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-[#5B4B8A] outline-none font-bold text-gray-900"
                                    />
                                </div>

                                {/* Time Selection (Rule 2: Short Duration) */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">¿Cuándo?</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'now', label: '⚡ Ahora mismo' },
                                            { id: '15', label: 'En 15 min' },
                                            { id: '30', label: 'En 30 min' },
                                            { id: '60', label: 'En 1 hora' }
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => updateData('time', opt.id)}
                                                className={`py-3 rounded-xl font-bold text-sm border transition-all ${data.time === opt.id
                                                    ? 'bg-[#5B4B8A] text-white border-[#5B4B8A]'
                                                    : 'bg-white text-gray-600 border-gray-200'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Attendee Limit (Rule 1: Micro Size 2-6) */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                                        Plazas (Máx 6 - Micro Moop)
                                    </label>
                                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100">
                                        <input
                                            type="range"
                                            min="2"
                                            max="6" // ENFORCED RULE
                                            step="1"
                                            value={data.spots}
                                            onChange={(e) => updateData('spots', parseInt(e.target.value))}
                                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B4B8A]"
                                        />
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-black text-gray-900 border border-gray-200 shadow-sm">
                                            {data.spots}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                        *Los grupos pequeños (2-6) generan más confianza y asistencia.
                                    </p>
                                </div>

                                {/* Who Filter */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">🛡 ¿Quién puede unirse?</label>
                                    <div className="bg-gray-50 p-1 rounded-xl flex">
                                        {[{ id: 'guys', label: 'Only Boys' }, { id: 'girls', label: 'Only Girls' }, { id: 'all', label: 'Todos' }].map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => updateData('who', opt.id)}
                                                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${data.who === opt.id
                                                    ? 'bg-white text-gray-900 shadow-sm border border-gray-100'
                                                    : 'text-gray-500 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center pt-12"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={40} className="text-green-600" strokeWidth={4} />
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 mb-2">¡Moop Publicado!</h1>
                            <p className="text-gray-600 mb-8 max-w-xs mx-auto">Tu plan está activo. Entra al chat para recibir a los asistentes.</p>

                            <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-8 mx-4 text-left shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${data.category?.color}`}>
                                        {data.category?.emoji}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{data.title || data.category?.label}</h3>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>{data.time === 'now' ? 'Ahora' : `En ${data.time} min`}</span>
                                            <span>•</span>
                                            <span>{data.spots} plazas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => onComplete && onComplete(data)}
                                className="w-full py-4 rounded-xl font-black text-white bg-[#5B4B8A] shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={20} /> Ir al Chat del Grupo
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Footer Buttons */}
            {step < 3 && (
                <div className="p-6 bg-white border-t border-gray-100">
                    <button
                        onClick={step === 2 ? () => setStep(3) : nextStep} // Step 1 is handled by card click
                        disabled={step === 1} // Step 1 buttons handle next
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${step === 2 ? 'bg-[#5B4B8A] text-white shadow-lg' : 'bg-gray-100 text-gray-400'
                            }`}
                        style={{ display: step === 1 ? 'none' : 'flex' }}
                    >
                        {step === 2 ? 'Publicar Moop' : 'Continuar'} <ArrowRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

