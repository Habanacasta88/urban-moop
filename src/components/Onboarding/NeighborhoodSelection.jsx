
import { ChevronLeft } from 'lucide-react';

const NeighborhoodSelection = ({ onNext, onBack }) => {
    const neighborhoods = [
        { id: 'centre', name: 'Centre', desc: '🏛️ Plaza Mayor · Tiendas · Cafés', icon: '📍' },
        { id: 'creu_alta', name: 'Creu Alta', desc: '🌿 Calma · Brunch · Vida tranquila', icon: '🥐' },
        { id: 'eix_macia', name: 'Eix Macià', desc: '🎉 Ocio · Cines · Eventos y más', icon: '🌃' },
        { id: 'all_sabadell', name: 'Toda la ciudad', desc: '🚶‍♂️ Me muevo por todas partes', icon: '🌍' },
        { id: 'other', name: 'No lo tengo claro', desc: '🔍 Explorar el mapa primero', icon: '🤔' },
    ];

    return (
        <div className="sub-page flex flex-col h-full pt-8 px-6">
            <div className="flex items-center mb-6 relative">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors absolute left-0 z-10">
                    <ChevronLeft className="text-gray-900" size={28} />
                </button>
                <div className="flex gap-2 mx-auto">
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                </div>
            </div>

            <h2 className="text-3xl font-black text-brand-700 mb-3">🗺️ ¿Dónde te mueves normalmente?</h2>
            <p className="text-muted font-medium text-sm mb-10 leading-relaxed">
                Te recomendaremos planes relevantes según tu zona de acción diaria.
            </p>

            <div className="flex flex-col gap-3 overflow-y-auto pb-4 hide-scrollbar">
                {neighborhoods.map((hood) => (
                    <button
                        key={hood.id}
                        onClick={() => onNext(hood.id)}
                        className="flex items-center gap-5 bg-white p-5 rounded-2xl border border-border hover:bg-surface-2 hover:border-brand-200 hover:scale-[1.02] active:scale-95 transition-all text-left group shadow-lg shadow-black/5"
                    >
                        <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-brand-100 transition-colors border border-brand-100">
                            {hood.icon}
                        </div>
                        <div>
                            <h3 className="text-text font-bold text-lg mb-0.5 group-hover:text-brand-600 transition-colors">{hood.name}</h3>
                            <p className="text-muted text-xs font-medium">{hood.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NeighborhoodSelection;
