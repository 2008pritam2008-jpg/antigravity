// server/src/controllers/feedback.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { z } from 'zod';

const feedbackSchema = z.object({
  advisoryType: z.string().min(2),
  advisoryId: z.string().uuid().optional().nullable(),
  rating: z.number().int().min(1).max(5),
  feedbackText: z.string().max(1000).optional().nullable(),
});

export const feedbackController = {
  async submitFeedback(req, res, next) {
    try {
      const validated = feedbackSchema.parse(req.body);
      const saved = await dbRepository.saveFeedback({
        user_id: req.user.id,
        advisory_type: validated.advisoryType,
        advisory_id: validated.advisoryId || null,
        rating: validated.rating,
        feedback_text: validated.feedbackText || null,
      });
      return ApiResponse.success(res, saved, 'Feedback submitted successfully', 201);
    } catch (err) {
      next(err);
    }
  },
};
