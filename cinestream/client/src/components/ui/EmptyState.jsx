import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon,
  title = 'Nothing here yet',
  description = '',
  actionLabel = null,
  actionTo = null,
  onAction = null,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center py-20 px-6"
  >
    {Icon && (
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-5">
        <Icon size={32} className="text-white/30" />
      </div>
    )}
    <h3 className="font-display text-2xl font-bold text-white/80 mb-2 uppercase tracking-wider">{title}</h3>
    {description && <p className="text-white/40 text-sm max-w-xs leading-relaxed">{description}</p>}
    {actionLabel && (actionTo || onAction) && (
      <div className="mt-6">
        {actionTo ? (
          <Link to={actionTo} className="btn-brand text-sm px-6 py-2.5">
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className="btn-brand text-sm px-6 py-2.5">
            {actionLabel}
          </button>
        )}
      </div>
    )}
  </motion.div>
);

export default EmptyState;
