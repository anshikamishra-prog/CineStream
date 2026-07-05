const IMAGE_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster: {
    sm: 'w185',
    md: 'w342',
    lg: 'w500',
    xl: 'w780',
    original: 'original',
  },
  backdrop: {
    sm: 'w300',
    md: 'w780',
    lg: 'w1280',
    original: 'original',
  },
  profile: {
    sm: 'w45',
    md: 'w185',
    lg: 'h632',
  },
};

export const getPosterUrl = (path, size = 'md') => {
  if (!path) return null;
  return `${IMAGE_BASE}/${IMAGE_SIZES.poster[size] || 'w342'}${path}`;
};

export const getBackdropUrl = (path, size = 'lg') => {
  if (!path) return null;
  return `${IMAGE_BASE}/${IMAGE_SIZES.backdrop[size] || 'w1280'}${path}`;
};

export const getProfileUrl = (path, size = 'md') => {
  if (!path) return null;
  return `${IMAGE_BASE}/${IMAGE_SIZES.profile[size] || 'w185'}${path}`;
};

export const getYouTubeEmbedUrl = (key) => {
  if (!key) return null;
  return `https://www.youtube.com/embed/${key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`;
};

export const getYouTubeThumbnail = (key) => {
  if (!key) return null;
  return `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatYear = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).getFullYear().toString();
};

export const formatRating = (rating) => {
  if (!rating) return 'N/A';
  return Number(rating).toFixed(1);
};

export const formatVoteCount = (count) => {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

export const getMediaTitle = (media) =>
  media?.title || media?.name || media?.original_title || media?.original_name || 'Unknown';

export const getMediaDate = (media) =>
  media?.release_date || media?.first_air_date || null;

export const getMediaType = (media) => {
  if (media?.media_type) return media.media_type;
  if (media?.first_air_date !== undefined) return 'tv';
  if (media?.release_date !== undefined) return 'movie';
  return 'movie';
};

export const getRatingColor = (rating) => {
  if (!rating) return 'text-white/40';
  if (rating >= 7.5) return 'text-green-400';
  if (rating >= 6) return 'text-yellow-400';
  if (rating >= 4) return 'text-orange-400';
  return 'text-red-400';
};

export const getProgressColor = (progress) => {
  if (progress >= 75) return 'bg-brand-500';
  if (progress >= 40) return 'bg-yellow-500';
  return 'bg-blue-500';
};
