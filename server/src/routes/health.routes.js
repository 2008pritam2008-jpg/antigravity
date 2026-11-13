// server/src/routes/health.routes.js
import { Router } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';
import { isSupabaseConfigured } from '../config/supabase.js';
import { isGeminiConfigured } from '../config/gemini.js';

const router = Router();

router.get('/', (req, res) => {
  return ApiResponse.success(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      database: isSupabaseConfigured() ? 'connected' : 'offline_memory_cache',
      gemini_ai: isGeminiConfigured() ? 'ready' : 'unconfigured_key',
    },
  }, 'Service operational');
});

export default router;
