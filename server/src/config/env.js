// server/src/config/env.js
import dotenv from 'dotenv';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  SUPABASE_DB_PASSWORD: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  WEATHER_API_KEY: z.string().optional(),
  WEATHER_API_BASE_URL: z.string().default('https://api.open-meteo.com/v1'),
  MAX_FILE_SIZE_MB: z.coerce.number().default(8),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  AI_REQUEST_LIMIT_PER_HOUR: z.coerce.number().default(30),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().default(30000),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.warn('Environment validation warnings:', parsed.error.format());
}

export const env = parsed.success ? parsed.data : {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  DATABASE_URL: process.env.DATABASE_URL || '',
  SUPABASE_DB_PASSWORD: process.env.SUPABASE_DB_PASSWORD || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
  WEATHER_API_BASE_URL: process.env.WEATHER_API_BASE_URL || 'https://api.open-meteo.com/v1',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '8', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  AI_REQUEST_LIMIT_PER_HOUR: parseInt(process.env.AI_REQUEST_LIMIT_PER_HOUR || '30', 10),
  AI_REQUEST_TIMEOUT_MS: parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '30000', 10),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
