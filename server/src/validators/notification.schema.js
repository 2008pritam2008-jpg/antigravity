// server/src/validators/notification.schema.js
import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().trim().min(2).max(150),
  message: z.string().trim().min(2).max(1000),
  type: z.enum(['weather_alert', 'cultivation_task', 'advisory_ready', 'system']),
  relatedEntityId: z.string().uuid().optional().nullable(),
});
