import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from '@contexts/AuthContext.jsx';
import ProtectedRoute from '@routes/ProtectedRoute.jsx';
import PublicRoute from '@routes/PublicRoute.jsx';
import MainLayout from '@components/layout/MainLayout.jsx';
import AuthLayout from '@components/layout/AuthLayout.jsx';
import PageLoader from '@components/ui/PageLoader.jsx';
import ScrollToTop from '@components/common/ScrollToTop.jsx';
import BackToTop from '@components/common/BackToTop.jsx';
import ErrorBoundary, { SectionErrorBoundary } from '@components/common/ErrorBoundary.jsx';

// ─── Lazy-loaded Pages ────────────────────────────────────────────────────────
const LandingPage        = lazy(() => import('@pages/LandingPage.jsx'));
const LoginPage          = lazy(() => import('@pages/LoginPage.jsx'));
const RegisterPage       = lazy(() => import('@pages/RegisterPage.jsx'));
const ProfileSelectPage  = lazy(() => import('@pages/ProfileSelectPage.jsx'));
const BrowsePage         = lazy(() => import('@pages/BrowsePage.jsx'));
const MoviesPage         = lazy(() => import('@pages/MoviesPage.jsx'));
const TVShowsPage        = lazy(() => import('@pages/TVShowsPage.jsx'));
const SearchPage         = lazy(() => import('@pages/SearchPage.jsx'));
const MediaDetailPage    = lazy(() => import('@pages/MediaDetailPage.jsx'));
const MyListPage         = lazy(() => import('@pages/MyListPage.jsx'));
const FavoritesPage      = lazy(() => import('@pages/FavoritesPage.jsx'));
const WatchHistoryPage   = lazy(() => import('@pages/WatchHistoryPage.jsx'));
const AccountPage        = lazy(() => import('@pages/AccountPage.jsx'));
const ProfileManagePage  = lazy(() => import('@pages/ProfileManagePage.jsx'));
const NotFoundPage       = lazy(() => import('@pages/NotFoundPage.jsx'));
const PlayerPage         = lazy(() => import('@pages/PlayerPage.jsx'));

const App = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public landing ── */}
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />

          {/* ── Auth pages ── */}
          <Route element={<AuthLayout />}>
            <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          </Route>

          {/* ── Profile selection (auth required, no active profile needed) ── */}
          <Route
            path="/profiles"
            element={<ProtectedRoute><ProfileSelectPage /></ProtectedRoute>}
          />
          <Route
            path="/profiles/manage"
            element={<ProtectedRoute><ProfileManagePage /></ProtectedRoute>}
          />

          {/* ── Player (full-screen, no chrome) ── */}
          <Route
            path="/watch/:type/:id"
            element={
              <ProtectedRoute requireProfile>
                <SectionErrorBoundary>
                  <PlayerPage />
                </SectionErrorBoundary>
              </ProtectedRoute>
            }
          />

          {/* ── Main app with Navbar / Footer ── */}
          <Route
            element={
              <ProtectedRoute requireProfile>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/browse"           element={<BrowsePage />} />
            <Route path="/movies"           element={<MoviesPage />} />
            <Route path="/tv"               element={<TVShowsPage />} />
            <Route path="/search"           element={<SearchPage />} />
            <Route path="/media/:type/:id"  element={<MediaDetailPage />} />
            <Route path="/my-list"          element={<MyListPage />} />
            <Route path="/favorites"        element={<FavoritesPage />} />
            <Route path="/history"          element={<WatchHistoryPage />} />
            <Route path="/account"          element={<AccountPage />} />
          </Route>

          {/* ── Redirects ── */}
          <Route path="/home" element={<Navigate to="/browse" replace />} />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      {/* Global floating UI */}
      <BackToTop />
    </ErrorBoundary>
  );
};

export default App;
