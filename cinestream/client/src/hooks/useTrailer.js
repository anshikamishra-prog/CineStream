import { useQuery } from '@tanstack/react-query';
import { mediaApi } from '@api/media.api.js';

/**
 * Fetches and returns the best available YouTube trailer for a media item.
 */
export const useTrailer = (type, id, enabled = true) => {
  const fetcher = type === 'movie' ? mediaApi.getMovieTrailer : mediaApi.getTVTrailer;

  return useQuery({
    queryKey: ['trailer', type, String(id)],
    queryFn: () => fetcher(id),
    select: (res) => res.data.trailer,
    enabled: enabled && !!type && !!id,
    staleTime: 30 * 60 * 1000,
  });
};
