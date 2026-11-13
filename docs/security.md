# Security Architecture & Data Governance

AgriAssist AI is engineered in accordance with strict defense-in-depth principles, safeguarding farmer data, preventing credential leakage, and ensuring safe AI recommendations.

---

## 1. Threat Model & Mitigations

### 1.1 Credential Protection
- **No Secret Exposure in Frontend**: The client bundle (`client/dist`) is strictly audited to ensure no private keys (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are present. Only the public Supabase `anon` key is exposed if Supabase client auth is active.
- **Environment Validation**: `server/src/config/env.js` validates environment variables with Zod on boot. Missing or malformed keys fail the server immediately.

### 1.2 Multi-Tenant Data Isolation
- **PostgreSQL Row Level Security (RLS)**: Every user table (`farms`, `crop_recommendations`, `soil_analyses`, `disease_analyses`, `fertilizer_advisories`, `cultivation_plans`) has RLS enabled. Policies strictly enforce `auth.uid() = user_id`.
- **Backend Ownership Verification**: Every controller validates that the `user_id` parsed from the verified JWT matches the resource owner before updating or deleting data.

### 1.3 AI Safety & Structured Output Validation
- **System Prompt Guardrails**: System instructions instruct Gemini never to invent pesticide registrations, unauthorized chemicals, or guaranteed yields.
- **Zod Output Parsing**: AI outputs must conform to strict JSON schemas (`aiResponse.schema.js`). Malformed responses or hallucinated schemas are rejected before reaching the database or user.

### 1.4 Multimodal File Upload Security
- **Memory-Only Buffers**: Uploaded disease inspection photos are never written directly to the host filesystem. They are held in memory buffers using `multer.memoryStorage()`.
- **MIME & Size Validation**: Only `image/jpeg`, `image/png`, and `image/webp` are permitted. Files exceeding 8MB are rejected by upload middleware.
- **Anti-Malware Vector Mitigation**: Memory buffer streams prevent executable code from running on the host system.

### 1.5 Rate Limiting & DoS Protection
- **Global API Rate Limiter**: 100 requests per 15-minute window per IP.
- **AI-Specific Rate Limiter**: Dedicated strict rate limiters on `/api/v1/advisories/*` and `/api/v1/chat/*` endpoints prevent abusive token consumption and quota exhaustion.
- **HTTP Security Headers**: Express app uses `helmet()` to set `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and strict HSTS headers.

---

## 2. Compliance & Farmer Data Privacy

- **Data Ownership**: Farmers retain complete ownership of their farm plot records, soil reports, and diagnostic images.
- **Right to Erasure**: The Settings interface allows farmers to download a JSON archive of their data or permanently purge their account and all associated records.
- **Educational Context**: Every advisory view displays clear disclosures stating recommendations are AI-assisted and should be verified with local agronomic authorities (KVK / ICAR).

