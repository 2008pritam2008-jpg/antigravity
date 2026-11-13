// server/src/prompts/diseaseAnalysis.prompt.js

export function buildDiseaseAnalysisPrompt({ cropName, growthStage, affectedPart, symptoms, hasImage }) {
  return `Perform an agricultural diagnostic analysis based on the ${hasImage ? 'provided crop leaf/plant image and ' : ''}observed field symptoms.

FIELD OBSERVATIONS:
- Crop: ${cropName}
- Growth Stage: ${growthStage || 'Unspecified'}
- Affected Plant Part: ${affectedPart}
- Symptoms Observed by Farmer: "${symptoms}"
- Visual Input: ${hasImage ? 'High-resolution image attached for visual inspection.' : 'No image supplied (symptom-only analysis).'}

INSTRUCTIONS:
1. Examine visual evidence (lesions, discoloration, chlorosis, necrosis, insect frass, fungal mycelium/spores) or textual symptom indicators.
2. Formulate 1 to 3 possible conditions (fungal, bacterial, viral, insect pest, nutrient deficiency, or physiological disorder).
3. Assign a conservative likelihood level: 'high', 'moderate', 'low', or 'inconclusive'.
4. Do not present the diagnosis as 100% guaranteed. State that field scouting and diagnostic lab tests provide definitive confirmation.
5. Provide actionable, IPM-aligned (Integrated Pest Management) recommendations starting with non-chemical, cultural, and biological practices.
6. If chemical options are mentioned, only cite generic active ingredients with safety reminders, never unverified mixing cocktails or unlicensed chemicals.
7. Output MUST strictly match the required JSON schema with NO markdown code fence or exterior text.`;
}
