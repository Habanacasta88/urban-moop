import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import useStore from '../../store/useStore';
import { clsx } from 'clsx';

const STEPS = {
    SLIDES: 0,
    CONSENT: 1,
    BASIC_DATA: 2,
    CONTEXT: 3,
    HABITS: 4,
    RESULT: 5
};

export default function OnboardingWizard() {
    const [step, setStep] = useState(STEPS.SLIDES);
    const [formData, setFormData] = useState({
        age: '', gender: '', height: '', weight: '',
        conditions: [],
        alcohol: '', activity: ''
    });
    const completeOnboarding = useStore(state => state.completeOnboarding);
    const navigate = useNavigate();

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => Math.max(0, prev - 1));

    const updateData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const calculateTrack = () => {
        // Logic from prompt:
        // If waist/BMI high or "belly" goal -> B
        // If "good weight" or high activity -> C
        // Default -> A
        if (formData.activity === 'high') return 'C';
        if (formData.weight > 100) return 'B'; // Simple heuristic for now
        return 'A';
    };

    const handleFinish = () => {
        const track = calculateTrack();
        completeOnboarding(track);
        navigate('/today');
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden relative">
            <div className="w-full h-1 bg-slate-100">
                <motion.div
                    className="h-full bg-brand-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((step + 1) / 6) * 100}%` }}
                />
            </div>

            <div className="flex-1 p-6 overflow-y-auto relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full flex flex-col"
                    >
                        {step === STEPS.SLIDES && <StepSlides onNext={handleNext} />}
                        {step === STEPS.CONSENT && <StepConsent onNext={handleNext} />}
                        {step === STEPS.BASIC_DATA && <StepBasicData data={formData} onUpdate={updateData} onNext={handleNext} />}
                        {step === STEPS.CONTEXT && <StepContext data={formData} onUpdate={updateData} onNext={handleNext} />}
                        {step === STEPS.HABITS && <StepHabits data={formData} onUpdate={updateData} onNext={handleNext} />}
                        {step === STEPS.RESULT && <StepResult data={formData} onFinish={handleFinish} track={calculateTrack()} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function StepSlides({ onNext }) {
    return (
        <div className="text-center space-y-8 mt-4">
            <div className="h-48 bg-brand-50 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🥗</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Tu plan personalizado</h2>
            <p className="text-slate-600">
                Sin contar calorías.<br />
                Sin pasar hambre.<br />
                Solo 3 hábitos diarios.
            </p>
            <div className="pt-8">
                <Button fullWidth onClick={onNext}>Continuar</Button>
            </div>
        </div>
    );
}

function StepConsent({ onNext }) {
    const [accepted, setAccepted] = useState(false);
    return (
        <div className="space-y-6 mt-4">
            <div className="text-center">
                <ShieldCheck className="w-12 h-12 text-brand-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Primero tu privacidad</h2>
                <p className="text-sm text-slate-500">Tus datos de salud son sensibles y los protegemos.</p>
            </div>

            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                    checked={accepted}
                    onChange={e => setAccepted(e.target.checked)}
                />
                <div className="text-sm">
                    <span className="font-semibold text-slate-900">Acepto los términos de uso</span>
                    <p className="text-slate-500 mt-1">Entiendo que esta app no es un dispositivo médico ni sustituye al médico.</p>
                </div>
            </label>

            <Button fullWidth disabled={!accepted} onClick={onNext}>Aceptar y Continuar</Button>
        </div>
    );
}

function StepBasicData({ data, onUpdate, onNext }) {
    const isValid = data.age && data.height;
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Datos básicos</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Edad</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white" value={data.age} onChange={e => onUpdate('age', e.target.value)} placeholder="Ej. 45" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Altura (cm)</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white" value={data.height} onChange={e => onUpdate('height', e.target.value)} placeholder="Ej. 175" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Peso (kg) - Opcional</label>
                    <input type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white" value={data.weight} onChange={e => onUpdate('weight', e.target.value)} placeholder="Ej. 80" />
                </div>
            </div>
            <Button fullWidth disabled={!isValid} onClick={onNext}>Siguiente</Button>
        </div>
    );
}

function StepContext({ data, onUpdate, onNext }) {
    const conditions = ['Diabetes Tipo 2', 'Hipertensión', 'Colesterol Alto', 'Ninguna'];
    const toggleCondition = (c) => {
        const current = data.conditions || [];
        if (current.includes(c)) onUpdate('conditions', current.filter(i => i !== c));
        else onUpdate('conditions', [...current, c]);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">¿Tienes alguna de estas condiciones?</h2>
            <div className="space-y-3">
                {conditions.map(c => (
                    <button
                        key={c}
                        onClick={() => toggleCondition(c)}
                        className={clsx(
                            "w-full text-left p-4 rounded-xl border flex justify-between items-center transition-all",
                            (data.conditions || []).includes(c)
                                ? "border-brand-500 bg-brand-50 text-brand-700 font-medium"
                                : "border-slate-200 hover:border-brand-200"
                        )}
                    >
                        {c}
                        {(data.conditions || []).includes(c) && <Check className="w-5 h-5" />}
                    </button>
                ))}
            </div>
            <Button fullWidth onClick={onNext}>Siguiente</Button>
        </div>
    );
}

function StepHabits({ data, onUpdate, onNext }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Hábitos actuales</h2>

            <div className="space-y-4">
                <label className="block">
                    <span className="text-sm font-medium text-slate-700">Consumo de alcohol</span>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white mt-1" value={data.alcohol} onChange={e => onUpdate('alcohol', e.target.value)}>
                        <option value="">Selecciona...</option>
                        <option value="none">0 - No bebo</option>
                        <option value="social">Ocasional / Social</option>
                        <option value="frequent">Frecuente</option>
                    </select>
                </label>

                <label className="block">
                    <span className="text-sm font-medium text-slate-700">Actividad Física</span>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white mt-1" value={data.activity} onChange={e => onUpdate('activity', e.target.value)}>
                        <option value="">Selecciona...</option>
                        <option value="low">Sedentario</option>
                        <option value="medium">Camino a veces</option>
                        <option value="high">Hago deporte regular</option>
                    </select>
                </label>
            </div>

            <Button fullWidth disabled={!data.alcohol || !data.activity} onClick={onNext}>Crear mi plan</Button>
        </div>
    );
}

function StepResult({ track, onFinish }) {
    return (
        <div className="text-center space-y-6 flex flex-col h-full justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
                <Check className="w-10 h-10 text-green-600" />
            </div>

            <div>
                <h2 className="text-2xl font-bold">¡Plan Generado!</h2>
                <p className="text-slate-600 mt-2">Hemos diseñado el camino perfecto para ti.</p>
            </div>

            <div className="bg-brand-50 border border-brand-100 p-6 rounded-2xl text-left">
                <p className="text-xs text-brand-600 font-bold uppercase tracking-wider mb-2">TU RUTA ASIGNADA</p>
                <h3 className="text-xl font-bold text-brand-900 mb-1">
                    {track === 'A' && 'Track A: Reinicio Hepático'}
                    {track === 'B' && 'Track B: Hígado + Bajada de Peso'}
                    {track === 'C' && 'Track C: Mantenimiento y Energía'}
                </h3>
                <p className="text-sm text-brand-700 opacity-90">
                    Basado en tus datos, nos centraremos en {track === 'B' ? 'reducir grasa visceral' : 'desinflamar y recuperar función'}.
                </p>
            </div>

            <div className="pt-4 space-y-3">
                <Button fullWidth size="lg" onClick={onFinish} className="shadow-lg shadow-brand-200">
                    Empezar Día 1
                </Button>
            </div>
        </div>
    );
}
