import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiPlayFill, RiStarFill } from 'react-icons/ri';

import {
  getPosterUrl, getMediaTitle, getMediaType,
  formatRating, formatYear, getMediaDate,
} from '@utils/tmdb.utils.js';

/**
 * A larger, horizontal search result card — used in the SearchPage
 * for a more information-dense layout than the standard MediaCard.
 */
const SearchResultCard = ({ media }) => {
  const mediaType  = getMediaType(media);
  const title      = getMediaTitle(media);
  const year       = formatYear(getMediaDate(media));
  const rating     = formatRating(media.vote_average);
  const posterUrl  = getPosterUrl(media.poster_path, 'sm');
  const overview   = media.overview || '';

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className="flex items-stretch gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all group"
    >
      {/* Poster */}
      <Link
        to={`/media/${mediaType}/${media.id}`}
        className="flex-shrink-0 w-14 rounded-lg overflow-hidden bg-surface-800 relative"
        style={{ minHeight: '80px' }}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] text-center p-1">
            {title}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <Link to={`/media/${mediaType}/${media.id}`}>
          <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors truncate">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-2.5 text-xs text-white/40">
          {year && <span>{year}</span>}
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase text-[10px] tracking-wide">
            {mediaType === 'tv' ? 'Series' : 'Film'}
          </span>
          {media.vote_average > 0 && (
            <span className="flex items-center gap-1">
              <RiStarFill size={11} className="text-gold-400" />
              {rating}
            </span>
          )}
        </div>

        {overview && (
          <p className="text-xs text-white/35 line-clamp-2 leading-relaxed hidden sm:block">
            {overview}
          </p>
        )}
      </div>

      {/* Quick play */}
      <div className="flex-shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/watch/${mediaType}/${media.id}`}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label={`Play ${title}`}
        >
          <RiPlayFill size={16} className="ml-0.5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default SearchResultCard;
