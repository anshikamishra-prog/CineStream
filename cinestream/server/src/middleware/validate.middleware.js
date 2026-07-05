import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError.js';

/**
 * Middleware to process express-validator results.
 * Must be called after all validation chains in a route.
 */
export const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    const error = new AppError('Validation failed', 422, 'VALIDATION_ERROR');
    error.validationErrors = formattedErrors;
    return next(error);
  }

  return next();
};
