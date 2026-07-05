import React from 'react';
import { RiArrowUpDownLine } from 'react-icons/ri';

const SORT_OPTIONS = [
  { value: 'popularity.desc',     label: 'Most Popular' },
  { value: 'vote_average.desc',   label: 'Highest Rated' },
  { value: 'release_date.desc',   label: 'Newest First' },
  { value: 'release_date.asc',    label: 'Oldest First' },
  { value: 'revenue.desc',        label: 'Highest Revenue' },
];

/**
 * Dropdown to control the sort order for Browse pages.
 */
const BrowseSortSelect = ({ value, onChange, className = '' }) => (
  <div className={`relative flex items-center ${className}`}>
    <RiArrowUpDownLine
      size={14}
      className="absolute left-3 text-white/40 pointer-events-none"
    />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-8 pr-4 py-2 text-sm bg-surface-800 text-white/70 border border-white/10 rounded-md appearance-none cursor-pointer hover:border-white/20 focus:outline-none focus:border-brand-500 transition-colors"
      aria-label="Sort by"
    >
      {SORT_OPTIONS.map(({ value: v, label }) => (
        <option key={v} value={v} className="bg-surface-800">
          {label}
        </option>
      ))}
    </select>
  </div>
);

export default BrowseSortSelect;
