// server/src/services/gemini.service.js
import { genAI, GEMINI_MODEL, isGeminiConfigured } from '../config/gemini.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AGRI_ASSIST_SYSTEM_PROMPT } from '../prompts/systemPrompt.js';
import { buildCropRecommendationPrompt } from '../prompts/cropRecommendation.prompt.js';
import { buildSoilAnalysisPrompt } from '../prompts/soilAnalysis.prompt.js';
import { buildDiseaseAnalysisPrompt } from '../prompts/diseaseAnalysis.prompt.js';
import { buildFertilizerAdvisoryPrompt } from '../prompts/fertilizer.prompt.js';
import { buildCultivationPlanPrompt } from '../prompts/cultivationPlan.prompt.js';
import { buildChatPrompt } from '../prompts/chat.prompt.js';
import {
  cropRecommendationResponseSchema,
  soilAnalysisResponseSchema,
  diseaseDetectionResponseSchema,
  fertilizerAdvisoryResponseSchema,
  cultivationPlanResponseSchema,
  chatResponseSchema,
} from '../validators/aiResponse.schema.js';

/**
 * Execute Gemini model call with timeout and retry handling
 */
async function callGeminiStructured({ prompt, systemInstruction, imageBuffer, imageMimeType, schema, retries = 1 }) {
  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please provide a valid Gemini API key in your server .env file.');
  }

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const parts = [];

      // Multimodal image attachment
      if (imageBuffer && imageMimeType) {
        parts.push({
          inlineData: {
            mimeType: imageMimeType,
            data: Buffer.isBuffer(imageBuffer) ? imageBuffer.toString('base64') : imageBuffer,
          },
        });
      }

      // Main text prompt
      parts.push({ text: prompt });

      const requestPayload = {
        model: GEMINI_MODEL,
        contents: parts,
        config: {
          systemInstruction: systemInstruction || AGRI_ASSIST_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.2, // Low temperature for high agricultural consistency
        },
      };

      // Wrap with timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI request timed out after ' + env.AI_REQUEST_TIMEOUT_MS + 'ms')), env.AI_REQUEST_TIMEOUT_MS)
      );

      const responsePromise = genAI.models.generateContent(requestPayload);
      const result = await Promise.race([responsePromise, timeoutPromise]);

      const rawText = result.text ? result.text.trim() : (result.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();

      if (!rawText) {
        throw new Error('Gemini returned an empty response.');
      }

      // Clean possible accidental markdown wrappers
      const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsedData = JSON.parse(cleanJson);

      // Validate with Zod schema
      const validated = schema.safeParse(parsedData);
      if (!validated.success) {
        logger.warn('AI JSON schema validation deviation:', validated.error.format());
        // Return parsedData if compatible or sanitized version
        return parsedData;
      }

      return validated.data;
    } catch (error) {
      attempt++;
      logger.error(`Gemini call attempt ${attempt} failed:`, error);
      if (attempt > retries) {
        throw error;
      }
    }
  }
}

export const geminiService = {
  /**
   * Crop Suitability Recommendation
   */
  async generateCropRecommendations(params) {
    const prompt = buildCropRecommendationPrompt(params);
    return callGeminiStructured({
      prompt,
      schema: cropRecommendationResponseSchema,
    });
  },

  /**
   * Soil Health Analysis
   */
  async analyzeSoil(params) {
    const prompt = buildSoilAnalysisPrompt(params);
    return callGeminiStructured({
      prompt,
      schema: soilAnalysisResponseSchema,
    });
  },

  /**
   * Multimodal Crop Disease Detection
   */
  async analyzeCropDisease({ cropName, growthStage, affectedPart, symptoms, imageBuffer, imageMimeType }) {
    const prompt = buildDiseaseAnalysisPrompt({
      cropName,
      growthStage,
      affectedPart,
      symptoms,
      hasImage: Boolean(imageBuffer),
    });

    return callGeminiStructured({
      prompt,
      imageBuffer,
      imageMimeType,
      schema: diseaseDetectionResponseSchema,
    });
  },

  /**
   * Fertilizer & Nutrient Advisory
   */
  async generateFertilizerAdvisory(params) {
    const prompt = buildFertilizerAdvisoryPrompt(params);
    return callGeminiStructured({
      prompt,
      schema: fertilizerAdvisoryResponseSchema,
    });
  },

  /**
   * Cultivation Plan Generator
   */
  async generateCultivationPlan(params) {
    const prompt = buildCultivationPlanPrompt(params);
    return callGeminiStructured({
      prompt,
      schema: cultivationPlanResponseSchema,
    });
  },

  /**
   * Conversational Agricultural Assistant
   */
  async generateAgriculturalChatResponse(params) {
    const prompt = buildChatPrompt(params);
    return callGeminiStructured({
      prompt,
      schema: chatResponseSchema,
    });
  },
};
