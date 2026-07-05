import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { RiEyeLine, RiEyeOffLine, RiMailLine, RiLockLine, RiUser3Line } from 'react-icons/ri';

import { useRegisterForm } from '@features/auth/useAuthForm.js';
import Spinner from '@components/ui/Spinner.jsx';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleRegister, apiError } = useRegisterForm();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch('password');

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wide mb-2">
          Create Account
        </h1>
        <p className="text-white/40 text-sm">Join millions of viewers today</p>
      </div>

      {apiError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
        >
          {apiError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(handleRegister)} noValidate className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-white/60">Full Name</label>
          <div className="relative">
            <RiUser3Line size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              id="name" type="text" autoComplete="name" placeholder="John Doe"
              className={`input-field pl-10 ${errors.name ? 'error' : ''}`}
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
                maxLength: { value: 50, message: 'Max 50 characters' },
              })}
            />
          </div>
          {errors.name && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400">
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-white/60">Email Address</label>
          <div className="relative">
            <RiMailLine size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              id="email" type="email" autoComplete="email" placeholder="you@example.com"
              className={`input-field pl-10 ${errors.email ? 'error' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />
          </div>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400">
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-white/60">Password</label>
          <div className="relative">
            <RiLockLine size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
              placeholder="Min. 8 characters"
              className={`input-field pl-10 pr-12 ${errors.password ? 'error' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'At least 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Must include uppercase, lowercase, and a number',
                },
              })}
            />
            <button
              type="button" onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
            >
              {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
            </button>
          </div>
          {errors.password && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400">
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/60">Confirm Password</label>
          <div className="relative">
            <RiLockLine size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              id="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
              placeholder="Repeat your password"
              className={`input-field pl-10 ${errors.confirmPassword ? 'error' : ''}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === password || 'Passwords do not match',
              })}
            />
          </div>
          {errors.confirmPassword && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400">
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </div>

        <button
          type="submit" disabled={isSubmitting}
          className="w-full btn-brand py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size="sm" /> Creating Account…
            </span>
          ) : 'Create Account'}
        </button>
      </form>

      <p className="mt-3 text-xs text-white/25 text-center leading-relaxed">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
      <div className="mt-5 pt-5 border-t border-white/5 text-center">
        <p className="text-sm text-white/40">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-brand-400 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
