import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authApi } from '@api/auth.api.js';
import { setAccessToken, clearAccessToken } from '@api/apiClient.js';
import { profileApi } from '@api/profile.api.js';

const AuthContext = createContext(null);

const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_INITIALIZED: 'SET_INITIALIZED',
};

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.SET_INITIALIZED:
      return {
        ...state,
        isInitialized: true,
        isLoading: false,
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Swallow logout errors — clear state regardless
    } finally {
      clearAccessToken();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Attempt to get a new access token using the httpOnly refresh token cookie
        const refreshResponse = await authApi.refreshToken();
        const { accessToken } = refreshResponse.data;
        setAccessToken(accessToken);

        // Fetch the current user
        const meResponse = await authApi.getMe();
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: meResponse.data.user,
        });
      } catch {
        // Not authenticated — this is expected on first visit
        dispatch({ type: AUTH_ACTIONS.SET_INITIALIZED });
      }
    };

    initializeAuth();
  }, []);

  // Listen for forced logout events from the API client interceptor
  useEffect(() => {
    const handleForcedLogout = () => {
      clearAccessToken();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    };

    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await authApi.login(credentials);
      const { user, accessToken } = response.data;
      setAccessToken(accessToken);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
      return { success: true, user };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await authApi.register(userData);
      const { user, accessToken } = response.data;
      setAccessToken(accessToken);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
      return { success: true, user };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      throw error;
    }
  };

  const updateUserProfiles = async () => {
    try {
      const response = await profileApi.getProfiles();
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: {
          profiles: response.data.profiles,
          activeProfileId: response.data.activeProfileId,
        },
      });
    } catch (error) {
      console.error('Failed to refresh profiles:', error);
    }
  };

  const updateUser = (updates) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: updates });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    updateUserProfiles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
