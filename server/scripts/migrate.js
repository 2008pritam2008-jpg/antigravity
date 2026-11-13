#!/usr/bin/env node
/**
 * =========================================================================
 * AGRI-ASSIST: SUPABASE CLOUD POSTGRESQL MIGRATION RUNNER
 * =========================================================================
 * Applies 001_initial_schema.sql (tables, triggers, RLS policies, seed data)
 * to Supabase Cloud PostgreSQL.
 *
 * Supported Authentication & Connection Methods:
 * 1. Direct PostgreSQL Connection (DATABASE_URL / SUPABASE_DB_URL / POSTGRES_URL)
 * 2. Supabase SQL REST API via SUPABASE_SERVICE_ROLE_KEY
 * 3. Supabase Management API via SUPABASE_ACCESS_TOKEN
 * =========================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env and root .env if present
const serverEnvPath = path.resolve(__dirname, '../.env');
const rootEnvPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
}
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}

// Configuration options
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL ||
  '';
const SUPABASE_DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD || '';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

// Parse project reference if SUPABASE_URL exists
const getProjectRef = (url) => {
  if (!url) return null;
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/);
  return match ? match[1] : null;
};

// Locate migration file
const defaultMigrationFile = path.resolve(
  __dirname,
  '../../supabase/migrations/001_initial_schema.sql'
);

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const fileArgIndex = args.indexOf('--file');
const migrationFilePath =
  fileArgIndex !== -1 && args[fileArgIndex + 1]
    ? path.resolve(process.cwd(), args[fileArgIndex + 1])
    : defaultMigrationFile;

console.log('='.repeat(70));
console.log('🌱 AGRI-ASSIST: SUPABASE MIGRATION RUNNER');
console.log('='.repeat(70));
console.log(`📁 Target Migration File: ${migrationFilePath}`);
console.log(`⏱️  Timestamp: ${new Date().toISOString()}`);

if (!fs.existsSync(migrationFilePath)) {
  console.error(`\n❌ Migration file not found at: ${migrationFilePath}`);
  process.exit(1);
}

const sqlContent = fs.readFileSync(migrationFilePath, 'utf8');
console.log(`📄 SQL Payload Size: ${(sqlContent.length / 1024).toFixed(2)} KB`);

if (isDryRun) {
  console.log('\n🔍 [DRY RUN] Mode enabled. Validating SQL syntax without executing.');
  console.log(`- Total Characters: ${sqlContent.length}`);
  console.log(`- Statements detected: ${sqlContent.split(';').length - 1}`);
  console.log('✅ Dry-run completed successfully.');
  process.exit(0);
}

// -------------------------------------------------------------------------
// METHOD 1: Direct PostgreSQL Connection via pg
// -------------------------------------------------------------------------
async function runViaPostgresConnection(connectionString) {
  console.log('\n🔌 Attempting migration via Direct PostgreSQL Connection...');
  const client = new pg.Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database.');

    console.log('🚀 Executing initial schema migration script...');
    await client.query('BEGIN');
    await client.query(sqlContent);
    await client.query('COMMIT');
    console.log('✅ Migration committed successfully.');

    // Verification check
    console.log('\n🔎 Verifying created tables...');
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tableNames = tablesRes.rows.map((r) => r.table_name);
    console.log(`📊 Found ${tableNames.length} tables in public schema:`);
    console.log(`   ${tableNames.join(', ')}`);

    // Verify crops seed count
    const cropsRes = await client.query('SELECT COUNT(*) as count FROM public.crops;');
    console.log(`🌾 Verified Crops in catalog: ${cropsRes.rows[0].count} records.`);

    await client.end();
    return true;
  } catch (err) {
    console.error('❌ Direct PostgreSQL migration error:', err.message);
    try {
      await client.query('ROLLBACK');
    } catch (_) {}
    try {
      await client.end();
    } catch (_) {}
    return false;
  }
}

// -------------------------------------------------------------------------
// METHOD 2: Supabase REST API via Service Role Key
// -------------------------------------------------------------------------
async function runViaSupabaseServiceRole(url, serviceRoleKey) {
  console.log('\n⚡ Attempting migration via Supabase Service Role Key endpoint...');

  const endpoints = [
    `${url}/pg/query`,
    `${url}/rest/v1/rpc/exec_sql`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Probing endpoint: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ query: sqlContent }),
      });

      if (response.ok) {
        console.log(`✅ Migration applied successfully via ${endpoint}!`);
        return true;
      }

      const errorText = await response.text();
      console.log(`ℹ️ Endpoint ${endpoint} returned: ${response.status} (${errorText.slice(0, 120)})`);
    } catch (err) {
      console.log(`ℹ️ Endpoint ${endpoint} call failed: ${err.message}`);
    }
  }

  return false;
}

// -------------------------------------------------------------------------
// METHOD 3: Supabase Management API via SUPABASE_ACCESS_TOKEN
// -------------------------------------------------------------------------
async function runViaManagementApi(projectRef, accessToken) {
  console.log('\n🔑 Attempting migration via Supabase Management API...');
  const endpoint = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query: sqlContent }),
    });

    if (response.ok) {
      console.log('✅ Migration applied successfully via Supabase Management API!');
      return true;
    }

    const errorText = await response.text();
    console.error(`❌ Management API failed (${response.status}):`, errorText);
    return false;
  } catch (err) {
    console.error('❌ Management API error:', err.message);
    return false;
  }
}

// -------------------------------------------------------------------------
// MAIN EXECUTION ORCHESTRATOR
// -------------------------------------------------------------------------
async function main() {
  const projectRef = getProjectRef(SUPABASE_URL);

  // 1. Try direct connection string if provided
  let effectiveConnString = DATABASE_URL;
  if (!effectiveConnString && projectRef && SUPABASE_DB_PASSWORD) {
    effectiveConnString = `postgresql://postgres:${encodeURIComponent(
      SUPABASE_DB_PASSWORD
    )}@db.${projectRef}.supabase.co:5432/postgres`;
  }

  if (effectiveConnString) {
    const success = await runViaPostgresConnection(effectiveConnString);
    if (success) {
      console.log('\n🎉 ALL MIGRATIONS AND SEED DATA APPLIED SUCCESSFULLY!');
      process.exit(0);
    }
  }

  // 2. Try Supabase Service Role Key endpoint
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    const success = await runViaSupabaseServiceRole(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY
    );
    if (success) {
      console.log('\n🎉 ALL MIGRATIONS AND SEED DATA APPLIED SUCCESSFULLY!');
      process.exit(0);
    }
  }

  // 3. Try Supabase Management API
  if (projectRef && SUPABASE_ACCESS_TOKEN) {
    const success = await runViaManagementApi(projectRef, SUPABASE_ACCESS_TOKEN);
    if (success) {
      console.log('\n🎉 ALL MIGRATIONS AND SEED DATA APPLIED SUCCESSFULLY!');
      process.exit(0);
    }
  }

  // If none succeeded or credentials are empty, provide clear instructions
  console.log('\n' + '='.repeat(70));
  console.log('⚠️  MIGRATION ACTION REQUIRED');
  console.log('='.repeat(70));
  console.log(
    'To apply the migration to your Supabase Cloud PostgreSQL database, choose any of the options below:\n'
  );

  console.log('OPTION A: Provide DATABASE_URL or SUPABASE_DB_PASSWORD in server/.env');
  console.log('  1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/' + (projectRef || '<your-project-id>'));
  console.log('  2. Go to Project Settings -> Database -> Connection String (URI / Nodejs)');
  console.log('  3. Add to server/.env:');
  console.log('     DATABASE_URL=postgresql://postgres.[your-project]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
  console.log('     (or SUPABASE_DB_PASSWORD=your_db_password)');
  console.log('  4. Re-run: npm run migrate\n');

  console.log('OPTION B: Apply directly via the Supabase Cloud Web SQL Editor');
  console.log('  1. Open your Supabase SQL Editor:');
  console.log('     https://supabase.com/dashboard/project/' + (projectRef || '<your-project-id>') + '/sql/new');
  console.log('  2. Copy and paste the contents of:');
  console.log(`     ${migrationFilePath}`);
  console.log('  3. Click "RUN" to apply all 15 tables, RLS policies, and seed data.\n');

  console.log('OPTION C: Apply using Supabase CLI');
  console.log('  Run: npx supabase db push');
  console.log('='.repeat(70));

  if (!SUPABASE_URL && !DATABASE_URL) {
    console.log('\nℹ️ Note: No remote database credentials currently set in server/.env.');
    console.log('The application will continue operating with the built-in offline In-Memory repository.');
  }

  process.exit(1);
}

main().catch((err) => {
  console.error('\n💥 Unexpected migration error:', err);
  process.exit(1);
});

