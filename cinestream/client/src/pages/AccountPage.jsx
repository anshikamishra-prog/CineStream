import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  RiUser3Line, RiLockLine, RiShieldLine, RiLogoutBoxRLine,
  RiEyeLine, RiEyeOffLine, RiCheckLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';

import { useAuth } from '@contexts/AuthContext.jsx';
import { authApi } from '@api/auth.api.js';
import { getErrorMessage } from '@utils/errorUtils.js';
import AvatarIcon from '@components/ui/AvatarIcon.jsx';
import Spinner from '@components/ui/Spinner.jsx';

const Section = ({ icon: Icon, title, children }) => (
  <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
      <Icon size={18} className="text-brand-500" />
      <h2 className="font-display text-lg font-bold text-white uppercase tracking-wide">{title}</h2>
    </div>
    <div className="px-6 py-5">{children}</div>
  </div>
);

const AccountPage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const nameForm = useForm({ defaultValues: { name: user?.name || '' } });
  const pwForm = useForm();

  const handleNameUpdate = async (data) => {
    try {
      // In a real app, this would call a user update API
      updateUser({ name: data.name });
      toast.success('Name updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed. Please sign in again.');
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide mb-2">
            Account
          </h1>
          <p className="text-white/40 text-sm">Manage your account settings and preferences</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-5"
        >
          {/* Profile Overview */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <Section icon={RiUser3Line} title="Account Info">
              <div className="flex items-center gap-5 mb-6">
                <AvatarIcon name={user?.name || ''} size="lg" />
                <div>
                  <p className="font-semibold text-white text-lg">{user?.name}</p>
                  <p className="text-white/40 text-sm">{user?.email}</p>
                  <span className="inline-flex items-center gap-1.5 mt-1 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {user?.subscription?.plan === 'premium' ? 'Premium Member' : 'Free Account'}
                  </span>
                </div>
              </div>

              {/* Name update */}
              <form onSubmit={nameForm.handleSubmit(handleNameUpdate)} className="space-y-3">
                <label className="block text-sm font-medium text-white/60">Display Name</label>
                <div className="flex gap-3">
                  <input
                    className="input-field flex-1"
                    {...nameForm.register('name', {
                      required: true,
                      minLength: 2,
                      maxLength: 50,
                    })}
                  />
                  <button
                    type="submit"
                    disabled={nameForm.formState.isSubmitting || !nameForm.formState.isDirty}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-40 flex items-center gap-2"
                  >
                    {nameForm.formState.isSubmitting ? <Spinner size="sm" /> : <RiCheckLine size={16} />}
                    Save
                  </button>
                </div>
              </form>
            </Section>
          </motion.div>

          {/* Profiles */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <Section icon={RiUser3Line} title="Profiles">
              <div className="space-y-2 mb-4">
                {user?.profiles?.map((profile) => (
                  <div key={profile._id} className="flex items-center gap-3 py-2">
                    <AvatarIcon name={profile.name} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{profile.name}</p>
                      {profile.isKids && (
                        <span className="text-xs text-green-400">Kids Profile</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/profiles/manage')}
                className="btn-secondary text-sm py-2.5 px-5"
              >
                Manage Profiles
              </button>
            </Section>
          </motion.div>

          {/* Security */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <Section icon={RiLockLine} title="Change Password">
              <form onSubmit={pwForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/60">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`input-field pr-12 ${pwForm.formState.errors.currentPassword ? 'error' : ''}`}
                      {...pwForm.register('currentPassword', { required: 'Required' })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                    >
                      {showCurrentPw ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-white/60">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      className={`input-field pr-12 ${pwForm.formState.errors.newPassword ? 'error' : ''}`}
                      {...pwForm.register('newPassword', {
                        required: 'Required',
                        minLength: { value: 8, message: 'Min. 8 characters' },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Must contain upper, lower, and a number',
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                    >
                      {showNewPw ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                    </button>
                  </div>
                  {pwForm.formState.errors.newPassword && (
                    <p className="text-xs text-red-400">{pwForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={pwForm.formState.isSubmitting}
                  className="btn-brand text-sm py-2.5 px-6 disabled:opacity-60"
                >
                  {pwForm.formState.isSubmitting ? (
                    <span className="flex items-center gap-2"><Spinner size="sm" /> Updating...</span>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </Section>
          </motion.div>

          {/* Sign Out */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
            <div className="rounded-xl border border-red-500/10 bg-red-500/[0.03] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">Sign Out</h3>
                  <p className="text-sm text-white/40">Sign out from all devices and sessions.</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-400 border border-red-500/30 rounded-md hover:bg-red-500/10 transition-colors"
                >
                  <RiLogoutBoxRLine size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountPage;
