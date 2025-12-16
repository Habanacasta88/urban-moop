import React, { useState } from 'react';
import { Heart, XCircle, CheckCircle, Share2, MessageCircle } from 'lucide-react';

export default function PartnerMode() {
    const [activeTab, setActiveTab] = useState('help'); // help | avoid

    const tips = [
        { id: 1, text: 'Tráele una bolsa de agua caliente sin que la pida.', type: 'action' },
        { id: 2, text: 'No preguntes "¿ya estás mejor?" cada 5 minutos.', type: 'avoid' },
        { id: 3, text: 'Ofrece un masaje suave en la espalda baja o pies.', type: 'action' },
        { id: 4, text: 'Encárgate de la cena / tareas hoy.', type: 'action' }
    ];

    const avoidList = [
        'No es para tanto, relájate.',
        '¿Otra vez te duele?',
        'Deberías hacer más ejercicio.',
        'Es solo la regla.'
    ];

    return (
        <div className="flex-col" style={{ padding: '1.5rem', paddingBottom: '100px', background: '#FFF8E1', minHeight: '100vh' }}>
            <div className="flex-center flex-col" style={{ marginBottom: '2rem' }}>
                <div style={{ background: 'var(--color-secondary)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                    <Heart color="white" size={32} />
                </div>
                <h1 className="h1" style={{ color: '#F57F17' }}>Modo Acompañante</h1>
                <p style={{ textAlign: 'center', color: '#8D6E63' }}>
                    Guía rápida para ayudar a tu persona favorita durante un brote.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex-center gap-2" style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('help')}
                    className="btn"
                    style={{
                        flex: 1, background: activeTab === 'help' ? '#F57F17' : 'white',
                        color: activeTab === 'help' ? 'white' : '#F57F17',
                        border: '1px solid #F57F17'
                    }}
                >
                    Qué hacer (✅)
                </button>
                <button
                    onClick={() => setActiveTab('avoid')}
                    className="btn"
                    style={{
                        flex: 1, background: activeTab === 'avoid' ? '#D84315' : 'white',
                        color: activeTab === 'avoid' ? 'white' : '#D84315',
                        border: '1px solid #D84315'
                    }}
                >
                    Qué evitar (❌)
                </button>
            </div>

            {activeTab === 'help' ? (
                <div className="flex-col gap-4">
                    {tips.filter(t => t.type === 'action').map(t => (
                        <div key={t.id} className="card flex-between" style={{ padding: '1.2rem' }}>
                            <span style={{ fontSize: '1rem' }}>{t.text}</span>
                            <CheckCircle color="#2ECC71" />
                        </div>
                    ))}

                    <div className="card" style={{ marginTop: '1rem', background: 'white' }}>
                        <strong>💬 Frase mágica:</strong>
                        <p style={{ fontStyle: 'italic', color: '#555', marginTop: '0.5rem' }}>
                            "Aquí estoy para lo que necesites. No tienes que hacer nada hoy."
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex-col gap-4">
                    {avoidList.map((t, i) => (
                        <div key={i} className="card flex-between" style={{ padding: '1.2rem', opacity: 0.8 }}>
                            <span style={{ fontSize: '1rem', color: '#555' }}>"{t}"</span>
                            <XCircle color="#E74C3C" />
                        </div>
                    ))}
                </div>
            )}

            <button className="btn btn-primary" style={{ marginTop: '2rem', width: '100%', background: '#333' }}>
                <Share2 size={18} style={{ marginRight: '8px' }} />
                Compartir esta guía
            </button>

        </div>
    );
}
