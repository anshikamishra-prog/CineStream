import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@contexts/AuthContext.jsx';
import { getErrorMessage } from '@utils/errorUtils.js';

/**
 * Shared logic for login and registration forms.
 * Handles submission, error extraction, and post-auth navigation.
 */
export const useLoginForm = () => {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from?.pathname || '/profiles';
  const [apiError, setApiError] = useState(null);

  const handleLogin = async (data, { setError }) => {
    setApiError(null);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      const message = getErrorMessage(error);
      if (error?.response?.status === 401) {
        setError('email',    { message: 'Invalid email or password' });
        setError('password', { message: 'Invalid email or password' });
      } else {
        setApiError(message);
        toast.error(message);
      }
    }
  };

  return { handleLogin, apiError };
};

export const useRegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);

  const handleRegister = async (data) => {
    setApiError(null);
    try {
      await registerUser(data);
      toast.success('Account created! Welcome to CineStream.');
      navigate('/profiles', { replace: true });
    } catch (error) {
      const message = getErrorMessage(error);
      setApiError(message);
      toast.error(message);
    }
  };

  return { handleRegister, apiError };
};
