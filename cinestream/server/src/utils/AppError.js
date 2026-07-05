export class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (message, statusCode, code = null) => {
  return new AppError(message, statusCode, code);
};

// Predefined common errors
export const Errors = {
  NOT_FOUND: (resource = 'Resource') =>
    new AppError(`${resource} not found`, 404, 'NOT_FOUND'),

  UNAUTHORIZED: (message = 'Authentication required') =>
    new AppError(message, 401, 'UNAUTHORIZED'),

  FORBIDDEN: (message = 'Access denied') => new AppError(message, 403, 'FORBIDDEN'),

  BAD_REQUEST: (message = 'Invalid request') => new AppError(message, 400, 'BAD_REQUEST'),

  CONFLICT: (message = 'Resource already exists') => new AppError(message, 409, 'CONFLICT'),

  INTERNAL: (message = 'Internal server error') =>
    new AppError(message, 500, 'INTERNAL_ERROR'),

  VALIDATION_ERROR: (message = 'Validation failed') =>
    new AppError(message, 422, 'VALIDATION_ERROR'),
};
