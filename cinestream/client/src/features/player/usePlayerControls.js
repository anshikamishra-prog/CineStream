import { useState, useRef, useCallback, useEffect } from 'react';
import useUIStore from '@store/uiStore.js';

/**
 * Manages all player UI state: play/pause, mute, volume, fullscreen,
 * progress tracking, and the auto-hide controls overlay.
 *
 * Persists volume and muted preferences to the Zustand UIStore
 * (which persists to localStorage).
 */
export const usePlayerControls = ({ duration = 0, onProgressUpdate } = {}) => {
  const { playerVolume, playerMuted, setPlayerVolume, setPlayerMuted } = useUIStore();

  const [isPlaying,    setIsPlaying]    = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted,   setHasStarted]   = useState(false);

  const controlsTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const containerRef     = useRef(null);

  // ── Auto-hide controls overlay ─────────────────────────────────────────────
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  }, [isPlaying]);

  // ── Fullscreen ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onFscChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFscChange);
    return () => document.removeEventListener('fullscreenchange', onFscChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  }, []);

  // ── Simulated progress counter ────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying || !hasStarted) return;

    progressTimerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        if (duration > 0 && next % 30 === 0 && onProgressUpdate) {
          const pct = Math.round((next / duration) * 100);
          onProgressUpdate(pct, next, duration);
        }
        if (duration > 0 && next >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(progressTimerRef.current);
  }, [isPlaying, hasStarted, duration, onProgressUpdate]);

  // ── Cleanup ────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(controlsTimerRef.current);
      clearInterval(progressTimerRef.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    setHasStarted(true);
    setIsPlaying(true);
  }, []);

  const togglePlay  = useCallback(() => setIsPlaying((p) => !p), []);
  const toggleMute  = useCallback(() => setPlayerMuted(!playerMuted), [playerMuted, setPlayerMuted]);

  const seekTo = useCallback((seconds) => {
    setCurrentTime(Math.max(0, Math.min(seconds, duration)));
  }, [duration]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    // State
    isPlaying,
    currentTime,
    duration,
    isFullscreen,
    showControls,
    hasStarted,
    volume: playerVolume,
    isMuted: playerMuted,
    progressPercent,
    // Refs
    containerRef,
    // Actions
    handleStart,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    seekTo,
    setVolume: setPlayerVolume,
    resetControlsTimer,
    formatTime,
  };
};
