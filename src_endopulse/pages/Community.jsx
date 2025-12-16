import React from 'react';
import { useUser } from '../context/UserContext';
import { MessageSquare, Heart } from 'lucide-react';

export default function Community() {
    const { profile } = useUser();

    const posts = [
        { id: 1, author: 'Guerrera_88', text: 'Hoy logré salir a caminar 10 minutos a pesar del dolor. Pequeñas victorias 💪', likes: 24, comments: 5 },
        { id: 2, author: 'LunaNueva', text: '¿Alguien ha probado la manta eléctrica de peso? Estoy pensando en comprar una.', likes: 12, comments: 8 },
        { id: 3, author: 'EndoSister', text: 'El médico por fin me escuchó. Gracias a todas por los consejos sobre cómo preparar la consulta.', likes: 56, comments: 12 }
    ];

    return (
        <div className="flex-col" style={{ padding: '1.5rem 1.5rem 100px' }}>
            <div className="flex-between">
                <h1 className="h1">Comunidad</h1>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>@{profile.communityAlias || 'Tú'}</span>
            </div>

            <div className="card" style={{ background: '#FFF3E0', borderLeft: '4px solid Orange' }}>
                <strong>Pregunta de la semana</strong>
                <p style={{ fontSize: '0.9rem' }}>¿Qué canción te ayuda a relajarte?</p>
                <button className="btn btn-secondary" style={{ marginTop: '10px', fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>Responder</button>
            </div>

            <div className="flex-col gap-4" style={{ marginTop: '1.5rem' }}>
                {posts.map(p => (
                    <div key={p.id} className="card">
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>@{p.author}</span>
                            <span style={{ fontSize: '0.8rem', color: '#999' }}>2h</span>
                        </div>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{p.text}</p>
                        <div className="flex-between" style={{ marginTop: '1rem', borderTop: '1px solid #f0f0f0', paddingTop: '0.8rem' }}>
                            <div className="flex-center gap-2" style={{ fontSize: '0.8rem', color: '#666' }}>
                                <Heart size={16} /> {p.likes}
                            </div>
                            <div className="flex-center gap-2" style={{ fontSize: '0.8rem', color: '#666' }}>
                                <MessageSquare size={16} /> {p.comments}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
