import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { RiFilmLine } from 'react-icons/ri';

import { mediaApi } from '@api/media.api.js';
import { useGenres } from '@hooks/useGenres.js';
import { useBrowseFilters } from '@features/browse/useBrowseFilters.js';
import BrowseSortSelect from '@features/browse/BrowseSortSelect.jsx';
import MediaGrid from '@components/media/MediaGrid.jsx';
import Pagination from '@components/ui/Pagination.jsx';
import ErrorMessage from '@components/ui/ErrorMessage.jsx';

const CATEGORIES = [
  { key: 'popular',    label: 'Popular' },
  { key: 'top_rated',  label: 'Top Rated' },
  { key: 'now_playing',label: 'Now Playing' },
  { key: 'upcoming',   label: 'Upcoming' },
];

const MoviesPage = () => {
  const { category, genreId, page, sortBy, setFilter, hasActiveFilters, clearFilters } =
    useBrowseFilters({ category: 'popular' });

  const { data: genresData }                    = useGenres();
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['movies', category, genreId, sortBy, page],
    queryFn:  () => mediaApi.getMovies({ category, page, genre: genreId }),
    select:   (res) => res.data,
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000,
  });

  const movies     = data?.results || [];
  const totalPages = Math.min(data?.total_pages || 1, 20);

  const activeGenreName = genreId
    ? (genresData?.movieGenres || []).find((g) => String(g.id) === genreId)?.name
    : null;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div className="flex items-center gap-3">
              <RiFilmLine size={28} className="text-brand-500" />
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide">
                {activeGenreName || 'Movies'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-white/40 hover:text-white transition-colors underline underline-offset-2"
                >
                  Clear filters
                </button>
              )}
              <BrowseSortSelect
                value={sortBy}
                onChange={(val) => setFilter({ sort: val })}
              />
            </div>
          </div>

          {/* Category tabs */}
          {!genreId && (
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter({ category: key })}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === key
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Genre chips */}
          {genresData?.movieGenres && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter({ genre: null })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !genreId
                    ? 'bg-white/15 text-white border border-white/20'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                All
              </button>
              {genresData.movieGenres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => setFilter({ genre: String(genre.id) })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    String(genre.id) === genreId
                      ? 'bg-brand-500 text-white'
                      : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Results ── */}
        {isError ? (
          <ErrorMessage title="Failed to Load Movies" onRetry={refetch} />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${genreId}-${page}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <MediaGrid items={movies} isLoading={isLoading || isFetching} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setFilter({ page: String(p) })}
                isLoading={isFetching}
                className="mt-12"
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
