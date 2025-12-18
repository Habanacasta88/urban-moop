import { ChevronLeft } from 'lucide-react';
import { useVibe } from '../../context/VibeContext';

export const RadarHeader = () => {
    const { openVibeCheck } = useVibe();

    return (
        <div className="flex items-start gap-2 pointer-events-auto flex-wrap">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg border border-white/50 overflow-hidden shrink-0">
                <img src="/logo_full.png" alt="Logo" className="w-full h-full object-contain p-1" />
            </div>

            {/* Location Selector */}
            <button
                onClick={() => openVibeCheck('zone', 'sabadell-center', 'Centro de Sabadell')}
                className="bg-white/90 backdrop-blur-md pl-3 pr-4 py-1.5 rounded-xl shadow-sm border border-white/50 flex flex-col items-start transition-transform active:scale-95 shrink-0"
            >
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">AHORA EN:</span>
                <div className="flex items-center gap-1 text-sm font-black text-gray-900 leading-none">
                    Sabadell <ChevronLeft size={10} className="-rotate-90 text-gray-400" />
                </div>
            </button>
        </div>
    );
};
