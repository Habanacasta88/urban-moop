import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { DataProvider } from './context/DataContext';
import { FlareProvider } from './context/FlareContext';
import BottomNav from './components/common/BottomNav';

// Pages
import OnboardingStack from './components/onboarding/OnboardingStack';
import Home from './pages/Home';
import FlareCoach from './pages/FlareCoach';
import Map from './pages/Map';
import Insights from './pages/Insights';
import Community from './pages/Community';
import PartnerMode from './pages/PartnerMode';


function MainLayout() {
  return (
    <>
      <main style={{ paddingBottom: '90px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/flare" element={<FlareCoach />} />


          <Route path="/map" element={<Map />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/community" element={<Community />} />
          <Route path="/partner" element={<PartnerMode />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  );
}

function AppContent() {
  const { profile } = useUser();

  if (!profile.onboardingComplete) {
    return <OnboardingStack />;
  }

  return <MainLayout />;
}

function App() {
  return (
    <UserProvider>
      <DataProvider>
        <FlareProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </FlareProvider>
      </DataProvider>
    </UserProvider>
  );
}

export default App;
