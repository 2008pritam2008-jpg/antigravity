// server/src/prompts/chat.prompt.js

export function buildChatPrompt({ message, farmContext, conversationHistory = [], language = 'en' }) {
  let contextBlock = '';
  if (farmContext) {
    contextBlock = `\nSELECTED FARM CONTEXT:
- Farm Name: ${farmContext.farm_name}
- Region: ${farmContext.district}, ${farmContext.state}
- Soil: ${farmContext.soil_type || 'Unknown'}, pH: ${farmContext.soil_ph ?? 'N/A'}
- Irrigation: ${farmContext.irrigation_type}
- Area: ${farmContext.land_area} ${farmContext.area_unit}\n`;
  }

  let historyBlock = '';
  if (conversationHistory.length > 0) {
    historyBlock = `\nRECENT CONVERSATION HISTORY:\n` +
      conversationHistory.slice(-6).map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n') + '\n';
  }

  return `Respond to the farmer's agricultural query in simple, supportive language.
Language requested: ${language}
${contextBlock}
${historyBlock}
CURRENT FARMER QUERY: "${message}"

INSTRUCTIONS:
1. Provide an authoritative yet understandable response tailored to practical farm needs.
2. Structure key points, practical action steps, and any critical cautionary warnings.
3. Suggest a natural follow-up question to help the farmer delve deeper or clarify constraints.
4. Output MUST strictly match the required JSON schema with NO exterior markdown or commentary.`;
}
