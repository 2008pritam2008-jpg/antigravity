// server/src/controllers/cultivation.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { geminiService } from '../services/gemini.service.js';
import { createCultivationPlanSchema, updateCultivationTaskSchema } from '../validators/cultivationPlan.schema.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { isGeminiConfigured } from '../config/gemini.js';

export const cultivationController = {
  async createPlan(req, res, next) {
    try {
      const validated = createCultivationPlanSchema.parse(req.body);

      const farm = await dbRepository.getFarmById(validated.farmId, req.user.id);
      if (!farm) {
        return ApiResponse.error(res, 'Specified farm not found or access denied', 'NOT_FOUND', [], 404);
      }

      let planResult;
      if (isGeminiConfigured()) {
        planResult = await geminiService.generateCultivationPlan({
          farm,
          cropName: validated.cropName,
          landArea: validated.landArea,
          areaUnit: validated.areaUnit,
          sowingDate: validated.sowingDate,
          expectedHarvestDate: validated.expectedHarvestDate,
          irrigationType: validated.irrigationType,
        });
      } else {
        const sowing = new Date(validated.sowingDate);
        planResult = {
          status: 'success',
          crop_name: validated.cropName,
          plan_summary: `Step-by-step production protocol for ${validated.cropName} on ${validated.landArea} ${validated.areaUnit}.`,
          expected_duration_days: 120,
          expected_harvest_window: new Date(sowing.getTime() + 120 * 24 * 3600 * 1000).toISOString().split('T')[0],
          stages: [
            {
              stage_name: 'Land Preparation & Basal Manuring',
              day_from_sowing: 0,
              duration_days: 10,
              description: 'Plough field to fine tilth, incorporate 5 tonnes FYM per acre, and level the plot.',
              activities: ['Deep summer ploughing', 'Cross harrowing', 'Basal application of DAP and Potash'],
              irrigation_guidance: 'Pre-sowing irrigation (Rauni/Paleva) to ensure optimum germination moisture.',
              nutrient_guidance: '100% P and K, 33% Nitrogen as basal dose.',
              risk_factors: ['Cloddy seedbed hindering uniform seedling emergence'],
            },
            {
              stage_name: 'Seed Treatment & Sowing',
              day_from_sowing: 10,
              duration_days: 5,
              description: 'Treat certified seeds with bio-fungicide and sow at recommended spacing and depth.',
              activities: ['Treat seed with Trichoderma (4g/kg seed)', 'Sow using seed drill at 4-5 cm depth'],
              irrigation_guidance: 'Maintain light soil moisture without stagnation.',
              nutrient_guidance: 'Seed coating with Rhizobium or Azotobacter biofertilizer.',
              risk_factors: ['Damping off or seed rot if soil is waterlogged'],
            },
            {
              stage_name: 'Early Vegetative & Weeding',
              day_from_sowing: 25,
              duration_days: 15,
              description: 'Crown root initiation, first intercultural weeding, and light irrigation.',
              activities: ['First manual weeding or wheel hoeing', 'Thinning to maintain plant spacing'],
              irrigation_guidance: 'Critical irrigation stage: apply uniform light irrigation.',
              nutrient_guidance: 'Top-dress first split of Neem-coated Urea (33% of total N).',
              risk_factors: ['Weed competition for nutrients and sunlight'],
            },
            {
              stage_name: 'Flowering & Grain/Fruit Development',
              day_from_sowing: 60,
              duration_days: 30,
              description: 'Reproductive anthesis, pod/grain filling, and active insect monitoring.',
              activities: ['Scout for pod borers or sucking pests', 'Install yellow sticky traps'],
              irrigation_guidance: 'Most critical moisture-sensitive phase; avoid any water deficit.',
              nutrient_guidance: 'Optional 2% 19:19:19 or 0:52:34 water-soluble foliar spray.',
              risk_factors: ['Flower drop due to moisture stress or sudden high temperature'],
            },
            {
              stage_name: 'Physiological Maturity & Harvest',
              day_from_sowing: 110,
              duration_days: 10,
              description: 'Senescence of foliage, grain hardening, moisture reduction, and harvest.',
              activities: ['Stop irrigation 10-14 days prior to harvest', 'Harvest at 14-16% grain moisture content'],
              irrigation_guidance: 'Completely withdraw irrigation to facilitate field drying.',
              nutrient_guidance: 'None required.',
              risk_factors: ['Untimely rain or storm causing crop lodging and grain discoloration'],
            },
          ],
          important_precautions: [
            'Ensure clean machinery and storage bins to prevent post-harvest weevil infestation.',
            'Dry produce on clean tarpaulin sheets before bagging.',
          ],
          missing_information: [],
          disclaimer: 'Cultivation timeline is a standard agronomic model. Adjust based on local weather forecasts.',
        };
      }

      // Compute task dates from sowing date
      const baseDate = new Date(validated.sowingDate);
      const tasks = (planResult.stages || []).map((stage) => {
        const taskDate = new Date(baseDate.getTime() + (stage.day_from_sowing || 0) * 24 * 3600 * 1000);
        return {
          title: stage.stage_name,
          description: stage.description,
          task_date: taskDate.toISOString().split('T')[0],
          growth_stage: stage.stage_name,
        };
      });

      const planRecord = {
        user_id: req.user.id,
        farm_id: farm.id,
        crop_name: validated.cropName,
        land_area: validated.landArea,
        area_unit: validated.areaUnit,
        sowing_date: validated.sowingDate,
        expected_harvest_date: planResult.expected_harvest_window || validated.expectedHarvestDate || null,
        plan_data: planResult,
      };

      const savedPlan = await dbRepository.saveCultivationPlan(planRecord, tasks);
      return ApiResponse.success(res, savedPlan, 'Cultivation plan created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async listPlans(req, res, next) {
    try {
      const plans = await dbRepository.getCultivationPlansByUser(req.user.id);
      return ApiResponse.success(res, plans, 'Cultivation plans retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getPlanById(req, res, next) {
    try {
      const plan = await dbRepository.getCultivationPlanById(req.params.id, req.user.id);
      if (!plan) {
        return ApiResponse.error(res, 'Cultivation plan not found', 'NOT_FOUND', [], 404);
      }
      return ApiResponse.success(res, plan, 'Cultivation plan retrieved');
    } catch (err) {
      next(err);
    }
  },

  async updateTaskStatus(req, res, next) {
    try {
      const validated = updateCultivationTaskSchema.parse(req.body);
      const updated = await dbRepository.updateTaskStatus(req.params.taskId, req.user.id, validated.status);
      if (!updated) {
        return ApiResponse.error(res, 'Task not found or update unauthorized', 'NOT_FOUND', [], 404);
      }
      return ApiResponse.success(res, updated, 'Task status updated');
    } catch (err) {
      next(err);
    }
  },
};
