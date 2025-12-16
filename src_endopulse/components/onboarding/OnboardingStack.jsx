import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../../context/UserContext';
import { ChevronRight, Check } from 'lucide-react';

// STACK UI CONSTANTS
const VARIANTS = {
    enter: (direction) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
    }),
};

// Extracted Component to prevent focus loss
const ConsentStep = ({ alias, setAlias, consent, setConsent, nextStep }) => (
    <div className="flex-col" style={{ padding: '2rem' }}>
        <h2 className="h2">Comunidad y Privacidad</h2>

        <label style={{ marginTop: '1rem', display: 'block' }}>Nombre en comunidad (Alias)</label>
        <input
            type="text"
            className="card"
            style={{ width: '100%', fontSize: '1rem', marginTop: '0.5rem', border: '1px solid #333', background: '#222', color: 'white' }}
            placeholder="Ej. Warrior01"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
        />
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>Mínimo 3 letras</p>

        <div className="card flex-between" style={{ marginTop: '2rem' }}>
            <div style={{ paddingRight: '10px' }}>
                <strong>Compartir datos anónimos</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ayuda a mejorar la investigación de EndoPulse.</p>
            </div>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={() => setConsent(!consent)}
                />
                <span className="slider round"></span>
            </label>
        </div>

        <button
            className="btn btn-primary"
            disabled={alias.length < 3}
            onClick={nextStep}
            style={{ marginTop: '2rem', opacity: alias.length < 3 ? 0.5 : 1 }}
        >
            Casi listo
        </button>
    </div>
);

export default function OnboardingStack() {
    const { updateProfile, completeOnboarding } = useUser();
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);

    // TEMPORARY STATE
    const [goal, setGoal] = useState('');
    const [profileData, setProfileData] = useState({ diagnosis: '', cycle: '', meds: false });
    const [trackingPrefs, setTrackingPrefs] = useState({
        pain: true, energy: true, sleep: true, stress: true,
        gi: false, bleeding: false, sexPain: false
    });
    const [alias, setAlias] = useState('');
    const [consent, setConsent] = useState(false);

    const nextStep = () => {
        setDirection(1);
        setStep((prev) => prev + 1);
    };

    const handleFinish = () => {
        updateProfile({
            primaryGoal: goal,
            diagnosis: profileData.diagnosis,
            cycle: profileData.cycle,
            meds: profileData.meds,
            trackingPrefs: trackingPrefs,
            communityAlias: alias,
            analyticsConsent: consent,
        });
        completeOnboarding();
    };

    const Step1_Welcome = () => (
        <div className="flex-col flex-center" style={{ height: '100%', padding: '2rem', textAlign: 'center' }}>
            <div className="flex-center" style={{ width: 80, height: 80, background: 'var(--color-primary-light)', borderRadius: '50%', marginBottom: '2rem' }}>
                <span style={{ fontSize: '2rem' }}>🦄</span>
            </div>
            <h1 className="h1" style={{ color: 'var(--color-primary)' }}>EndoPulse</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                Tu compañero experto para la endometriosis. Entiende tu cuerpo, calma el dolor y vive mejor.
            </p>
            <button className="btn btn-primary" onClick={nextStep} style={{ width: '100%' }}>Empezar</button>
            <button className="btn" style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Ya tengo cuenta</button>
        </div>
    );

    const Step2_Goal = () => (
        <div className="flex-col" style={{ padding: '2rem' }}>
            <h2 className="h2">¿Cuál es tu objetivo principal?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Personalizaremos la experiencia para ti.</p>

            <div className="flex-col gap-2">
                {['Controlar brotes de dolor', 'Mejorar mi energía', 'Preparar consulta médica', 'Entender mis síntomas', 'Monitorizar fertilidad'].map(opt => (
                    <button
                        key={opt}
                        onClick={() => { setGoal(opt); nextStep(); }}
                        className={`card ${goal === opt ? 'selected' : ''}`}
                        style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            border: goal === opt ? '2px solid var(--color-primary)' : '1px solid transparent',
                            background: goal === opt ? 'var(--bg-card)' : 'var(--bg-card)',
                            textAlign: 'left'
                        }}
                    >
                        {opt}
                        {goal === opt && <Check size={18} color="var(--color-primary)" />}
                    </button>
                ))}
            </div>
        </div>
    );

    const Step3_Profile = () => (
        <div className="flex-col" style={{ padding: '2rem' }}>
            <h2 className="h2" style={{ marginBottom: '2rem' }}>Cuéntanos un poco de ti</h2>

            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Diagnóstico</label>
            <div className="flex-col gap-2" style={{ marginBottom: '1.5rem' }}>
                {['Sospecha', 'Confirmado', 'En evaluación'].map(d => (
                    <button
                        key={d}
                        onClick={() => setProfileData({ ...profileData, diagnosis: d })}
                        className="card"
                        style={{ padding: '0.75rem', border: profileData.diagnosis === d ? '2px solid var(--color-primary)' : '' }}
                    >
                        {d}
                    </button>
                ))}
            </div>

            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Ciclo Menstrual</label>
            <div className="flex-col gap-2" style={{ marginBottom: '2rem' }}>
                {['Regular', 'Irregular', 'No aplica (hormonas/menopausia)'].map(c => (
                    <button
                        key={c}
                        onClick={() => setProfileData({ ...profileData, cycle: c })}
                        className="card"
                        style={{ padding: '0.75rem', border: profileData.cycle === c ? '2px solid var(--color-primary)' : '' }}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <button className="btn btn-primary" disabled={!profileData.diagnosis || !profileData.cycle} onClick={nextStep} style={{ marginTop: 'auto' }}>
                Continuar
            </button>
        </div>
    );

    const Step4_Prefs = () => (
        <div className="flex-col" style={{ padding: '2rem' }}>
            <h2 className="h2">¿Qué quieres monitorizar?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Puedes cambiar esto después.</p>

            <div className="flex-col gap-2">
                {Object.keys(trackingPrefs).map(key => (
                    <div key={key} className="card flex-between" style={{ padding: '1rem' }}>
                        <span style={{ textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={trackingPrefs[key]}
                                onChange={() => setTrackingPrefs({ ...trackingPrefs, [key]: !trackingPrefs[key] })}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                ))}
            </div>
            <button className="btn btn-primary" onClick={nextStep} style={{ marginTop: '2rem' }}>Siguiente</button>

            <style>{`
        .switch { position: relative; display: inline-block; width: 50px; height: 28px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--color-primary); }
        input:checked + .slider:before { transform: translateX(22px); }
      `}</style>
        </div>
    );

    // Step 5 Extracted to handle input focus correctly


    const Step6_Permissions = () => (
        <div className="flex-col flex-center" style={{ height: '100%', padding: '2rem', textAlign: 'center' }}>
            <h2 className="h2">Últimos detalles</h2>
            <p>Para la mejor experiencia, necesitamos algunos permisos.</p>

            <div className="card" style={{ width: '100%', marginTop: '2rem', textAlign: 'left' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <span>🔔 Notificaciones</span>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Activar</button>
                </div>
                <div className="flex-between">
                    <span>❤️ Salud (HealthKit)</span>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Conectar</button>
                </div>
            </div>

            <button className="btn btn-primary" onClick={handleFinish} style={{ width: '100%', marginTop: 'auto' }}>
                Entrar a EndoPulse
            </button>
        </div>
    );

    // Components mapping removed in favor of conditional render for stability


    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative', background: 'var(--bg-app)' }}>
            <AnimatePresence custom={direction} initial={false}>
                <motion.div
                    key={step}
                    custom={direction}
                    variants={VARIANTS}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                >
                    {/* Render steps conditionally to avoid re-mounting inputs */}
                    {step === 1 && <Step1_Welcome />}
                    {step === 2 && <Step2_Goal />}
                    {step === 3 && <Step3_Profile />}
                    {step === 4 && <Step4_Prefs />}
                    {step === 5 && (
                        <ConsentStep
                            alias={alias}
                            setAlias={setAlias}
                            consent={consent}
                            setConsent={setConsent}
                            nextStep={nextStep}
                        />
                    )}
                    {step === 6 && <Step6_Permissions />}
                </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex-center gap-2" style={{ position: 'absolute', bottom: '30px', width: '100%', zIndex: 10 }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: i + 1 === step ? 'var(--color-primary)' : '#ddd',
                        transition: 'background 0.3s'
                    }} />
                ))}
            </div>
        </div>
    );
}
