import React, { useState } from 'react';
import { useFlare } from '../../context/FlareContext';
import { Star } from 'lucide-react';

export default function FlareSummary() {
    const { resolveFlare } = useFlare();
    const [helpers, setHelpers] = useState([]);

    const toggleHelper = (h) => {
        if (helpers.includes(h)) setHelpers(prev => prev.filter(x => x !== h));
        else setHelpers(prev => [...prev, h]);
    };

    return (
        <div className="flex-col" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Star size={48} color="var(--color-success)" fill="var(--color-success)" />
            </div>
            <h2 className="h2">¡Brote superado!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Has gestionado este momento con fuerza.</p>

            <div className="card" style={{ marginTop: '2rem', textAlign: 'left' }}>
                <h3 className="h2" style={{ fontSize: '1.1rem' }}>¿Qué te ayudó más?</h3>
                <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '1rem' }}>Esto mejora tus recomendaciones futuras.</p>

                <div className="flex-center gap-2" style={{ flexWrap: 'wrap' }}>
                    {['Calor', 'Descanso', 'Medicación', 'Respiración', 'Caminar'].map(h => (
                        <button
                            key={h}
                            onClick={() => toggleHelper(h)}
                            className="btn"
                            style={{
                                padding: '0.4rem 0.8rem', fontSize: '0.8rem',
                                background: helpers.includes(h) ? 'var(--color-success)' : 'white',
                                color: helpers.includes(h) ? 'white' : '#555',
                                border: helpers.includes(h) ? 'none' : '1px solid #ddd'
                            }}
                        >
                            {h}
                        </button>
                    ))}
                </div>
            </div>

            <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '3rem' }}
                onClick={() => resolveFlare({ helpers })}
            >
                Guardar y Cerrar
            </button>
        </div>
    );
}
