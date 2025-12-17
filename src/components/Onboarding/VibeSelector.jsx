import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

const VibeSelector = ({ onNext, onBack, data }) => {
    const vibeOptions = [
        { id: 'chill', label: 'Chill', icon: '😌', desc: 'Tranqui' },
        { id: 'energia', label: 'Energía', icon: '⚡', desc: 'A tope' },
        { id: 'foodie', label: 'Foodie', icon: '🍕', desc: 'Gastro' },
        { id: 'social', label: 'Social', icon: '👥', desc: 'Gente' },
        { id: 'creativo', label: 'Creativo', icon: '🎨', desc: 'Arte' },
        { id: 'sorpresa', label: 'Sorpresa', icon: '🎲', desc: 'Random' },
    ];

    const [selectedVibes, setSelectedVibes] = useState(data.vibes || []);

    const toggleVibe = (id) => {
        if (selectedVibes.includes(id)) {
            setSelectedVibes(selectedVibes.filter(v => v !== id));
        } else {
            setSelectedVibes([...selectedVibes, id]);
        }
    };

    return (
        <div className="sub-page flex flex-col h-full pt-8 px-6">
            <div className="flex items-center mb-6 relative">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors absolute left-0 z-10">
                    <ChevronLeft className="text-gray-900" size={28} />
                </button>
                <div className="flex gap-2 mx-auto">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                </div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-3">✨ ¿Qué vibra tienes hoy?</h2>
            <p className="text-gray-500 font-medium text-sm mb-10 leading-relaxed">
                Elige al menos una. Ajustaremos tu mapa como si fuera un radar social.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 w-full max-w-md mx-auto">
                {vibeOptions.map((vibe) => (
                    <button
                        key={vibe.id}
                        onClick={() => toggleVibe(vibe.id)}
                        className={`p-4 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 aspect-square ${selectedVibes.includes(vibe.id)
                            ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/30 ring-1 ring-white/20'
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:scale-[1.02]'
                            }`}
                    >
                        <span className="text-4xl filter drop-shadow-md">{vibe.icon}</span>
                        <div className="text-center">
                            <span className={`block font-bold text-sm ${selectedVibes.includes(vibe.id) ? 'text-white' : 'text-gray-900'}`}>
                                {vibe.label}
                            </span>
                            <span className={`text-[10px] font-medium uppercase tracking-wider ${selectedVibes.includes(vibe.id) ? 'text-indigo-200' : 'text-gray-500'}`}>
                                {vibe.desc}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-auto pb-8">
                <button
                    onClick={() => onNext(selectedVibes)}
                    className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-xl text-lg shadow-lg shadow-gray-900/10 transition-all active:scale-95"
                >
                    Continuar hacia el Mapa
                </button>
            </div>
        </div>
    );
};

export default VibeSelector;
