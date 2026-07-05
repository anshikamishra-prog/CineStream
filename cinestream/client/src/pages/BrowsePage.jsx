import React from 'react';
import { motion } from 'framer-motion';

import { useHomeData } from '@hooks/useHomeData.js';
import { useGenres } from '@hooks/useGenres.js';
import { useProfile } from '@contexts/ProfileContext.jsx';
import { SectionErrorBoundary } from '@components/common/ErrorBoundary.jsx';
import HeroBanner from '@components/media/HeroBanner.jsx';
import ContentRow from '@components/media/ContentRow.jsx';
import ContinueWatchingRow from '@components/media/ContinueWatchingRow.jsx';
import GenreRow from '@components/media/GenreRow.jsx';
import ErrorMessage from '@components/ui/ErrorMessage.jsx';

// Show only the 4 most popular genres to avoid over-fetching
const FEATURED_GENRE_IDS = [28, 18, 35, 878]; // Action, Drama, Comedy, Sci-Fi

const BrowsePage = () => {
  const { continueWatching } = useProfile();
  const { data, isLoading, isError, refetch } = useHomeData();
  const { data: genresData } = useGenres();

  const featuredGenres = (genresData?.movieGenres || []).filter((g) =>
    FEATURED_GENRE_IDS.includes(g.id)
  );

  if (isError) {
    return (
      <div className="pt-24">
        <ErrorMessage
          title="Failed to Load Content"
          message="We couldn't fetch the latest movies and shows. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  const heroItems = data?.trending?.slice(0, 5) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pb-20"
    >
      {/* ── Hero ── */}
      <SectionErrorBoundary>
        <HeroBanner media={heroItems} isLoading={isLoading} />
      </SectionErrorBoundary>

      {/* ── Content rows (overlap hero at bottom) ── */}
      <div className="mt-[-80px] relative z-10 space-y-10 pt-4">

        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <SectionErrorBoundary>
            <ContinueWatchingRow items={continueWatching} />
          </SectionErrorBoundary>
        )}

        <SectionErrorBoundary>
          <ContentRow
            title="Trending Today"
            items={data?.trending || []}
            isLoading={isLoading}
            variant="backdrop"
            viewAllLink="/movies?category=popular"
          />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <ContentRow
            title="Now Playing in Cinemas"
            items={data?.nowPlaying || []}
            isLoading={isLoading}
            variant="poster"
            viewAllLink="/movies?category=now_playing"
          />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <ContentRow
            title="Popular Movies"
            items={data?.popularMovies || []}
            isLoading={isLoading}
            variant="poster"
            viewAllLink="/movies?category=popular"
          />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <ContentRow
            title="Top Rated Movies"
            items={data?.topRatedMovies || []}
            isLoading={isLoading}
            variant="poster"
            viewAllLink="/movies?category=top_rated"
          />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <ContentRow
            title="Popular TV Shows"
            items={data?.popularTV || []}
            isLoading={isLoading}
            variant="poster"
            viewAllLink="/tv?category=popular"
          />
        </SectionErrorBoundary>

        <SectionErrorBoundary>
          <ContentRow
            title="Top Rated Series"
            items={data?.topRatedTV || []}
            isLoading={isLoading}
            variant="poster"
            viewAllLink="/tv?category=top_rated"
          />
        </SectionErrorBoundary>

        {/* ── Genre rows (only rendered once genres are loaded) ── */}
        {!isLoading && featuredGenres.map((genre) => (
          <SectionErrorBoundary key={genre.id}>
            <GenreRow genre={genre} mediaType="movie" />
          </SectionErrorBoundary>
        ))}
      </div>
    </motion.div>
  );
};

export default BrowsePage;
