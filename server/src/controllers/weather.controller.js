// server/src/controllers/weather.controller.js
import { weatherService } from '../services/weather.service.js';
import { dbRepository } from '../repositories/db.repository.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const weatherController = {
  async getCurrentWeather(req, res, next) {
    try {
      const { farmId, lat, lng } = req.query;
      let latitude = lat ? parseFloat(lat) : null;
      let longitude = lng ? parseFloat(lng) : null;

      if (farmId) {
        const farm = await dbRepository.getFarmById(farmId, req.user.id);
        if (farm && farm.latitude && farm.longitude) {
          latitude = Number(farm.latitude);
          longitude = Number(farm.longitude);
        } else if (!latitude) {
          // Default to central India (Nagpur agro-hub) coordinates if farm coords missing
          latitude = 21.1458;
          longitude = 79.0882;
        }
      } else if (!latitude || !longitude) {
        // Fallback default coordinates (New Delhi)
        latitude = 28.6139;
        longitude = 77.2090;
      }

      const weather = await weatherService.getWeatherData(latitude, longitude);
      return ApiResponse.success(res, weather, 'Current weather data retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getForecast(req, res, next) {
    try {
      const { farmId, lat, lng } = req.query;
      let latitude = lat ? parseFloat(lat) : null;
      let longitude = lng ? parseFloat(lng) : null;

      if (farmId) {
        const farm = await dbRepository.getFarmById(farmId, req.user.id);
        if (farm && farm.latitude && farm.longitude) {
          latitude = Number(farm.latitude);
          longitude = Number(farm.longitude);
        }
      }
      if (!latitude || !longitude) {
        latitude = 21.1458;
        longitude = 79.0882;
      }

      const weather = await weatherService.getWeatherData(latitude, longitude);
      return ApiResponse.success(res, weather.forecast || {}, '7-day weather forecast retrieved');
    } catch (err) {
      next(err);
    }
  },

  async getAgriculturalAdvisory(req, res, next) {
    try {
      const { farmId, lat, lng } = req.query;
      let latitude = lat ? parseFloat(lat) : null;
      let longitude = lng ? parseFloat(lng) : null;

      if (farmId) {
        const farm = await dbRepository.getFarmById(farmId, req.user.id);
        if (farm && farm.latitude && farm.longitude) {
          latitude = Number(farm.latitude);
          longitude = Number(farm.longitude);
        }
      }
      if (!latitude || !longitude) {
        latitude = 21.1458;
        longitude = 79.0882;
      }

      const weather = await weatherService.getWeatherData(latitude, longitude);
      return ApiResponse.success(
        res,
        {
          alerts: weather.agriculturalAlerts || [],
          currentConditions: weather.current || {},
          provider: weather.provider,
          lastUpdated: weather.lastUpdated,
        },
        'Agricultural weather advisory retrieved'
      );
    } catch (err) {
      next(err);
    }
  },
};
