import React from 'react';

/**
 * A simple animated progress bar.
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  className = '',
  colorClass = 'bg-brand-500',
  showLabel = false,
  height = 'h-1',
}) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${height} bg-white/10 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <p className="text-[10px] text-white/30 mt-1 text-right">{Math.round(percent)}%</p>
      )}
    </div>
  );
};

export default ProgressBar;
