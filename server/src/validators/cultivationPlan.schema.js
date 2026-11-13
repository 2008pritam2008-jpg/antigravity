// server/src/validators/cultivationPlan.schema.js
import { z } from 'zod';

export const createCultivationPlanSchema = z.object({
  farmId: z.string().uuid('Invalid farm ID format'),
  cropName: z.string().trim().min(2, 'Crop name is required').max(100),
  landArea: z.coerce.number().positive('Land area must be positive'),
  areaUnit: z.enum(['acre', 'hectare']).default('acre'),
  sowingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Sowing date must be YYYY-MM-DD format'),
  expectedHarvestDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Harvest date must be YYYY-MM-DD format').optional().nullable(),
  irrigationType: z.string().min(2).optional(),
  preferredPlanLanguage: z.string().default('en'),
});

export const updateCultivationTaskSchema = z.object({
  status: z.enum(['pending', 'completed', 'skipped']),
  completedAt: z.string().datetime().optional().nullable(),
});
