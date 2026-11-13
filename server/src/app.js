// server/src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { standardRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';
import { ApiResponse } from './utils/apiResponse.js';

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server) or from allowed frontend URL
      if (!origin || origin === env.FRONTEND_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Standard Rate Limiter
app.use(standardRateLimiter);

// API v1 Base Route
app.use('/api/v1', apiRouter);

// 404 Fallback Handler
app.use('*', (req, res) => {
  return ApiResponse.error(res, `Cannot ${req.method} ${req.originalUrl}`, 'ENDPOINT_NOT_FOUND', [], 404);
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
