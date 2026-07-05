import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSearchLine, RiFilmLine, RiTvLine } from 'react-icons/ri';

import { useSearch } from '@hooks/useSearch.js';
import { useSearchHistory } from '@features/search/useSearchHistory.js';
import RecentSearches from '@features/search/RecentSearches.jsx';
import SearchResultCard from '@features/search/SearchResultCard.jsx';
import MediaGrid from '@components/media/MediaGrid.jsx';
import { SkeletonCard } from '@components/ui/SkeletonCard.jsx';
import EmptyState from '@components/ui/EmptyState.jsx';
import ErrorMessage from '@components/ui/ErrorMessage.jsx';

const TABS = [
  { key: 'multi', label: 'All',      icon: RiSearchLine },
  { key: 'movie', label: 'Movies',   icon: RiFilmLine },
  { key: 'tv',    label: 'TV Shows', icon: RiTvLine },
];

const VIEW_MODES = ['grid', 'list'];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate    = useNavigate();
  const inputRef    = useRef(null);

  const query    = searchParams.get('q') || '';
  const type     = searchParams.get('type') || 'multi';
  const viewMode = searchParams.get('view') || 'grid';

  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory();
  const { results, totalResults, isLoading, isSearching, isError, hasQuery } =
    useSearch(query, type);

  // Focus the input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Record to history when there are results
  useEffect(() => {
    if (query.trim().length >= 2 && results.length > 0) {
      addToHistory(query.trim());
    }
  }, [query, results.length, addToHistory]);

  const setParam = (key, value) => {
    const next = Object.fromEntries(searchParams.entries());
    if (value) next[key] = value; else delete next[key];
    setSearchParams(next);
  };

  const handleSelect = (term) => {
    setSearchParams({ q: term, type });
    inputRef.current?.focus();
  };

  const showSkeleton = isLoading && hasQuery;
  const showEmpty    = !isLoading && hasQuery && results.length === 0 && !isError;
  const showResults  = !isLoading && results.length > 0;
  const showInitial  = !hasQuery;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide mb-6">
            Search
          </h1>

          {/* Search input */}
          <div className="relative max-w-2xl mb-5">
            <RiSearchLine
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            )}
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder="Search movies, TV shows, people…"
              className="input-field pl-12 py-4 text-base"
              aria-label="Search content"
            />
          </div>

          {/* Tabs + view toggle */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setParam('type', key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    type === key
                      ? 'bg-brand-500 text-white shadow-glow-red'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {showResults && (
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                {VIEW_MODES.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setParam('view', mode)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize ${
                      viewMode === mode
                        ? 'bg-white/15 text-white'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Content ── */}
        <AnimatePresence mode="wait">

          {/* Initial / empty state — show history */}
          {showInitial && (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {history.length > 0 ? (
                <RecentSearches
                  history={history}
                  onSelect={handleSelect}
                  onRemove={removeFromHistory}
                  onClearAll={clearHistory}
                />
              ) : (
                <EmptyState
                  icon={RiSearchLine}
                  title="Start Searching"
                  description="Enter at least 2 characters to search across movies, TV shows, and people."
                />
              )}
            </motion.div>
          )}

          {/* Loading skeleton */}
          {showSkeleton && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3"
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <SkeletonCard key={i} aspectRatio="poster" />
              ))}
            </motion.div>
          )}

          {/* Error */}
          {isError && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ErrorMessage
                title="Search Failed"
                message="Something went wrong. Please try again."
              />
            </motion.div>
          )}

          {/* No results */}
          {showEmpty && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState
                icon={RiSearchLine}
                title="No Results Found"
                description={`We couldn't find anything for "${query}". Try different keywords.`}
              />
            </motion.div>
          )}

          {/* Results */}
          {showResults && (
            <motion.div
              key={`results-${query}-${type}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm text-white/40 mb-5">
                <span className="text-white/70 font-medium">
                  {totalResults.toLocaleString()}
                </span>{' '}
                result{totalResults !== 1 ? 's' : ''} for{' '}
                <span className="text-white/70">&ldquo;{query}&rdquo;</span>
              </p>

              {viewMode === 'list' ? (
                <div className="space-y-2 max-w-3xl">
                  {results.map((item) => (
                    <SearchResultCard
                      key={`${item.id}-${item.media_type}`}
                      media={item}
                    />
                  ))}
                </div>
              ) : (
                <MediaGrid items={results} isLoading={false} />
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchPage;
