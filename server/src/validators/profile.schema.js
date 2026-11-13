// server/src/validators/profile.schema.js
import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100).optional(),
  phone: z.string().trim().max(20).optional().nullable(),
  preferredLanguage: z.string().trim().min(2).max(10).optional(),
  state: z.string().trim().max(100).optional().nullable(),
  district: z.string().trim().max(100).optional().nullable(),
  village: z.string().trim().max(100).optional().nullable(),
  farmingExperience: z.string().trim().max(50).optional().nullable(),
  onboardingCompleted: z.boolean().optional(),
});
