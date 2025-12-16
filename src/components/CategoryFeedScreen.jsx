import BottomNavigation from './Navigation/BottomNavigation';
import { ArrowLeft } from 'lucide-react';

export const CategoryFeedScreen = ({ onBack, activeTab, onTabChange, category }) => {
    return (
        <div style={{ position: 'relative', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <div className='sub-page'>
                <button onClick={onBack} style={{ background: 'transparent', color: 'white', marginBottom: '20px' }}>
                    <ArrowLeft /> Volver
                </button>
                <h2>Categoría: {category}</h2>
                <p>Feed filtrado por categoría.</p>
            </div>
            <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
        </div>
    );
};
