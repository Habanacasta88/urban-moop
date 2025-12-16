import { MisMoopsScreen } from './Moops/MisMoopsScreen';
import BottomNavigation from './Navigation/BottomNavigation';

export const MoopsScreen = ({ onBack, activeTab, onTabChange, onRequestLogin, onNavigateToChat }) => {
    return (
        <div style={{ position: 'relative', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <MisMoopsScreen onBack={onBack} onNavigateToChat={onNavigateToChat} />
            </div>
            <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
        </div>
    );
};
