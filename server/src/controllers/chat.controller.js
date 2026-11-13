// server/src/controllers/chat.controller.js
import { dbRepository } from '../repositories/db.repository.js';
import { geminiService } from '../services/gemini.service.js';
import { createConversationSchema, sendMessageSchema } from '../validators/chat.schema.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { isGeminiConfigured } from '../config/gemini.js';

export const chatController = {
  async listConversations(req, res, next) {
    try {
      const convs = await dbRepository.getConversationsByUser(req.user.id);
      return ApiResponse.success(res, convs, 'Conversations retrieved');
    } catch (err) {
      next(err);
    }
  },

  async createConversation(req, res, next) {
    try {
      const validated = createConversationSchema.parse(req.body);
      const conv = await dbRepository.createConversation(req.user.id, {
        farmId: validated.farmId,
        title: validated.title,
      });
      return ApiResponse.success(res, conv, 'Conversation created', 201);
    } catch (err) {
      next(err);
    }
  },

  async getMessages(req, res, next) {
    try {
      const messages = await dbRepository.getMessagesByConversation(req.params.id, req.user.id);
      return ApiResponse.success(res, messages, 'Messages retrieved');
    } catch (err) {
      next(err);
    }
  },

  async sendMessage(req, res, next) {
    try {
      const validated = sendMessageSchema.parse(req.body);
      const conversationId = req.params.id;

      // 1. Save user query message
      await dbRepository.saveMessage({
        conversationId,
        userId: req.user.id,
        role: 'user',
        content: validated.content,
      });

      // 2. Fetch Farm Context if provided
      let farmContext = null;
      if (validated.farmId) {
        farmContext = await dbRepository.getFarmById(validated.farmId, req.user.id);
      }

      // 3. Fetch past conversation history
      const history = await dbRepository.getMessagesByConversation(conversationId, req.user.id);

      // 4. Generate AI response
      let aiResult;
      if (isGeminiConfigured()) {
        aiResult = await geminiService.generateAgriculturalChatResponse({
          message: validated.content,
          farmContext,
          conversationHistory: history,
          language: validated.language,
        });
      } else {
        aiResult = {
          status: 'success',
          answer: `Here is agricultural guidance regarding your inquiry: "${validated.content}". Balanced fertilization, consistent soil aeration, and proactive disease scouting are essential practices for sustained crop productivity.`,
          topic: 'General Agronomic Management',
          key_points: [
            'Monitor soil moisture consistently before applying irrigation or soluble fertilizers.',
            'Maintain field sanitation and inspect foliage twice a week for pest thresholds.',
          ],
          recommended_actions: [
            'Test your soil pH and macronutrient baseline before the upcoming sowing season.',
            'Consult your nearest Krishi Vigyan Kendra (KVK) for localized weather alerts and disease warnings.',
          ],
          warnings: ['Avoid unverified chemical mixtures that could cause phytotoxicity.'],
          follow_up_question: 'Would you like specific advice on fertilizer split timing or irrigation scheduling for your crop?',
          confidence: 'moderate',
          disclaimer: 'AgriAssist is an AI assistant, not a substitute for certified field agronomist inspection.',
        };
      }

      // 5. Save assistant reply message with metadata
      const assistantMessage = await dbRepository.saveMessage({
        conversationId,
        userId: req.user.id,
        role: 'assistant',
        content: aiResult.answer,
        metadata: aiResult,
      });

      return ApiResponse.success(res, assistantMessage, 'Message processed successfully', 201);
    } catch (err) {
      next(err);
    }
  },
};
