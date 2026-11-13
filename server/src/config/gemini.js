// server/src/config/gemini.js
import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let genAIInstance = null;

if (env.GEMINI_API_KEY) {
  try {
    genAIInstance = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
    logger.info('Google GenAI SDK initialized successfully with model: ' + env.GEMINI_MODEL);
  } catch (err) {
    logger.error('Failed to initialize Google GenAI SDK:', err);
  }
} else {
  logger.warn('GEMINI_API_KEY not configured. AI operations will notify users that Gemini API credentials are required.');
}

export const genAI = genAIInstance;
export const GEMINI_MODEL = env.GEMINI_MODEL || 'gemini-2.5-flash';
export const isGeminiConfigured = () => Boolean(genAIInstance && env.GEMINI_API_KEY);
