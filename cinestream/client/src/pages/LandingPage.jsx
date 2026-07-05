import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiPlayFill, RiArrowRightLine, RiDeviceLine, RiSmartphoneLine, RiTvLine } from 'react-icons/ri';
import Logo from '@components/ui/Logo.jsx';

const FEATURES = [
  {
    icon: RiTvLine,
    title: 'Watch Everywhere',
    desc: 'Stream on your TV, laptop, tablet, and phone without interruption.',
  },
  {
    icon: RiSmartphoneLine,
    title: 'Multiple Profiles',
    desc: 'Create up to 5 profiles for different members of your household.',
  },
  {
    icon: RiDeviceLine,
    title: 'Cancel Anytime',
    desc: 'No contracts, no commitments. Cancel whenever you want.',
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface-950 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://image.tmdb.org/t/p/original/cinER0ESG0eJ49kXlExM0MEWGxW.jpg)',
          }}
        >
          <div className="absolute inset-0 bg-surface-950/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface-950/60 via-transparent to-surface-950" />
        </div>

        {/* Navigation */}
        <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6">
          <Logo size="lg" />
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="btn-ghost text-sm px-5 py-2.5"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-brand text-sm px-5 py-2.5"
            >
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <motion.main
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20"
        >
          <motion.div variants={fadeUp} className="mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Stream Anything
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold text-white uppercase tracking-wide mb-6 leading-none"
          >
            Unlimited
            <br />
            <span className="text-brand-500">Cinema</span>
            <br />
            Awaits
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-white/60 text-base sm:text-lg max-w-lg mb-10 leading-relaxed"
          >
            Watch movies, TV shows, and originals. Stream anywhere, cancel anytime.
            Thousands of titles at your fingertips.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <Link
              to="/register"
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-brand-500 text-white font-bold rounded-md hover:bg-brand-600 transition-all text-base hover:scale-105 active:scale-100"
            >
              <RiPlayFill size={20} />
              Start Watching
            </Link>
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-md hover:bg-white/15 transition-all text-base border border-white/10"
            >
              Sign In
              <RiArrowRightLine size={18} />
            </Link>
          </motion.div>
        </motion.main>
      </div>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide mb-4">
              Why CineStream?
            </h2>
            <p className="text-white/40 text-base max-w-md mx-auto">
              Everything you need for the perfect streaming experience
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="p-6 rounded-xl border border-white/5 bg-white/[0.03] text-center group hover:border-brand-500/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <Icon size={24} className="text-brand-500" />
                </div>
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide mb-2">
                  {title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center rounded-2xl p-12 border border-white/5"
          style={{ background: 'linear-gradient(135deg, rgba(229,9,20,0.08) 0%, rgba(20,20,20,0) 100%)' }}
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-wide mb-4">
            Ready to Watch?
          </h2>
          <p className="text-white/50 mb-8">Create your free account and start streaming instantly.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-brand-500 text-white font-bold rounded-md hover:bg-brand-600 transition-all text-base hover:scale-105 active:scale-100"
          >
            Get Started Free
            <RiArrowRightLine size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-white/25">
        <p>&copy; {new Date().getFullYear()} CineStream. Content data by TMDB.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
