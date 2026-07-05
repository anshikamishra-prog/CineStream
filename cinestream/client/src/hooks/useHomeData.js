import { useQuery } from '@tanstack/react-query';
import { mediaApi } from '@api/media.api.js';

export const useHomeData = () => {
  return useQuery({
    queryKey: ['homeData'],
    queryFn: () => mediaApi.getHomeData(),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
  });
};
