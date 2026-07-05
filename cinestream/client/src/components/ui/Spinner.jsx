import React from 'react';

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-10 h-10 border-[3px]',
  xl: 'w-14 h-14 border-4',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <div
    className={`${sizeMap[size]} rounded-full border-brand-500 border-t-transparent animate-spin ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
