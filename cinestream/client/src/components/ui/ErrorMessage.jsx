import React from 'react';
import { motion } from 'framer-motion';
import { RiAlertLine, RiRefreshLine } from 'react-icons/ri';

const ErrorMessage = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry = null,
  className = '',
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
  >
    <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center mb-4">
      <RiAlertLine size={28} className="text-brand-500" />
    </div>
    <h3 className="font-display text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white/50 text-sm max-w-xs">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-md transition-colors"
      >
        <RiRefreshLine size={16} />
        Try Again
      </button>
    )}
  </motion.div>
);

export default ErrorMessage;
