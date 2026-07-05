import React from 'react';
import { motion } from 'framer-motion';
import MediaCard from './MediaCard.jsx';
import { SkeletonCard } from '@components/ui/SkeletonCard.jsx';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
};

/**
 * A responsive CSS grid of media cards with stagger animation.
 * Handles loading and empty states.
 */
const MediaGrid = ({
  items = [],
  isLoading = false,
  skeletonCount = 18,
  className = '',
}) => {
  const gridClass = `grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4 ${className}`;

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} aspectRatio="poster" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={gridClass}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {items.map((item) => (
        <motion.div key={`${item.id}-${item.media_type || 'media'}`} variants={itemVariants}>
          <MediaCard media={item} variant="poster" className="w-full" />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MediaGrid;
