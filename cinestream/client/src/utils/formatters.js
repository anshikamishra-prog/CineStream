/**
 * Centralized formatting utilities for display values.
 */

/**
 * Formats a number with locale-aware thousand separators.
 */
export const formatNumber = (n) => {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US').format(n);
};

/**
 * Formats a monetary value (e.g. budget/revenue from TMDB).
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount || amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: amount >= 1_000_000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(amount);
};

/**
 * Formats a relative time string: "2 hours ago", "3 days ago", etc.
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = Date.now();
  const diff = new Date(date).getTime() - now;
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  const hours   = Math.round(minutes / 60);
  const days    = Math.round(hours / 24);
  const weeks   = Math.round(days / 7);
  const months  = Math.round(days / 30);
  const years   = Math.round(days / 365);

  if (Math.abs(seconds) < 60)   return rtf.format(seconds, 'second');
  if (Math.abs(minutes) < 60)   return rtf.format(minutes, 'minute');
  if (Math.abs(hours)   < 24)   return rtf.format(hours,   'hour');
  if (Math.abs(days)    < 7)    return rtf.format(days,    'day');
  if (Math.abs(weeks)   < 5)    return rtf.format(weeks,   'week');
  if (Math.abs(months)  < 12)   return rtf.format(months,  'month');
  return rtf.format(years, 'year');
};

/**
 * Truncates a string to a maximum length with ellipsis.
 */
export const truncate = (str, maxLength = 150) => {
  if (!str || str.length <= maxLength) return str || '';
  return `${str.slice(0, maxLength).trimEnd()}…`;
};

/**
 * Converts a fractional progress value (0–1) to a CSS percentage string.
 */
export const toPercent = (value, decimals = 0) => {
  return `${(value * 100).toFixed(decimals)}%`;
};
