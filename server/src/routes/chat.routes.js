// server/src/routes/chat.routes.js
import { Router } from 'express';
import { chatController } from '../controllers/chat.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);
router.get('/conversations', chatController.listConversations);
router.post('/conversations', chatController.createConversation);
router.get('/conversations/:id/messages', chatController.getMessages);
router.post('/conversations/:id/messages', aiRateLimiter, chatController.sendMessage);

export default router;
