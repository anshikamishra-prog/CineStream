import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext.jsx';
import { useProfile } from '@contexts/ProfileContext.jsx';
import PageLoader from '@components/ui/PageLoader.jsx';

const ProtectedRoute = ({ children, requireProfile = false }) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const { isProfileSelected } = useProfile();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to profile selection if a profile is required but none is active
  if (requireProfile && !isProfileSelected) {
    return <Navigate to="/profiles" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
