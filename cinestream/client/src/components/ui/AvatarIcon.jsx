import React from 'react';

const AVATAR_COLORS = [
  ['#e50914', '#ff6b6b'],
  ['#1e88e5', '#64b5f6'],
  ['#43a047', '#81c784'],
  ['#fb8c00', '#ffcc80'],
  ['#8e24aa', '#ce93d8'],
  ['#e91e63', '#f48fb1'],
];

const getColorForName = (name) => {
  if (!name) return AVATAR_COLORS[0];
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const sizeMap = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-20 h-20 text-3xl',
};

const AvatarIcon = ({ avatar, name = '', size = 'md', className = '' }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;
  const [from, to] = getColorForName(name);
  const initials = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={`${sizeClass} rounded-lg flex items-center justify-center font-display font-bold flex-shrink-0 ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-label={`${name} avatar`}
    >
      {initials}
    </div>
  );
};

export default AvatarIcon;
