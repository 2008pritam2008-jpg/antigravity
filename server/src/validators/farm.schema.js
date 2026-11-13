// server/src/validators/farm.schema.js
import { z } from 'zod';

export const farmSchema = z.object({
  farmName: z.string().trim().min(2, 'Farm name must be at least 2 characters').max(100),
  state: z.string().trim().min(2, 'State is required').max(100),
  district: z.string().trim().min(2, 'District is required').max(100),
  village: z.string().trim().max(100).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  landArea: z.coerce.number().positive('Land area must be greater than 0').max(1000000),
  areaUnit: z.enum(['acre', 'hectare']).default('acre'),
  soilType: z.string().trim().optional().nullable(),
  soilPh: z.coerce.number().min(0).max(14).optional().nullable(),
  nitrogen: z.coerce.number().nonnegative().optional().nullable(),
  phosphorus: z.coerce.number().nonnegative().optional().nullable(),
  potassium: z.coerce.number().nonnegative().optional().nullable(),
  organicCarbon: z.coerce.number().min(0).max(100).optional().nullable(),
  electricalConductivity: z.coerce.number().nonnegative().optional().nullable(),
  irrigationType: z.string().trim().min(2, 'Irrigation type is required'),
  waterAvailability: z.string().trim().min(2, 'Water availability is required'),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateFarmSchema = farmSchema.partial();
