import React from 'react';
import { RiStarFill } from 'react-icons/ri';
import { formatRating, formatVoteCount, getRatingColor } from '@utils/tmdb.utils.js';

const RatingBadge = ({ rating, voteCount, size = 'md', showCount = true }) => {
  if (!rating) return null;

  const color = getRatingColor(rating);
  const sizes = {
    sm: { star: 12, text: 'text-xs', count: 'text-[10px]' },
    md: { star: 14, text: 'text-sm', count: 'text-xs' },
    lg: { star: 18, text: 'text-base font-bold', count: 'text-xs' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center gap-1.5">
      <RiStarFill size={s.star} className="text-gold-400 flex-shrink-0" />
      <span className={`${s.text} font-semibold ${color}`}>
        {formatRating(rating)}
      </span>
      {showCount && voteCount > 0 && (
        <span className={`${s.count} text-white/30`}>
          ({formatVoteCount(voteCount)})
        </span>
      )}
    </div>
  );
};

export default RatingBadge;
