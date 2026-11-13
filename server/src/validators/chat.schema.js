// server/src/validators/chat.schema.js
import { z } from 'zod';

export const createConversationSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  title: z.string().trim().max(100).default('New Conversation'),
});

export const sendMessageSchema = z.object({
  content: z.string().trim().min(1, 'Message content cannot be empty').max(2000),
  farmId: z.string().uuid().optional().nullable(),
  language: z.string().default('en'),
});
