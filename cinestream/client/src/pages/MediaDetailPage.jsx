import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiPlayFill, RiAddLine, RiCheckLine,
  RiHeartLine, RiHeartFill, RiCloseLine,
} from 'react-icons/ri';

import { useMediaDetail } from '@hooks/useMediaDetail.js';
import { useGenreMap } from '@hooks/useGenres.js';
import {
  getBackdropUrl, getPosterUrl, getMediaTitle,
  formatYear, getMediaDate,
} from '@utils/tmdb.utils.js';
import { useAuth } from '@contexts/AuthContext.jsx';
import { useProfile } from '@contexts/ProfileContext.jsx';
import ContentRow from '@components/media/ContentRow.jsx';
import MediaInfoPanel from '@components/media/MediaInfoPanel.jsx';
import RatingBadge from '@components/media/RatingBadge.jsx';
import { SkeletonDetailPage } from '@components/ui/SkeletonCard.jsx';
import ErrorMessage from '@components/ui/ErrorMessage.jsx';
import Badge from '@components/ui/Badge.jsx';

const CastCard = ({ person }) => (
  <div className="flex-shrink-0 w-28 text-center">
    <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden bg-surface-700">
      {person.profile_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
          alt={person.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/30 text-xl font-bold">
          {person.name?.[0]}
        </div>
      )}
    </div>
    <p className="text-xs font-semibold text-white/80 line-clamp-2 leading-tight">{person.name}</p>
    <p className="text-[10px] text-white/40 line-clamp-1 mt-0.5">{person.character}</p>
  </div>
);

const MediaDetailPage = () => {
  const { type, id } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);

  const { isAuthenticated } = useAuth();
  const { isInMyList, isInFavorites, toggleMyList, toggleFavorite } = useProfile();
  const genreMap = useGenreMap();

  const { data: media, isLoading, isError, refetch } = useMediaDetail(type, id);

  if (isLoading) return <div className="pt-16"><SkeletonDetailPage /></div>;
  if (isError || !media) {
    return (
      <div className="pt-24">
        <ErrorMessage
          title="Content Not Found"
          message="We couldn't load this title. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  const title       = getMediaTitle(media);
  const year        = formatYear(getMediaDate(media));
  const backdropUrl = getBackdropUrl(media.backdrop_path, 'original');
  const posterUrl   = getPosterUrl(media.poster_path, 'lg');
  const inMyList    = isInMyList(media.id, type);
  const inFavorites = isInFavorites(media.id, type);
  const cast        = media.credits?.cast?.slice(0, 12) || [];
  const trailer     = media.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const recommendations = [
    ...(media.recommendations?.results || []),
    ...(media.similar?.results || []),
  ].slice(0, 12);

  const genres = media.genres?.map((g) => g.name) ||
    (media.genre_ids || []).map((id) => genreMap[id]).filter(Boolean);

  const creators = type === 'tv'
    ? (media.created_by || []).map((c) => c.name).join(', ')
    : (media.credits?.crew || []).find((c) => c.job === 'Director')?.name;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20">

      {/* ── Backdrop ── */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh]">
        {backdropUrl && (
          <img src={backdropUrl} alt={title} className="w-full h-full object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-900/60 to-transparent" />
      </div>

      {/* ── Detail content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 -mt-32 sm:-mt-44 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left: poster + info panel ── */}
          <div className="hidden lg:flex flex-col gap-5 flex-shrink-0 w-52">
            {posterUrl && (
              <img
                src={posterUrl}
                alt={title}
                className="w-full rounded-xl shadow-2xl shadow-black/60 border border-white/5"
              />
            )}
            <MediaInfoPanel media={media} type={type} />
          </div>

          {/* ── Right: main info ── */}
          <div className="flex-1 min-w-0 space-y-6 pt-4">

            {/* Title + tagline */}
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide leading-tight">
                {title}
              </h1>
              {media.tagline && (
                <p className="text-white/40 italic mt-2 text-base">{media.tagline}</p>
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3">
              <RatingBadge
                rating={media.vote_average}
                voteCount={media.vote_count}
                size="lg"
              />
              {year && <span className="text-white/50 text-sm">{year}</span>}
              <Badge variant="default">
                {type === 'tv' ? 'Series' : 'Film'}
              </Badge>
              {media.adult && <Badge variant="danger">18+</Badge>}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/20 transition-colors cursor-default"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {media.overview && (
              <p className="text-white/65 text-sm sm:text-base leading-relaxed max-w-2xl">
                {media.overview}
              </p>
            )}

            {/* Creator / Director */}
            {creators && (
              <p className="text-sm text-white/40">
                <span className="text-white/25 uppercase tracking-wider text-xs mr-2">
                  {type === 'tv' ? 'Created by' : 'Director'}
                </span>
                {creators}
              </p>
            )}

            {/* Mobile: info panel */}
            <div className="lg:hidden">
              <MediaInfoPanel media={media} type={type} />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/watch/${type}/${media.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-white text-surface-900 font-bold rounded-md hover:bg-white/90 transition-colors"
              >
                <RiPlayFill size={20} />
                Play
              </Link>

              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-md hover:bg-white/20 transition-colors border border-white/10"
                >
                  ▶ Trailer
                </button>
              )}

              {isAuthenticated && (
                <>
                  <button
                    onClick={() => toggleMyList(media.id, type)}
                    className={`flex items-center gap-2 px-5 py-3 font-semibold rounded-md transition-colors border ${
                      inMyList
                        ? 'bg-brand-500/20 border-brand-500/40 text-brand-400 hover:bg-brand-500/30'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    {inMyList ? <RiCheckLine size={18} /> : <RiAddLine size={18} />}
                    {inMyList ? 'In My List' : 'My List'}
                  </button>

                  <button
                    onClick={() => toggleFavorite(media.id, type)}
                    className={`w-12 h-12 flex items-center justify-center rounded-full border transition-colors ${
                      inFavorites
                        ? 'border-brand-400 text-brand-400 bg-brand-500/10 hover:bg-brand-500/20'
                        : 'border-white/30 text-white/60 hover:border-white hover:text-white'
                    }`}
                    aria-label={inFavorites ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {inFavorites ? <RiHeartFill size={20} /> : <RiHeartLine size={20} />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Cast ── */}
        {cast.length > 0 && (
          <div className="mt-14">
            <h2 className="section-heading mb-5">Cast</h2>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4">
              {cast.map((person) => <CastCard key={person.id} person={person} />)}
            </div>
          </div>
        )}

        {/* ── Recommendations ── */}
        {recommendations.length > 0 && (
          <div className="mt-14 -mx-4 sm:-mx-6 lg:-mx-12">
            <ContentRow
              title="More Like This"
              items={recommendations}
              variant="poster"
            />
          </div>
        )}
      </div>

      {/* ── Trailer Modal ── */}
      {showTrailer && trailer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowTrailer(false)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close trailer"
          >
            <RiCloseLine size={22} />
          </button>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={`${title} — Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MediaDetailPage;
