import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { RiArrowLeftLine } from 'react-icons/ri';

import { useAuth } from '@contexts/AuthContext.jsx';
import { useProfileActions } from '@features/profile/useProfileActions.js';
import AvatarIcon from '@components/ui/AvatarIcon.jsx';
import Spinner from '@components/ui/Spinner.jsx';
import ConfirmDialog from '@components/common/ConfirmDialog.jsx';

const MATURITY_OPTIONS = ['ALL', 'G', 'PG', 'PG-13', 'R', 'NC-17'];

const ProfileManagePage = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { user }   = useAuth();

  const editingProfileId = location.state?.profileId;
  const editingProfile   = editingProfileId
    ? user?.profiles?.find((p) => p._id === editingProfileId || p._id?.toString() === editingProfileId)
    : null;

  const isEditMode = !!editingProfile;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { createProfile, updateProfile, deleteProfile, isLoading } = useProfileActions();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name:           editingProfile?.name           || '',
      isKids:         editingProfile?.isKids         || false,
      maturityRating: editingProfile?.maturityRating || 'ALL',
    },
  });

  const watchedName = watch('name');

  const onSubmit = (data) => {
    if (isEditMode) {
      updateProfile(editingProfileId, data);
    } else {
      createProfile(data);
    }
  };

  const handleDelete = () => {
    deleteProfile(editingProfileId, editingProfile?.name);
    setShowDeleteDialog(false);
  };

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate('/profiles')}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wide">
            {isEditMode ? 'Edit Profile' : 'Create Profile'}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

          {/* Avatar preview */}
          <div className="flex flex-col items-center gap-4">
            <AvatarIcon
              name={watchedName || editingProfile?.name || 'New'}
              size="xl"
              className="ring-4 ring-brand-500"
            />
            <p className="text-white/40 text-sm">{watchedName || 'New Profile'}</p>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-white/60">Profile Name</label>
            <input
              type="text" placeholder="e.g. John, Kids, Work" autoFocus
              className={`input-field ${errors.name ? 'error' : ''}`}
              {...register('name', {
                required: 'Profile name is required',
                maxLength: { value: 30, message: 'Max 30 characters' },
              })}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Maturity rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/60">Maturity Rating</label>
            <div className="flex flex-wrap gap-2">
              {MATURITY_OPTIONS.map((rating) => (
                <label key={rating} className="cursor-pointer">
                  <input type="radio" value={rating} className="sr-only" {...register('maturityRating')} />
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border transition-all cursor-pointer ${
                    watch('maturityRating') === rating
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                  }`}>
                    {rating}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Kids toggle */}
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/[0.03] border border-white/5">
            <div>
              <p className="text-sm font-medium text-white">Kids Profile</p>
              <p className="text-xs text-white/40 mt-0.5">Restrict to age-appropriate content only</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register('isKids')} />
              <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit" disabled={isLoading}
              className="flex-1 btn-brand py-3.5 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner size="sm" />
                  {isEditMode ? 'Saving…' : 'Creating…'}
                </span>
              ) : isEditMode ? 'Save Changes' : 'Create Profile'}
            </button>
            <button
              type="button" onClick={() => navigate('/profiles')}
              className="px-5 py-3.5 rounded-md bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
          </div>

          {/* Delete */}
          {isEditMode && user?.profiles?.length > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
              >
                Delete This Profile
              </button>
            </motion.div>
          )}
        </form>
      </div>

      {/* ConfirmDialog — replaces window.confirm */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Profile?"
        message={`"${editingProfile?.name}" and all their watchlist, favorites, and history will be permanently removed.`}
        confirmLabel="Delete"
        cancelLabel="Keep Profile"
        variant="danger"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProfileManagePage;
