// server/src/routes/farm.routes.js
import { Router } from 'express';
import { farmController } from '../controllers/farm.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', farmController.getFarms);
router.post('/', farmController.createFarm);
router.get('/:farmId', farmController.getFarmById);
router.patch('/:farmId', farmController.updateFarm);
router.delete('/:farmId', farmController.deleteFarm);

export default router;
