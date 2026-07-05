import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext.jsx';
import { useProfile } from '@contexts/ProfileContext.jsx';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const { isProfileSelected } = useProfile();

  if (!isInitialized) {
    return null;
  }

  if (isAuthenticated) {
    // Send authenticated users to browse if they have a profile selected,
    // otherwise to profile selection
    return <Navigate to={isProfileSelected ? '/browse' : '/profiles'} replace />;
  }

  return children;
};

export default PublicRoute;
