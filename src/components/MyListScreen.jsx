import BottomNavigation from './Navigation/BottomNavigation';
import { ArrowLeft } from 'lucide-react';

export const MyListScreen = ({ onBack, onEventClick, activeTab, onTabChange }) => {
    return (
        <div style={{ position: 'relative', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <div className='sub-page'>
                <button onClick={onBack} style={{ background: 'transparent', color: 'white', marginBottom: '20px' }}>
                    <ArrowLeft /> Volver
                </button>
                <h2>Mi Lista</h2>
                <p>Tus planes guardados aparecerán aquí.</p>
            </div>
            <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
        </div>
    );
};
