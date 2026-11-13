-- =========================================================================
-- AGRI-ASSIST: AI-POWERED AGRICULTURE CROP ADVISORY ASSISTANT
-- 001_INITIAL_SCHEMA.SQL
-- COMPLETE SUPABASE CLOUD POSTGRESQL SCHEMA WITH RLS, TRIGGERS,
-- CONSTRAINTS & SEED DATA
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE (Extends Supabase auth.users)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    state TEXT,
    district TEXT,
    village TEXT,
    farming_experience TEXT,
    preferred_unit TEXT NOT NULL DEFAULT 'metric'
        CHECK (preferred_unit IN ('metric', 'imperial')),
    role TEXT NOT NULL DEFAULT 'farmer'
        CHECK (role IN ('farmer', 'admin')),
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 2. FARMS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    village TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    land_area NUMERIC(12,3) NOT NULL CHECK (land_area > 0),
    area_unit TEXT NOT NULL DEFAULT 'acre'
        CHECK (area_unit IN ('acre', 'hectare')),
    soil_type TEXT,
    soil_ph NUMERIC(4,2)
        CHECK (soil_ph IS NULL OR (soil_ph >= 0 AND soil_ph <= 14)),
    nitrogen NUMERIC(12,3),
    phosphorus NUMERIC(12,3),
    potassium NUMERIC(12,3),
    organic_carbon NUMERIC(8,3),
    electrical_conductivity NUMERIC(10,3),
    irrigation_type TEXT NOT NULL,
    water_availability TEXT NOT NULL,
    current_crop TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
        (latitude IS NULL AND longitude IS NULL)
        OR
        (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)
    )
);

-- -------------------------------------------------------------------------
-- 3. CROPS REFERENCE CATALOG
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    scientific_name TEXT,
    category TEXT NOT NULL,
    description TEXT,
    suitable_soil_types TEXT[] DEFAULT '{}',
    suitable_seasons TEXT[] DEFAULT '{}',
    water_requirement TEXT,
    growth_duration_days INTEGER
        CHECK (growth_duration_days IS NULL OR growth_duration_days > 0),
    supported_regions TEXT[] DEFAULT '{}',
    optimal_ph_min NUMERIC(4,2) DEFAULT 6.0,
    optimal_ph_max NUMERIC(4,2) DEFAULT 7.5,
    expected_yield_per_hectare NUMERIC(10,2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. AGRICULTURAL REFERENCE SOURCES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agricultural_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,
    organization TEXT NOT NULL,
    source_url TEXT,
    region TEXT,
    crop_category TEXT,
    source_type TEXT NOT NULL,
    publication_date DATE,
    last_verified_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5. CROP RECOMMENDATIONS ADVISORIES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    season TEXT NOT NULL,
    input_snapshot JSONB NOT NULL,
    recommendation_result JSONB NOT NULL,
    model_name TEXT,
    status TEXT NOT NULL DEFAULT 'completed'
        CHECK (status IN ('completed', 'needs_review', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. SOIL ANALYSES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.soil_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    soil_data JSONB NOT NULL,
    analysis_result JSONB NOT NULL,
    report_file_path TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 7. DISEASE ANALYSES (MULTIMODAL)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.disease_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    growth_stage TEXT,
    affected_part TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    image_path TEXT,
    analysis_result JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed'
        CHECK (status IN ('completed', 'needs_review', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 8. FERTILIZER ADVISORIES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.fertilizer_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    growth_stage TEXT NOT NULL,
    input_snapshot JSONB NOT NULL,
    advisory_result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 9. CULTIVATION PLANS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cultivation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    land_area NUMERIC(12,3) NOT NULL CHECK (land_area > 0),
    area_unit TEXT NOT NULL DEFAULT 'acre',
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE,
    plan_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (
        expected_harvest_date IS NULL
        OR expected_harvest_date >= sowing_date
    )
);

-- -------------------------------------------------------------------------
-- 10. CULTIVATION TASKS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cultivation_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES public.cultivation_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    task_date DATE,
    growth_stage TEXT,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'skipped')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 11. CHAT CONVERSATIONS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 12. CHAT MESSAGES
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 13. NOTIFICATIONS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_entity_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 14. AI FEEDBACK
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    advisory_type TEXT NOT NULL,
    advisory_id UUID,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 15. AUDIT LOGS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_crops_category ON public.crops(category);
CREATE INDEX IF NOT EXISTS idx_crop_recommendations_user_id ON public.crop_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_recommendations_farm_id ON public.crop_recommendations(farm_id);
CREATE INDEX IF NOT EXISTS idx_soil_analyses_user_id ON public.soil_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_disease_analyses_user_id ON public.disease_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_fertilizer_advisories_user_id ON public.fertilizer_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_plans_user_id ON public.cultivation_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_tasks_plan_id ON public.cultivation_tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);

-- -------------------------------------------------------------------------
-- REUSABLE UPDATED_AT TRIGGER FUNCTION
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_farms_updated_at ON public.farms;
CREATE TRIGGER trg_farms_updated_at
BEFORE UPDATE ON public.farms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_crops_updated_at ON public.crops;
CREATE TRIGGER trg_crops_updated_at
BEFORE UPDATE ON public.crops
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_cultivation_plans_updated_at ON public.cultivation_plans;
CREATE TRIGGER trg_cultivation_plans_updated_at
BEFORE UPDATE ON public.cultivation_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER trg_chat_conversations_updated_at
BEFORE UPDATE ON public.chat_conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------------------------
-- PROFILE CREATION TRIGGER FROM AUTH.USERS
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        phone,
        preferred_language,
        role,
        onboarding_completed
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Farmer'),
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en'),
        'farmer',
        FALSE
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agricultural_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultivation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultivation_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 2. Farms Policies
DROP POLICY IF EXISTS "Users can view own farms" ON public.farms;
CREATE POLICY "Users can view own farms"
    ON public.farms FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own farms" ON public.farms;
CREATE POLICY "Users can insert own farms"
    ON public.farms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own farms" ON public.farms;
CREATE POLICY "Users can update own farms"
    ON public.farms FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own farms" ON public.farms;
CREATE POLICY "Users can delete own farms"
    ON public.farms FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Crops Catalog Policies (Public read for active crops, admin manage)
DROP POLICY IF EXISTS "Active crops readable by authenticated users" ON public.crops;
CREATE POLICY "Active crops readable by authenticated users"
    ON public.crops FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admins can insert crops" ON public.crops;
CREATE POLICY "Admins can insert crops"
    ON public.crops FOR INSERT
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update crops" ON public.crops;
CREATE POLICY "Admins can update crops"
    ON public.crops FOR UPDATE
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete crops" ON public.crops;
CREATE POLICY "Admins can delete crops"
    ON public.crops FOR DELETE
    USING (public.is_admin());

-- 4. Agricultural Sources (Public read active, admin manage)
DROP POLICY IF EXISTS "Active sources readable by all authenticated" ON public.agricultural_sources;
CREATE POLICY "Active sources readable by all authenticated"
    ON public.agricultural_sources FOR SELECT
    USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage sources" ON public.agricultural_sources;
CREATE POLICY "Admins can manage sources"
    ON public.agricultural_sources FOR ALL
    USING (public.is_admin());

-- 5. Crop Recommendations
DROP POLICY IF EXISTS "Users can view own crop recommendations" ON public.crop_recommendations;
CREATE POLICY "Users can view own crop recommendations"
    ON public.crop_recommendations FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own crop recommendations" ON public.crop_recommendations;
CREATE POLICY "Users can insert own crop recommendations"
    ON public.crop_recommendations FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can delete own crop recommendations" ON public.crop_recommendations;
CREATE POLICY "Users can delete own crop recommendations"
    ON public.crop_recommendations FOR DELETE
    USING (auth.uid() = user_id);

-- 6. Soil Analyses
DROP POLICY IF EXISTS "Users can view own soil analyses" ON public.soil_analyses;
CREATE POLICY "Users can view own soil analyses"
    ON public.soil_analyses FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own soil analyses" ON public.soil_analyses;
CREATE POLICY "Users can insert own soil analyses"
    ON public.soil_analyses FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can delete own soil analyses" ON public.soil_analyses;
CREATE POLICY "Users can delete own soil analyses"
    ON public.soil_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Disease Analyses
DROP POLICY IF EXISTS "Users can view own disease analyses" ON public.disease_analyses;
CREATE POLICY "Users can view own disease analyses"
    ON public.disease_analyses FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own disease analyses" ON public.disease_analyses;
CREATE POLICY "Users can insert own disease analyses"
    ON public.disease_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own disease analyses" ON public.disease_analyses;
CREATE POLICY "Users can delete own disease analyses"
    ON public.disease_analyses FOR DELETE
    USING (auth.uid() = user_id);

-- 8. Fertilizer Advisories
DROP POLICY IF EXISTS "Users can view own fertilizer advisories" ON public.fertilizer_advisories;
CREATE POLICY "Users can view own fertilizer advisories"
    ON public.fertilizer_advisories FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own fertilizer advisories" ON public.fertilizer_advisories;
CREATE POLICY "Users can insert own fertilizer advisories"
    ON public.fertilizer_advisories FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can delete own fertilizer advisories" ON public.fertilizer_advisories;
CREATE POLICY "Users can delete own fertilizer advisories"
    ON public.fertilizer_advisories FOR DELETE
    USING (auth.uid() = user_id);

-- 9. Cultivation Plans
DROP POLICY IF EXISTS "Users can view own cultivation plans" ON public.cultivation_plans;
CREATE POLICY "Users can view own cultivation plans"
    ON public.cultivation_plans FOR SELECT
    USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own cultivation plans" ON public.cultivation_plans;
CREATE POLICY "Users can insert own cultivation plans"
    ON public.cultivation_plans FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.farms WHERE id = farm_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can update own cultivation plans" ON public.cultivation_plans;
CREATE POLICY "Users can update own cultivation plans"
    ON public.cultivation_plans FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cultivation plans" ON public.cultivation_plans;
CREATE POLICY "Users can delete own cultivation plans"
    ON public.cultivation_plans FOR DELETE
    USING (auth.uid() = user_id);

-- 10. Cultivation Tasks (Enforces ownership via parent plan and user_id)
DROP POLICY IF EXISTS "Users can view own cultivation tasks" ON public.cultivation_tasks;
CREATE POLICY "Users can view own cultivation tasks"
    ON public.cultivation_tasks FOR SELECT
    USING (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.cultivation_plans WHERE id = plan_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert own cultivation tasks" ON public.cultivation_tasks;
CREATE POLICY "Users can insert own cultivation tasks"
    ON public.cultivation_tasks FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.cultivation_plans WHERE id = plan_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can update own cultivation tasks" ON public.cultivation_tasks;
CREATE POLICY "Users can update own cultivation tasks"
    ON public.cultivation_tasks FOR UPDATE
    USING (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.cultivation_plans WHERE id = plan_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can delete own cultivation tasks" ON public.cultivation_tasks;
CREATE POLICY "Users can delete own cultivation tasks"
    ON public.cultivation_tasks FOR DELETE
    USING (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.cultivation_plans WHERE id = plan_id AND user_id = auth.uid())
    );

-- 11. Chat Conversations
DROP POLICY IF EXISTS "Users can view own conversations" ON public.chat_conversations;
CREATE POLICY "Users can view own conversations"
    ON public.chat_conversations FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own conversations" ON public.chat_conversations;
CREATE POLICY "Users can insert own conversations"
    ON public.chat_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own conversations" ON public.chat_conversations;
CREATE POLICY "Users can update own conversations"
    ON public.chat_conversations FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own conversations" ON public.chat_conversations;
CREATE POLICY "Users can delete own conversations"
    ON public.chat_conversations FOR DELETE
    USING (auth.uid() = user_id);

-- 12. Chat Messages
DROP POLICY IF EXISTS "Users can view own chat messages" ON public.chat_messages;
CREATE POLICY "Users can view own chat messages"
    ON public.chat_messages FOR SELECT
    USING (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert own chat messages" ON public.chat_messages;
CREATE POLICY "Users can insert own chat messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = conversation_id AND user_id = auth.uid())
    );

-- 13. Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- 14. AI Feedback
DROP POLICY IF EXISTS "Users can view and insert own feedback" ON public.ai_feedback;
CREATE POLICY "Users can view and insert own feedback"
    ON public.ai_feedback FOR ALL
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id);

-- 15. Audit Logs (Restricted to Admins only)
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    USING (public.is_admin());

DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "System can insert audit logs"
    ON public.audit_logs FOR INSERT
    WITH CHECK (TRUE);


-- =========================================================================
-- SEED DATA: 21 CROPS CATALOG & AGRICULTURAL RESEARCH SOURCES
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
ON CONFLICT (name) DO UPDATE SET
    scientific_name = EXCLUDED.scientific_name,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    suitable_soil_types = EXCLUDED.suitable_soil_types,
    suitable_seasons = EXCLUDED.suitable_seasons,
    water_requirement = EXCLUDED.water_requirement,
    growth_duration_days = EXCLUDED.growth_duration_days,
    supported_regions = EXCLUDED.supported_regions,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Seed Agricultural Sources
INSERT INTO public.agricultural_sources (title, organization, source_url, region, crop_category, source_type, publication_date, is_active)
VALUES
('Package of Practices for Kharif Crops', 'Indian Council of Agricultural Research (ICAR)', 'https://icar.org.in', 'All India', 'cereals, pulses, oilseeds', 'Official Research Manual', '2025-06-01', TRUE),
('Crop Weather Watch Group Bulletins', 'Ministry of Agriculture & Farmers Welfare, Govt of India', 'https://agricoop.nic.in', 'All India', 'all', 'Government Advisory Bulletin', '2026-01-15', TRUE),
('Integrated Nutrient Management Guidelines', 'Indian Agricultural Research Institute (IARI - Pusa)', 'https://iari.res.in', 'Indo-Gangetic Plains & Central India', 'cereals, vegetables', 'Nutrient Protocol', '2025-09-10', TRUE),
('Integrated Pest & Disease Management Protocols', 'National Institute of Plant Health Management (NIPHM)', 'https://niphm.gov.in', 'All India', 'all', 'Plant Protection Manual', '2025-11-20', TRUE),
('Agro-meteorological Advisory Services', 'India Meteorological Department (IMD) - Gramin Krishi Mausam Sewa', 'https://mausam.imd.gov.in', 'National / District-level', 'weather, irrigation', 'Agro-Meteorological Service', '2026-02-01', TRUE)
ON CONFLICT (title) DO UPDATE SET
    organization = EXCLUDED.organization,
    source_url = EXCLUDED.source_url,
    region = EXCLUDED.region,
    crop_category = EXCLUDED.crop_category,
    source_type = EXCLUDED.source_type,
    publication_date = EXCLUDED.publication_date,
    is_active = EXCLUDED.is_active;

