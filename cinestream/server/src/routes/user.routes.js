import { Router } from 'express';
import { getCurrentUser, updateCurrentUser, deactivateAccount } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/me', getCurrentUser);
router.patch('/me', updateCurrentUser);
router.delete('/me', deactivateAccount);

export default router;
