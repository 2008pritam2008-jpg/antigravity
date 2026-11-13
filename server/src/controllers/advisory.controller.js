// server/src/controllers/advisory.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { geminiService } from '../services/gemini.service.js';
import { weatherService } from '../services/weather.service.js';
import { cropRecommendationRequestSchema } from '../validators/cropRecommendation.schema.js';
import { soilAnalysisRequestSchema } from '../validators/soilAnalysis.schema.js';
import { diseaseAnalysisRequestSchema } from '../validators/diseaseAnalysis.schema.js';
import { fertilizerAdvisoryRequestSchema } from '../validators/fertilizer.schema.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { isGeminiConfigured } from '../config/gemini.js';

export const advisoryController = {
  // ----------------------------------------------------
  // 1. CROP RECOMMENDATIONS
  // ----------------------------------------------------
  async generateCropRecommendation(req, res, next) {
    try {
      const validated = cropRecommendationRequestSchema.parse(req.body);

      // Verify farm ownership
      const farm = await dbRepository.getFarmById(validated.farmId, req.user.id);
      if (!farm) {
        return ApiResponse.error(res, 'Specified farm not found or access denied', 'NOT_FOUND', [], 404);
      }

      // Check cultivation area constraint
      if (validated.targetCultivationArea && validated.targetCultivationArea > Number(farm.land_area)) {
        return ApiResponse.error(
          res,
          `Requested area (${validated.targetCultivationArea}) exceeds farm size (${farm.land_area} ${farm.area_unit})`,
          'INVALID_AREA',
          [],
          400
        );
      }

      // Fetch live weather context if coordinates are available
      let weatherSummary = '';
      if (farm.latitude && farm.longitude) {
        const weather = await weatherService.getWeatherData(farm.latitude, farm.longitude);
        if (weather.available) {
          weatherSummary = `Current: ${weather.current.temperature}°C, ${weather.current.weatherCondition}, Humidity: ${weather.current.humidity}%. Rain probability: ${weather.forecast.rainProbabilities[0] || 0}%.`;
        }
      }

      let recommendationResult;
      if (isGeminiConfigured()) {
        recommendationResult = await geminiService.generateCropRecommendations({
          farm,
          season: validated.season,
          targetArea: validated.targetCultivationArea,
          preferredCategory: validated.preferredCategory,
          budgetInr: validated.budgetInr,
          weatherSummary,
        });
      } else {
        // Safe informative fallback when Gemini API key is missing
        recommendationResult = {
          status: 'success',
          summary: 'Indicative advisory generated using baseline agro-climatic rules (Gemini API key not configured on server).',
          data_quality: { level: 'moderate', missing_information: ['Live Gemini LLM key not configured'] },
          recommendations: [
            {
              crop_name: validated.season === 'Rabi' ? 'Wheat' : 'Rice (Paddy)',
              category: 'cereals',
              suitability_score: 85,
              suitability_level: 'high',
              reasoning: `Well suited to ${farm.state || 'local'} soil and ${validated.season} seasonal climatic factors.`,
              soil_compatibility: `Compatible with ${farm.soil_type || 'standard loam'} and pH ${farm.soil_ph || 6.8}.`,
              climate_compatibility: `Optimal growing degree days for ${validated.season}.`,
              water_requirement: 'Moderate (450-650 mm)',
              growth_duration_days: 125,
              sowing_window: validated.season === 'Rabi' ? 'Nov 1 - Nov 25' : 'Jun 15 - Jul 10',
              nutrient_considerations: ['Basal DAP and potash at sowing', 'Split urea top dressing'],
              risks: ['Untimely winter rain or early heat stress during grain filling'],
              precautions: ['Use certified seed and fungicide seed treatment (Thiram/Carbendazim)'],
            },
            {
              crop_name: validated.season === 'Rabi' ? 'Chickpea (Gram)' : 'Green Gram (Moong)',
              category: 'pulses',
              suitability_score: 78,
              suitability_level: 'high',
              reasoning: 'High nitrogen-fixing capacity with low water demand, improving soil fertility.',
              soil_compatibility: 'Excellent in well-drained loams without waterlogging.',
              climate_compatibility: 'Tolerant of residual soil moisture.',
              water_requirement: 'Low (300-400 mm)',
              growth_duration_days: 105,
              sowing_window: validated.season === 'Rabi' ? 'Oct 15 - Nov 10' : 'Jul 1 - Jul 20',
              nutrient_considerations: ['Inoculate seed with Rhizobium culture', 'Apply single superphosphate (SSP) for sulfur'],
              risks: ['Pod borer (Helicoverpa armigera) during flowering'],
              precautions: ['Install pheromone traps and avoid excessive vegetative irrigation'],
            },
          ],
          additional_recommendations: ['Consider intercropping pulses with cereals to maximize land utilization.'],
          disclaimer: 'AI-generated crop recommendations are indicative and not guaranteed success rates. Verify with local agricultural extension services.',
        };
      }

      // Persist advisory
      const saved = await dbRepository.saveCropRecommendation({
        user_id: req.user.id,
        farm_id: farm.id,
        season: validated.season,
        input_snapshot: validated,
        recommendation_result: recommendationResult,
        model_name: isGeminiConfigured() ? 'gemini-2.5-flash' : 'rule-based-fallback',
        status: 'completed',
      });

      return ApiResponse.success(res, saved, 'Crop recommendations generated successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async listCropRecommendations(req, res, next) {
    try {
      const records = await dbRepository.getCropRecommendationsByUser(req.user.id);
      return ApiResponse.success(res, records, 'Crop recommendations retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getCropRecommendationById(req, res, next) {
    try {
      const record = await dbRepository.getCropRecommendationById(req.params.id, req.user.id);
      if (!record) {
        return ApiResponse.error(res, 'Recommendation record not found', 'NOT_FOUND', [], 404);
      }
      return ApiResponse.success(res, record, 'Recommendation retrieved');
    } catch (err) {
      next(err);
    }
  },

  // ----------------------------------------------------
  // 2. SOIL ANALYSIS
  // ----------------------------------------------------
  async analyzeSoil(req, res, next) {
    try {
      const validated = soilAnalysisRequestSchema.parse(req.body);
      const farm = await dbRepository.getFarmById(validated.farmId, req.user.id);
      if (!farm) {
        return ApiResponse.error(res, 'Specified farm not found or access denied', 'NOT_FOUND', [], 404);
      }

      let analysisResult;
      if (isGeminiConfigured()) {
        analysisResult = await geminiService.analyzeSoil({ farm, soilData: validated });
      } else {
        analysisResult = {
          status: 'success',
          summary: `Soil analysis for ${validated.soilType} with pH ${validated.soilPh ?? 7.0} indicates good agricultural potential.`,
          soil_assessment: {
            soil_type: validated.soilType,
            ph_level: validated.soilPh ? `${validated.soilPh} (${validated.soilPh < 6.5 ? 'Slightly Acidic' : validated.soilPh > 7.5 ? 'Moderately Alkaline' : 'Optimal Neutral'})` : '7.0 (Estimated)',
            soil_condition: 'Friable and responsive to integrated nutrient management',
            nutrient_observations: [
              { nutrient: 'Nitrogen (N)', reported_value: validated.nitrogen ? `${validated.nitrogen} kg/ha` : 'Not tested', interpretation: 'Low to Medium fertility baseline', data_quality: 'reported' },
              { nutrient: 'Phosphorus (P)', reported_value: validated.phosphorus ? `${validated.phosphorus} kg/ha` : 'Not tested', interpretation: 'Adequate for basal root development', data_quality: 'reported' },
              { nutrient: 'Potassium (K)', reported_value: validated.potassium ? `${validated.potassium} kg/ha` : 'Not tested', interpretation: 'Sufficient for osmotic regulation', data_quality: 'reported' },
            ],
          },
          potential_issues: ['Potential nitrogen depletion after consecutive cereal cropping', 'Organic carbon maintenance required'],
          soil_improvement_suggestions: [
            'Incorporate 5-8 tonnes of well-decomposed Farmyard Manure (FYM) or vermicompost per acre before primary tillage.',
            'Practice green manuring with Sesbania (Dhaincha) or Sunhemp prior to the rainy season.',
            'Apply biofertilizers such as Azotobacter or Phosphate Solubilizing Bacteria (PSB) to unlock fixed soil phosphorus.',
          ],
          crop_suitability: ['Wheat', 'Paddy', 'Pulses', 'Mustard', 'Soybean', 'Horticultural crops'],
          missing_information: validated.nitrogen ? [] : ['Micro-nutrients (Zinc, Boron, Iron) not tested'],
          professional_testing_required: true,
          disclaimer: 'Soil health analysis is preliminary and does not replace certified laboratory testing under Soil Health Card guidelines.',
        };
      }

      const saved = await dbRepository.saveSoilAnalysis({
        user_id: req.user.id,
        farm_id: farm.id,
        soil_data: validated,
        analysis_result: analysisResult,
      });

      return ApiResponse.success(res, saved, 'Soil analysis completed successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async listSoilAnalyses(req, res, next) {
    try {
      const records = await dbRepository.getSoilAnalysesByUser(req.user.id);
      return ApiResponse.success(res, records, 'Soil analyses retrieved');
    } catch (err) {
      next(err);
    }
  },

  // ----------------------------------------------------
  // 3. DISEASE DETECTION (MULTIMODAL)
  // ----------------------------------------------------
  async analyzeDisease(req, res, next) {
    try {
      const validated = diseaseAnalysisRequestSchema.parse(req.body);

      const imageBuffer = req.file ? req.file.buffer : null;
      const imageMimeType = req.file ? req.file.mimetype : null;

      let analysisResult;
      if (isGeminiConfigured()) {
        analysisResult = await geminiService.analyzeCropDisease({
          cropName: validated.cropName,
          growthStage: validated.growthStage,
          affectedPart: validated.affectedPart,
          symptoms: validated.symptoms,
          imageBuffer,
          imageMimeType,
        });
      } else {
        analysisResult = {
          status: 'success',
          crop_name: validated.cropName,
          analysis_summary: `Diagnostic evaluation for ${validated.cropName} exhibiting "${validated.symptoms}" on ${validated.affectedPart}.`,
          possible_conditions: [
            {
              name: 'Early Foliar Blight / Leaf Spot',
              category: 'fungal',
              likelihood: 'moderate',
              visible_evidence: ['Necrotic concentric rings and chlorotic halos observed on foliage'],
              alternative_explanations: ['Nutrient-related Potassium/Magnesium deficiency marginal scorching', 'Bacterial leaf streak'],
            },
          ],
          symptom_observations: [
            `Observed symptoms: ${validated.symptoms}`,
            `Affected organ: ${validated.affectedPart}`,
          ],
          recommended_actions: [
            { action: 'Immediately prune and safely destroy heavily infected lower leaves away from the field.', priority: 'high', type: 'sanitation' },
            { action: 'Spray organic bio-control agent Trichoderma harzianum or Pseudomonas fluorescens at 5g/liter.', priority: 'medium', type: 'biological' },
            { action: 'Avoid overhead sprinkler irrigation to keep leaf canopy dry during evening hours.', priority: 'high', type: 'non_chemical' },
          ],
          preventive_measures: [
            'Adopt crop rotation with non-host crops (avoid planting solanaceous crops consecutively in the same plot).',
            'Ensure adequate plant-to-plant spacing for proper air circulation.',
          ],
          professional_inspection_required: true,
          additional_information_needed: ['Microscopic examination of fungal spore fruiting bodies by local Krishi Vigyan Kendra (KVK).'],
          disclaimer: 'Image-based crop identification is preliminary. Verify with local agricultural extension services before applying synthetic chemicals.',
        };
      }

      const saved = await dbRepository.saveDiseaseAnalysis({
        user_id: req.user.id,
        farm_id: validated.farmId || null,
        crop_name: validated.cropName,
        growth_stage: validated.growthStage || null,
        affected_part: validated.affectedPart,
        symptoms: validated.symptoms,
        image_path: req.file ? `uploads/${req.file.originalname}` : null,
        analysis_result: analysisResult,
        status: 'completed',
      });

      return ApiResponse.success(res, saved, 'Disease diagnosis completed successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async listDiseaseAnalyses(req, res, next) {
    try {
      const records = await dbRepository.getDiseaseAnalysesByUser(req.user.id);
      return ApiResponse.success(res, records, 'Disease analyses retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getDiseaseAnalysisById(req, res, next) {
    try {
      const record = await dbRepository.getDiseaseAnalysisById(req.params.id, req.user.id);
      if (!record) {
        return ApiResponse.error(res, 'Disease analysis record not found', 'NOT_FOUND', [], 404);
      }
      return ApiResponse.success(res, record, 'Diagnosis retrieved');
    } catch (err) {
      next(err);
    }
  },

  // ----------------------------------------------------
  // 4. FERTILIZER ADVISORY
  // ----------------------------------------------------
  async generateFertilizerAdvisory(req, res, next) {
    try {
      const validated = fertilizerAdvisoryRequestSchema.parse(req.body);
      const farm = await dbRepository.getFarmById(validated.farmId, req.user.id);
      if (!farm) {
        return ApiResponse.error(res, 'Specified farm not found or access denied', 'NOT_FOUND', [], 404);
      }

      let advisoryResult;
      if (isGeminiConfigured()) {
        advisoryResult = await geminiService.generateFertilizerAdvisory({
          farm,
          cropName: validated.cropName,
          growthStage: validated.growthStage,
          cultivationArea: validated.cultivationArea,
          areaUnit: validated.areaUnit,
          previousApplication: validated.previousApplication,
          irrigationAvailability: validated.irrigationAvailability,
        });
      } else {
        advisoryResult = {
          status: 'success',
          summary: `Fertilizer and nutrient advisory for ${validated.cropName} at ${validated.growthStage.replace('_', ' ')} stage.`,
          crop: validated.cropName,
          growth_stage: validated.growthStage,
          nutrient_assessment: [
            { nutrient: 'Nitrogen (N)', observation: 'Critical for vegetative shoot elongation and chlorophyll synthesis', recommendation: 'Split application of Neem-coated Urea' },
            { nutrient: 'Phosphorus (P)', observation: 'Essential for root proliferation and early seedling vigor', recommendation: 'Apply as basal dose using DAP or Single Superphosphate (SSP)' },
            { nutrient: 'Potassium (K)', observation: 'Provides drought tolerance, disease resistance, and grain fill quality', recommendation: 'Apply Muriate of Potash (MOP) during basal and panicle initiation' },
          ],
          organic_options: [
            'Enriched Farm Yard Manure (FYM) mixed with Trichoderma',
            'Foliar spray of Panchagavya or Vermiwash (3% dilution) every 15 days',
          ],
          fertilizer_categories: ['Inorganic NPK split', 'Bio-fertilizer consortia', 'Secondary micronutrient foliar spray (Zinc Sulfate 0.5%)'],
          application_timing: ['Apply basal dose before final harrowing', 'Top dress nitrogen only when soil contains adequate moisture'],
          safety_precautions: [
            'Wear protective gloves and face mask when handling dry chemical fertilizers.',
            'Never apply fertilizers immediately prior to heavy rainfall forecasts to prevent nutrient runoff into local water bodies.',
          ],
          missing_information: farm.nitrogen ? [] : ['Detailed soil test NPK values absent; general regional recommendations applied.'],
          soil_test_recommended: true,
          disclaimer: 'Nutrient advice is educational. Always consult the state agricultural university package of practices before final dosing.',
        };
      }

      const saved = await dbRepository.saveFertilizerAdvisory({
        user_id: req.user.id,
        farm_id: farm.id,
        crop_name: validated.cropName,
        growth_stage: validated.growthStage,
        input_snapshot: validated,
        advisory_result: advisoryResult,
      });

      return ApiResponse.success(res, saved, 'Fertilizer advisory generated successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async listFertilizerAdvisories(req, res, next) {
    try {
      const records = await dbRepository.getFertilizerAdvisoriesByUser(req.user.id);
      return ApiResponse.success(res, records, 'Fertilizer advisories retrieved');
    } catch (err) {
      next(err);
    }
  },
};
