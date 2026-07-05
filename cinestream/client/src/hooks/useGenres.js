import { useQuery } from '@tanstack/react-query';
import { mediaApi } from '@api/media.api.js';

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => mediaApi.getGenres(),
    select: (res) => res.data,
    staleTime: 24 * 60 * 60 * 1000, // Genres rarely change — cache for 24h
  });
};

/**
 * Returns a lookup map: genreId -> genreName
 * Works for both movie and TV genres.
 */
export const useGenreMap = () => {
  const { data } = useGenres();

  const map = {};
  [...(data?.movieGenres || []), ...(data?.tvGenres || [])].forEach((g) => {
    map[g.id] = g.name;
  });

  return map;
};
