// server/src/routes/profile.routes.js
import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', profileController.getProfile);
router.patch('/', profileController.updateProfile);

export default router;
