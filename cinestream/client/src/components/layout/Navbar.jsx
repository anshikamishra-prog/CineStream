import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiSearchLine, RiArrowDownSLine, RiUser3Line,
  RiSettings3Line, RiLogoutBoxRLine, RiHeartLine,
  RiHistoryLine, RiBookmarkLine, RiCloseLine,
} from 'react-icons/ri';

import { useAuth }            from '@contexts/AuthContext.jsx';
import { useProfile }         from '@contexts/ProfileContext.jsx';
import { useScrollDirection } from '@hooks/useScrollDirection.js';
import useUIStore             from '@store/uiStore.js';
import Logo                   from '@components/ui/Logo.jsx';
import AvatarIcon             from '@components/ui/AvatarIcon.jsx';

const NAV_LINKS = [
  { to: '/browse',  label: 'Home' },
  { to: '/tv',      label: 'TV Shows' },
  { to: '/movies',  label: 'Movies' },
  { to: '/my-list', label: 'My List' },
];

const Navbar = () => {
  const [isSearchOpen,      setIsSearchOpen]      = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen,  setIsMobileMenuOpen]  = useState(false);

  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navigate       = useNavigate();
  const location       = useLocation();

  const { user, logout }                             = useAuth();
  const { activeProfile }                            = useProfile();
  const { searchQuery, setSearchQuery, clearSearch } = useUIStore();

  // Hide navbar when scrolling down past 80px; show when scrolling up
  const { scrollDirection, scrollY } = useScrollDirection();
  const isScrolled  = scrollY > 20;
  const isHidden    = scrollDirection === 'down' && scrollY > 80 && !isSearchOpen && !isProfileMenuOpen;

  // ── Close all UI on route change ──────────────────────────────────────────
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    clearSearch();
  }, [location.pathname, clearSearch]);

  // ── Auto-focus search input ───────────────────────────────────────────────
  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  // ── Close profile menu on outside click ──────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (q.length >= 2) {
        navigate(`/search?q=${encodeURIComponent(q)}`);
        setIsSearchOpen(false);
        clearSearch();
      }
    },
    [searchQuery, navigate, clearSearch]
  );

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <motion.header
      animate={{ y: isHidden ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        isScrolled
          ? 'bg-surface-900/95 backdrop-blur-md shadow-lg shadow-black/20'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-12 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link to="/browse" className="flex-shrink-0 mr-2" aria-label="CineStream home">
          <Logo size="md" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-white/60 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* ── Search ── */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  onSubmit={handleSearchSubmit}
                  className="overflow-hidden"
                >
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Escape' && (setIsSearchOpen(false), clearSearch())}
                    placeholder="Titles, people, genres"
                    className="w-full h-9 px-3 pr-8 bg-surface-800/90 text-white text-sm placeholder-white/30 border border-white/20 rounded-md focus:outline-none focus:border-white/50"
                    aria-label="Search content"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <button
              onClick={() => isSearchOpen ? (setIsSearchOpen(false), clearSearch()) : setIsSearchOpen(true)}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors rounded-md hover:bg-white/10"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            >
              {isSearchOpen ? <RiCloseLine size={20} /> : <RiSearchLine size={20} />}
            </button>
          </div>

          {/* ── Profile Menu ── */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen((p) => !p)}
              className="flex items-center gap-1.5 group"
              aria-haspopup="true"
              aria-expanded={isProfileMenuOpen}
            >
              <AvatarIcon
                avatar={activeProfile?.avatar || 'default'}
                name={activeProfile?.name || user?.name || ''}
                size="sm"
              />
              <motion.span
                animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="hidden sm:block text-white/50 group-hover:text-white"
              >
                <RiArrowDownSLine size={16} />
              </motion.span>
            </button>

            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-60 rounded-xl overflow-hidden shadow-2xl shadow-black/60"
                  style={{
                    background: 'rgba(22,22,22,0.98)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="px-4 py-3.5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <AvatarIcon name={activeProfile?.name || user?.name || ''} size="md" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {activeProfile?.name || user?.name}
                        </p>
                        <p className="text-xs text-white/35 truncate mt-0.5">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-1.5">
                    {[
                      { to: '/profiles',  icon: RiUser3Line,     label: 'Switch Profile' },
                      { to: '/my-list',   icon: RiBookmarkLine,  label: 'My List' },
                      { to: '/favorites', icon: RiHeartLine,     label: 'Favorites' },
                      { to: '/history',   icon: RiHistoryLine,   label: 'Watch History' },
                      { to: '/account',   icon: RiSettings3Line, label: 'Account' },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/65 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Icon size={16} className="flex-shrink-0" />
                        {label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-white/5 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 transition-colors"
                    >
                      <RiLogoutBoxRLine size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Mobile menu toggle ── */}
          <button
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors rounded-md hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-surface-900/98 border-t border-white/5"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-500/10 text-brand-400'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
