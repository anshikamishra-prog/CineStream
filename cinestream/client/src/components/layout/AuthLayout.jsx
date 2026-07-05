import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '@components/ui/Logo.jsx';

const AuthLayout = () => {
  return (
    <div className="relative min-h-screen bg-surface-950 flex flex-col">
      {/* Cinematic background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            'url(https://image.tmdb.org/t/p/original/wNAhuOZ3Zf84jCIlrcI6JhgmY5q.jpg)',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-surface-950/80 via-surface-950/50 to-surface-950" />

      {/* Header */}
      <header className="relative z-10 px-8 py-6">
        <Link to="/" aria-label="CineStream Home">
          <Logo size="lg" />
        </Link>
      </header>

      {/* Content */}
      <motion.main
        className="relative z-10 flex-1 flex items-center justify-center px-4 py-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="w-full max-w-md">
          <div
            className="rounded-xl p-8 sm:p-10"
            style={{
              background: 'rgba(20, 20, 20, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Outlet />
          </div>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-6 text-center text-sm text-white/30">
        <p>&copy; {new Date().getFullYear()} CineStream. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
