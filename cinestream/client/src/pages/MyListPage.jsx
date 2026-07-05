import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { RiBookmarkLine } from 'react-icons/ri';

import { profileApi } from '@api/profile.api.js';
import { useProfile } from '@contexts/ProfileContext.jsx';
import { mediaApi } from '@api/media.api.js';
import MediaCard from '@components/media/MediaCard.jsx';
import { SkeletonCard } from '@components/ui/SkeletonCard.jsx';
import EmptyState from '@components/ui/EmptyState.jsx';
import ErrorMessage from '@components/ui/ErrorMessage.jsx';

const MyListPage = () => {
  const { activeProfile, myList } = useProfile();

  // The list items only have mediaId/mediaType; we need to fetch details
  // We use the data already populated in ProfileContext (myList) for the list
  // and show cards that link to media detail pages

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
              <RiBookmarkLine size={22} className="text-brand-500" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide">
              My List
            </h1>
          </div>
          {myList.length > 0 && (
            <p className="text-white/40 text-sm ml-14">
              {myList.length} title{myList.length !== 1 ? 's' : ''} saved
            </p>
          )}
        </motion.div>

        {myList.length === 0 ? (
          <EmptyState
            icon={RiBookmarkLine}
            title="Your List is Empty"
            description="Add movies and TV shows to your list by clicking the + button on any title."
            actionLabel="Browse Content"
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
            {myList.map((item, index) => (
              <motion.div
                key={`${item.mediaId}-${item.mediaType}`}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
              >
                <MyListCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Each item only has mediaId/mediaType — create a minimal media shape for MediaCard
const MyListCard = ({ item }) => {
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

export default MyListPage;
