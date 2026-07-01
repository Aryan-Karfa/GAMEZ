import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// Lazy load all page routes
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage.jsx'));
const LibraryPage = lazy(() => import('../pages/Library/LibraryPage.jsx'));
const SearchPage = lazy(() => import('../pages/Search/SearchPage.jsx'));
const GameDetailsPage = lazy(() => import('../pages/GameDetails/GameDetailsPage.jsx'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage.jsx'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage.jsx'));
const LoginPage = lazy(() => import('../pages/Login/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/Register/RegisterPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage.jsx'));

function TerminalLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-xl font-mono text-accent animate-pulse">
      <div className="text-lg font-bold uppercase tracking-widest">BOOTING MODULE...</div>
      <div className="text-xs text-muted-text mt-xs">CONNECTING MEMORY ADDRESS [0x3B9F]</div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<TerminalLoader />}>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Main App Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/games/:rawgId" element={<GameDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Custom 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
