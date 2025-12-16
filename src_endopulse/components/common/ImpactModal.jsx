import React, { useState } from 'react';
import { X, Briefcase, GraduationCap } from 'lucide-react';

export default function ImpactModal({ onClose }) {
    const [impactType, setImpactType] = useState('work'); // work | studies
    const [hoursLost, setHoursLost] = useState(0);
    const [cause, setCause] = useState('pain');

    const handleSave = () => {
        // In a real app, save to context
        console.log('Impact saved:', { impactType, hoursLost, cause });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[5000] flex-center" style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
            <div className="card" style={{ width: '90%', maxWidth: '400px', padding: '1.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="h2" style={{ fontSize: '1.2rem' }}>Registro de Impacto</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'transparent' }}><X /></button>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                    Documentar esto es clave para tu inapacidad o adaptaciones.
                </p>

                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Ámbito afectado</label>
                <div className="flex-center gap-2" style={{ marginBottom: '1.5rem' }}>
                    <button
                        onClick={() => setImpactType('work')}
                        className="btn"
                        style={{ flex: 1, background: impactType === 'work' ? '#E8EAF6' : 'white', border: impactType === 'work' ? '2px solid #3F51B5' : '1px solid #ddd' }}
                    >
                        <Briefcase size={16} style={{ marginRight: '6px' }} /> Trabajo
                    </button>
                    <button
                        onClick={() => setImpactType('studies')}
                        className="btn"
                        style={{ flex: 1, background: impactType === 'studies' ? '#E8EAF6' : 'white', border: impactType === 'studies' ? '2px solid #3F51B5' : '1px solid #ddd' }}
                    >
                        <GraduationCap size={16} style={{ marginRight: '6px' }} /> Estudios
                    </button>
                </div>

                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Horas perdidas hoy: {hoursLost}h</label>
                <input
                    type="range" min="0" max="8" step="0.5"
                    value={hoursLost} onChange={(e) => setHoursLost(e.target.value)}
                    style={{ width: '100%', marginBottom: '1.5rem', accentColor: '#3F51B5' }}
                />

                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Causa principal</label>
                <select
                    value={cause} onChange={(e) => setCause(e.target.value)}
                    className="card"
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '2rem' }}
                >
                    <option value="pain">Dolor intenso</option>
                    <option value="fatigue">Fatiga extrema</option>
                    <option value="medical">Consulta médica</option>
                    <option value="brain_fog">Niebla mental</option>
                </select>

                <button className="btn btn-primary" style={{ width: '100%', background: '#3F51B5' }} onClick={handleSave}>
                    Registrar Impacto
                </button>
            </div>
        </div>
    );
}
