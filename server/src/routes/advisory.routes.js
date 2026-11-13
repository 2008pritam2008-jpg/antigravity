// server/src/routes/advisory.routes.js
import { Router } from 'express';
import { advisoryController } from '../controllers/advisory.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { handleImageUpload } from '../middleware/upload.middleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);

// Crop Recommendations
router.post('/crop-recommendation', aiRateLimiter, advisoryController.generateCropRecommendation);
router.get('/crop-recommendation', advisoryController.listCropRecommendations);
router.get('/crop-recommendation/:id', advisoryController.getCropRecommendationById);

// Soil Health Analyses
router.post('/soil-analysis', aiRateLimiter, advisoryController.analyzeSoil);
router.get('/soil-analysis', advisoryController.listSoilAnalyses);

// Crop Disease Detection (Multimodal with Multer image upload)
router.post('/disease-detection', aiRateLimiter, handleImageUpload('image'), advisoryController.analyzeDisease);
router.get('/disease-detection', advisoryController.listDiseaseAnalyses);
router.get('/disease-detection/:id', advisoryController.getDiseaseAnalysisById);

// Fertilizer & Nutrient Advisories
router.post('/fertilizer', aiRateLimiter, advisoryController.generateFertilizerAdvisory);
router.get('/fertilizer', advisoryController.listFertilizerAdvisories);

export default router;
