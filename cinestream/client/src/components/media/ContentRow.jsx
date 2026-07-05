import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';

import MediaCard from './MediaCard.jsx';
import { SkeletonCard } from '@components/ui/SkeletonCard.jsx';
import { useIntersectionObserver } from '@hooks/useIntersectionObserver.js';

const ContentRow = ({
  title,
  items = [],
  isLoading = false,
  variant = 'poster',
  viewAllLink = null,
  titleClassName = '',
}) => {
  const rowRef = useRef(null);
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Lazy-render: only show content once the row enters the viewport
  const { elementRef: sectionRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.05,
    rootMargin: '200px 0px',  // pre-load 200px before visible
  });

  const updateScrollState = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  const scroll = useCallback((direction) => {
    const el = rowRef.current;
    if (!el) return;
    const cardWidth   = variant === 'poster' ? 176 + 12 : 320 + 12;
    const visible     = Math.floor(el.clientWidth / cardWidth);
    const scrollAmount = cardWidth * Math.max(visible - 1, 2);
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }, [variant]);

  if (!isLoading && items.length === 0) return null;

  // While not yet in viewport, render a lightweight placeholder to reserve height
  const shouldRender = isLoading || hasIntersected;

  return (
    <div ref={sectionRef} className="space-y-3">
      {/* Row header */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`section-heading ${titleClassName}`}
        >
          {title}
        </motion.h2>
        {viewAllLink && !isLoading && (
          <Link
            to={viewAllLink}
            className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors flex items-center gap-1"
          >
            See all <RiArrowRightSLine size={16} />
          </Link>
        )}
      </div>

      {/* Cards */}
      <div className="relative group/row">
        {/* Left arrow */}
        {canScrollLeft && shouldRender && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center
              bg-gradient-to-r from-surface-900 to-transparent
              text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
            aria-label="Scroll left"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <RiArrowLeftSLine size={20} />
            </div>
          </motion.button>
        )}

        {/* Right arrow */}
        {canScrollRight && shouldRender && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center
              bg-gradient-to-l from-surface-900 to-transparent
              text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"
            aria-label="Scroll right"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <RiArrowRightSLine size={20} />
            </div>
          </motion.button>
        )}

        <div
          ref={rowRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto no-scrollbar pl-4 sm:pl-6 lg:pl-12 pr-4 pb-3"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {/* Skeleton while loading OR before intersection */}
          {(!shouldRender || isLoading)
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} aspectRatio={variant} />
              ))
            : items.map((item) => (
                <MediaCard
                  key={`${item.id}-${item.media_type || 'item'}`}
                  media={item}
                  variant={variant}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ContentRow;
