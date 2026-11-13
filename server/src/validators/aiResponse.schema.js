// server/src/validators/aiResponse.schema.js
import { z } from 'zod';

export const cropRecommendationResponseSchema = z.object({
  status: z.string().default('success'),
  summary: z.string(),
  data_quality: z.object({
    level: z.enum(['high', 'moderate', 'low', 'insufficient_data']).default('moderate'),
    missing_information: z.array(z.string()).default([]),
  }).default({ level: 'moderate', missing_information: [] }),
  recommendations: z.array(
    z.object({
      crop_name: z.string(),
      category: z.string().default('general'),
      suitability_score: z.number().min(0).max(100).default(75),
      suitability_level: z.enum(['high', 'moderate', 'low', 'insufficient_data']).default('high'),
      reasoning: z.string(),
      soil_compatibility: z.string(),
      climate_compatibility: z.string(),
      water_requirement: z.string(),
      growth_duration_days: z.number().int().positive().default(120),
      sowing_window: z.string(),
      nutrient_considerations: z.array(z.string()).default([]),
      risks: z.array(z.string()).default([]),
      precautions: z.array(z.string()).default([]),
    })
  ).default([]),
  additional_recommendations: z.array(z.string()).default([]),
  disclaimer: z.string().default('AI-generated crop recommendations are indicative and not guaranteed success rates.'),
});

export const soilAnalysisResponseSchema = z.object({
  status: z.string().default('success'),
  summary: z.string(),
  soil_assessment: z.object({
    soil_type: z.string(),
    ph_level: z.string(),
    soil_condition: z.string(),
    nutrient_observations: z.array(
      z.object({
        nutrient: z.string(),
        reported_value: z.string(),
        interpretation: z.string(),
        data_quality: z.string().default('verified_input'),
      })
    ).default([]),
  }),
  potential_issues: z.array(z.string()).default([]),
  soil_improvement_suggestions: z.array(z.string()).default([]),
  crop_suitability: z.array(z.string()).default([]),
  missing_information: z.array(z.string()).default([]),
  professional_testing_required: z.boolean().default(true),
  disclaimer: z.string().default('Soil health analysis is preliminary and does not replace certified laboratory testing.'),
});

export const diseaseDetectionResponseSchema = z.object({
  status: z.string().default('success'),
  crop_name: z.string(),
  analysis_summary: z.string(),
  possible_conditions: z.array(
    z.object({
      name: z.string(),
      category: z.enum([
        'fungal',
        'bacterial',
        'viral',
        'pest',
        'nutrient_deficiency',
        'environmental_stress',
        'unknown',
      ]).default('unknown'),
      likelihood: z.enum(['low', 'moderate', 'high', 'inconclusive']).default('moderate'),
      visible_evidence: z.array(z.string()).default([]),
      alternative_explanations: z.array(z.string()).default([]),
    })
  ).default([]),
  symptom_observations: z.array(z.string()).default([]),
  recommended_actions: z.array(
    z.object({
      action: z.string(),
      priority: z.enum(['high', 'medium', 'low', 'critical']).default('medium'),
      type: z.enum(['non_chemical', 'biological', 'chemical', 'sanitation']).default('non_chemical'),
    })
  ).default([]),
  preventive_measures: z.array(z.string()).default([]),
  professional_inspection_required: z.boolean().default(true),
  additional_information_needed: z.array(z.string()).default([]),
  disclaimer: z.string().default('Image-based crop identification is preliminary. Verify with local agricultural extension services.'),
});

export const fertilizerAdvisoryResponseSchema = z.object({
  status: z.string().default('success'),
  summary: z.string(),
  crop: z.string(),
  growth_stage: z.string(),
  nutrient_assessment: z.array(
    z.object({
      nutrient: z.string(),
      observation: z.string(),
      recommendation: z.string(),
    })
  ).default([]),
  organic_options: z.array(z.string()).default([]),
  fertilizer_categories: z.array(z.string()).default([]),
  application_timing: z.array(z.string()).default([]),
  safety_precautions: z.array(z.string()).default([]),
  missing_information: z.array(z.string()).default([]),
  soil_test_recommended: z.boolean().default(true),
  disclaimer: z.string().default('Nutrient advice is educational. Always follow manufacturer labels and state agricultural university package of practices.'),
});

export const cultivationPlanResponseSchema = z.object({
  status: z.string().default('success'),
  crop_name: z.string(),
  plan_summary: z.string(),
  expected_duration_days: z.number().int().positive().default(120),
  expected_harvest_window: z.string(),
  stages: z.array(
    z.object({
      stage_name: z.string(),
      day_from_sowing: z.number().int().nonnegative(),
      duration_days: z.number().int().positive(),
      description: z.string(),
      activities: z.array(z.string()).default([]),
      irrigation_guidance: z.string().default(''),
      nutrient_guidance: z.string().default(''),
      risk_factors: z.array(z.string()).default([]),
    })
  ).default([]),
  important_precautions: z.array(z.string()).default([]),
  missing_information: z.array(z.string()).default([]),
  disclaimer: z.string().default('Cultivation plans are guideline projections subject to actual microclimate, weather, and pest incidence.'),
});

export const chatResponseSchema = z.object({
  status: z.string().default('success'),
  answer: z.string(),
  topic: z.string().default('General Agricultural Guidance'),
  key_points: z.array(z.string()).default([]),
  recommended_actions: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  follow_up_question: z.string().default(''),
  confidence: z.enum(['low', 'moderate', 'high']).default('moderate'),
  disclaimer: z.string().default('AgriAssist is an AI assistant, not a substitute for professional field inspection.'),
});
