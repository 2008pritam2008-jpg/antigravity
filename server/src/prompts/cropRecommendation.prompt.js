// server/src/prompts/cropRecommendation.prompt.js

export function buildCropRecommendationPrompt({ farm, season, budgetInr, preferredCategory, targetArea, weatherSummary }) {
  return `Analyze the supplied farm and environmental context and identify the top suitable crops for the upcoming season.

FARM CONTEXT:
- Farm Name: ${farm.farm_name || farm.farmName}
- Location: ${farm.district || 'Unspecified District'}, ${farm.state || 'Unspecified State'}, India
- Soil Type: ${farm.soil_type || farm.soilType || 'Not specified'}
- Soil pH: ${farm.soil_ph ?? farm.soilPh ?? 'Not tested'}
- Soil NPK (kg/ha): N=${farm.nitrogen ?? 'N/A'}, P=${farm.phosphorus ?? 'N/A'}, K=${farm.potassium ?? 'N/A'}
- Organic Carbon: ${farm.organic_carbon ?? farm.organicCarbon ?? 'N/A'}%
- Electrical Conductivity: ${farm.electrical_conductivity ?? farm.electricalConductivity ?? 'N/A'} dS/m
- Land Area: ${targetArea || farm.land_area || farm.landArea} ${farm.area_unit || farm.areaUnit || 'acre'}
- Irrigation Facility: ${farm.irrigation_type || farm.irrigationType}
- Water Availability: ${farm.water_availability || farm.waterAvailability}
- Target Season: ${season}
${budgetInr ? `- Farmer Cultivation Budget: ₹${budgetInr}` : ''}
${preferredCategory ? `- Preferred Category: ${preferredCategory}` : ''}
${weatherSummary ? `- Local Climate & Forecast: ${weatherSummary}` : ''}

INSTRUCTIONS:
1. Prioritize agronomic suitability, soil health compatibility, and water sufficiency over popularity.
2. Return recommendations in descending order of suitability.
3. Label suitability scores (0-100) as AI-generated indicative estimates.
4. If soil or climate data is incomplete, identify missing details and explicitly state any limitations.
5. Provide realistic sowing windows and harvest duration for the specified Indian state and district.
6. Output MUST strictly match the required JSON schema with NO extra commentary.`;
}
