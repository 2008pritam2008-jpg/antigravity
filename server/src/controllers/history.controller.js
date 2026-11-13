// server/src/controllers/history.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const historyController = {
  async getHistorySummary(req, res, next) {
    try {
      const [cropRecs, soilAnalyses, diseaseAnalyses, fertilizerAdvisories, cultivationPlans] = await Promise.all([
        dbRepository.getCropRecommendationsByUser(req.user.id),
        dbRepository.getSoilAnalysesByUser(req.user.id),
        dbRepository.getDiseaseAnalysesByUser(req.user.id),
        dbRepository.getFertilizerAdvisoriesByUser(req.user.id),
        dbRepository.getCultivationPlansByUser(req.user.id),
      ]);

      const formatted = [
        ...cropRecs.map((r) => ({
          id: r.id,
          type: 'crop_recommendation',
          title: `Crop Recommendation (${r.season})`,
          summary: r.recommendation_result?.summary || 'Recommended crops based on soil and climate',
          createdAt: r.created_at,
          data: r,
        })),
        ...soilAnalyses.map((s) => ({
          id: s.id,
          type: 'soil_analysis',
          title: `Soil Health Analysis`,
          summary: s.analysis_result?.summary || 'Soil condition and nutrient interpretation',
          createdAt: s.created_at,
          data: s,
        })),
        ...diseaseAnalyses.map((d) => ({
          id: d.id,
          type: 'disease_analysis',
          title: `Disease Diagnosis: ${d.crop_name}`,
          summary: d.analysis_result?.analysis_summary || d.symptoms,
          createdAt: d.created_at,
          data: d,
        })),
        ...fertilizerAdvisories.map((f) => ({
          id: f.id,
          type: 'fertilizer_advisory',
          title: `Nutrient Advisory: ${f.crop_name}`,
          summary: f.advisory_result?.summary || `Stage: ${f.growth_stage}`,
          createdAt: f.created_at,
          data: f,
        })),
        ...cultivationPlans.map((p) => ({
          id: p.id,
          type: 'cultivation_plan',
          title: `Cultivation Plan: ${p.crop_name}`,
          summary: `Area: ${p.land_area} ${p.area_unit}, Sowing: ${p.sowing_date}`,
          createdAt: p.created_at,
          data: p,
        })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return ApiResponse.success(res, formatted, 'Advisory history retrieved');
    } catch (err) {
      next(err);
    }
  },
};
