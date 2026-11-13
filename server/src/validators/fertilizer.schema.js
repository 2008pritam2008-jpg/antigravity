// server/src/validators/fertilizer.schema.js
import { z } from 'zod';

export const fertilizerAdvisoryRequestSchema = z.object({
  farmId: z.string().uuid('Invalid farm ID format'),
  cropName: z.string().trim().min(2, 'Crop name is required').max(100),
  growthStage: z.enum([
    'basal_sowing',
    'vegetative',
    'tillering_branching',
    'flowering_heading',
    'grain_fruit_development',
    'maturity'
  ]),
  cultivationArea: z.coerce.number().positive('Cultivation area must be greater than 0'),
  areaUnit: z.enum(['acre', 'hectare']).default('acre'),
  previousApplication: z.string().max(500).optional().nullable(),
  irrigationAvailability: z.string().min(2).optional().nullable(),
});
