import React, { useState } from 'react';
import { FileText, TrendingUp, Moon } from 'lucide-react';
import DoctorPackModal from '../components/common/DoctorPackModal';

export default function Insights() {
    const [showDoctor, setShowDoctor] = useState(false);

    return (
        <div className="flex-col" style={{ padding: '1.5rem 1.5rem 100px' }}>
            <h1 className="h1">Insights</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Descubre tus patrones.</p>

            {/* Trends Chart Mockup */}
            <div className="card" style={{ marginTop: '1.5rem', height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '0' }}>
                {[3, 4, 7, 2, 5, 8, 4].map((h, i) => (
                    <div key={i} style={{ width: '10%', height: `${h * 10}%`, background: h > 6 ? 'var(--color-accent)' : 'var(--color-primary-light)', borderRadius: '4px 4px 0 0', opacity: 0.7 }}></div>
                ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>Nivel de dolor - Últimos 7 días</p>

            {/* Patterns */}
            <h3 className="h2" style={{ marginTop: '2rem' }}>Patrones Detectados</h3>
            <div className="card flex-between">
                <div className="flex-center" style={{ background: '#E8EAF6', padding: '10px', borderRadius: '50%', marginRight: '1rem' }}>
                    <Moon size={20} color="#3F51B5" />
                </div>
                <div style={{ flex: 1 }}>
                    <strong>Sueño vs Dolor</strong>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>Dormir menos de 6h aumenta tu dolor un 30%.</p>
                </div>
            </div>

            {/* Doctor Pack CTA */}
            <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', color: 'white' }}>
                <div className="flex-between">
                    <h3 className="h2" style={{ color: 'white' }}>Doctor Pack</h3>
                    <FileText color="white" />
                </div>
                <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1rem' }}>Genera un informe clínico completo en PDF para tu próxima consulta.</p>
                <button
                    className="btn"
                    style={{ background: 'white', color: 'var(--color-primary)', width: '100%' }}
                    onClick={() => setShowDoctor(true)}
                >
                    Crear Informe
                </button>
            </div>

            {showDoctor && <DoctorPackModal onClose={() => setShowDoctor(false)} />}
        </div>
    );
}
