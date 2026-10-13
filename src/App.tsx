// src/App.tsx
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { MainLayout } from './layouts/MainLayout';
import { LoadingState } from './components/ui/LoadingState';
import { LevelUpModal } from './components/ui/LevelUpModal';
import { AchievementUnlockModal } from './components/ui/AchievementUnlockModal';
import { AssistantWidget } from './components/AssistantWidget';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const QuestsPage = lazy(() => import('./pages/QuestsPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const RemindersPage = lazy(() => import('./pages/RemindersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const CaregiverPage = lazy(() => import('./pages/CaregiverPage'));
const MemoryMatchGame = lazy(() => import('./games/MemoryMatch'));
const SequenceRecallGame = lazy(() => import('./games/SequenceRecall'));
const WordRecallGame = lazy(() => import('./games/WordRecall'));
const PatternPulseGame = lazy(() => import('./games/PatternPulse'));
const NumberEchoGame = lazy(() => import('./games/NumberEcho'));
const OddOneOutGame = lazy(() => import('./games/OddOneOut'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function CaregiverRoute({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'caregiver') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  const { user, pendingLevelUp, pendingAchievements, dismissLevelUp, dismissAchievements } = useApp();

  return (
    <>
      <Suspense fallback={<LoadingState />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected app routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="games" element={<GamesPage />} />
            <Route path="quests" element={<QuestsPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Game routes */}
          <Route path="/games/memory-match" element={<ProtectedRoute><MemoryMatchGame /></ProtectedRoute>} />
          <Route path="/games/sequence-recall" element={<ProtectedRoute><SequenceRecallGame /></ProtectedRoute>} />
          <Route path="/games/word-recall" element={<ProtectedRoute><WordRecallGame /></ProtectedRoute>} />
          <Route path="/games/pattern-pulse" element={<ProtectedRoute><PatternPulseGame /></ProtectedRoute>} />
          <Route path="/games/number-echo" element={<ProtectedRoute><NumberEchoGame /></ProtectedRoute>} />
          <Route path="/games/odd-one-out" element={<ProtectedRoute><OddOneOutGame /></ProtectedRoute>} />

          {/* Caregiver routes */}
          <Route path="/caregiver" element={
            <CaregiverRoute>
              <MainLayout caregiverMode />
            </CaregiverRoute>
          }>
            <Route index element={<CaregiverPage />} />
          </Route>

          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
        </Routes>
      </Suspense>

      {pendingLevelUp !== null && (
        <LevelUpModal level={pendingLevelUp} onClose={dismissLevelUp} />
      )}
      {pendingAchievements.length > 0 && (
        <AchievementUnlockModal achievements={pendingAchievements} onClose={dismissAchievements} />
      )}
      {user && <AssistantWidget />}
    </>
  );
}
