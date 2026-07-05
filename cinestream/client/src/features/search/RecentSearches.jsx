import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiHistoryLine, RiCloseLine, RiDeleteBin7Line } from 'react-icons/ri';

/**
 * Shows the user's recent search terms with individual remove and clear-all.
 */
const RecentSearches = ({ history, onSelect, onRemove, onClearAll }) => {
  if (!history.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest">
          Recent Searches
        </h3>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <RiDeleteBin7Line size={13} />
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {history.map((term) => (
            <motion.div
              key={term}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full bg-white/5 border border-white/10 group"
            >
              <RiHistoryLine size={12} className="text-white/30" />
              <button
                onClick={() => onSelect(term)}
                className="text-xs text-white/60 hover:text-white transition-colors"
              >
                {term}
              </button>
              <button
                onClick={() => onRemove(term)}
                className="w-4 h-4 flex items-center justify-center rounded-full text-white/20 hover:text-white/60 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Remove "${term}" from history`}
              >
                <RiCloseLine size={11} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecentSearches;
