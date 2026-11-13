// server/src/controllers/profile.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { updateProfileSchema } from '../validators/profile.schema.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const profileController = {
  async getProfile(req, res, next) {
    try {
      let profile = await dbRepository.getProfile(req.user.id);
      if (!profile) {
        // Auto-create default profile if missing
        profile = await dbRepository.upsertProfile(req.user.id, {
          fullName: req.user.fullName || 'Farmer',
          preferredLanguage: 'en',
          role: req.user.role || 'farmer',
          onboardingCompleted: false,
        });
      }
      return ApiResponse.success(res, profile, 'Profile retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const validated = updateProfileSchema.parse(req.body);
      const updated = await dbRepository.upsertProfile(req.user.id, validated);
      return ApiResponse.success(res, updated, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  },
};
