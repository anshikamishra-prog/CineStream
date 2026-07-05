import React from 'react';

export const SkeletonCard = ({ aspectRatio = 'poster' }) => (
  <div
    className={`rounded-lg overflow-hidden flex-shrink-0 ${
      aspectRatio === 'poster' ? 'aspect-poster w-36 sm:w-44' : 'aspect-backdrop w-64 sm:w-80'
    }`}
  >
    <div className="skeleton w-full h-full" />
  </div>
);

export const SkeletonRow = ({ count = 6 }) => (
  <div className="space-y-4">
    <div className="skeleton h-6 w-48 rounded" />
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export const SkeletonHero = () => (
  <div className="relative w-full h-[75vh] min-h-[500px]">
    <div className="skeleton absolute inset-0" />
    <div className="absolute bottom-0 left-0 p-12 space-y-4">
      <div className="skeleton h-12 w-96 rounded" />
      <div className="skeleton h-5 w-80 rounded" />
      <div className="skeleton h-4 w-64 rounded" />
      <div className="flex gap-3 mt-4">
        <div className="skeleton h-12 w-32 rounded-md" />
        <div className="skeleton h-12 w-32 rounded-md" />
      </div>
    </div>
  </div>
);

export const SkeletonDetailPage = () => (
  <div className="animate-fade-in">
    <div className="skeleton w-full h-[50vh] sm:h-[65vh]" />
    <div className="max-w-7xl mx-auto px-6 -mt-8 space-y-8">
      <div className="space-y-3">
        <div className="skeleton h-10 w-72 rounded" />
        <div className="skeleton h-4 w-full max-w-xl rounded" />
        <div className="skeleton h-4 w-3/4 max-w-lg rounded" />
      </div>
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-12 w-28 rounded-md" />
        ))}
      </div>
      <SkeletonRow count={5} />
    </div>
  </div>
);

export default SkeletonCard;
