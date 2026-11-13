import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

// Layouts
import AppLayout from './components/layout/AppLayout.jsx';
import AuthLayout from './components/layout/AuthLayout.jsx';

// Public Pages
import LandingPage from './pages/public/LandingPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import PrivacyPage from './pages/public/PrivacyPage.jsx';
import TermsPage from './pages/public/TermsPage.jsx';

// Auth Pages
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';

// Protected App Pages
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import FarmsPage from './pages/farms/FarmsPage.jsx';
import AddFarmPage from './pages/farms/AddFarmPage.jsx';
import FarmDetailsPage from './pages/farms/FarmDetailsPage.jsx';
import CropRecommendationPage from './pages/advisories/CropRecommendationPage.jsx';
import SoilAnalysisPage from './pages/advisories/SoilAnalysisPage.jsx';
import DiseaseDetectionPage from './pages/advisories/DiseaseDetectionPage.jsx';
import FertilizerAdvisorPage from './pages/advisories/FertilizerAdvisorPage.jsx';
import WeatherPage from './pages/advisories/WeatherPage.jsx';
import CultivationPlansPage from './pages/cultivation/CultivationPlansPage.jsx';
import CreatePlanPage from './pages/cultivation/CreatePlanPage.jsx';
import PlanDetailPage from './pages/cultivation/PlanDetailPage.jsx';
import AiAssistantPage from './pages/chat/AiAssistantPage.jsx';
import HistoryPage from './pages/history/HistoryPage.jsx';
import NotificationsPage from './pages/notifications/NotificationsPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';

// Route Guard Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Authenticating session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Static Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Authenticated Dashboard & Advisory Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Farm Management */}
        <Route path="/farms" element={<FarmsPage />} />
        <Route path="/farms/new" element={<AddFarmPage />} />
        <Route path="/farms/:farmId" element={<FarmDetailsPage />} />

        {/* Core AI Advisories */}
        <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
        <Route path="/soil-analysis" element={<SoilAnalysisPage />} />
        <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
        <Route path="/fertilizer-advisor" element={<FertilizerAdvisorPage />} />
        <Route path="/weather" element={<WeatherPage />} />

        {/* Cultivation Planning */}
        <Route path="/cultivation-plans" element={<CultivationPlansPage />} />
        <Route path="/cultivation-plans/new" element={<CreatePlanPage />} />
        <Route path="/cultivation-plans/:id" element={<PlanDetailPage />} />

        {/* Multilingual AI Chatbot */}
        <Route path="/ai-assistant" element={<AiAssistantPage />} />

        {/* Audit, History & Notifications */}
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Administration */}
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

