// server/src/services/weather.service.js
import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const weatherService = {
  /**
   * Fetch current weather and 7-day forecast from weather provider
   */
  async getWeatherData(latitude, longitude) {
    if (!latitude || !longitude) {
      return {
        available: false,
        message: 'Farm geographic coordinates are missing. Update farm profile with latitude and longitude for live weather alerts.',
      };
    }

    try {
      // Using Open-Meteo free API (no API key required, reliable worldwide meteorological data)
      const baseUrl = env.WEATHER_API_BASE_URL || 'https://api.open-meteo.com/v1';
      const url = `${baseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

      const response = await axios.get(url, { timeout: 8000 });
      const data = response.data;

      const current = data.current || {};
      const daily = data.daily || {};

      // Map WMO weather codes to human descriptions
      const weatherCodeMap = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        75: 'Heavy snow',
        80: 'Rain showers',
        81: 'Moderate showers',
        82: 'Violent showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
      };

      const currentWeatherCondition = weatherCodeMap[current.weather_code] || 'Partly cloudy';

      // Generate Agricultural Weather Alerts
      const alerts = [];
      const precipitationSumToday = daily.precipitation_sum?.[0] || 0;
      const maxTempToday = daily.temperature_2m_max?.[0] || current.temperature_2m || 30;
      const minTempToday = daily.temperature_2m_min?.[0] || 20;
      const windSpeed = current.wind_speed_10m || 10;
      const humidity = current.relative_humidity_2m || 50;

      if (precipitationSumToday > 40 || current.weather_code >= 80) {
        alerts.push({
          type: 'heavy_rain',
          severity: 'high',
          title: 'Heavy Rainfall Warning',
          description: `Forecasted precipitation is ${precipitationSumToday}mm. Ensure field drainage channels are open to prevent root asphyxiation and waterlogging.`,
          action: 'Postpone pesticide spraying and fertilizer application.',
        });
      }

      if (maxTempToday > 40) {
        alerts.push({
          type: 'extreme_heat',
          severity: 'high',
          title: 'High Heat Wave Alert',
          description: `Maximum daytime temperature approaching ${maxTempToday}°C. Crops may experience thermal stress and accelerated transpirational water loss.`,
          action: 'Provide light and frequent irrigation during early morning or evening hours.',
        });
      } else if (minTempToday < 5) {
        alerts.push({
          type: 'frost',
          severity: 'critical',
          title: 'Cold Frost Warning',
          description: `Night temperatures expected to drop to ${minTempToday}°C. Vulnerable vegetables and young seedlings risk frost burn.`,
          action: 'Apply light evening irrigation or mulch to retain soil temperature.',
        });
      }

      if (windSpeed > 35) {
        alerts.push({
          type: 'high_wind',
          severity: 'moderate',
          title: 'High Wind Warning',
          description: `Wind gusts up to ${windSpeed} km/h recorded. Risk of lodging in tall crops like maize, sugarcane, and paddy.`,
          action: 'Ensure staking for horticultural crops and postpone tall canopy spraying.',
        });
      }

      if (humidity > 85 && (maxTempToday > 25 && maxTempToday < 33)) {
        alerts.push({
          type: 'disease_risk',
          severity: 'moderate',
          title: 'Fungal Pathogen Risk Index Elevated',
          description: `High relative humidity (${humidity}%) paired with warm temperatures creates favorable conditions for foliar blights, rust, and downy mildew.`,
          action: 'Scout crops closely for early signs of leaf lesions.',
        });
      }

      return {
        available: true,
        provider: 'Open-Meteo Global Agro-Meteorological Service',
        lastUpdated: current.time || new Date().toISOString(),
        current: {
          temperature: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          precipitation: current.precipitation,
          windSpeed: current.wind_speed_10m,
          weatherCondition: currentWeatherCondition,
          weatherCode: current.weather_code,
        },
        forecast: {
          dates: daily.time || [],
          maxTemps: daily.temperature_2m_max || [],
          minTemps: daily.temperature_2m_min || [],
          precipitationSums: daily.precipitation_sum || [],
          rainProbabilities: daily.precipitation_probability_max || [],
        },
        agriculturalAlerts: alerts,
      };
    } catch (error) {
      logger.error('Failed to retrieve meteorological data from provider:', error);
      return {
        available: false,
        message: 'Weather service temporarily unreachable. Showing cached agronomic parameters.',
      };
    }
  },
};
