// server/src/middleware/error.middleware.js
import { ZodError } from 'zod';
import { ApiResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('Unhandled Application Exception:', err);

  if (err instanceof ZodError) {
    const errorDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return ApiResponse.error(res, 'Request validation failed', 'VALIDATION_ERROR', errorDetails, 400);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred';
  const code = err.code || 'INTERNAL_ERROR';

  return ApiResponse.error(res, message, code, [], statusCode);
}
