import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiPlayFill, RiAddLine, RiCheckLine,
  RiVolumeUpLine, RiVolumeMuteLine, RiInformationLine,
} from 'react-icons/ri';

import {
  getBackdropUrl, getMediaTitle, getMediaType,
  formatRating, formatYear, getMediaDate,
} from '@utils/tmdb.utils.js';
import { useProfile } from '@contexts/ProfileContext.jsx';
import { useAuth }    from '@contexts/AuthContext.jsx';
import { useGenreMap } from '@hooks/useGenres.js';
import useUIStore from '@store/uiStore.js';
import RatingBadge from './RatingBadge.jsx';

const HeroBanner = ({ media, isLoading = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isAuthenticated }                    = useAuth();
  const { isInMyList, toggleMyList }           = useProfile();
  const { playerMuted, togglePlayerMuted }     = useUIStore();
  const genreMap                               = useGenreMap();

  const items   = Array.isArray(media) ? media.slice(0, 5) : media ? [media] : [];
  const current = items[currentIndex];

  // Auto-rotate hero every 8 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % items.length),
      8000
    );
    return () => clearInterval(id);
  }, [items.length]);

  if (isLoading) {
    return (
      <div className="relative w-full h-[80vh] min-h-[520px]">
        <div className="skeleton absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-900/90 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 sm:p-12 lg:p-16 space-y-4">
          <div className="skeleton h-12 w-80 rounded" />
          <div className="skeleton h-4 w-96 rounded" />
          <div className="skeleton h-4 w-72 rounded" />
          <div className="flex gap-3 mt-4">
            <div className="skeleton h-12 w-32 rounded-md" />
            <div className="skeleton h-12 w-36 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const mediaType  = getMediaType(current);
  const title      = getMediaTitle(current);
  const year       = formatYear(getMediaDate(current));
  const overview   = current.overview || '';
  const backdropUrl = getBackdropUrl(current.backdrop_path, 'original');
  const inMyList   = isInMyList(current.id, mediaType);

  // Resolve genre IDs → names using the global map
  const genreNames = (current.genre_ids || [])
    .slice(0, 3)
    .map((id) => genreMap[id])
    .filter(Boolean);

  return (
    <div className="relative w-full h-[80vh] min-h-[520px] overflow-hidden">

      {/* ── Backdrop (crossfade) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover object-top"
              fetchpriority="high"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-surface-900 via-surface-900/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

      {/* ── Hero content ── */}
      <div className="relative h-full flex items-end pb-20 sm:pb-24">
        <div className="px-6 sm:px-10 lg:px-16 w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Meta */}
              <div className="flex items-center gap-3 text-sm flex-wrap">
                {year && (
                  <span className="text-white/50 font-medium">{year}</span>
                )}
                <RatingBadge
                  rating={current.vote_average}
                  voteCount={current.vote_count}
                  size="sm"
                  showCount={false}
                />
                <span className="px-2 py-0.5 rounded border border-white/20 text-white/50 text-xs uppercase tracking-wide">
                  {mediaType === 'tv' ? 'Series' : 'Film'}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-wide uppercase">
                {title}
              </h1>

              {/* Overview */}
              {overview && (
                <p className="text-white/65 text-sm sm:text-base leading-relaxed line-clamp-3 max-w-lg">
                  {overview}
                </p>
              )}

              {/* Genre chips (resolved names, not IDs) */}
              {genreNames.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genreNames.map((name) => (
                    <span
                      key={name}
                      className="text-xs px-2.5 py-1 rounded-full bg-white/8 text-white/55 border border-white/8"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={`/watch/${mediaType}/${current.id}`}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-surface-900 font-bold rounded-md hover:bg-white/90 transition-colors text-sm sm:text-base"
                >
                  <RiPlayFill size={20} />
                  Play
                </Link>

                <Link
                  to={`/media/${mediaType}/${current.id}`}
                  className="flex items-center gap-2 px-6 py-3 bg-white/15 text-white font-semibold rounded-md hover:bg-white/25 transition-colors text-sm sm:text-base border border-white/10"
                >
                  <RiInformationLine size={18} />
                  More Info
                </Link>

                {isAuthenticated && (
                  <button
                    onClick={() => toggleMyList(current.id, mediaType)}
                    className={`flex items-center gap-2 px-5 py-3 font-semibold rounded-md transition-colors text-sm sm:text-base border ${
                      inMyList
                        ? 'bg-brand-500/20 border-brand-500/50 text-brand-400 hover:bg-brand-500/30'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                    aria-label={inMyList ? 'Remove from My List' : 'Add to My List'}
                  >
                    {inMyList ? <RiCheckLine size={18} /> : <RiAddLine size={18} />}
                    {inMyList ? 'In My List' : 'My List'}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mute toggle (uses persisted UIStore preference) ── */}
      <button
        onClick={togglePlayerMuted}
        className="absolute bottom-20 sm:bottom-24 right-6 sm:right-10 lg:right-16 w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
        aria-label={playerMuted ? 'Unmute' : 'Mute'}
      >
        {playerMuted ? <RiVolumeMuteLine size={18} /> : <RiVolumeUpLine size={18} />}
      </button>

      {/* ── Dot pagination ── */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex
                  ? 'w-6 h-1.5 bg-brand-500'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
