import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';
import LeaderboardPage from './pages/LeaderboardPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/index" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forget" element={<ForgotPasswordPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          {/* ========== PROTECTED ROUTES (require Firebase auth) ========== */}
          <Route path="/welcome" element={
            <ProtectedRoute><WelcomePage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/chatbot" element={
            <ProtectedRoute><ChatbotPage /></ProtectedRoute>
          } />
          <Route path="/profile-sitting" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute><LeaderboardPage /></ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute><CommunityPage /></ProtectedRoute>
          } />
          <Route path="/profile-sittingDashboard" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />


          {/* ========== LEGACY URL REDIRECTS ========== */}
          <Route path="/Q&A" element={<Navigate to="/dashboard" replace />} />
          <Route path="/reason" element={<Navigate to="/register" replace />} />
          <Route path="/reason1" element={<Navigate to="/register" replace />} />
          <Route path="/MoreOption" element={<Navigate to="/dashboard" replace />} />
          <Route path="/Controll" element={<Navigate to="/dashboard" replace />} />
          <Route path="/voice" element={<Navigate to="/chatbot" replace />} />
          <Route path="/team" element={<Navigate to="/about-us" replace />} />
          <Route path="/vision" element={<Navigate to="/about-us" replace />} />
          <Route path="/verify" element={<Navigate to="/login" replace />} />
          <Route path="/RepairWebsite" element={<Navigate to="/" replace />} />

          {/* ========== 404 CATCH-ALL ========== */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
