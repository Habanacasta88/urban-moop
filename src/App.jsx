
import { useState, useEffect } from 'react'; // Added useEffect
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginModal } from './components/LoginModal';
import { MapScreen } from './components/MapScreenImproved';
import { EventDetailScreen } from './components/EventDetailScreen';
import { MyListScreen } from './components/MyListScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { FeedScreen } from './components/FeedScreen';
import { SavedScreen } from './components/SavedScreen';
import { MoopsScreen } from './components/MoopsScreen';
import { CategoryFeedScreen } from './components/CategoryFeedScreen';
import { MapOnboardingTooltip } from './components/MapOnboardingTooltip';
import { ActivityProvider } from './context/ActivityContext';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import Auth
import ConversationsList from './components/Chat/ConversationsList';
import ChatWindow from './components/Chat/ChatWindow';
import { VibeProvider } from './context/VibeContext';
// Global Components
import { CreateMoopRadialMenu } from './components/Map/CreateMoopRadialMenu';
import { CreateMoopWizard } from './components/Moops/CreateMoopWizard';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <VibeProvider>
          <MainApp />
        </VibeProvider>
      </ActivityProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { user, loading: authLoading } = useAuth(); // Use Real Auth
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [selectedEventId, setSelectedEventId] = useState(1);
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Chat State
  const [conversationId, setConversationId] = useState(null);

  // Login State
  // const [userStatus, setUserStatus] = useState(null); // Removed mock state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTrigger, setLoginTrigger] = useState('');
  const [showMapTooltip, setShowMapTooltip] = useState(false);
  const [guestMode, setGuestMode] = useState(false); // New explicit guest mode state

  const handleNavigateToChats = () => {
    setCurrentScreen('chats');
  };

  const handleSelectConversation = (id) => {
    setConversationId(id);
    setCurrentScreen('chatWindow');
  };

  const handleBackToChats = () => {
    setCurrentScreen('chats');
  };

  // Effect to sync Auth with Screens
  useEffect(() => {
    if (user) {
      // If user just logged in and was on onboarding, go to home
      if (currentScreen === 'onboarding') {
        setCurrentScreen('home');
        setActiveTab('map');
      }
    }
  }, [user, currentScreen]);

  const handleGetStarted = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = (userData) => {
    console.log('Onboarding completed with data:', userData);
    setGuestMode(true);
    setCurrentScreen('home');
    setActiveTab('map');
    setShowMapTooltip(true);
  };

  const requestLogin = (trigger) => {
    if (user) return true; // Real user check

    setLoginTrigger(trigger);
    setLoginModalOpen(true);
    return false;
  };

  const handleLoginSuccess = () => {
    // AuthContext handles the user state update automatically via Supabase listener
    setLoginModalOpen(false);
  };

  const handleGuestContinue = () => {
    setGuestMode(true);
    setLoginModalOpen(false);
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    setCurrentScreen('eventDetail');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleSaveEvent = () => {
    // Verificar si necesita login
    if (!requestLogin('save')) {
      return; // Si no está logueado, muestra el modal
    }

    // Si está logueado, guardar el evento
    console.log('Event saved');
    // Could show a toast here
  };

  // Global Creation State
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardCategory, setWizardCategory] = useState(null);

  // Handle Radial Selection (Global)
  const handleRadialSelect = (categoryId) => {
    setIsRadialMenuOpen(false);
    setWizardCategory(categoryId);
    setIsWizardOpen(true);
  };

  const handleTabChange = (tab) => {
    if (tab === 'publish') {
      setIsRadialMenuOpen(true);
      return;
    }

    setActiveTab(tab);

    switch (tab) {
      case 'map':
        setCurrentScreen('home');
        break;
      case 'feed':
        setCurrentScreen('feed');
        break;
      case 'saved':
        setCurrentScreen('saved');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  const handleNavigateToMyList = () => {
    setCurrentScreen('myList');
  };

  const handleNavigateToMoops = () => {
    setCurrentScreen('moops');
  };

  const handleNavigateToCategoryFeed = (category) => {
    setSelectedCategory(category);
    setCurrentScreen('categoryFeed');
  };

  const handleBackToFeed = () => {
    setCurrentScreen('feed');
  };

  // ... (rest of methods)

  return (
    <>
      {/* GLOBAL OVERLAYS */}
      {/* Radial Menu (Z-Index 5000) */}
      <CreateMoopRadialMenu
        isOpen={isRadialMenuOpen}
        onClose={() => setIsRadialMenuOpen(false)}
        onSelect={handleRadialSelect}
      />

      {/* Create Wizard (Z-Index 6000) */}
      <AnimatePresence>
        {isWizardOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[6000] bg-gray-50 flex flex-col"
          >
            <CreateMoopWizard
              onClose={() => setIsWizardOpen(false)}
              initialCategory={wizardCategory}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        trigger={loginTrigger}
      />

      {/* SCREENS */}
      {currentScreen === 'onboarding' && <OnboardingScreen onComplete={handleOnboardingComplete} />}

      {currentScreen === 'home' && (
        <MapScreen
          onEventClick={handleEventClick}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNavigateToMyList={handleNavigateToMyList}
          onNavigateToMoops={handleNavigateToMoops}
        />
      )}

      {currentScreen === 'eventDetail' && (
        <EventDetailScreen
          eventId={selectedEventId}
          onBack={handleBackToHome}
          onSave={handleSaveEvent}
        />
      )}

      {currentScreen === 'myList' && (
        <MyListScreen
          onBack={handleBackToHome}
          onEventClick={handleEventClick}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onViewKarma={() => console.log('View karma clicked')}
          onRequestLogin={() => requestLogin('profile')}
          onOpenChats={handleNavigateToChats}
        />
      )}

      {currentScreen === 'chats' && (
        <ConversationsList
          onBack={() => setCurrentScreen('profile')}
          onSelectConversation={handleSelectConversation}
        />
      )}

      {currentScreen === 'chatWindow' && (
        <ChatWindow
          conversationId={conversationId}
          onBack={handleBackToChats}
        />
      )}

      {currentScreen === 'feed' && (
        <FeedScreen
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNavigateToMap={() => handleTabChange('map')}
          onNavigateToCategory={handleNavigateToCategoryFeed}
          onNavigateToChat={handleSelectConversation}
        />
      )}

      {currentScreen === 'saved' && (
        <SavedScreen
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onItemClick={handleEventClick}
          onRequestLogin={() => requestLogin('save')}
        />
      )}

      {currentScreen === 'moops' && (
        <MoopsScreen
          onBack={handleBackToHome}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onRequestLogin={() => requestLogin('moops')}
          onNavigateToChat={handleSelectConversation}
        />
      )}

      {currentScreen === 'categoryFeed' && (
        <CategoryFeedScreen
          onBack={handleBackToFeed}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          category={selectedCategory}
        />
      )}
    </>
  );
}
