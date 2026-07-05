import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  changePassword,
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} from '../validators/auth.validators.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', authenticate, logout);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);
router.patch('/change-password', authenticate, changePasswordValidator, validate, changePassword);

export default router;
