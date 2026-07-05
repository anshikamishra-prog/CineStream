import React from 'react';

const sizes = {
  sm: { text: 'text-lg', dot: 'w-1.5 h-1.5' },
  md: { text: 'text-2xl', dot: 'w-2 h-2' },
  lg: { text: 'text-3xl', dot: 'w-2.5 h-2.5' },
};

const Logo = ({ size = 'md', className = '' }) => {
  const s = sizes[size] || sizes.md;
  return (
    <div className={`flex items-center gap-1 select-none ${className}`}>
      <span
        className={`font-display font-bold tracking-widest uppercase text-white ${s.text}`}
        style={{ letterSpacing: '0.12em' }}
      >
        CINE
      </span>
      <span className={`${s.dot} rounded-full bg-brand-500 flex-shrink-0 mt-0.5`} />
      <span
        className={`font-display font-bold tracking-widest uppercase text-brand-500 ${s.text}`}
        style={{ letterSpacing: '0.12em' }}
      >
        STREAM
      </span>
    </div>
  );
};

export default Logo;
