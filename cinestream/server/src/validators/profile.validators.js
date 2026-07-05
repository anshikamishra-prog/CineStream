import { body, param } from 'express-validator';

export const createProfileValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Profile name is required')
    .isLength({ min: 1, max: 30 })
    .withMessage('Profile name must be between 1 and 30 characters'),

  body('avatar').optional().isString().withMessage('Avatar must be a string'),

  body('isKids').optional().isBoolean().withMessage('isKids must be a boolean'),

  body('maturityRating')
    .optional()
    .isIn(['G', 'PG', 'PG-13', 'R', 'NC-17', 'ALL'])
    .withMessage('Invalid maturity rating'),
];

export const updateProfileValidator = [
  param('profileId').isMongoId().withMessage('Invalid profile ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Profile name must be between 1 and 30 characters'),

  body('avatar').optional().isString().withMessage('Avatar must be a string'),

  body('isKids').optional().isBoolean().withMessage('isKids must be a boolean'),

  body('maturityRating')
    .optional()
    .isIn(['G', 'PG', 'PG-13', 'R', 'NC-17', 'ALL'])
    .withMessage('Invalid maturity rating'),

  body('language').optional().isString().isLength({ max: 5 }).withMessage('Invalid language code'),
];

export const profileIdValidator = [
  param('profileId').isMongoId().withMessage('Invalid profile ID'),
];
