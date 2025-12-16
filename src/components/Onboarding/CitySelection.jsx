import { useState } from 'react';
import { MapPin, Check } from 'lucide-react';

const CitySelection = ({ onNext, data, onChange }) => {
    const cities = ['Sabadell', 'Barcelona', 'Terrassa', 'Otra...'];
    const [selected, setSelected] = useState(data.city || 'Sabadell');

    const handleSelect = (city) => {
        setSelected(city);
        onChange({ city });
    };

    return (
        <div className="onboarding-step fade-in">
            <h2 className="step-title">¿Dónde vives?</h2>
            <div className="selection-list">
                {cities.map(city => (
                    <div
                        key={city}
                        className={`selection-item ${selected === city ? 'active' : ''}`}
                        onClick={() => handleSelect(city)}
                    >
                        <span className="item-label">{city}</span>
                        {selected === city && <Check size={20} color="var(--color-primary)" />}
                    </div>
                ))}
            </div>

            <button className="btn-primary" onClick={onNext}>
                Continuar
            </button>
        </div>
    );
};

export default CitySelection;
