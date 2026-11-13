// server/src/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const standardRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: env.RATE_LIMIT_MAX_REQUESTS || 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many requests from this IP address. Please try again after 15 minutes.',
      'RATE_LIMIT_EXCEEDED',
      [],
      429
    );
  },
});

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: env.AI_REQUEST_LIMIT_PER_HOUR || 30, // 30 AI requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Hourly AI advisory request quota reached. Please wait before submitting more analyses.',
      'AI_QUOTA_EXCEEDED',
      [],
      429
    );
  },
});
