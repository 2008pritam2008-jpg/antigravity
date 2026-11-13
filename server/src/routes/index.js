// server/src/routes/index.js
import { Router } from 'express';
import healthRoutes from './health.routes.js';
import profileRoutes from './profile.routes.js';
import farmRoutes from './farm.routes.js';
import cropRoutes from './crop.routes.js';
import advisoryRoutes from './advisory.routes.js';
import weatherRoutes from './weather.routes.js';
import cultivationRoutes from './cultivation.routes.js';
import chatRoutes from './chat.routes.js';
import historyRoutes from './history.routes.js';
import notificationRoutes from './notification.routes.js';
import feedbackRoutes from './feedback.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/profile', profileRoutes);
router.use('/farms', farmRoutes);
router.use('/crops', cropRoutes);
router.use('/advisories', advisoryRoutes);
router.use('/weather', weatherRoutes);
router.use('/cultivation-plans', cultivationRoutes);
router.use('/chat', chatRoutes);
router.use('/history', historyRoutes);
router.use('/notifications', notificationRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/admin', adminRoutes);

export default router;
