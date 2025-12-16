export const MapOnboardingTooltip = ({ onComplete }) => {
    return (
        <div style={{
            position: 'absolute', bottom: '80px', left: '20px', right: '20px',
            background: '#01F9C6', color: 'black', padding: '16px', borderRadius: '12px', zIndex: 2000
        }}>
            <h4>¡Bienvenido!</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Explora el mapa para encontrar vibes.</p>
            <button onClick={onComplete} style={{ background: 'black', color: 'white', padding: '4px 12px', fontSize: '0.8rem' }}>Entendido</button>
        </div>
    );
};
