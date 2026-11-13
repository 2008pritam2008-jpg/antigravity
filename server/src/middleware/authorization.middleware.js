// server/src/middleware/authorization.middleware.js
import { ApiResponse } from '../utils/apiResponse.js';

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return ApiResponse.error(res, 'Authentication required', 'UNAUTHORIZED', [], 401);
  }

  if (req.user.role !== 'admin') {
    return ApiResponse.error(res, 'Administrator privileges required for this action', 'FORBIDDEN', [], 403);
  }

  next();
}
