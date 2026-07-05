/**
 * Environment variable validation.
 * Fails fast at startup if any required variable is missing or invalid,
 * preventing cryptic runtime errors in production.
 */

const REQUIRED_VARS = [
  { key: 'MONGODB_URI',         desc: 'MongoDB connection string' },
  { key: 'JWT_SECRET',          desc: 'JWT access token secret (min 32 chars)' },
  { key: 'JWT_REFRESH_SECRET',  desc: 'JWT refresh token secret (min 32 chars)' },
  { key: 'TMDB_API_KEY',        desc: 'The Movie Database API key' },
];

const OPTIONAL_DEFAULTS = {
  NODE_ENV:             'development',
  PORT:                 '5000',
  CLIENT_URL:           'http://localhost:5173',
  JWT_EXPIRES_IN:       '7d',
  JWT_REFRESH_EXPIRES_IN: '30d',
  COOKIE_SECRET:        'changeme-in-production',
};

export const validateEnv = () => {
  const errors = [];

  // Check required variables
  for (const { key, desc } of REQUIRED_VARS) {
    if (!process.env[key]) {
      errors.push(`  ✗ ${key} is missing — ${desc}`);
    }
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('  ✗ JWT_SECRET must be at least 32 characters long');
  }
  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.length < 32) {
    errors.push('  ✗ JWT_REFRESH_SECRET must be at least 32 characters long');
  }

  // Warn about insecure defaults in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.COOKIE_SECRET === 'changeme-in-production') {
      errors.push('  ✗ COOKIE_SECRET must be changed from the default in production');
    }
  }

  // Apply defaults for optional variables
  for (const [key, value] of Object.entries(OPTIONAL_DEFAULTS)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  if (errors.length > 0) {
    console.error('\n🚨 Environment Configuration Errors:\n');
    errors.forEach((e) => console.error(e));
    console.error(
      '\nPlease copy server/.env.example to server/.env and fill in all required values.\n'
    );
    process.exit(1);
  }
};
