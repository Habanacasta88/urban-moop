import React, { useState } from 'react';

export default function Map() {
    const [activeTab, setActiveTab] = useState('Today');
    const zones = [
        { id: 'pelvis', x: 50, y: 55, intensity: 8 },
        { id: 'lumbar', x: 50, y: 45, intensity: 4 },
        { id: 'head', x: 50, y: 15, intensity: 2 }
    ];

    return (
        <div className="flex-col" style={{ padding: '1.5rem 1.5rem 100px' }}>
            <div className="flex-between">
                <h1 className="h1">Mapa de Dolor</h1>
                <div className="flex-center gap-2" style={{ background: '#eee', padding: '4px', borderRadius: '20px' }}>
                    {['Today', '30 D'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className="btn"
                            style={{
                                padding: '0.3rem 0.8rem', fontSize: '0.8rem',
                                background: activeTab === t ? 'white' : 'transparent',
                                boxShadow: activeTab === t ? '0 2px 5px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card flex-center" style={{ marginTop: '2rem', height: '400px', position: 'relative', background: '#FAFAFA' }}>
                {/* Simple Body Silhouette SVG */}
                <svg width="200" height="380" viewBox="0 0 100 200" style={{ opacity: 0.3 }}>
                    <path d="M50,10 C60,10 65,20 65,30 C65,40 80,45 80,60 L80,100 L70,100 L70,190 L55,190 L55,130 L45,130 L45,190 L30,190 L30,100 L20,100 L20,60 C20,45 35,40 35,30 C35,20 40,10 50,10 Z" fill="#ccc" />
                </svg>

                {/* Heatmap Points */}
                {zones.map(z => (
                    <div
                        key={z.id}
                        style={{
                            position: 'absolute',
                            left: `${z.x}%`, top: `${z.y}%`,
                            width: `${z.intensity * 4}px`, height: `${z.intensity * 4}px`,
                            background: 'radial-gradient(circle, rgba(231, 76, 60, 0.8) 0%, rgba(231, 76, 60, 0) 70%)',
                            transform: 'translate(-50%, -50%)',
                            borderRadius: '50%'
                        }}
                    />
                ))}
            </div>

            <div className="card" style={{ marginTop: '1rem' }}>
                <h3 className="h2" style={{ fontSize: '1rem' }}>Zonas más activas</h3>
                <div className="flex-between" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    <span>Pelvis</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>Alta (8/10)</span>
                </div>
                <div className="flex-between" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    <span>Lumbar</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-warning)' }}>Media (4/10)</span>
                </div>
            </div>
        </div>
    );
}
