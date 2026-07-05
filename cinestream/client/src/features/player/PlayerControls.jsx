import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiPlayFill, RiPauseFill, RiVolumeMuteLine,
  RiVolumeUpLine, RiFullscreenLine, RiFullscreenExitLine,
  RiArrowLeftLine, RiInformationLine,
} from 'react-icons/ri';

/**
 * The controls overlay UI rendered on top of the player.
 * Stateless — all values and handlers come from usePlayerControls.
 */
const PlayerControls = ({
  title,
  mediaType,
  mediaId,
  subTitle,
  isPlaying,
  isMuted,
  isFullscreen,
  currentTime,
  duration,
  progressPercent,
  formatTime,
  onBack,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen,
  onSeek,
}) => {
  const handleProgressClick = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(ratio * duration);
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">

      {/* ── Top bar ── */}
      <div className="px-4 sm:px-8 pt-5 pb-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            aria-label="Go back"
          >
            <RiArrowLeftLine size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-lg sm:text-2xl font-bold text-white uppercase tracking-wide truncate">
              {title}
            </h1>
            {subTitle && (
              <p className="text-white/40 text-xs mt-0.5 uppercase tracking-wider">{subTitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Centre tap zone ── */}
      <button
        onClick={onTogglePlay}
        className="absolute inset-0 pointer-events-auto"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        tabIndex={-1}
      />

      {/* ── Bottom controls ── */}
      <div className="px-4 sm:px-8 pb-5 pt-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">

        {/* Progress bar */}
        <div
          role="slider"
          aria-label="Playback progress"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onClick={handleProgressClick}
          className="relative h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer group/prog"
        >
          <div
            className="absolute left-0 top-0 h-full bg-brand-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/prog:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />
        </div>

        {/* Button row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={onTogglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying
                ? <RiPauseFill size={28} className="text-white" />
                : <RiPlayFill  size={28} className="text-white ml-0.5" />}
            </button>

            <button onClick={onToggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted
                ? <RiVolumeMuteLine size={22} className="text-white/80" />
                : <RiVolumeUpLine   size={22} className="text-white/80" />}
            </button>

            <span className="text-sm text-white/50 tabular-nums hidden sm:block">
              {formatTime(currentTime)}
              {duration > 0 && ` / ${formatTime(duration)}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {mediaType && mediaId && (
              <Link
                to={`/media/${mediaType}/${mediaId}`}
                className="text-white/50 hover:text-white transition-colors hidden sm:block"
                aria-label="More info"
              >
                <RiInformationLine size={22} />
              </Link>
            )}
            <button onClick={onToggleFullscreen} aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              {isFullscreen
                ? <RiFullscreenExitLine size={22} className="text-white/80" />
                : <RiFullscreenLine     size={22} className="text-white/80" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
