import UserProfile from './Profile/UserProfile';
import BottomNavigation from './Navigation/BottomNavigation';

export const ProfileScreen = ({ activeTab, onTabChange, onViewKarma, userStatus, onRequestLogin, onOpenChats }) => {
    return (
        <div style={{ position: 'relative', height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <UserProfile onRequestLogin={onRequestLogin} onOpenChats={onOpenChats} />
            </div>
            <BottomNavigation currentView={activeTab} onNavigate={onTabChange} />
        </div>
    );
};
