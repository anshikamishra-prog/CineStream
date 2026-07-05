import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useMediaDetail } from '@hooks/useMediaDetail.js';
import { usePlayerControls } from '@features/player/usePlayerControls.js';
import PlayerControls from '@features/player/PlayerControls.jsx';
import { useProfile } from '@contexts/ProfileContext.jsx';
import { getMediaTitle, getBackdropUrl } from '@utils/tmdb.utils.js';
import Spinner from '@components/ui/Spinner.jsx';
import ErrorMessage from '@components/ui/ErrorMessage.jsx';

const PlayerPage = () => {
  const { type, id } = useParams();
  const navigate      = useNavigate();
  const { activeProfile, updateWatchProgress } = useProfile();

  const { data: media, isLoading, isError } = useMediaDetail(type, id);

  const handleProgressUpdate = useCallback(
    (progressPct, currentSec, durationSec) => {
      if (!media || !activeProfile) return;
      updateWatchProgress(id, type, {
        title:       getMediaTitle(media),
        posterPath:  media.poster_path,
        backdropPath:media.backdrop_path,
        progress:    progressPct,
        duration:    durationSec,
      });
    },
    [media, activeProfile, id, type, updateWatchProgress]
  );

  const mediaDuration = type === 'movie'
    ? (media?.runtime || 90) * 60
    : 2700; // ~45 min per TV episode

  const {
    isPlaying, isMuted, isFullscreen, showControls,
    currentTime, progressPercent, containerRef,
    handleStart, togglePlay, toggleMute, toggleFullscreen,
    seekTo, resetControlsTimer, formatTime,
  } = usePlayerControls({
    duration:         media ? mediaDuration : 0,
    onProgressUpdate: handleProgressUpdate,
  });

  // Find the best YouTube trailer / clip
  const trailer = media?.videos?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  ) || media?.videos?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Teaser'
  ) || media?.videos?.results?.find(
    (v) => v.site === 'YouTube'
  );

  const title       = getMediaTitle(media || {});
  const backdropUrl = getBackdropUrl(media?.backdrop_path, 'original');

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[200]">
        <Spinner size="xl" />
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError || !media) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[200]">
        <ErrorMessage
          title="Content Unavailable"
          message="This title could not be loaded for playback."
          onRetry={() => navigate(-1)}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-[200] overflow-hidden select-none"
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >

      {/* ── Video layer ── */}
      {trailer ? (
        <iframe
          key={trailer.key}
          className="absolute inset-0 w-full h-full pointer-events-none"
          src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${trailer.key}`}
          title={`${title} — Player`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleStart}
        />
      ) : (
        /* Fallback backdrop when no YouTube video is available */
        <div className="absolute inset-0">
          {backdropUrl && (
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover opacity-25"
            />
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <p className="font-display text-2xl font-bold text-white/40 uppercase tracking-wide mb-2">
              No Stream Available
            </p>
            <p className="text-white/25 text-sm max-w-xs">
              This title doesn&apos;t have a playable trailer on YouTube.
              Visit the detail page for more options.
            </p>
          </div>
        </div>
      )}

      {/* ── Controls overlay ── */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <PlayerControls
              title={title}
              mediaType={type}
              mediaId={id}
              subTitle={trailer ? `${trailer.type} — ${trailer.name}` : null}
              isPlaying={isPlaying}
              isMuted={isMuted}
              isFullscreen={isFullscreen}
              currentTime={currentTime}
              duration={mediaDuration}
              progressPercent={progressPercent}
              formatTime={formatTime}
              onBack={() => navigate(-1)}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onToggleFullscreen={toggleFullscreen}
              onSeek={seekTo}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerPage;
