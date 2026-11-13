// server/src/prompts/soilAnalysis.prompt.js

export function buildSoilAnalysisPrompt({ farm, soilData }) {
  return `Analyze the provided soil test information and explain its agricultural implications.

SOIL DATA:
- Location: ${farm ? `${farm.district}, ${farm.state}` : 'India'}
- Soil Type: ${soilData.soilType}
- Soil pH: ${soilData.soilPh ?? 'Not provided'}
- Available Nitrogen (N): ${soilData.nitrogen ?? 'Not provided'} kg/ha
- Available Phosphorus (P): ${soilData.phosphorus ?? 'Not provided'} kg/ha
- Available Potassium (K): ${soilData.potassium ?? 'Not provided'} kg/ha
- Organic Carbon (%): ${soilData.organicCarbon ?? 'Not provided'}
- Electrical Conductivity (EC): ${soilData.electricalConductivity ?? 'Not provided'} dS/m
- Target Crop (if any): ${soilData.targetCrop || 'General crop suitability'}
- Farmer Notes: ${soilData.additionalObservations || 'None'}

INSTRUCTIONS:
1. Evaluate whether the soil pH is acidic, neutral, or alkaline, and explain what nutrients may be locked or readily available.
2. Analyze NPK levels against standard Indian agronomic soil fertility rating scales (low, medium, high).
3. Do not diagnose micronutrient deficiencies (Zinc, Boron, Iron) unless measurements or symptoms are provided.
4. Suggest organic soil-building practices (green manuring, FYM, vermicompost, biofertilizers) alongside corrective measures (e.g. lime for acidic, gypsum for sodic soils).
5. Output MUST strictly match the required JSON schema with NO extra text.`;
}
