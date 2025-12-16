import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useData } from '../context/DataContext';
import { useFlare } from '../context/FlareContext';
import { useNavigate } from 'react-router-dom';
import { Settings, Zap, Moon, AlertOctagon, CheckCircle } from 'lucide-react';
import ImpactModal from '../components/common/ImpactModal'; // Import

export default function Home() {
    const { profile } = useUser();
    const { saveDailyCheckIn, getEntry } = useData();
    const { startFlare } = useFlare();
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];
    const [checkedIn, setCheckedIn] = useState(false);
    const [showImpact, setShowImpact] = useState(false); // State

    // Local Form State
    const [pain, setPain] = useState(2);
    const [energy, setEnergy] = useState('Medium');
    const [isFlare, setIsFlare] = useState(false);

    // Semaphore Logic (Mocked for now based on pain)
    const getSemaphore = () => {
        if (pain >= 7 || isFlare) return { color: 'var(--color-accent)', text: 'Rojo', sub: 'Prioriza descanso' };
        if (pain >= 4) return { color: 'var(--color-warning)', text: 'Amarillo', sub: 'Vigila síntomas' };
        return { color: 'var(--color-success)', text: 'Verde', sub: 'Todo en orden' };
    };
    const sem = getSemaphore();

    const handleSave = () => {
        saveDailyCheckIn({ date: today, pain, energy, isFlare });
        setCheckedIn(true);

        if (isFlare) {
            startFlare();
            navigate('/flare');
        }
    };

    return (
        <div style={{ padding: '1.5rem', paddingBottom: '100px' }}>
            {/* Header */}
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h1 className="h1">Hoy</h1>
                    <span style={{ color: 'var(--text-secondary)' }}>Hola, {profile.communityAlias || 'Guerrera'}</span>
                </div>
                <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <Settings size={20} />
                </button>
            </div>

            {/* Semaphore Card */}
            <div className="card flex-between" style={{ background: 'white', borderLeft: `6px solid ${sem.color}` }}>
                <div>
                    <h2 className="h2" style={{ color: sem.color }}>{sem.text}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{sem.sub}</p>
                </div>
                <div style={{ padding: '1rem', background: 'white', borderRadius: '50%' }}>
                    {sem.text === 'Rojo' ? <AlertOctagon color={sem.color} /> : <Zap color={sem.color} />}
                </div>
            </div>

            {/* Check-in Card */}
            {!checkedIn ? (
                <div className="card">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <h3 className="h2" style={{ fontSize: '1.1rem' }}>Check-in Diario</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', background: 'var(--color-primary-light)20', padding: '2px 8px', borderRadius: '12px' }}>20s</span>
                    </div>

                    {/* Pain Slider */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <label>Nivel de Dolor</label>
                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{pain}</span>
                        </div>
                        <input
                            type="range" min="0" max="10" value={pain}
                            onChange={(e) => setPain(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                        />
                        <div className="flex-between" style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px' }}>
                            <span>Nada</span>
                            <span>Insupportable</span>
                        </div>
                    </div>

                    {/* Energy Selector */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Energía</label>
                        <div className="flex-between gap-2">
                            {['Baja', 'Media', 'Alta'].map(e => (
                                <button
                                    key={e}
                                    onClick={() => setEnergy(e)}
                                    className="card"
                                    style={{
                                        flex: 1, padding: '0.5rem', textAlign: 'center',
                                        background: energy === e ? 'var(--color-primary)' : 'var(--bg-app)',
                                        color: energy === e ? 'white' : 'var(--text-primary)',
                                        border: 'none',
                                        boxShadow: 'none'
                                    }}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Flare Question */}
                    <div className="flex-between" style={{ marginBottom: '1.5rem', background: '#FFF5F5', padding: '1rem', borderRadius: '12px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>¿Estás en un brote?</span>
                        <div className="flex-center gap-2">
                            <button
                                onClick={() => setIsFlare(false)}
                                style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid #ddd', background: !isFlare ? 'white' : 'transparent', fontWeight: !isFlare ? 600 : 400 }}
                            >No</button>
                            <button
                                onClick={() => setIsFlare(true)}
                                style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: 'none', background: isFlare ? 'var(--color-accent)' : '#ddd', color: isFlare ? 'white' : '#333', fontWeight: 600 }}
                            >Sí</button>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave}>
                        {isFlare ? 'Iniciar Modo Brote' : 'Guardar día'}
                    </button>
                </div>
            ) : (
                <div className="card flex-center flex-col" style={{ padding: '2rem', textAlign: 'center' }}>
                    <CheckCircle size={48} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
                    <h3 className="h2">¡Día registrado!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Has dado un paso más en tu bienestar.</p>
                    <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setCheckedIn(false)}>Editar</button>
                </div>
            )}

            {/* Action Card */}
            <div className="card">
                <h3 className="h2" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Herramientas rápidas</h3>

                <button
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.9rem', marginBottom: '0.5rem' }}
                    onClick={() => navigate('/partner')}
                >
                    🤝 Activar Modo Acompañante
                </button>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', marginTop: '1rem' }}>
                    Toma 5 minutos para estirar la zona lumbar suavemente.
                </p>
                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>Ver guía de estiramiento</button>
            </div>

            {/* Summary Mock */}
            <div className="card flex-between">
                <div className="flex-col">
                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>2</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Días seguidos</span>
                </div>
                <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>12%</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Menos dolor vs mes pasado</span>
                </div>
            </div>

            {/* Impact Mock */}
            <div className="card" onClick={() => setShowImpact(true)} style={{ cursor: 'pointer', border: '1px dashed #ccc' }}>
                <div className="flex-between">
                    <strong>💼 Impacto laboral / estudios</strong>
                    <span style={{ fontSize: '1.2rem' }}>+</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>¿El dolor te limitó hoy?</p>
            </div>

            {showImpact && <ImpactModal onClose={() => setShowImpact(false)} />}
        </div>
    );
}
