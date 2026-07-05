import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { mediaApi } from '@api/media.api.js';
import MediaCard from './MediaCard.jsx';
import { SkeletonRow } from '@components/ui/SkeletonCard.jsx';
import ContentRow from './ContentRow.jsx';

/**
 * Fetches and displays content for a single TMDB genre.
 */
const GenreRow = ({ genre, mediaType = 'movie' }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['genre-content', mediaType, genre.id],
    queryFn: () =>
      mediaType === 'movie'
        ? mediaApi.getMovies({ genre: genre.id })
        : mediaApi.getTVShows({ genre: genre.id }),
    select: (res) => res.data?.results || [],
    staleTime: 10 * 60 * 1000,
  });

  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <ContentRow
      title={genre.name}
      items={data || []}
      isLoading={isLoading}
      variant="poster"
      viewAllLink={`/${mediaType === 'tv' ? 'tv' : 'movies'}?genre=${genre.id}`}
    />
  );
};

export default GenreRow;
