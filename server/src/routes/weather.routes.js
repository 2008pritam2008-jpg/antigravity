// server/src/routes/weather.routes.js
import { Router } from 'express';
import { weatherController } from '../controllers/weather.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/current', weatherController.getCurrentWeather);
router.get('/forecast', weatherController.getForecast);
router.get('/agricultural-advisory', weatherController.getAgriculturalAdvisory);

export default router;
