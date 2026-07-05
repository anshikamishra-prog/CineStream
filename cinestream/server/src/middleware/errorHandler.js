import { logger } from '../utils/logger.js';

const handleCastError = (error) => ({
  statusCode: 400,
  message: `Invalid ${error.path}: ${error.value}`,
  code: 'INVALID_ID',
});

const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  return {
    statusCode: 409,
    message: `An account with this ${field} already exists`,
    code: 'DUPLICATE_KEY',
  };
};

const handleValidationError = (error) => ({
  statusCode: 422,
  message: Object.values(error.errors)
    .map((el) => el.message)
    .join('. '),
  code: 'VALIDATION_ERROR',
});

const handleJWTError = () => ({
  statusCode: 401,
  message: 'Invalid authentication token. Please log in again.',
  code: 'INVALID_TOKEN',
});

const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: 'Your session has expired. Please log in again.',
  code: 'TOKEN_EXPIRED',
});

// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, _next) => {
  let { statusCode = 500, message = 'Something went wrong', code = null } = error;

  // Transform known error types into operational errors
  if (error.name === 'CastError') {
    ({ statusCode, message, code } = handleCastError(error));
  } else if (error.code === 11000) {
    ({ statusCode, message, code } = handleDuplicateKeyError(error));
  } else if (error.name === 'ValidationError') {
    ({ statusCode, message, code } = handleValidationError(error));
  } else if (error.name === 'JsonWebTokenError') {
    ({ statusCode, message, code } = handleJWTError());
  } else if (error.name === 'TokenExpiredError') {
    ({ statusCode, message, code } = handleJWTExpiredError());
  }

  // Log non-operational errors with full stack
  if (!error.isOperational) {
    logger.error('UNEXPECTED ERROR:', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  const response = {
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    code,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};
