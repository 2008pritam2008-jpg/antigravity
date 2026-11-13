// server/src/controllers/farm.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { farmSchema, updateFarmSchema } from '../validators/farm.schema.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const farmController = {
  async getFarms(req, res, next) {
    try {
      const farms = await dbRepository.getFarmsByUser(req.user.id);
      return ApiResponse.success(res, farms, 'Farms retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getFarmById(req, res, next) {
    try {
      const farm = await dbRepository.getFarmById(req.params.farmId, req.user.id);
      if (!farm) {
        return ApiResponse.error(res, 'Farm not found or access denied', 'NOT_FOUND', [], 404);
      }
      return ApiResponse.success(res, farm, 'Farm details retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async createFarm(req, res, next) {
    try {
      const validated = farmSchema.parse(req.body);
      const farm = await dbRepository.createFarm(req.user.id, validated);
      await dbRepository.logAudit({
        actorId: req.user.id,
        action: 'CREATE_FARM',
        entityType: 'farm',
        entityId: farm.id,
        metadata: { farmName: farm.farm_name },
      });
      return ApiResponse.success(res, farm, 'Farm plot created successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async updateFarm(req, res, next) {
    try {
      const validated = updateFarmSchema.parse(req.body);
      const updated = await dbRepository.updateFarm(req.params.farmId, req.user.id, validated);
      if (!updated) {
        return ApiResponse.error(res, 'Farm not found or update unauthorized', 'NOT_FOUND', [], 404);
      }
      await dbRepository.logAudit({
        actorId: req.user.id,
        action: 'UPDATE_FARM',
        entityType: 'farm',
        entityId: req.params.farmId,
      });
      return ApiResponse.success(res, updated, 'Farm updated successfully');
    } catch (err) {
      next(err);
    }
  },

  async deleteFarm(req, res, next) {
    try {
      const deleted = await dbRepository.deleteFarm(req.params.farmId, req.user.id);
      if (!deleted) {
        return ApiResponse.error(res, 'Farm not found or deletion unauthorized', 'NOT_FOUND', [], 404);
      }
      await dbRepository.logAudit({
        actorId: req.user.id,
        action: 'DELETE_FARM',
        entityType: 'farm',
        entityId: req.params.farmId,
      });
      return ApiResponse.success(res, { id: req.params.farmId }, 'Farm deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};
