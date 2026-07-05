import { useQuery } from '@tanstack/react-query';
import { mediaApi } from '@api/media.api.js';

/**
 * Fetches full detail for a movie or TV show.
 * @param {'movie'|'tv'} type
 * @param {string|number} id
 */
export const useMediaDetail = (type, id) => {
  const fetcher = type === 'movie' ? mediaApi.getMovieById : mediaApi.getTVById;

  return useQuery({
    queryKey: ['media', type, String(id)],
    queryFn: () => fetcher(id),
    select: (res) => res.data,
    enabled: !!type && !!id,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Fetches minimal media data — used for list/grid cards where only
 * poster_path, title, and vote_average are needed.
 */
export const useMediaMini = (type, id) => {
  return useMediaDetail(type, id);
};
