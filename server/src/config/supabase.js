// server/src/config/supabase.js
import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let supabaseClient = null;
let supabaseAdminClient = null;

if (env.SUPABASE_URL && (env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY)) {
  try {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY);
    supabaseAdminClient = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
    logger.info('Supabase client initialized successfully.');
  } catch (err) {
    logger.error('Failed to initialize Supabase client:', err);
  }
} else {
  logger.warn('SUPABASE_URL or keys not configured. Database will run in offline memory repository mode.');
}

export const supabase = supabaseClient;
export const supabaseAdmin = supabaseAdminClient;
export const isSupabaseConfigured = () => Boolean(supabaseClient);
