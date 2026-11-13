// client/src/constants/indianAgri.js

export const INDIAN_STATES_DISTRICTS = {
  'Maharashtra': ['Nashik', 'Pune', 'Nagpur', 'Ahmednagar', 'Solapur', 'Kolhapur', 'Amravati', 'Aurangabad', 'Jalgaon'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar', 'Bathinda', 'Sangrur', 'Ferozepur', 'Hoshiarpur'],
  'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Kanpur', 'Agra', 'Meerut', 'Prayagraj', 'Gorakhpur', 'Bareilly', 'Aligarh'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Ujjain', 'Jabalpur', 'Gwalior', 'Hoshangabad', 'Dewas', 'Sagar'],
  'Gujarat': ['Ahmedabad', 'Rajkot', 'Surat', 'Vadodara', 'Junagadh', 'Bhavnagar', 'Mehsana', 'Anand'],
  'Karnataka': ['Bengaluru Rural', 'Belagavi', 'Dharwad', 'Mysuru', 'Mandya', 'Shivamogga', 'Vijayapura', 'Raichur'],
  'Andhra Pradesh': ['Guntur', 'Krishna', 'East Godavari', 'West Godavari', 'Kurnool', 'Anantapur', 'Chittoor'],
  'Tamil Nadu': ['Thanjavur', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Erode', 'Dindigul'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Sri Ganganagar', 'Bikaner', 'Alwar', 'Bharatpur'],
  'Haryana': ['Karnal', 'Kurukshetra', 'Hisar', 'Ambala', 'Sirsa', 'Rohtak', 'Panipat', 'Sonipat'],
  'West Bengal': ['Bardhaman', 'Hooghly', 'Nadia', 'Murshidabad', 'North 24 Parganas', 'Malda'],
  'Bihar': ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Nalanda', 'Rohtas', 'Samastipur'],
  'Telangana': ['Warangal', 'Karimnagar', 'Nalgonda', 'Khammam', 'Nizamabad', 'Mahbubnagar'],
  'Odisha': ['Cuttack', 'Bhubaneswar', 'Ganjam', 'Balasore', 'Sambalpur', 'Bargarh'],
};

export const AGRICULTURAL_SEASONS = [
  { value: 'Kharif', label: 'Kharif (Monsoon: June – October)', description: 'Sown with the onset of southwest monsoon (Rice, Maize, Cotton, Soybean, Groundnut)' },
  { value: 'Rabi', label: 'Rabi (Winter: October – April)', description: 'Sown in autumn/winter and harvested in spring (Wheat, Gram, Mustard, Barley, Potato)' },
  { value: 'Zaid', label: 'Zaid (Summer: March – June)', description: 'Cultivated between Rabi and Kharif under assured irrigation (Moong, Cucumbers, Watermelon)' },
  { value: 'Perennial', label: 'Perennial / All-Year', description: 'Long-term crops (Sugarcane, Banana, Mango, Turmeric, Papaya)' },
];

export const SOIL_TYPES = [
  { value: 'alluvial', label: 'Alluvial Soil', description: 'Rich in potash and lime; ideal for Wheat, Rice, Sugarcane, and Pulses' },
  { value: 'black soil', label: 'Black / Regur Soil', description: 'High clay and moisture retention; premier for Cotton, Soybean, Chickpea, and Sorghum' },
  { value: 'red soil', label: 'Red Soil', description: 'Porous and friable, rich in iron; excellent for Groundnut, Millets, and Tobacco' },
  { value: 'laterite soil', label: 'Laterite Soil', description: 'Acidic, well-leached; suited for Plantation crops, Cashew, and Tea' },
  { value: 'sandy loam', label: 'Sandy Loam', description: 'Well-aerated, quick draining; optimal for Vegetables, Potatoes, Onion, and Melons' },
  { value: 'clay loam', label: 'Clay Loam', description: 'Heavy moisture holding capacity; favored for wetland Rice and Sugarcane' },
  { value: 'saline', label: 'Saline / Alkaline Soil', description: 'Requires gypsum correction and drainage leaching' },
];

export const IRRIGATION_TYPES = [
  { value: 'drip_system', label: 'Drip Irrigation (Micro-irrigation)' },
  { value: 'sprinkler', label: 'Sprinkler System' },
  { value: 'borewell', label: 'Tube-well / Deep Borewell' },
  { value: 'canal', label: 'Canal Command Water' },
  { value: 'rainfed', label: 'Strictly Rainfed / Dryland' },
  { value: 'open_well', label: 'Open Well / Farm Pond' },
  { value: 'river_flood', label: 'Surface Furrow / Flood' },
];

export const WATER_AVAILABILITY = [
  { value: 'abundant', label: 'Abundant (Year-round assured supply)' },
  { value: 'medium', label: 'Medium (Adequate for 2-3 protective irrigations)' },
  { value: 'scarce', label: 'Scarce (Critical deficit, drought-prone)' },
];

export const PLANT_PARTS = [
  { value: 'leaf', label: 'Foliage / Leaves' },
  { value: 'stem', label: 'Stem / Branch / Twig' },
  { value: 'fruit', label: 'Fruit / Pod / Grain' },
  { value: 'flower', label: 'Flower / Inflorescence' },
  { value: 'root', label: 'Root / Crown / Tuber' },
  { value: 'whole_plant', label: 'Whole Plant (General Wilting / Stunting)' },
];

export const CROP_STAGES = [
  { value: 'basal_sowing', label: 'Land Prep & Sowing (Basal)' },
  { value: 'vegetative', label: 'Early Vegetative / Seedling' },
  { value: 'tillering_branching', label: 'Tillering / Active Branching' },
  { value: 'flowering_heading', label: 'Flowering / Anthesis / Heading' },
  { value: 'grain_fruit_development', label: 'Grain / Pod / Fruit Filling' },
  { value: 'maturity', label: 'Physiological Maturity & Ripening' },
];
