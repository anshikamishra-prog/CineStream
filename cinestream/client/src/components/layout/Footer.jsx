import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@components/ui/Logo.jsx';

const FOOTER_LINKS = [
  { to: '/browse', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/tv', label: 'TV Shows' },
  { to: '/my-list', label: 'My List' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/account', label: 'Account' },
];

const Footer = () => {
  return (
    <footer className="bg-surface-950 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <Logo size="lg" />

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
            {FOOTER_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-full max-w-sm h-px bg-white/5" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-white/25">
            <p>&copy; {new Date().getFullYear()} CineStream. All rights reserved.</p>
            <span className="hidden sm:block">·</span>
            <p>
              Content data provided by{' '}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white/60 transition-colors underline underline-offset-2"
              >
                TMDB
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
