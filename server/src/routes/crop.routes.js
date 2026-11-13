// server/src/routes/crop.routes.js
import { Router } from 'express';
import { cropController } from '../controllers/crop.controller.js';

const router = Router();

// Publicly readable active crops
router.get('/', cropController.getCrops);
router.get('/categories', cropController.getCategories);
router.get('/:cropId', cropController.getCropById);

export default router;
