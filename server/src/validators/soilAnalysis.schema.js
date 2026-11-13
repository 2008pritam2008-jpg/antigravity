// server/src/validators/soilAnalysis.schema.js
import { z } from 'zod';

export const soilAnalysisRequestSchema = z.object({
  farmId: z.string().uuid('Invalid farm ID format'),
  soilType: z.string().min(2, 'Soil type is required'),
  soilPh: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().nonnegative().optional().nullable(),
  phosphorus: z.coerce.number().nonnegative().optional().nullable(),
  potassium: z.coerce.number().nonnegative().optional().nullable(),
  organicCarbon: z.coerce.number().min(0).max(100).optional().nullable(),
  electricalConductivity: z.coerce.number().nonnegative().optional().nullable(),
  targetCrop: z.string().max(100).optional().nullable(),
  additionalObservations: z.string().max(1000).optional().nullable(),
});
