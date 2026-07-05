import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiHistoryLine, RiPlayFill, RiDeleteBin7Line } from 'react-icons/ri';

import { profileApi } from '@api/profile.api.js';
import { useProfile } from '@contexts/ProfileContext.jsx';
import { getPosterUrl } from '@utils/tmdb.utils.js';
import ProgressBar from '@components/ui/ProgressBar.jsx';
import EmptyState from '@components/ui/EmptyState.jsx';
import Spinner from '@components/ui/Spinner.jsx';
import ConfirmDialog from '@components/common/ConfirmDialog.jsx';
import toast from 'react-hot-toast';

const HistoryCard = ({ item }) => {
  const posterUrl = item.posterPath ? getPosterUrl(item.posterPath, 'sm') : null;
  const progress  = Math.min(Math.max(item.progress || 0, 0), 100);
  const watchedDate = new Date(item.watchedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all group"
    >
      {/* Poster */}
      <Link
        to={`/media/${item.mediaType}/${item.mediaId}`}
        className="flex-shrink-0 relative w-14 rounded-lg overflow-hidden bg-surface-800"
        style={{ minHeight: '80px' }}
      >
        {posterUrl ? (
          <img src={posterUrl} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs text-center p-1">
            {item.title}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <RiPlayFill size={18} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {/* ProgressBar component */}
        <div className="absolute bottom-0 left-0 right-0">
          <ProgressBar value={progress} max={100} colorClass="bg-brand-500" height="h-1" />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/media/${item.mediaType}/${item.mediaId}`}>
          <h3 className="font-semibold text-white text-sm truncate hover:text-brand-400 transition-colors">
            {item.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-white/30 uppercase">{item.mediaType === 'tv' ? 'Series' : 'Film'}</span>
          {item.seasonNumber && (
            <span className="text-xs text-white/30">· S{item.seasonNumber} E{item.episodeNumber}</span>
          )}
        </div>
        {progress > 0 && (
          <p className="text-xs text-white/30 mt-1">{progress}% watched</p>
        )}
        <p className="text-xs text-white/20 mt-0.5">{watchedDate}</p>
      </div>

      {/* Quick resume */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/watch/${item.mediaType}/${item.mediaId}`}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Resume"
        >
          <RiPlayFill size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

const WatchHistoryPage = () => {
  const { activeProfile, setContinueWatching } = useProfile();
  const [history,           setHistory]           = useState(null);
  const [isLoading,         setIsLoading]         = useState(true);
  const [isClearing,        setIsClearing]        = useState(false);
  const [showConfirmClear,  setShowConfirmClear]  = useState(false);

  useEffect(() => {
    if (!activeProfile?._id) return;
    setIsLoading(true);
    profileApi
      .getWatchHistory(activeProfile._id)
      .then((res) => setHistory(res.data.watchHistory || []))
      .catch(() => setHistory([]))
      .finally(() => setIsLoading(false));
  }, [activeProfile?._id]);

  const handleClearHistory = async () => {
    if (!activeProfile?._id) return;
    setIsClearing(true);
    try {
      await profileApi.clearWatchHistory(activeProfile._id);
      setHistory([]);
      setContinueWatching([]);
      toast.success('Watch history cleared');
    } catch {
      toast.error('Failed to clear history');
    } finally {
      setIsClearing(false);
      setShowConfirmClear(false);
    }
  };

  const items = history || [];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-10 gap-4"
        >
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <RiHistoryLine size={22} className="text-brand-500" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide">
                Watch History
              </h1>
            </div>
            {items.length > 0 && (
              <p className="text-white/40 text-sm ml-14">
                {items.length} title{items.length !== 1 ? 's' : ''} watched
              </p>
            )}
          </div>

          {items.length > 0 && (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors flex-shrink-0"
            >
              <RiDeleteBin7Line size={16} />
              Clear All
            </button>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={RiHistoryLine}
            title="No Watch History"
            description="Movies and shows you watch will appear here."
            actionLabel="Start Watching"
            actionTo="/browse"
          />
        ) : (
          <motion.div layout className="space-y-2">
            <AnimatePresence>
              {items.map((item) => (
                <HistoryCard
                  key={`${item.mediaId}-${item.mediaType}-${item.watchedAt}`}
                  item={item}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ConfirmDialog replaces window.confirm */}
      <ConfirmDialog
        isOpen={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
        onConfirm={handleClearHistory}
        title="Clear Watch History?"
        message="This will permanently remove all your watch history and continue-watching progress. This action cannot be undone."
        confirmLabel="Clear History"
        cancelLabel="Keep History"
        variant="danger"
        isLoading={isClearing}
      />
    </div>
  );
};

export default WatchHistoryPage;
