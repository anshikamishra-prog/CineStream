import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { profileApi } from '@api/profile.api.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated, updateUserProfiles } = useAuth();
  const [activeProfile, setActiveProfile] = useState(null);
  const [myList, setMyList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [isProfileSelected, setIsProfileSelected] = useState(false);
  const [isLoadingProfileData, setIsLoadingProfileData] = useState(false);

  // Derive active profile from user state
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setActiveProfile(null);
      setIsProfileSelected(false);
      setMyList([]);
      setFavorites([]);
      setContinueWatching([]);
      return;
    }

    if (user.activeProfileId && user.profiles?.length > 0) {
      const profile = user.profiles.find(
        (p) => p._id === user.activeProfileId || p._id?.toString() === user.activeProfileId?.toString()
      );
      if (profile) {
        setActiveProfile(profile);
        setIsProfileSelected(true);
      }
    }
  }, [user, isAuthenticated]);

  // Load profile-specific data when active profile is set
  useEffect(() => {
    if (!activeProfile?._id || !isAuthenticated) {
      return;
    }

    const loadProfileData = async () => {
      setIsLoadingProfileData(true);
      try {
        const [myListRes, favoritesRes, continueRes] = await Promise.allSettled([
          profileApi.getMyList(activeProfile._id),
          profileApi.getFavorites(activeProfile._id),
          profileApi.getContinueWatching(activeProfile._id),
        ]);

        if (myListRes.status === 'fulfilled') {
          setMyList(myListRes.value.data.myList || []);
        }
        if (favoritesRes.status === 'fulfilled') {
          setFavorites(favoritesRes.value.data.favorites || []);
        }
        if (continueRes.status === 'fulfilled') {
          setContinueWatching(continueRes.value.data.continueWatching || []);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoadingProfileData(false);
      }
    };

    loadProfileData();
  }, [activeProfile?._id, isAuthenticated]);

  const selectProfile = useCallback(async (profile) => {
    try {
      await profileApi.selectProfile(profile._id);
      setActiveProfile(profile);
      setIsProfileSelected(true);
      await updateUserProfiles();
    } catch (error) {
      console.error('Failed to select profile:', error);
      toast.error('Failed to switch profile');
    }
  }, [updateUserProfiles]);

  const isInMyList = useCallback(
    (mediaId, mediaType) =>
      myList.some(
        (item) => item.mediaId === Number(mediaId) && item.mediaType === mediaType
      ),
    [myList]
  );

  const isInFavorites = useCallback(
    (mediaId, mediaType) =>
      favorites.some(
        (item) => item.mediaId === Number(mediaId) && item.mediaType === mediaType
      ),
    [favorites]
  );

  const toggleMyList = useCallback(
    async (mediaId, mediaType) => {
      if (!activeProfile?._id) {
        return;
      }

      const inList = isInMyList(mediaId, mediaType);

      // Optimistic update
      if (inList) {
        setMyList((prev) =>
          prev.filter(
            (item) => !(item.mediaId === Number(mediaId) && item.mediaType === mediaType)
          )
        );
        try {
          await profileApi.removeFromMyList(activeProfile._id, mediaId, mediaType);
          toast.success('Removed from My List');
        } catch {
          // Revert optimistic update on error
          setMyList((prev) => [
            ...prev,
            { mediaId: Number(mediaId), mediaType, addedAt: new Date() },
          ]);
          toast.error('Failed to remove from My List');
        }
      } else {
        setMyList((prev) => [
          { mediaId: Number(mediaId), mediaType, addedAt: new Date() },
          ...prev,
        ]);
        try {
          await profileApi.addToMyList(activeProfile._id, { mediaId, mediaType });
          toast.success('Added to My List');
        } catch {
          setMyList((prev) =>
            prev.filter(
              (item) => !(item.mediaId === Number(mediaId) && item.mediaType === mediaType)
            )
          );
          toast.error('Failed to add to My List');
        }
      }
    },
    [activeProfile, isInMyList]
  );

  const toggleFavorite = useCallback(
    async (mediaId, mediaType) => {
      if (!activeProfile?._id) {
        return;
      }

      const inFavorites = isInFavorites(mediaId, mediaType);

      if (inFavorites) {
        setFavorites((prev) =>
          prev.filter(
            (item) => !(item.mediaId === Number(mediaId) && item.mediaType === mediaType)
          )
        );
        try {
          await profileApi.removeFromFavorites(activeProfile._id, mediaId, mediaType);
          toast.success('Removed from Favorites');
        } catch {
          setFavorites((prev) => [
            ...prev,
            { mediaId: Number(mediaId), mediaType, addedAt: new Date() },
          ]);
          toast.error('Failed to remove from Favorites');
        }
      } else {
        setFavorites((prev) => [
          { mediaId: Number(mediaId), mediaType, addedAt: new Date() },
          ...prev,
        ]);
        try {
          await profileApi.addToFavorites(activeProfile._id, { mediaId, mediaType });
          toast.success('Added to Favorites');
        } catch {
          setFavorites((prev) =>
            prev.filter(
              (item) => !(item.mediaId === Number(mediaId) && item.mediaType === mediaType)
            )
          );
          toast.error('Failed to add to Favorites');
        }
      }
    },
    [activeProfile, isInFavorites]
  );

  const updateWatchProgress = useCallback(
    async (mediaId, mediaType, data) => {
      if (!activeProfile?._id) {
        return;
      }
      try {
        await profileApi.addToWatchHistory(activeProfile._id, {
          mediaId,
          mediaType,
          ...data,
        });

        // Refresh continue watching list
        const response = await profileApi.getContinueWatching(activeProfile._id);
        setContinueWatching(response.data.continueWatching || []);
      } catch (error) {
        console.error('Failed to update watch progress:', error);
      }
    },
    [activeProfile]
  );

  const value = {
    activeProfile,
    myList,
    favorites,
    continueWatching,
    isProfileSelected,
    isLoadingProfileData,
    selectProfile,
    isInMyList,
    isInFavorites,
    toggleMyList,
    toggleFavorite,
    updateWatchProgress,
    setMyList,
    setFavorites,
    setContinueWatching,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
