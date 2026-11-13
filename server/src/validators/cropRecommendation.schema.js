// server/src/validators/cropRecommendation.schema.js
import { z } from 'zod';

export const cropRecommendationRequestSchema = z.object({
  farmId: z.string().uuid('Invalid farm ID format'),
  season: z.enum(['Kharif', 'Rabi', 'Zaid', 'Perennial', 'All-Season']),
  targetCultivationArea: z.coerce.number().positive().optional(),
  preferredCategory: z.string().optional().nullable(),
  budgetInr: z.coerce.number().nonnegative().optional().nullable(),
  additionalRequirements: z.string().max(500).optional().nullable(),
});
