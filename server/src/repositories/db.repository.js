// server/src/repositories/db.repository.js
import { supabaseAdmin, isSupabaseConfigured } from '../config/supabase.js';
import { logger } from '../utils/logger.js';
import crypto from 'crypto';

// In-Memory Storage Cache used for local development/testing when remote Supabase keys are not set
const memoryStore = {
  profiles: new Map(),
  farms: new Map(),
  crops: new Map(),
  agricultural_sources: new Map(),
  crop_recommendations: new Map(),
  soil_analyses: new Map(),
  disease_analyses: new Map(),
  fertilizer_advisories: new Map(),
  cultivation_plans: new Map(),
  cultivation_tasks: new Map(),
  chat_conversations: new Map(),
  chat_messages: new Map(),
  notifications: new Map(),
  ai_feedback: new Map(),
  audit_logs: new Map(),
};

// Seed initial memory store with default Indian crops catalog
const initialCrops = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Rice (Paddy)',
    scientific_name: 'Oryza sativa',
    category: 'cereals',
    description: 'Staple cereal crop thriving in submerged/clayey conditions with warm climate.',
    suitable_soil_types: ['clay', 'clay loam', 'alluvial'],
    suitable_seasons: ['Kharif'],
    water_requirement: 'High (1200-1500 mm)',
    growth_duration_days: 135,
    supported_regions: ['Punjab', 'West Bengal', 'Uttar Pradesh', 'Andhra Pradesh', 'Tamil Nadu'],
    is_active: true,
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Wheat',
    scientific_name: 'Triticum aestivum',
    category: 'cereals',
    description: 'Premier winter cereal crop requiring cool temperatures during vegetative growth and warm weather for grain filling.',
    suitable_soil_types: ['loamy', 'alluvial', 'clay loam'],
    suitable_seasons: ['Rabi'],
    water_requirement: 'Moderate (450-650 mm)',
    growth_duration_days: 120,
    supported_regions: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar'],
    is_active: true,
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Cotton',
    scientific_name: 'Gossypium hirsutum',
    category: 'commercial',
    description: 'White gold fiber crop flourishing in deep moisture-retentive black soils with warm days.',
    suitable_soil_types: ['black soil', 'alluvial', 'clay loam'],
    suitable_seasons: ['Kharif'],
    water_requirement: 'Moderate to High (700-1100 mm)',
    growth_duration_days: 160,
    supported_regions: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Rajasthan'],
    is_active: true,
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Tomato',
    scientific_name: 'Solanum lycopersicum',
    category: 'vegetables',
    description: 'High-value solanaceous vegetable sensitive to frost and waterlogging.',
    suitable_soil_types: ['sandy loam', 'loamy soil', 'red soil'],
    suitable_seasons: ['Kharif', 'Rabi', 'Zaid'],
    water_requirement: 'Moderate (400-600 mm)',
    growth_duration_days: 110,
    supported_regions: ['Andhra Pradesh', 'Madhya Pradesh', 'Karnataka', 'Gujarat', 'Maharashtra'],
    is_active: true,
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Chickpea (Gram)',
    scientific_name: 'Cicer arietinum',
    category: 'pulses',
    description: 'Dominant rabi pulse fixing atmospheric nitrogen, well adapted to conserved moisture.',
    suitable_soil_types: ['loamy soil', 'black soil', 'clay loam'],
    suitable_seasons: ['Rabi'],
    water_requirement: 'Low (300-400 mm)',
    growth_duration_days: 110,
    supported_regions: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Uttar Pradesh'],
    is_active: true,
  },
];

initialCrops.forEach((c) => memoryStore.crops.set(c.id, c));

export const dbRepository = {
  // ----------------------------------------------------
  // PROFILES
  // ----------------------------------------------------
  async getProfile(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', userId).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
    return memoryStore.profiles.get(userId) || null;
  },

  async upsertProfile(userId, profileData) {
    const record = {
      id: userId,
      full_name: profileData.fullName || profileData.full_name || 'Farmer',
      phone: profileData.phone || null,
      preferred_language: profileData.preferredLanguage || profileData.preferred_language || 'en',
      state: profileData.state || null,
      district: profileData.district || null,
      village: profileData.village || null,
      farming_experience: profileData.farmingExperience || profileData.farming_experience || null,
      role: profileData.role || 'farmer',
      onboarding_completed: profileData.onboardingCompleted ?? profileData.onboarding_completed ?? false,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('profiles').upsert(record).select().single();
      if (error) throw error;
      return data;
    }

    const existing = memoryStore.profiles.get(userId) || { created_at: new Date().toISOString() };
    const merged = { ...existing, ...record };
    memoryStore.profiles.set(userId, merged);
    return merged;
  },

  // ----------------------------------------------------
  // FARMS
  // ----------------------------------------------------
  async getFarmsByUser(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('farms')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.farms.values())
      .filter((f) => f.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getFarmById(farmId, userId = null) {
    if (isSupabaseConfigured()) {
      let query = supabaseAdmin.from('farms').select('*').eq('id', farmId);
      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query.single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
    const farm = memoryStore.farms.get(farmId);
    if (!farm) return null;
    if (userId && farm.user_id !== userId) return null;
    return farm;
  },

  async createFarm(userId, farmData) {
    const farmRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      farm_name: farmData.farmName,
      state: farmData.state,
      district: farmData.district,
      village: farmData.village || null,
      latitude: farmData.latitude || null,
      longitude: farmData.longitude || null,
      land_area: farmData.landArea,
      area_unit: farmData.areaUnit || 'acre',
      soil_type: farmData.soilType || null,
      soil_ph: farmData.soilPh || null,
      nitrogen: farmData.nitrogen || null,
      phosphorus: farmData.phosphorus || null,
      potassium: farmData.potassium || null,
      organic_carbon: farmData.organicCarbon || null,
      electrical_conductivity: farmData.electricalConductivity || null,
      irrigation_type: farmData.irrigationType,
      water_availability: farmData.waterAvailability,
      notes: farmData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('farms').insert(farmRecord).select().single();
      if (error) throw error;
      return data;
    }

    memoryStore.farms.set(farmRecord.id, farmRecord);
    return farmRecord;
  },

  async updateFarm(farmId, userId, updateData) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('farms')
        .update({
          ...(updateData.farmName ? { farm_name: updateData.farmName } : {}),
          ...(updateData.state ? { state: updateData.state } : {}),
          ...(updateData.district ? { district: updateData.district } : {}),
          ...(updateData.village !== undefined ? { village: updateData.village } : {}),
          ...(updateData.landArea ? { land_area: updateData.landArea } : {}),
          ...(updateData.areaUnit ? { area_unit: updateData.areaUnit } : {}),
          ...(updateData.soilType !== undefined ? { soil_type: updateData.soilType } : {}),
          ...(updateData.soilPh !== undefined ? { soil_ph: updateData.soilPh } : {}),
          ...(updateData.nitrogen !== undefined ? { nitrogen: updateData.nitrogen } : {}),
          ...(updateData.phosphorus !== undefined ? { phosphorus: updateData.phosphorus } : {}),
          ...(updateData.potassium !== undefined ? { potassium: updateData.potassium } : {}),
          ...(updateData.irrigationType ? { irrigation_type: updateData.irrigationType } : {}),
          ...(updateData.waterAvailability ? { water_availability: updateData.waterAvailability } : {}),
          ...(updateData.notes !== undefined ? { notes: updateData.notes } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', farmId)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const farm = memoryStore.farms.get(farmId);
    if (!farm || farm.user_id !== userId) return null;
    const updated = {
      ...farm,
      ...(updateData.farmName ? { farm_name: updateData.farmName } : {}),
      ...(updateData.state ? { state: updateData.state } : {}),
      ...(updateData.district ? { district: updateData.district } : {}),
      ...(updateData.village !== undefined ? { village: updateData.village } : {}),
      ...(updateData.landArea ? { land_area: updateData.landArea } : {}),
      ...(updateData.areaUnit ? { area_unit: updateData.areaUnit } : {}),
      ...(updateData.soilType !== undefined ? { soil_type: updateData.soilType } : {}),
      ...(updateData.soilPh !== undefined ? { soil_ph: updateData.soilPh } : {}),
      ...(updateData.nitrogen !== undefined ? { nitrogen: updateData.nitrogen } : {}),
      ...(updateData.phosphorus !== undefined ? { phosphorus: updateData.phosphorus } : {}),
      ...(updateData.potassium !== undefined ? { potassium: updateData.potassium } : {}),
      ...(updateData.irrigationType ? { irrigation_type: updateData.irrigationType } : {}),
      ...(updateData.waterAvailability ? { water_availability: updateData.waterAvailability } : {}),
      ...(updateData.notes !== undefined ? { notes: updateData.notes } : {}),
      updated_at: new Date().toISOString(),
    };
    memoryStore.farms.set(farmId, updated);
    return updated;
  },

  async deleteFarm(farmId, userId) {
    if (isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('farms').delete().eq('id', farmId).eq('user_id', userId);
      if (error) throw error;
      return true;
    }
    const farm = memoryStore.farms.get(farmId);
    if (!farm || farm.user_id !== userId) return false;
    memoryStore.farms.delete(farmId);
    return true;
  },

  // ----------------------------------------------------
  // CROPS
  // ----------------------------------------------------
  async getCrops({ category, search, limit = 50 }) {
    if (isSupabaseConfigured()) {
      let query = supabaseAdmin.from('crops').select('*').eq('is_active', true);
      if (category) query = query.eq('category', category);
      if (search) query = query.ilike('name', `%${search}%`);
      const { data, error } = await query.limit(limit);
      if (error) throw error;
      return data;
    }
    let list = Array.from(memoryStore.crops.values()).filter((c) => c.is_active);
    if (category) list = list.filter((c) => c.category === category);
    if (search) list = list.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    return list.slice(0, limit);
  },

  async getCropById(cropId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('crops').select('*').eq('id', cropId).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
    return memoryStore.crops.get(cropId) || null;
  },

  // ----------------------------------------------------
  // ADVISORIES: CROP RECOMMENDATIONS
  // ----------------------------------------------------
  async saveCropRecommendation(record) {
    const rec = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...record,
    };
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('crop_recommendations').insert(rec).select().single();
      if (error) throw error;
      return data;
    }
    memoryStore.crop_recommendations.set(rec.id, rec);
    return rec;
  },

  async getCropRecommendationsByUser(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('crop_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.crop_recommendations.values())
      .filter((r) => r.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getCropRecommendationById(id, userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('crop_recommendations')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
    const r = memoryStore.crop_recommendations.get(id);
    return r && r.user_id === userId ? r : null;
  },

  // ----------------------------------------------------
  // ADVISORIES: SOIL ANALYSES
  // ----------------------------------------------------
  async saveSoilAnalysis(record) {
    const rec = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...record,
    };
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('soil_analyses').insert(rec).select().single();
      if (error) throw error;
      return data;
    }
    memoryStore.soil_analyses.set(rec.id, rec);
    return rec;
  },

  async getSoilAnalysesByUser(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('soil_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.soil_analyses.values())
      .filter((s) => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // ----------------------------------------------------
  // ADVISORIES: DISEASE ANALYSES
  // ----------------------------------------------------
  async saveDiseaseAnalysis(record) {
    const rec = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...record,
    };
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('disease_analyses').insert(rec).select().single();
      if (error) throw error;
      return data;
    }
    memoryStore.disease_analyses.set(rec.id, rec);
    return rec;
  },

  async getDiseaseAnalysesByUser(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('disease_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.disease_analyses.values())
      .filter((d) => d.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getDiseaseAnalysisById(id, userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('disease_analyses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
    const d = memoryStore.disease_analyses.get(id);
    return d && d.user_id === userId ? d : null;
  },

  // ----------------------------------------------------
  // ADVISORIES: FERTILIZER
  // ----------------------------------------------------
  async saveFertilizerAdvisory(record) {
    const rec = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...record,
    };
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('fertilizer_advisories').insert(rec).select().single();
      if (error) throw error;
      return data;
    }
    memoryStore.fertilizer_advisories.set(rec.id, rec);
    return rec;
  },

  async getFertilizerAdvisoriesByUser(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('fertilizer_advisories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.fertilizer_advisories.values())
      .filter((f) => f.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // ----------------------------------------------------
  // CULTIVATION PLANS & TASKS
  // ----------------------------------------------------
  async saveCultivationPlan(planRecord, tasks = []) {
    const plan = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      ...planRecord,
    };

    if (isSupabaseConfigured()) {
      const { data: savedPlan, error: planError } = await supabaseAdmin
        .from('cultivation_plans')
        .insert(plan)
        .select()
        .single();
      if (planError) throw planError;

      if (tasks.length > 0) {
        const tasksPayload = tasks.map((t) => ({
          id: crypto.randomUUID(),
          plan_id: savedPlan.id,
          user_id: plan.user_id,
          title: t.title,
          description: t.description || null,
          task_date: t.task_date || null,
          growth_stage: t.growth_stage || null,
          status: 'pending',
          created_at: new Date().toISOString(),
        }));
        const { error: tasksError } = await supabaseAdmin.from('cultivation_tasks').insert(tasksPayload);
        if (tasksError) logger.error('Error saving cultivation tasks:', tasksError);
      }

      return savedPlan;
    }

    memoryStore.cultivation_plans.set(plan.id, plan);
    tasks.forEach((t) => {
      const taskId = crypto.randomUUID();
      memoryStore.cultivation_tasks.set(taskId, {
        id: taskId,
        plan_id: plan.id,
        user_id: plan.user_id,
        title: t.title,
        description: t.description || null,
        task_date: t.task_date || null,
        growth_stage: t.growth_stage || null,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
    });

    return plan;
  },

  async getCultivationPlansByUser(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('cultivation_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.cultivation_plans.values())
      .filter((p) => p.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getCultivationPlanById(id, userId) {
    if (isSupabaseConfigured()) {
      const { data: plan, error: planError } = await supabaseAdmin
        .from('cultivation_plans')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
      if (planError && planError.code !== 'PGRST116') throw planError;
      if (!plan) return null;

      const { data: tasks } = await supabaseAdmin
        .from('cultivation_tasks')
        .select('*')
        .eq('plan_id', id)
        .order('task_date', { ascending: true });

      return { ...plan, tasks: tasks || [] };
    }

    const plan = memoryStore.cultivation_plans.get(id);
    if (!plan || plan.user_id !== userId) return null;
    const tasks = Array.from(memoryStore.cultivation_tasks.values()).filter((t) => t.plan_id === id);
    return { ...plan, tasks };
  },

  async updateTaskStatus(taskId, userId, status) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('cultivation_tasks')
        .update({
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', taskId)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const task = memoryStore.cultivation_tasks.get(taskId);
    if (!task || task.user_id !== userId) return null;
    const updated = {
      ...task,
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    };
    memoryStore.cultivation_tasks.set(taskId, updated);
    return updated;
  },

  // ----------------------------------------------------
  // CHAT CONVERSATIONS & MESSAGES
  // ----------------------------------------------------
  async getConversationsByUser(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.chat_conversations.values())
      .filter((c) => c.user_id === userId)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  },

  async createConversation(userId, { farmId, title }) {
    const conv = {
      id: crypto.randomUUID(),
      user_id: userId,
      farm_id: farmId || null,
      title: title || 'New Conversation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('chat_conversations').insert(conv).select().single();
      if (error) throw error;
      return data;
    }
    memoryStore.chat_conversations.set(conv.id, conv);
    return conv;
  },

  async getMessagesByConversation(conversationId, userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.chat_messages.values())
      .filter((m) => m.conversation_id === conversationId && m.user_id === userId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  async saveMessage({ conversationId, userId, role, content, metadata = {} }) {
    const msg = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      user_id: userId,
      role,
      content,
      metadata,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('chat_messages').insert(msg).select().single();
      if (error) throw error;

      await supabaseAdmin
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    }
    memoryStore.chat_messages.set(msg.id, msg);
    const conv = memoryStore.chat_conversations.get(conversationId);
    if (conv) {
      conv.updated_at = new Date().toISOString();
      memoryStore.chat_conversations.set(conversationId, conv);
    }
    return msg;
  },

  // ----------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------
  async getNotificationsByUser(userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.notifications.values())
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async markNotificationRead(id, userId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const notif = memoryStore.notifications.get(id);
    if (!notif || notif.user_id !== userId) return null;
    notif.is_read = true;
    memoryStore.notifications.set(id, notif);
    return notif;
  },

  async markAllNotificationsRead(userId) {
    if (isSupabaseConfigured()) {
      const { error } = await supabaseAdmin.from('notifications').update({ is_read: true }).eq('user_id', userId);
      if (error) throw error;
      return true;
    }
    for (const [id, notif] of memoryStore.notifications.entries()) {
      if (notif.user_id === userId) {
        notif.is_read = true;
        memoryStore.notifications.set(id, notif);
      }
    }
    return true;
  },

  async saveNotification(record) {
    const notif = {
      id: crypto.randomUUID(),
      is_read: false,
      created_at: new Date().toISOString(),
      ...record,
    };
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('notifications').insert(notif).select().single();
      if (error) throw error;
      return data;
    }
    memoryStore.notifications.set(notif.id, notif);
    return notif;
  },

  // ----------------------------------------------------
  // FEEDBACK
  // ----------------------------------------------------
  async saveFeedback(record) {
    const item = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...record,
    };
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin.from('ai_feedback').insert(item).select().single();
      if (error) throw error;
      return data;
    }
    memoryStore.ai_feedback.set(item.id, item);
    return item;
  },

  // ----------------------------------------------------
  // AUDIT LOGS
  // ----------------------------------------------------
  async logAudit({ actorId, action, entityType, entityId, metadata = {} }) {
    const entry = {
      id: crypto.randomUUID(),
      actor_id: actorId || null,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      metadata,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured()) {
      await supabaseAdmin.from('audit_logs').insert(entry);
      return entry;
    }
    memoryStore.audit_logs.set(entry.id, entry);
    return entry;
  },

  async getAuditLogs(limit = 100) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    }
    return Array.from(memoryStore.audit_logs.values())
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  },
};
