import { useState } from 'react';

const CreateMoop = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        vibe: '',
        time: '18:00',
        description: ''
    });

    const vibes = ['😌', '⚡', '🍕', '👥', '🎨'];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to save Moop
        console.log("Moop Created", formData);
        onCancel(); // Return to list
    };

    return (
        <div className="sub-page">
            <h2 className="page-title">Crear un Moop</h2>

            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Título</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ej. Café creativo"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Vibe</label>
                    <div className="vibe-selector-mini">
                        {vibes.map(v => (
                            <div
                                key={v}
                                className={`vibe-chip ${formData.vibe === v ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, vibe: v })}
                            >
                                {v}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Hora</label>
                    <input
                        type="time"
                        className="form-input"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                        className="form-textarea"
                        placeholder="¿Cuál es el plan?"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <div className="btn-group">
                    <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                        Publicar Moop
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateMoop;
