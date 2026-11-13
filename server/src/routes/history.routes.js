// server/src/routes/history.routes.js
import { Router } from 'express';
import { historyController } from '../controllers/history.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', historyController.getHistorySummary);

export default router;
