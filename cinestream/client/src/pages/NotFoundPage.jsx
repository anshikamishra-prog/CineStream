import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiHomeLine, RiSearchLine } from 'react-icons/ri';
import Logo from '@components/ui/Logo.jsx';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      {/* Nav */}
      <header className="px-8 py-6">
        <Link to="/browse">
          <Logo size="md" />
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          {/* Big 404 */}
          <div className="relative mb-8">
            <span
              className="font-display text-[180px] sm:text-[240px] font-black leading-none select-none"
              style={{
                background: 'linear-gradient(180deg, rgba(229,9,20,0.3) 0%, rgba(229,9,20,0.05) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              404
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide mb-4">
            Lost in the Stream
          </h1>
          <p className="text-white/40 text-base mb-10 leading-relaxed">
            The page you&apos;re looking for has wandered off set. Let&apos;s get you back to the good stuff.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-md hover:bg-white/15 transition-colors"
            >
              <RiArrowLeftLine size={18} />
              Go Back
            </button>
            <Link
              to="/browse"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white font-medium rounded-md hover:bg-brand-600 transition-colors"
            >
              <RiHomeLine size={18} />
              Back to Home
            </Link>
            <Link
              to="/search"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-md hover:bg-white/15 transition-colors"
            >
              <RiSearchLine size={18} />
              Search
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
