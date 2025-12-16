import { useState, useEffect } from 'react';
import './BottomSheet.css';

const BottomSheet = ({ zone, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (zone) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [zone]);

    if (!zone) return null;

    return (
        <div className={`bottom-sheet ${isOpen ? 'open' : ''}`}>
            <div className="sheet-handle" onClick={onClose} />

            <div className="sheet-header">
                <h2 style={{ color: zone.color }}>{zone.name}</h2>
                <p className="sheet-subtitle">19:45h – Vibra suave</p>
            </div>

            <div className="sheet-content">
                <section className="sheet-section">
                    <h3>Moops activos (3)</h3>
                    <div className="moop-card-mini">
                        <div className="moop-info">
                            <h4>🍻 Afterwork suave</h4>
                            <p>6 personas · Bar Luna</p>
                        </div>
                        <button className="btn-small">Ver más</button>
                    </div>
                </section>

                <section className="sheet-section">
                    <h3>Promos del día (2)</h3>
                    <div className="promo-card-mini">
                        <h4>2x1 cervezas – Hasta 23h</h4>
                        <p>Bar Luna</p>
                    </div>
                </section>

                <div className="sheet-footer">
                    <button className="btn-explore" style={{ background: zone.color, color: 'black' }}>
                        Explorar esta zona →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BottomSheet;
