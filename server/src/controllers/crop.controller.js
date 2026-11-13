// server/src/controllers/crop.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const cropController = {
  async getCrops(req, res, next) {
    try {
      const { category, search, limit } = req.query;
      const crops = await dbRepository.getCrops({
        category,
        search,
        limit: limit ? parseInt(limit, 10) : 50,
      });
      return ApiResponse.success(res, crops, 'Crops retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getCropById(req, res, next) {
    try {
      const crop = await dbRepository.getCropById(req.params.cropId);
      if (!crop) {
        return ApiResponse.error(res, 'Crop not found in catalog', 'NOT_FOUND', [], 404);
      }
      return ApiResponse.success(res, crop, 'Crop details retrieved successfully');
    } catch (err) {
      next(err);
    }
  },

  async getCategories(req, res, next) {
    try {
      const categories = [
        { id: 'cereals', name: 'Cereals & Millets', description: 'Rice, Wheat, Maize, Bajra, Ragi' },
        { id: 'pulses', name: 'Pulses & Legumes', description: 'Gram, Tur/Arhar, Moong, Urad, Lentil' },
        { id: 'oilseeds', name: 'Oilseeds', description: 'Groundnut, Soybean, Mustard, Sunflower' },
        { id: 'commercial', name: 'Commercial & Cash Crops', description: 'Cotton, Sugarcane, Jute, Tobacco' },
        { id: 'vegetables', name: 'Vegetables', description: 'Tomato, Onion, Potato, Chilli, Brinjal, Okra' },
        { id: 'fruits', name: 'Fruits', description: 'Mango, Banana, Papaya, Guava, Citrus' },
        { id: 'plantation', name: 'Plantation & Spices', description: 'Turmeric, Ginger, Coconut, Coffee' },
      ];
      return ApiResponse.success(res, categories, 'Crop categories retrieved successfully');
    } catch (err) {
      next(err);
    }
  },
};
