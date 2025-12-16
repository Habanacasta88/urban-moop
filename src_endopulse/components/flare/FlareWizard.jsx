import React, { useState, useEffect } from 'react';
import { useFlare } from '../../context/FlareContext';
import { Play, Pause, Square, Thermometer, Wind, Activity } from 'lucide-react';

// Step 2 Component
const Step2_Register = ({ advanceStage, updateFlareData }) => {
    // Mock Body Map for MVP: List of zones
    const zones = ['Pelvis', 'Lumbar', 'Abdomen', 'Piernas', 'Cabeza'];
    const [selectedZones, setSelectedZones] = useState([]);
    const [intensity, setIntensity] = useState(5);
    const [symptom, setSymptom] = useState('Dolor');

    const toggleZone = (z) => {
        if (selectedZones.includes(z)) setSelectedZones(prev => prev.filter(x => x !== z));
        else setSelectedZones(prev => [...prev, z]);
    };

    return (
        <div className="flex-col" style={{ padding: '2rem' }}>
            <div className="flex-between">
                <h2 className="h2">Registra el síntoma</h2>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>2/3</span>
            </div>

            <label style={{ marginTop: '1rem', display: 'block' }}>Zonas Afectadas</label>
            <div className="flex-center gap-2" style={{ flexWrap: 'wrap', justifyContent: 'flex-start', margin: '1rem 0' }}>
                {zones.map(z => (
                    <button
                        key={z}
                        onClick={() => toggleZone(z)}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem', fontSize: '0.8rem',
                            background: selectedZones.includes(z) ? 'var(--color-primary)' : 'white',
                            color: selectedZones.includes(z) ? 'white' : '#555',
                            border: '1px solid #ddd'
                        }}
                    >
                        {z}
                    </button>
                ))}
            </div>

            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Intensidad ({intensity})</label>
            <input
                type="range" min="0" max="10" value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-primary)' }}
            />

            <label style={{ display: 'block', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Síntoma Dominante</label>
            <div className="flex-center gap-2">
                {['Dolor', 'Fatiga', 'GI', 'Sangrado'].map(s => (
                    <button
                        key={s}
                        onClick={() => setSymptom(s)}
                        className="card"
                        style={{
                            flex: 1, padding: '0.6rem', textAlign: 'center', fontSize: '0.8rem',
                            background: symptom === s ? '#F3E5F5' : 'white',
                            border: symptom === s ? '1px solid var(--color-primary)' : '1px solid transparent'
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={() => {
                    updateFlareData({
                        painMap: selectedZones,
                        currentPain: intensity,
                        dominantSymptom: symptom
                    });
                    advanceStage('wizard_step_3');
                }}
            >
                Continuar
            </button>
        </div>
    );
};

// Step 3 Component
const Step3_Decide = ({ advanceStage, updateFlareData }) => {
    const [checklist, setChecklist] = useState([
        { id: 1, text: 'Manta eléctrica / Calor', done: false },
        { id: 2, text: 'Medicación SOS (Ibuprofeno)', done: false },
        { id: 3, text: 'Cancelar reunión tarde', done: false }
    ]);

    return (
        <div className="flex-col" style={{ padding: '2rem' }}>
            <div className="flex-between">
                <h2 className="h2">Plan de Acción</h2>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>3/3</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Organiza tus próximos pasos para sentirte segura.</p>

            <div className="flex-col gap-2" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                {checklist.map((item, idx) => (
                    <div key={item.id} className="card flex-between" style={{ padding: '1rem' }}>
                        <input
                            type="text"
                            value={item.text}
                            onChange={(e) => {
                                const newL = [...checklist];
                                newL[idx].text = e.target.value;
                                setChecklist(newL);
                            }}
                            style={{ border: 'none', width: '100%', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>
                ))}
                <button
                    className="btn btn-secondary"
                    onClick={() => setChecklist([...checklist, { id: Date.now(), text: '', done: false }])}
                >
                    + Añadir ítem
                </button>
            </div>

            <div style={{ background: '#FFF5F5', padding: '1rem', borderRadius: '8px', marginBottom: 'auto' }}>
                <strong style={{ color: 'var(--color-accent)' }}>⚠️ Señales de Alerta</strong>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Si tienes fiebre alta, vómitos incontrolables o desmayos, acude a urgencias.</p>
            </div>

            <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => {
                    updateFlareData({ plan: checklist });
                    advanceStage('in_progress');
                }}
            >
                Activar Modo Brote
            </button>
        </div>
    );
};

// Step 1 Component
const Step1_Calm = ({ advanceStage, updateFlareData }) => {
    const [timer, setTimer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedIntervention, setSelectedIntervention] = useState(null);

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="flex-col" style={{ padding: '2rem', height: '100%', textAlign: 'center' }}>
            <h2 className="h2">Vamos a bajar el pico</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Elige una herramienta rápida (2-5 min)</p>

            <div className="flex-center gap-2" style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
                {[
                    { id: 'heat', icon: <Thermometer />, label: 'Calor' },
                    { id: 'breath', icon: <Wind />, label: 'Respirar' },
                    { id: 'move', icon: <Activity />, label: 'Mov. Suave' }
                ].map(it => (
                    <button
                        key={it.id}
                        onClick={() => setSelectedIntervention(it.id)}
                        className="card flex-col flex-center"
                        style={{
                            width: '90px', height: '90px',
                            border: selectedIntervention === it.id ? '2px solid var(--color-primary)' : ''
                        }}
                    >
                        {it.icon}
                        <span style={{ fontSize: '0.8rem', marginTop: '4px' }}>{it.label}</span>
                    </button>
                ))}
            </div>

            {selectedIntervention && (
                <div className="card flex-col flex-center" style={{ padding: '2rem', marginBottom: '2rem', background: '#FAFAFA' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {formatTime(timer)}
                    </span>
                    <div className="flex-center gap-4" style={{ marginTop: '1rem' }}>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="btn btn-primary"
                            style={{ width: '60px', height: '60px', borderRadius: '50%', padding: 0 }}
                        >
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
                        {isPlaying ? 'Reproduciendo audio guía...' : 'Pulsa play para empezar'}
                    </p>
                </div>
            )}

            <div style={{ marginTop: 'auto' }}>
                <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => {
                        updateFlareData({ interventions: [{ type: selectedIntervention, duration: timer }] });
                        advanceStage('wizard_step_2');
                    }}
                >
                    Hecho / Me siento mejor
                </button>
                <button
                    className="btn"
                    style={{ marginTop: '1rem', color: '#999' }}
                    onClick={() => advanceStage('wizard_step_2')}
                >
                    Saltar este paso
                </button>
            </div>
        </div>
    );
};

export default function FlareWizard() {
    const { flareState, advanceStage, updateFlareData } = useFlare();

    if (flareState === 'wizard_step_1') return <Step1_Calm advanceStage={advanceStage} updateFlareData={updateFlareData} />;
    if (flareState === 'wizard_step_2') return <Step2_Register advanceStage={advanceStage} updateFlareData={updateFlareData} />;
    if (flareState === 'wizard_step_3') return <Step3_Decide advanceStage={advanceStage} updateFlareData={updateFlareData} />;

    return null;
}
