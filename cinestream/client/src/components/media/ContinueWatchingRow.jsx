import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiPlayFill } from 'react-icons/ri';
import { getPosterUrl } from '@utils/tmdb.utils.js';
import ProgressBar from '@components/ui/ProgressBar.jsx';

const ContinueWatchingCard = ({ item }) => {
  const progress   = Math.min(Math.max(item.progress || 0, 0), 100);
  const posterUrl  = item.posterPath ? getPosterUrl(item.posterPath, 'sm') : null;

  // Determine color based on completion
  const progressColor =
    progress >= 75 ? 'bg-brand-500' :
    progress >= 40 ? 'bg-yellow-500' : 'bg-blue-500';

  return (
    <Link
      to={`/watch/${item.mediaType}/${item.mediaId}`}
      className="flex-shrink-0 w-36 sm:w-44 rounded-lg overflow-hidden group relative"
    >
      {/* Poster */}
      <div className="aspect-poster bg-surface-800">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 text-xs text-center px-2">{item.title}</span>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100 duration-200">
            <RiPlayFill size={18} className="text-surface-900 ml-0.5" />
          </div>
        </div>
      </div>

      {/* ProgressBar component replaces inline div */}
      <div className="absolute bottom-6 left-0 right-0 px-0">
        <ProgressBar
          value={progress}
          max={100}
          colorClass={progressColor}
          height="h-1"
        />
      </div>

      {/* Title */}
      <div className="absolute bottom-1 left-2 right-2">
        <p className="text-[10px] text-white/60 truncate">{item.title}</p>
      </div>
    </Link>
  );
};

const ContinueWatchingRow = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="section-heading"
        >
          Continue Watching
        </motion.h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pl-4 sm:pl-6 lg:pl-12 pr-4 pb-3">
        {items.map((item) => (
          <ContinueWatchingCard key={`${item.mediaId}-${item.mediaType}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ContinueWatchingRow;
