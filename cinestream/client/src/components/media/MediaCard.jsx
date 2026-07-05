import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiPlayFill, RiAddLine, RiCheckLine,
  RiHeartLine, RiHeartFill, RiStarFill, RiInformationLine,
} from 'react-icons/ri';

import {
  getPosterUrl, getBackdropUrl, getMediaTitle,
  getMediaType, formatRating, formatYear, getMediaDate,
} from '@utils/tmdb.utils.js';
import { useProfile }  from '@contexts/ProfileContext.jsx';
import { useAuth }     from '@contexts/AuthContext.jsx';
import Tooltip         from '@components/ui/Tooltip.jsx';

const MediaCard = ({ media, variant = 'poster', className = '' }) => {
  const [imgError,   setImgError]   = useState(false);
  const [isHovered,  setIsHovered]  = useState(false);

  const { isAuthenticated }                            = useAuth();
  const { isInMyList, isInFavorites, toggleMyList, toggleFavorite } = useProfile();

  const mediaType = getMediaType(media);
  const title     = getMediaTitle(media);
  const year      = formatYear(getMediaDate(media));
  const rating    = formatRating(media.vote_average);
  const inMyList   = isInMyList(media.id, mediaType);
  const inFavorites = isInFavorites(media.id, mediaType);

  const imageUrl =
    variant === 'poster'
      ? getPosterUrl(media.poster_path, 'md')
      : getBackdropUrl(media.backdrop_path, 'md') || getPosterUrl(media.poster_path, 'md');

  const handleMyList = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (isAuthenticated) toggleMyList(media.id, mediaType);
  }, [isAuthenticated, media.id, mediaType, toggleMyList]);

  const handleFavorite = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (isAuthenticated) toggleFavorite(media.id, mediaType);
  }, [isAuthenticated, media.id, mediaType, toggleFavorite]);

  return (
    <motion.div
      className={`relative flex-shrink-0 rounded-lg overflow-hidden group cursor-pointer ${
        variant === 'poster'
          ? 'w-36 sm:w-44 aspect-poster'
          : 'w-64 sm:w-80 aspect-backdrop'
      } ${className}`}
      whileHover={{ scale: 1.04, zIndex: 10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/media/${mediaType}/${media.id}`} className="block w-full h-full">
        {/* Image */}
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-surface-800 flex items-center justify-center p-4">
            <span className="text-white/20 text-xs font-display text-center uppercase tracking-wide">
              {title}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Rating badge */}
        {media.vote_average > 0 && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
            <RiStarFill size={10} className="text-gold-400" />
            <span className="text-[10px] font-bold text-white">{rating}</span>
          </div>
        )}

        {/* Hover action bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-0 left-0 right-0 p-3"
        >
          <p className="text-white text-xs font-semibold line-clamp-2 mb-1.5 leading-tight">
            {title}
          </p>
          {year && <p className="text-white/50 text-[10px] mb-2">{year}</p>}

          <div className="flex items-center gap-1.5">
            {/* Play */}
            <Tooltip content="Play" placement="top">
              <Link
                to={`/watch/${mediaType}/${media.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0 hover:bg-white/90 transition-colors"
                aria-label={`Play ${title}`}
              >
                <RiPlayFill size={13} className="text-surface-900 ml-0.5" />
              </Link>
            </Tooltip>

            {/* My List */}
            {isAuthenticated && (
              <Tooltip content={inMyList ? 'Remove from List' : 'Add to List'} placement="top">
                <button
                  onClick={handleMyList}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                    inMyList
                      ? 'bg-brand-500 border-brand-500 text-white'
                      : 'border-white/50 text-white hover:border-white'
                  }`}
                  aria-label={inMyList ? 'Remove from My List' : 'Add to My List'}
                >
                  {inMyList ? <RiCheckLine size={13} /> : <RiAddLine size={13} />}
                </button>
              </Tooltip>
            )}

            {/* Favorite */}
            {isAuthenticated && (
              <Tooltip content={inFavorites ? 'Remove Favorite' : 'Add Favorite'} placement="top">
                <button
                  onClick={handleFavorite}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                    inFavorites
                      ? 'border-brand-400 text-brand-400'
                      : 'border-white/50 text-white hover:border-white'
                  }`}
                  aria-label={inFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                  {inFavorites ? <RiHeartFill size={12} /> : <RiHeartLine size={12} />}
                </button>
              </Tooltip>
            )}

            {/* Info */}
            <Tooltip content="More Info" placement="top">
              <Link
                to={`/media/${mediaType}/${media.id}`}
                onClick={(e) => e.stopPropagation()}
                className="ml-auto w-7 h-7 rounded-full border border-white/50 flex items-center justify-center text-white hover:border-white transition-colors"
                aria-label={`More info: ${title}`}
              >
                <RiInformationLine size={13} />
              </Link>
            </Tooltip>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default MediaCard;
