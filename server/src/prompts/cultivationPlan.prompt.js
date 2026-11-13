// server/src/prompts/cultivationPlan.prompt.js

export function buildCultivationPlanPrompt({ farm, cropName, landArea, areaUnit, sowingDate, expectedHarvestDate, irrigationType }) {
  return `Generate a comprehensive, stage-by-stage crop cultivation timeline and operations plan.

AGRONOMIC PARAMETERS:
- Crop: ${cropName}
- Location: ${farm ? `${farm.district}, ${farm.state}` : 'India'}
- Cultivation Area: ${landArea} ${areaUnit}
- Planned Sowing Date: ${sowingDate}
${expectedHarvestDate ? `- Anticipated Harvest Date: ${expectedHarvestDate}` : ''}
- Soil Characteristics: ${farm?.soil_type || 'Loamy agricultural soil'}, pH: ${farm?.soil_ph ?? 'Neutral'}
- Irrigation System: ${irrigationType || farm?.irrigation_type || 'Standard surface irrigation'}

INSTRUCTIONS:
1. Divide the cultivation cycle into sequential stages:
   a. Land Preparation & Basal Manuring
   b. Seed Treatment & Sowing / Transplanting
   c. Early Vegetative & First Intercultural / Weeding
   d. Mid Vegetative & Nutrient Top-Dressing
   e. Flowering, Pod/Fruit Initiation & Critical Irrigation
   f. Maturity, Pre-Harvest Checks & Harvesting
2. For each stage, assign realistic day intervals from sowing, specific actions, water guidelines, and risk factors.
3. Keep guidance realistic to Indian regional agricultural conditions.
4. Output MUST strictly match the required JSON schema with NO extra text.`;
}
