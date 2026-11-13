-- =========================================================================
-- AGRI-ASSIST: SEED DATA FOR CROPS AND AGRICULTURAL SOURCES
-- =========================================================================

-- Seed Crops Catalog
INSERT INTO public.crops (name, scientific_name, category, description, suitable_soil_types, suitable_seasons, water_requirement, growth_duration_days, supported_regions, is_active)
VALUES
-- Cereals & Millets
('Rice (Paddy)', 'Oryza sativa', 'cereals', 'Staple cereal crop thriving in submerged/clayey conditions with warm climate.', ARRAY['clay', 'clay loam', 'alluvial'], ARRAY['Kharif'], 'High (1200-1500 mm)', 135, ARRAY['Punjab', 'West Bengal', 'Uttar Pradesh', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha'], TRUE),
('Wheat', 'Triticum aestivum', 'cereals', 'Premier winter cereal crop requiring cool temperatures during vegetative growth and warm weather for grain filling.', ARRAY['loamy', 'alluvial', 'clay loam'], ARRAY['Rabi'], 'Moderate (450-650 mm)', 120, ARRAY['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar'], TRUE),
('Maize (Corn)', 'Zea mays', 'cereals', 'Versatile cereal and fodder crop sensitive to waterlogging but resilient across diverse soils.', ARRAY['sandy loam', 'alluvial', 'red soil'], ARRAY['Kharif', 'Rabi', 'Zaid'], 'Moderate (500-800 mm)', 105, ARRAY['Karnataka', 'Madhya Pradesh', 'Bihar', 'Tamil Nadu', 'Maharashtra', 'Telangana'], TRUE),
('Pearl Millet (Bajra)', 'Pennisetum glaucum', 'cereals', 'Highly drought-resilient millet suitable for arid and semi-arid tracts.', ARRAY['sandy soil', 'sandy loam', 'red soil'], ARRAY['Kharif'], 'Low (350-500 mm)', 85, ARRAY['Rajasthan', 'Gujarat', 'Haryana', 'Uttar Pradesh', 'Maharashtra'], TRUE),
('Finger Millet (Ragi)', 'Eleusine coracana', 'cereals', 'Nutrient-dense millet with high calcium content and superior drought tolerance.', ARRAY['red soil', 'laterite soil', 'sandy loam'], ARRAY['Kharif', 'Rabi'], 'Low to Moderate (400-600 mm)', 110, ARRAY['Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Odisha', 'Uttarakhand'], TRUE),

-- Pulses
('Chickpea (Gram)', 'Cicer arietinum', 'pulses', 'Dominant rabi pulse fixing atmospheric nitrogen, well adapted to conserved moisture.', ARRAY['loamy soil', 'black soil', 'clay loam'], ARRAY['Rabi'], 'Low (300-400 mm)', 110, ARRAY['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Uttar Pradesh'], TRUE),
('Pigeon Pea (Arhar/Tur)', 'Cajanus cajan', 'pulses', 'Deep-rooted perennial legume cultivated as an annual kharif pulse with high protein content.', ARRAY['alluvial', 'black soil', 'loamy'], ARRAY['Kharif'], 'Moderate (600-800 mm)', 160, ARRAY['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Gujarat', 'Uttar Pradesh'], TRUE),
('Green Gram (Moong)', 'Vigna radiata', 'pulses', 'Short duration catch crop enriching soil fertility and fitting into multiple cropping systems.', ARRAY['sandy loam', 'alluvial', 'loamy'], ARRAY['Kharif', 'Zaid'], 'Low (350-450 mm)', 65, ARRAY['Rajasthan', 'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Punjab'], TRUE),
('Black Gram (Urad)', 'Vigna mungo', 'pulses', 'Fast-growing nitrogen-fixing pulse cultivated in tropical and subtropical regions.', ARRAY['black soil', 'loamy soil', 'alluvial'], ARRAY['Kharif', 'Rabi'], 'Low to Moderate (400-500 mm)', 75, ARRAY['Madhya Pradesh', 'Uttar Pradesh', 'Andhra Pradesh', 'Tamil Nadu'], TRUE),

-- Oilseeds
('Groundnut (Peanut)', 'Arachis hypogaea', 'oilseeds', 'Valuable oilseed and food crop requiring well-drained friable soils for peg penetration.', ARRAY['sandy loam', 'red soil', 'loamy'], ARRAY['Kharif', 'Rabi'], 'Moderate (500-700 mm)', 120, ARRAY['Gujarat', 'Rajasthan', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka'], TRUE),
('Mustard', 'Brassica juncea', 'oilseeds', 'Crucial rabi oilseed crop requiring cool dry weather and well-drained loamy soils.', ARRAY['loamy soil', 'alluvial', 'sandy loam'], ARRAY['Rabi'], 'Low to Moderate (350-450 mm)', 115, ARRAY['Rajasthan', 'Haryana', 'Madhya Pradesh', 'Uttar Pradesh', 'West Bengal'], TRUE),
('Soybean', 'Glycine max', 'oilseeds', 'Dual-purpose legume producing high-grade protein and vegetable oil in black soils.', ARRAY['black soil', 'clay loam', 'loamy'], ARRAY['Kharif'], 'Moderate (600-800 mm)', 100, ARRAY['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka'], TRUE),

-- Commercial & Cash Crops
('Cotton', 'Gossypium hirsutum', 'commercial', 'White gold fiber crop flourishing in deep moisture-retentive black soils with warm days.', ARRAY['black soil', 'alluvial', 'clay loam'], ARRAY['Kharif'], 'Moderate to High (700-1100 mm)', 160, ARRAY['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Rajasthan', 'Punjab'], TRUE),
('Sugarcane', 'Saccharum officinarum', 'commercial', 'High-biomass perennial commercial crop demanding abundant water and sunshine.', ARRAY['alluvial', 'black soil', 'loamy'], ARRAY['Kharif', 'Perennial'], 'Very High (1500-2500 mm)', 360, ARRAY['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Bihar'], TRUE),

-- Vegetables
('Tomato', 'Solanum lycopersicum', 'vegetables', 'High-value solanaceous vegetable sensitive to frost and waterlogging.', ARRAY['sandy loam', 'loamy soil', 'red soil'], ARRAY['Kharif', 'Rabi', 'Zaid'], 'Moderate (400-600 mm)', 110, ARRAY['Andhra Pradesh', 'Madhya Pradesh', 'Karnataka', 'Gujarat', 'Odisha', 'Maharashtra'], TRUE),
('Onion', 'Allium cepa', 'vegetables', 'Pungent commercial bulb vegetable grown in loose friable soils under controlled moisture.', ARRAY['sandy loam', 'alluvial', 'clay loam'], ARRAY['Kharif', 'Rabi', 'Late Kharif'], 'Moderate (450-550 mm)', 130, ARRAY['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Gujarat', 'Rajasthan'], TRUE),
('Potato', 'Solanum tuberosum', 'vegetables', 'Starchy cool-season tuber requiring well-aerated fertile soils and balanced nutrition.', ARRAY['sandy loam', 'alluvial'], ARRAY['Rabi'], 'Moderate (500-700 mm)', 95, ARRAY['Uttar Pradesh', 'West Bengal', 'Bihar', 'Gujarat', 'Punjab'], TRUE),
('Chilli (Hot Pepper)', 'Capsicum annuum', 'vegetables', 'Spicy cash vegetable responsive to balanced fertigation and well-drained soils.', ARRAY['black soil', 'sandy loam', 'red soil'], ARRAY['Kharif', 'Rabi'], 'Moderate (500-650 mm)', 140, ARRAY['Andhra Pradesh', 'Telangana', 'Karnataka', 'Madhya Pradesh'], TRUE),

-- Fruits & Plantation
('Mango', 'Mangifera indica', 'fruits', 'King of tropical fruits thriving in deep well-drained soils without stagnant water table.', ARRAY['alluvial', 'red soil', 'laterite soil', 'loamy'], ARRAY['Perennial'], 'Moderate (800-1200 mm)', 365, ARRAY['Uttar Pradesh', 'Andhra Pradesh', 'Karnataka', 'Bihar', 'Gujarat', 'Maharashtra'], TRUE),
('Banana', 'Musa acuminata', 'fruits', 'Heavy feeder fruit crop needing continuous tropical warmth and rich organic matter.', ARRAY['clay loam', 'alluvial', 'rich loam'], ARRAY['Perennial'], 'High (1800-2200 mm)', 330, ARRAY['Tamil Nadu', 'Maharashtra', 'Gujarat', 'Andhra Pradesh', 'Karnataka'], TRUE),
('Turmeric', 'Curcuma longa', 'plantation', 'Aromatic rhizomatous spice requiring warm humid climate and porous humus-rich loam.', ARRAY['sandy loam', 'red soil', 'alluvial'], ARRAY['Kharif'], 'High (1200-1500 mm)', 240, ARRAY['Telangana', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh', 'Odisha'], TRUE)
ON CONFLICT DO NOTHING;

-- Seed Agricultural Sources
INSERT INTO public.agricultural_sources (title, organization, source_url, region, crop_category, source_type, publication_date, is_active)
VALUES
('Package of Practices for Kharif Crops', 'Indian Council of Agricultural Research (ICAR)', 'https://icar.org.in', 'All India', 'cereals, pulses, oilseeds', 'Official Research Manual', '2025-06-01', TRUE),
('Crop Weather Watch Group Bulletins', 'Ministry of Agriculture & Farmers Welfare, Govt of India', 'https://agricoop.nic.in', 'All India', 'all', 'Government Advisory Bulletin', '2026-01-15', TRUE),
('Integrated Nutrient Management Guidelines', 'Indian Agricultural Research Institute (IARI - Pusa)', 'https://iari.res.in', 'Indo-Gangetic Plains & Central India', 'cereals, vegetables', 'Nutrient Protocol', '2025-09-10', TRUE),
('Integrated Pest & Disease Management Protocols', 'National Institute of Plant Health Management (NIPHM)', 'https://niphm.gov.in', 'All India', 'all', 'Plant Protection Manual', '2025-11-20', TRUE),
('Agro-meteorological Advisory Services', 'India Meteorological Department (IMD) - Gramin Krishi Mausam Sewa', 'https://mausam.imd.gov.in', 'National / District-level', 'weather, irrigation', 'Agro-Meteorological Service', '2026-02-01', TRUE)
ON CONFLICT DO NOTHING;
