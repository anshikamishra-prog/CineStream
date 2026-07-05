import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';

import { useAuth } from '@contexts/AuthContext.jsx';
import { useProfile } from '@contexts/ProfileContext.jsx';
import Logo from '@components/ui/Logo.jsx';
import AvatarIcon from '@components/ui/AvatarIcon.jsx';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const ProfileSelectPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { selectProfile } = useProfile();
  const navigate = useNavigate();

  const profiles = user?.profiles || [];

  const handleSelectProfile = async (profile) => {
    if (isEditing) {
      navigate('/profiles/manage', { state: { profileId: profile._id } });
      return;
    }
    await selectProfile(profile);
    navigate('/browse', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <Logo size="lg" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide mb-3">
          {isEditing ? 'Manage Profiles' : "Who's Watching?"}
        </h1>
        <p className="text-white/40 text-sm">
          {isEditing ? 'Select a profile to edit' : 'Select your profile to continue'}
        </p>
      </motion.div>

      {/* Profiles Grid */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-center justify-center gap-6 mb-12 max-w-2xl"
      >
        {profiles.map((profile) => (
          <motion.button
            key={profile._id}
            variants={fadeUp}
            onClick={() => handleSelectProfile(profile)}
            className="group flex flex-col items-center gap-3 focus:outline-none"
          >
            <div className="relative">
              <AvatarIcon
                avatar={profile.avatar}
                name={profile.name}
                size="xl"
                className={`transition-all duration-200 ${
                  isEditing
                    ? 'group-hover:opacity-60'
                    : 'group-hover:ring-4 group-hover:ring-white'
                }`}
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <RiPencilLine size={24} className="text-white drop-shadow-lg" />
                </div>
              )}
              {profile.isKids && (
                <span className="absolute -bottom-1 -right-1 text-[9px] bg-green-500 text-white rounded px-1 py-0.5 font-bold uppercase">
                  Kids
                </span>
              )}
            </div>
            <span className={`text-sm font-medium transition-colors ${
              isEditing ? 'text-white/50' : 'text-white/70 group-hover:text-white'
            }`}>
              {profile.name}
            </span>
          </motion.button>
        ))}

        {/* Add Profile */}
        {profiles.length < 5 && (
          <motion.button
            variants={fadeUp}
            onClick={() => navigate('/profiles/manage')}
            className="group flex flex-col items-center gap-3 focus:outline-none"
          >
            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-white/20 group-hover:border-white/60 flex items-center justify-center transition-colors">
              <RiAddLine size={32} className="text-white/30 group-hover:text-white/70 transition-colors" />
            </div>
            <span className="text-sm font-medium text-white/40 group-hover:text-white/70 transition-colors">
              Add Profile
            </span>
          </motion.button>
        )}
      </motion.div>

      {/* Edit Toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => setIsEditing((p) => !p)}
        className={`px-8 py-2.5 rounded-md text-sm font-semibold transition-all ${
          isEditing
            ? 'btn-brand'
            : 'border border-white/30 text-white/60 hover:text-white hover:border-white'
        }`}
      >
        {isEditing ? 'Done' : 'Manage Profiles'}
      </motion.button>
    </div>
  );
};

export default ProfileSelectPage;
