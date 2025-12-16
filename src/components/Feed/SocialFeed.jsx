import { useState } from 'react';
import { Heart, Star, Share2, Volume2, VolumeX } from 'lucide-react';
import './Feed.css';

const VideoCard = ({ plan }) => {
    const [muted, setMuted] = useState(true);
    const [liked, setLiked] = useState(false);

    // Mock video placeholder with gradient animation
    return (
        <div className="video-card">
            <div className="video-placeholder" style={{ background: plan.gradient }}>
                <div className="vibra-badge">{plan.vibe}</div>
            </div>

            <div className="interaction-sidebar">
                <button className="icon-btn" onClick={() => setMuted(!muted)}>
                    {muted ? <VolumeX /> : <Volume2 />}
                </button>

                <div className="action-group">
                    <button className="icon-btn-large" onClick={() => setLiked(!liked)}>
                        <Heart fill={liked ? 'red' : 'none'} color={liked ? 'red' : 'white'} />
                        <span className="action-label">Guardar</span>
                    </button>
                    <button className="icon-btn-large">
                        <Star color="white" />
                        <span className="action-label">Interesa</span>
                    </button>
                    <button className="icon-btn-large">
                        <Share2 color="white" />
                        <span className="action-label">Compartir</span>
                    </button>
                </div>
            </div>

            <div className="card-info">
                <h3>{plan.title}</h3>
                <p>{plan.location} · {plan.distance} · {plan.time}</p>
            </div>
        </div>
    );
};

const SocialFeed = () => {
    const plans = [
        { id: 1, title: 'Vermut en Bar Centre', location: 'Bar Centre', distance: '300m', time: '19:00', vibe: '🍕 Foodie', gradient: 'linear-gradient(45deg, #FF6B6B, #556270)' },
        { id: 2, title: 'Tarde de Ilustración', location: 'Estudio Niu', distance: '1.2km', time: '17:30', vibe: '🎨 Creativo', gradient: 'linear-gradient(45deg, #a8e063, #56ab2f)' },
        { id: 3, title: 'Afterwork Tech', location: 'Hub Central', distance: '500m', time: '20:00', vibe: '⚡ Energía', gradient: 'linear-gradient(45deg, #4568DC, #B06AB3)' },
    ];

    return (
        <div className="feed-container">
            {plans.map(plan => (
                <VideoCard key={plan.id} plan={plan} />
            ))}
        </div>
    );
};

export default SocialFeed;
