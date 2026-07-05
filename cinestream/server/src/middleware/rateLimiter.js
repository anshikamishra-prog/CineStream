import rateLimit from 'express-rate-limit';

/**
 * Creates a configurable rate limiter middleware.
 * @param {object} options - Rate limit options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum requests per window
 * @param {string} [options.message] - Error message
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP. Please try again later.',
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 'fail',
      message,
      code: 'RATE_LIMIT_EXCEEDED',
    },
    skip: () => process.env.NODE_ENV === 'test',
  });
};
