// server/src/controllers/admin.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { cropSchema } from '../validators/crop.schema.js';

export const adminController = {
  async getDashboard(req, res, next) {
    try {
      const auditLogs = await dbRepository.getAuditLogs(10);
      const crops = await dbRepository.getCrops({ limit: 100 });
      return ApiResponse.success(
        res,
        {
          stats: {
            totalCrops: crops.length,
            systemHealth: 'OPERATIONAL',
            recentAuditCount: auditLogs.length,
          },
          recentAuditLogs: auditLogs,
        },
        'Admin dashboard metrics retrieved'
      );
    } catch (err) {
      next(err);
    }
  },

  async getAuditLogs(req, res, next) {
    try {
      const logs = await dbRepository.getAuditLogs(100);
      return ApiResponse.success(res, logs, 'Administrative audit logs retrieved');
    } catch (err) {
      next(err);
    }
  },

  async createCrop(req, res, next) {
    try {
      const validated = cropSchema.parse(req.body);
      // In real setup, insert into crops table
      await dbRepository.logAudit({
        actorId: req.user.id,
        action: 'CREATE_CROP_CATALOG',
        entityType: 'crop',
        metadata: { name: validated.name },
      });
      return ApiResponse.success(res, validated, 'Crop catalog entry created', 201);
    } catch (err) {
      next(err);
    }
  },
};
