import React from 'react';
import { motion } from 'framer-motion';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import Spinner from './Spinner.jsx';

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  isLoading = false,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(page, totalPages);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1 || isLoading}
        className="w-9 h-9 flex items-center justify-center rounded-md bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <RiArrowLeftSLine size={18} />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-white/30 text-sm">
            …
          </span>
        ) : (
          <motion.button
            key={p}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPageChange(p)}
            disabled={isLoading}
            className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
              p === page
                ? 'bg-brand-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </motion.button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages || isLoading}
        className="w-9 h-9 flex items-center justify-center rounded-md bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        {isLoading ? <Spinner size="sm" /> : <RiArrowRightSLine size={18} />}
      </button>
    </div>
  );
};

/**
 * Builds a compact page range with ellipsis: [1, 2, ..., 7, 8, 9, ..., 20]
 */
function buildPageRange(current, total, delta = 2) {
  const range = [];
  const left = current - delta;
  const right = current + delta;

  let last = 0;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      if (last + 1 < i) range.push('...');
      range.push(i);
      last = i;
    }
  }
  return range;
}

export default Pagination;
