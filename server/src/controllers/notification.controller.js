// server/src/controllers/notification.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const notificationController = {
  async getNotifications(req, res, next) {
    try {
      const notifications = await dbRepository.getNotificationsByUser(req.user.id);
      return ApiResponse.success(res, notifications, 'Notifications retrieved');
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req, res, next) {
    try {
      const updated = await dbRepository.markNotificationRead(req.params.id, req.user.id);
      return ApiResponse.success(res, updated, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      await dbRepository.markAllNotificationsRead(req.user.id);
      return ApiResponse.success(res, { success: true }, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  },
};
