import { useState } from 'react';
import './Business.css';

const BusinessDashboard = ({ onBack }) => {
    const [isRegistered, setIsRegistered] = useState(false);

    if (!isRegistered) {
        return (
            <div className="sub-page">
                <h2 className="page-title">Registra tu local</h2>
                <form className="form-container" onSubmit={(e) => { e.preventDefault(); setIsRegistered(true) }}>
                    <div className="form-group">
                        <label>Nombre del negocio</label>
                        <input type="text" className="form-input" placeholder="Ej. Bar Luna" />
                    </div>
                    <div className="form-group">
                        <label>Tipo</label>
                        <select className="form-select">
                            <option>Bar</option>
                            <option>Café</option>
                            <option>Tienda</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary">Crear perfil</button>
                    <button type="button" className="btn-secondary" onClick={onBack}>Cancelar</button>
                </form>
            </div>
        );
    }

    return (
        <div className="sub-page">
            <div className="profile-header">
                <div className="avatar-large" style={{ borderColor: 'var(--color-secondary)' }}>
                    🏢
                </div>
                <div className="profile-info">
                    <h2>Bar Luna</h2>
                    <p>Nivel 1</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>128</h3>
                    <p>Vistas semana</p>
                </div>
                <div className="stat-card">
                    <h3>24</h3>
                    <p>Guardados</p>
                </div>
            </div>

            <div style={{ marginTop: '24px' }}>
                <button className="btn-primary" style={{ width: '100%' }}>Publicar plan del día</button>
            </div>

            <button className="btn-text" onClick={onBack} style={{ marginTop: '20px', color: 'white' }}>
                ← Volver a usuario
            </button>
        </div>
    );
};

export default BusinessDashboard;
