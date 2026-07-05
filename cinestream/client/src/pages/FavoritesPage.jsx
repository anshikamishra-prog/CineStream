import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { RiHeartLine } from 'react-icons/ri';

import { mediaApi } from '@api/media.api.js';
import { useProfile } from '@contexts/ProfileContext.jsx';
import MediaCard from '@components/media/MediaCard.jsx';
import { SkeletonCard } from '@components/ui/SkeletonCard.jsx';
import EmptyState from '@components/ui/EmptyState.jsx';

const FavoriteCard = ({ item }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['media-mini', item.mediaType, item.mediaId],
    queryFn: () =>
      item.mediaType === 'movie'
        ? mediaApi.getMovieById(item.mediaId)
        : mediaApi.getTVById(item.mediaId),
    select: (res) => res.data,
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) return <SkeletonCard aspectRatio="poster" />;
  if (!data) return null;

  return (
    <MediaCard
      media={{ ...data, media_type: item.mediaType }}
      variant="poster"
      className="w-full"
    />
  );
};

const FavoritesPage = () => {
  const { favorites } = useProfile();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <RiHeartLine size={22} className="text-brand-500" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide">
              Favorites
            </h1>
          </div>
          {favorites.length > 0 && (
            <p className="text-white/40 text-sm ml-14">
              {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
            </p>
          )}
        </motion.div>

        {favorites.length === 0 ? (
          <EmptyState
            icon={RiHeartLine}
            title="No Favorites Yet"
            description="Heart any movie or TV show to save it here for quick access."
            actionLabel="Explore Titles"
            actionTo="/browse"
          />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.04 } },
            }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4"
          >
            {favorites.map((item) => (
              <motion.div
                key={`${item.mediaId}-${item.mediaType}`}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
              >
                <FavoriteCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
