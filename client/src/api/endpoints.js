// client/src/api/endpoints.js
import { apiClient } from './client.js';

export const api = {
  // Profile
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data) => apiClient.patch('/profile', data),

  // Farms
  getFarms: () => apiClient.get('/farms'),
  getFarmById: (id) => apiClient.get(`/farms/${id}`),
  createFarm: (data) => apiClient.post('/farms', data),
  updateFarm: (id, data) => apiClient.patch(`/farms/${id}`, data),
  deleteFarm: (id) => apiClient.delete(`/farms/${id}`),

  // Crops
  getCrops: (params) => apiClient.get('/crops', { params }),
  getCropById: (id) => apiClient.get(`/crops/${id}`),
  getCategories: () => apiClient.get('/crops/categories'),

  // Advisories: Crop Recommendation
  generateCropRecommendation: (data) => apiClient.post('/advisories/crop-recommendation', data),
  listCropRecommendations: () => apiClient.get('/advisories/crop-recommendation'),
  getCropRecommendationById: (id) => apiClient.get(`/advisories/crop-recommendation/${id}`),

  // Advisories: Soil Analysis
  analyzeSoil: (data) => apiClient.post('/advisories/soil-analysis', data),
  listSoilAnalyses: () => apiClient.get('/advisories/soil-analysis'),

  // Advisories: Disease Detection (supports FormData for image upload)
  analyzeDisease: (formData) =>
    apiClient.post('/advisories/disease-detection', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  listDiseaseAnalyses: () => apiClient.get('/advisories/disease-detection'),
  getDiseaseAnalysisById: (id) => apiClient.get(`/advisories/disease-detection/${id}`),

  // Advisories: Fertilizer
  generateFertilizerAdvisory: (data) => apiClient.post('/advisories/fertilizer', data),
  listFertilizerAdvisories: () => apiClient.get('/advisories/fertilizer'),

  // Weather
  getCurrentWeather: (params) => apiClient.get('/weather/current', { params }),
  getForecast: (params) => apiClient.get('/weather/forecast', { params }),
  getWeatherAdvisory: (params) => apiClient.get('/weather/agricultural-advisory', { params }),

  // Cultivation Plans
  getCultivationPlans: () => apiClient.get('/cultivation-plans'),
  getCultivationPlanById: (id) => apiClient.get(`/cultivation-plans/${id}`),
  createCultivationPlan: (data) => apiClient.post('/cultivation-plans', data),
  updateTaskStatus: (taskId, status) => apiClient.patch(`/cultivation-plans/tasks/${taskId}`, { status }),

  // Chat
  getConversations: () => apiClient.get('/chat/conversations'),
  createConversation: (data) => apiClient.post('/chat/conversations', data),
  getMessages: (conversationId) => apiClient.get(`/chat/conversations/${conversationId}/messages`),
  sendMessage: (conversationId, data) => apiClient.post(`/chat/conversations/${conversationId}/messages`, data),

  // History & Notifications
  getHistory: () => apiClient.get('/history'),
  getNotifications: () => apiClient.get('/notifications'),
  markNotificationRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllNotificationsRead: () => apiClient.patch('/notifications/read-all'),

  // Feedback
  submitFeedback: (data) => apiClient.post('/feedback', data),

  // Admin
  getAdminDashboard: () => apiClient.get('/admin/dashboard'),
  getAdminAuditLogs: () => apiClient.get('/admin/audit-logs'),
  createAdminCrop: (data) => apiClient.post('/admin/crops', data),
};
