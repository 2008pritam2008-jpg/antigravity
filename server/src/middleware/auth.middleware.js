// server/src/middleware/auth.middleware.js
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { dbRepository } from '../repositories/db.repository.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 'Authentication token missing or invalid format', 'UNAUTHORIZED', [], 401);
    }

    const token = authHeader.split(' ')[1];

    if (isSupabaseConfigured()) {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !user) {
        return ApiResponse.error(res, 'Invalid or expired session token', 'UNAUTHORIZED', [], 401);
      }

      // Fetch user profile from DB to retrieve role
      const profile = await dbRepository.getProfile(user.id);
      req.user = {
        id: user.id,
        email: user.email,
        role: profile?.role || 'farmer',
        fullName: profile?.full_name || user.user_metadata?.full_name || 'Farmer',
      };
      return next();
    }

    // Local / Offline test authentication support
    // Allows testing with sample dev farmer credentials
    if (token.startsWith('demo-token-')) {
      const demoUserId = token.replace('demo-token-', '') || '00000000-0000-0000-0000-000000000001';
      let profile = await dbRepository.getProfile(demoUserId);
      if (!profile) {
        profile = await dbRepository.upsertProfile(demoUserId, {
          fullName: 'Kisan Kumar (Demo)',
          preferredLanguage: 'en',
          state: 'Maharashtra',
          district: 'Nashik',
          role: demoUserId.includes('admin') ? 'admin' : 'farmer',
          onboardingCompleted: true,
        });
      }
      req.user = {
        id: demoUserId,
        email: 'farmer@demo.agriassist.in',
        role: profile.role || 'farmer',
        fullName: profile.full_name,
      };
      return next();
    }

    return ApiResponse.error(res, 'Invalid authentication credentials', 'UNAUTHORIZED', [], 401);
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return ApiResponse.error(res, 'Internal authentication verification error', 'AUTH_ERROR', [], 500);
  }
}
