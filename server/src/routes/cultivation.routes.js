// server/src/routes/cultivation.routes.js
import { Router } from 'express';
import { cultivationController } from '../controllers/cultivation.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);
router.get('/', cultivationController.listPlans);
router.post('/', aiRateLimiter, cultivationController.createPlan);
router.get('/:id', cultivationController.getPlanById);
router.patch('/tasks/:taskId', cultivationController.updateTaskStatus);

export default router;
