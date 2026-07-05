import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@api/search.api.js';
import { useDebounce } from './useDebounce.js';

/**
 * Debounced search hook. Returns search results along with loading state.
 * @param {string} query - Raw search query (will be debounced internally)
 * @param {'multi'|'movie'|'tv'} type
 * @param {number} [debounceMs=400] - Debounce delay in ms
 */
export const useSearch = (query, type = 'multi', debounceMs = 400) => {
  const debouncedQuery = useDebounce(query, debounceMs);
  const isEnabled = debouncedQuery.trim().length >= 2;

  const result = useQuery({
    queryKey: ['search', debouncedQuery.trim(), type],
    queryFn: () => searchApi.search({ query: debouncedQuery.trim(), type }),
    select: (res) => res.data,
    enabled: isEnabled,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  return {
    ...result,
    results: result.data?.results || [],
    totalResults: result.data?.total_results || 0,
    isSearching: result.isFetching,
    hasQuery: isEnabled,
  };
};
