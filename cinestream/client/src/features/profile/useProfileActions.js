import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { profileApi } from '@api/profile.api.js';
import { useAuth } from '@contexts/AuthContext.jsx';
import { getErrorMessage } from '@utils/errorUtils.js';

/**
 * Encapsulates profile CRUD actions with loading state management.
 */
export const useProfileActions = () => {
  const { updateUserProfiles } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const createProfile = async (data) => {
    setIsLoading(true);
    try {
      await profileApi.createProfile(data);
      await updateUserProfiles();
      toast.success('Profile created');
      navigate('/profiles');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileId, data) => {
    setIsLoading(true);
    try {
      await profileApi.updateProfile(profileId, data);
      await updateUserProfiles();
      toast.success('Profile updated');
      navigate('/profiles');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProfile = async (profileId, profileName) => {
    const confirmed = window.confirm(
      `Delete "${profileName}"? This will permanently remove their watchlist and history.`
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await profileApi.deleteProfile(profileId);
      await updateUserProfiles();
      toast.success('Profile deleted');
      navigate('/profiles');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return { createProfile, updateProfile, deleteProfile, isLoading };
};
