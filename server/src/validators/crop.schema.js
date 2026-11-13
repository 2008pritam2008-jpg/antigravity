// server/src/validators/crop.schema.js
import { z } from 'zod';

export const cropSchema = z.object({
  name: z.string().trim().min(2).max(100),
  scientificName: z.string().trim().max(150).optional().nullable(),
  category: z.string().trim().min(2).max(50),
  description: z.string().max(1000).optional().nullable(),
  suitableSoilTypes: z.array(z.string()).default([]),
  suitableSeasons: z.array(z.string()).default([]),
  waterRequirement: z.string().max(100).optional().nullable(),
  growthDurationDays: z.coerce.number().int().positive().optional().nullable(),
  supportedRegions: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});
