import React, { useState } from 'react';
import { X, FileText, Download, Share } from 'lucide-react';

export default function DoctorPackModal({ onClose }) {
    const [range, setRange] = useState('30');
    const [sections, setSections] = useState({
        symptoms: true,
        impact: true,
        meds: true,
        questions: false
    });

    const toggleSection = (s) => setSections(prev => ({ ...prev, [s]: !prev[s] }));

    return (
        <div className="fixed inset-0 z-[5000] flex-center" style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
            <div className="card" style={{ width: '90%', maxWidth: '400px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    <h2 className="h2" style={{ fontSize: '1.2rem' }}>Doctor Pack</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'transparent' }}><X /></button>
                </div>

                <div className="card flex-center gap-4" style={{ background: '#f0f0f0', marginBottom: '1.5rem' }}>
                    <FileText size={48} color="#555" />
                    <div style={{ textAlign: 'left' }}>
                        <strong>Resumen Clínico</strong>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>1 página PDF optimizada para lectura rápida.</p>
                    </div>
                </div>

                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rango de tiempo</label>
                <div className="flex-center gap-2" style={{ marginBottom: '1.5rem' }}>
                    {['7 días', '30 días', '3 meses'].map(r => (
                        <button
                            key={r} onClick={() => setRange(r)}
                            className="btn"
                            style={{
                                flex: 1, fontSize: '0.8rem', padding: '0.4rem',
                                background: range === r ? 'var(--color-primary)' : 'white',
                                color: range === r ? 'white' : 'var(--text-primary)',
                                border: '1px solid #ddd'
                            }}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Incluir secciones</label>
                <div className="flex-col gap-2" style={{ marginBottom: '2rem' }}>
                    <label className="flex-between card" style={{ padding: '0.8rem' }}>
                        <span>📉 Evolución de síntomas</span>
                        <input type="checkbox" checked={sections.symptoms} onChange={() => toggleSection('symptoms')} />
                    </label>
                    <label className="flex-between card" style={{ padding: '0.8rem' }}>
                        <span>💼 Impacto laboral</span>
                        <input type="checkbox" checked={sections.impact} onChange={() => toggleSection('impact')} />
                    </label>
                    <label className="flex-between card" style={{ padding: '0.8rem' }}>
                        <span>💊 Medicación tomada</span>
                        <input type="checkbox" checked={sections.meds} onChange={() => toggleSection('meds')} />
                    </label>
                </div>

                <div className="flex-col gap-2">
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
                        <Download size={18} style={{ marginRight: '8px' }} /> Generar PDF (Preview)
                    </button>
                    <button className="btn btn-secondary" style={{ width: '100%' }}>
                        <Share size={18} style={{ marginRight: '8px' }} /> Enviar por WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}
