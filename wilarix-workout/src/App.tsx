import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import WorkoutSession from './pages/WorkoutSession';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Benefits from './pages/Benefits';
import Contact from './pages/Contact';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/session/:sessionId" element={<RequireAuth><WorkoutSession /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkoutProvider>
          <AppRoutes />
        </WorkoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
