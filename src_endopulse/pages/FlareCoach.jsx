import React from 'react';
import { useFlare } from '../context/FlareContext';
import FlareWizard from '../components/flare/FlareWizard';
import FlareDashboard from '../components/flare/FlareDashboard';
import FlareSummary from '../components/flare/FlareSummary';
import { PlusCircle } from 'lucide-react';

export default function FlareCoach() {
    const { flareState, startFlare } = useFlare();

    // STATE MACHINE ROUTING
    if (flareState.startsWith('wizard')) {
        return <FlareWizard />;
    }

    if (flareState === 'in_progress') {
        return <FlareDashboard />;
    }

    if (flareState === 'resolved') {
        return <FlareSummary />;
    }

    // DEFAULT STATE (NONE) - CTA
    return (
        <div className="flex-col flex-center" style={{ height: '80vh', padding: '2rem', textAlign: 'center' }}>
            <div style={{
                width: 120, height: 120, borderRadius: '50%', background: '#F3E5F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'
            }}>
                <span style={{ fontSize: '3rem' }}>🛡️</span>
            </div>

            <h1 className="h1">Flare Coach 360º</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '300px' }}>
                Si notas que empieza un brote, actívalo. Te guiaremos paso a paso para reducir el impacto.
            </p>

            <button className="btn btn-primary" onClick={startFlare} style={{ width: '100%', padding: '1rem' }}>
                <PlusCircle style={{ marginRight: '8px' }} />
                Iniciar Modo Brote
            </button>

            <div className="card" style={{ marginTop: '2rem', textAlign: 'left', width: '100%' }}>
                <strong>💡 Tip preventivo</strong>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>Mantén tu "Kit de emergencia" preparado con calor y analgésicos a mano.</p>
            </div>
        </div>
    );
}
