import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Manages URL-driven browse filter state for Movies and TV pages.
 * All filter values are stored in the URL so they are shareable and
 * survive page refresh.
 */
export const useBrowseFilters = (defaults = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key) => searchParams.get(key) ?? defaults[key] ?? null;

  const category = getParam('category') || defaults.category || 'popular';
  const genreId  = getParam('genre');
  const page     = Math.max(1, parseInt(getParam('page') || '1', 10));
  const sortBy   = getParam('sort') || 'popularity.desc';

  const setFilter = useCallback(
    (updates) => {
      const current = Object.fromEntries(searchParams.entries());
      const next = { ...current, ...updates };

      // Reset to page 1 whenever any filter other than page changes
      if (!Object.prototype.hasOwnProperty.call(updates, 'page')) {
        next.page = '1';
      }

      // Remove null / undefined values from URL
      Object.keys(next).forEach((k) => {
        if (next[k] == null || next[k] === '') delete next[k];
      });

      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    category,
    genreId,
    page,
    sortBy,
    setFilter,
    clearFilters,
    hasActiveFilters: !!(genreId || sortBy !== 'popularity.desc'),
  };
};
