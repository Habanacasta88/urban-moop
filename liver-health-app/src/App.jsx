import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import useStore from './store/useStore';
import Welcome from './pages/Welcome';
import OnboardingWizard from './pages/Onboarding/OnboardingWizard';

// Placeholder Pages - We will replace these one by one
const Today = () => <div className="p-8"><h1 className="text-2xl font-bold">Resumen de Hoy</h1></div>;
const Plan = () => <div className="p-8"><h1 className="text-2xl font-bold">Tu Plan</h1></div>;
const Eat = () => <div className="p-8"><h1 className="text-2xl font-bold">Comidas</h1></div>;
const Progress = () => <div className="p-8"><h1 className="text-2xl font-bold">Progreso</h1></div>;
const Help = () => <div className="p-8"><h1 className="text-2xl font-bold">Ayuda</h1></div>;

function ProtectedRoute({ children }) {
  const onboardingCompleted = useStore((state) => state.onboardingCompleted);
  if (!onboardingCompleted) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />
        </Route>

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<Today />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/eat" element={<Eat />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
