// server/src/prompts/fertilizer.prompt.js

export function buildFertilizerAdvisoryPrompt({ farm, cropName, growthStage, cultivationArea, areaUnit, previousApplication, irrigationAvailability }) {
  return `Generate an educational nutrient management and fertilizer advisory.

FARM & CROP SPECIFICATIONS:
- Location: ${farm ? `${farm.district}, ${farm.state}` : 'India'}
- Target Crop: ${cropName}
- Current Growth Stage: ${growthStage}
- Cultivated Area: ${cultivationArea} ${areaUnit}
- Soil Type: ${farm?.soil_type || 'General agricultural soil'}
- Baseline Soil pH: ${farm?.soil_ph ?? 'Unknown'}
- Soil NPK Status: N=${farm?.nitrogen ?? 'Unknown'}, P=${farm?.phosphorus ?? 'Unknown'}, K=${farm?.potassium ?? 'Unknown'}
- Irrigation Status: ${irrigationAvailability || farm?.irrigation_type || 'Rainfed / general'}
- Previous Fertilizer Treatments: ${previousApplication || 'None recorded'}

INSTRUCTIONS:
1. Emphasize 4R Nutrient Stewardship: Right source, Right rate, Right time, and Right place.
2. Outline stage-specific nutrient needs (e.g. basal phosphorus/potassium for root establishment vs. split nitrogen top-dressing for vegetative flush).
3. Recommend organic and biological alternatives (compost, neem-coated urea, Trichoderma, mycorrhiza, bio-fertilizers like Rhizobium/Azotobacter).
4. Do not invent proprietary commercial brand names; refer to standard nutrient carriers (e.g., Urea 46% N, DAP 18:46:0, MOP 0:0:60, SSP).
5. Highlight essential safety precautions (glove use, avoiding application before forecasted heavy rainfall).
6. Output MUST strictly match the required JSON schema with NO extra commentary.`;
}
