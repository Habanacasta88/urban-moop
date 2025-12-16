import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wine, Coffee, Footprints, ChevronRight, flame, Trophy, Utensils } from 'lucide-react';
import useStore from '../../store/useStore';
import { clsx } from 'clsx';

export default function Today() {
    const { dailyChecks, toggleCheck, streak, programStartDate, user } = useStore();
    const navigate = useNavigate();

    const dayNumber = useMemo(() => {
        if (!programStartDate) return 1;
        const start = new Date(programStartDate);
        const now = new Date();
        const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        return diff + 1;
    }, [programStartDate]);

    const weekNumber = Math.ceil(dayNumber / 7);

    const completionCount = Object.values(dailyChecks).filter(Boolean).length;
    const progress = (completionCount / 3) * 100;

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">
                        Semana {weekNumber} · Día {dayNumber}
                    </p>
                    <h1 className="text-3xl font-bold text-slate-900 mt-1">
                        Hola, {user?.name || 'Viajero'}
                    </h1>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-sm font-bold border border-orange-100">
                    <Trophy className="w-4 h-4" />
                    <span>{streak} días</span>
                </div>
            </header>

            {/* Daily Checks */}
            <section className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h2 className="text-lg font-bold text-slate-900">Tus 3 Claves de Hoy</h2>
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">
                        {completionCount}/3 Completado
                    </span>
                </div>

                <div className="space-y-3">
                    <CheckCard
                        label="Alcohol Cero"
                        description="Evita cualquier bebida alcohólica"
                        icon={Wine}
                        checked={dailyChecks.alcohol}
                        onChange={() => toggleCheck('alcohol')}
                        color="indigo"
                    />
                    <CheckCard
                        label="Sin Azúcar Líquido"
                        description="Agua, café o té sin endulzar"
                        icon={Coffee}
                        checked={dailyChecks.sugar}
                        onChange={() => toggleCheck('sugar')}
                        color="emerald" // Updated from teal to emerald for better contrast
                    />
                    <CheckCard
                        label="Movimiento 15'"
                        description="Caminar rápido o ejercicio ligero"
                        icon={Footprints}
                        checked={dailyChecks.movement}
                        onChange={() => toggleCheck('movement')}
                        color="rose"
                    />
                </div>
            </section>

            {/* Menu Shortcut */}
            <section>
                <div
                    onClick={() => navigate('/eat')}
                    className="bg-brand-500 rounded-2xl p-6 text-white shadow-lg shadow-brand-200 cursor-pointer active:scale-95 transition-transform relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Utensils className="w-24 h-24 rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-lg font-bold mb-1">Tu Menú de Hoy</h3>
                        <p className="text-brand-100 text-sm mb-4 max-w-[200px]">
                            Descubre lo que hemos preparado para tu día {dayNumber}.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-sm">
                            Ver comidas <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency / Help */}
            <section className="grid grid-cols-2 gap-3">
                <button className="p-4 rounded-xl border border-slate-200 bg-white text-left hover:bg-slate-50 transition-colors">
                    <span className="text-2xl mb-2 block">🍽️</span>
                    <span className="font-bold text-slate-700 text-sm block">Comer fuera</span>
                </button>
                <button className="p-4 rounded-xl border border-slate-200 bg-white text-left hover:bg-slate-50 transition-colors">
                    <span className="text-2xl mb-2 block">🆘</span>
                    <span className="font-bold text-slate-700 text-sm block">¡Ayuda!</span>
                </button>
            </section>
        </div>
    );
}

function CheckCard({ label, description, icon: Icon, checked, onChange, color }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100', // emerald instead of teal
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
    };

    const activeColors = {
        indigo: 'bg-indigo-600 border-indigo-600 text-white',
        emerald: 'bg-emerald-600 border-emerald-600 text-white',
        rose: 'bg-rose-600 border-rose-600 text-white',
    };

    return (
        <div
            onClick={onChange}
            className={clsx(
                "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm",
                checked ? activeColors[color] : "bg-white border-slate-100 hover:border-brand-200"
            )}
        >
            <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                checked ? "bg-white/20 text-white" : colors[color]
            )}>
                <Icon className="w-6 h-6" />
            </div>

            <div className="flex-1">
                <h3 className={clsx("font-bold transition-colors", checked ? "text-white" : "text-slate-900")}>
                    {label}
                </h3>
                <p className={clsx("text-xs transition-colors", checked ? "text-white/80" : "text-slate-500")}>
                    {description}
                </p>
            </div>

            <div className={clsx(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                checked ? "border-white bg-white text-brand-600" : "border-slate-200 bg-transparent"
            )}>
                {checked && <div className="w-3 h-3 rounded-full bg-current" />}
            </div>
        </div>
    );
}
