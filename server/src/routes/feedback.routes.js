// server/src/routes/feedback.routes.js
import { Router } from 'express';
import { feedbackController } from '../controllers/feedback.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.post('/', feedbackController.submitFeedback);

export default router;
