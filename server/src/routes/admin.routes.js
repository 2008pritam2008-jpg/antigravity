// server/src/routes/admin.routes.js
import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/authorization.middleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/audit-logs', adminController.getAuditLogs);
router.post('/crops', adminController.createCrop);

export default router;
