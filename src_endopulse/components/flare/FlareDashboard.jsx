import React from 'react';
import { useFlare } from '../../context/FlareContext';
import { Check, Clock } from 'lucide-react';

export default function FlareDashboard() {
    const { currentFlare, advanceStage } = useFlare();

    if (!currentFlare) return null;

    const startTime = new Date(currentFlare.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{ padding: '1.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div className="flex-center" style={{ gap: '8px' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-accent)', animation: 'pulse-red 2s infinite' }}></span>
                    <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>BROTE EN CURSO</span>
                </div>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>Inicio {startTime}</span>
            </div>

            {/* Plan Checklist */}
            <h3 className="h2" style={{ marginTop: '1rem' }}>Tu Plan</h3>
            <div className="flex-col gap-2">
                {currentFlare.plan && currentFlare.plan.map((item, idx) => (
                    <div key={idx} className="card flex-between" style={{ padding: '1rem' }}>
                        <span>{item.text}</span>
                        <button className="btn btn-secondary" style={{ padding: '0.2rem 0.6rem' }}>
                            <Check size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Update Status */}
            <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <h3 className="h2">¿Cómo te sientes ahora?</h3>
                <div className="flex-between gap-4" style={{ marginTop: '1rem' }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }}>Peor</button>
                    <button className="btn btn-secondary" style={{ flex: 1 }}>Igual</button>
                    <button className="btn btn-primary" style={{ flex: 1 }}>Mejor</button>
                </div>
            </div>

            <button
                className="btn"
                style={{ width: '100%', marginTop: '3rem', border: '1px solid #ddd', color: 'var(--color-success)' }}
                onClick={() => advanceStage('resolved')}
            >
                <Check size={18} style={{ marginRight: '8px' }} />
                Finalizar Brote
            </button>
        </div>
    );
}
