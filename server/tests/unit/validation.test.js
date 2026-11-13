// server/tests/unit/validation.test.js
import { describe, it, expect } from 'vitest';
import { farmSchema } from '../../src/validators/farm.schema.js';
import { cropRecommendationRequestSchema } from '../../src/validators/cropRecommendation.schema.js';
import { diseaseAnalysisRequestSchema } from '../../src/validators/diseaseAnalysis.schema.js';

describe('Zod Validation Schemas', () => {
  it('validates a valid farm payload', () => {
    const validFarm = {
      farmName: 'Krishna Valley Farm',
      state: 'Maharashtra',
      district: 'Nashik',
      landArea: 5.5,
      areaUnit: 'acre',
      soilType: 'black soil',
      soilPh: 6.8,
      nitrogen: 210,
      phosphorus: 25,
      potassium: 180,
      irrigationType: 'drip_system',
      waterAvailability: 'abundant',
    };
    const parsed = farmSchema.safeParse(validFarm);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid pH levels outside 0-14 range', () => {
    const invalidFarm = {
      farmName: 'Out of bounds pH Farm',
      state: 'Punjab',
      district: 'Ludhiana',
      landArea: 10,
      areaUnit: 'acre',
      soilPh: 15.5, // Invalid
      irrigationType: 'canal',
      waterAvailability: 'medium',
    };
    const parsed = farmSchema.safeParse(invalidFarm);
    expect(parsed.success).toBe(false);
  });

  it('validates crop recommendation request payload', () => {
    const validRec = {
      farmId: '11111111-1111-1111-1111-111111111111',
      season: 'Rabi',
      targetCultivationArea: 3,
      budgetInr: 50000,
    };
    const parsed = cropRecommendationRequestSchema.safeParse(validRec);
    expect(parsed.success).toBe(true);
  });

  it('rejects disease analysis with too short symptom description', () => {
    const invalidDisease = {
      cropName: 'Tomato',
      affectedPart: 'leaf',
      symptoms: 'bad', // under 10 chars
    };
    const parsed = diseaseAnalysisRequestSchema.safeParse(invalidDisease);
    expect(parsed.success).toBe(false);
  });
});
