// server/src/validators/diseaseAnalysis.schema.js
import { z } from 'zod';

export const diseaseAnalysisRequestSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  cropName: z.string().trim().min(2, 'Crop name must be at least 2 characters').max(100),
  growthStage: z.string().trim().max(100).optional().nullable(),
  affectedPart: z.enum(['leaf', 'stem', 'fruit', 'flower', 'root', 'whole_plant', 'other']),
  symptoms: z.string().trim().min(10, 'Please describe observed symptoms in at least 10 characters').max(1000),
});
