import { useState } from 'react';
import { MapPin, Bell, MessageCircle, AlertCircle, ChevronLeft } from 'lucide-react';

const Permissions = ({ onNext, onBack }) => {
    // onNext(true) -> GPS Granted
    // onNext(false) -> Manual Selection

    return (
        <div className="onboarding-step flex flex-col h-full pt-8 px-6 pb-8 animate-in fade-in slide-in-from-right duration-300">
            {/* Header with Back */}
            <div className="flex items-center mb-6 relative">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors absolute left-0 z-10">
                    <ChevronLeft className="text-gray-900" size={28} />
                </button>
                <div className="flex gap-2 mx-auto">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                </div>
            </div>

            {/* VISUAL HEADER */}
            <div className="flex-1 flex flex-col items-center justify-center text-center mb-8 relative">
                {/* Dynamic Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl -z-10 rounded-full"></div>

                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/30 rotate-3 transform transition-transform hover:rotate-6">
                    <MapPin size={48} className="text-white drop-shadow-md" />
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                    Activa tu ubicación 📍
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto font-medium">
                    Para mostrarte solo lo que está pasando a un paso de ti. Planes reales. Personas reales. Ahora.
                </p>
            </div>

            {/* OPTIONS LIST */}
            <div className="w-full space-y-3 mb-8">
                <div className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                        👋
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-sm mb-1">Viajeros y moopers cerca</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">Conecta con personas que están literalmente a unos metros.</p>
                    </div>
                </div>
                <div className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                        ☕
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-sm mb-1">Actividades locales</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">Descubre planes que están ocurriendo en tu ciudad ahora mismo.</p>
                    </div>
                </div>
            </div>

            {/* ACTION */}
            <div className="space-y-3">
                <button
                    onClick={() => onNext(true)}
                    className="w-full py-4 rounded-xl font-black text-white bg-gray-900 shadow-lg shadow-gray-900/10 active:scale-95 transition-transform"
                >
                    Activar Ubicación
                </button>
                <button
                    onClick={() => onNext(false)}
                    className="w-full py-4 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                    Seleccionar manualmente
                </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-4">
                UrbanMoop no rastrea tu historial. Solo tu posición actual.
            </p>
        </div>
    );
};

export default Permissions;
