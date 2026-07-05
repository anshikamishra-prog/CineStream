import React from 'react';

const VARIANTS = {
  brand:   'bg-brand-500/10 text-brand-400 border-brand-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  danger:  'bg-red-500/10 text-red-400 border-red-500/20',
  default: 'bg-white/5 text-white/50 border-white/10',
  gold:    'bg-gold-500/10 text-gold-400 border-gold-500/20',
};

const Badge = ({ children, variant = 'default', className = '' }) => (
  <span
    className={`badge border ${VARIANTS[variant] || VARIANTS.default} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
