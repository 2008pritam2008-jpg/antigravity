# Local Development & Production Deployment Guide

This guide walks through configuring, running, and deploying AgriAssist AI.

---

## 1. Local Development Setup

### Step 1: Install Node.js
Ensure you have Node.js 20.x or 22.x LTS installed:
```bash
node -v   # Should output v20+ or v22+
npm -v    # Should output v9+ or v10+
```

### Step 2: Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-org/agriassist-ai.git
cd agriassist-ai

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 3: Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: Set your Gemini API key for live AI generation
GEMINI_API_KEY=AIzaSy...

# Optional: Supabase configuration (omit to run with built-in in-memory repo)
# SUPABASE_URL=https://xyzcompany.supabase.co
# SUPABASE_ANON_KEY=eyJhbGci...
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**Frontend (`client/.env`):**
```env
VITE_API_BASE_URL=/api/v1
# Optional:
# VITE_SUPABASE_URL=https://xyzcompany.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Step 4: Run Development Servers

In terminal 1:
```bash
cd server
npm run dev
```

In terminal 2:
```bash
cd client
npm run dev
```

The frontend Vite server opens on **http://localhost:5173** and proxies `/api` calls to **http://localhost:5000**.

---

## 2. Supabase Cloud Configuration

### Automated Migration Runner (Recommended)
1. In your `server/.env`, configure your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   # For direct SQL execution, supply connection string or DB password:
   DATABASE_URL=postgresql://postgres.[your-project-id]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres
   # (or SUPABASE_DB_PASSWORD=your_db_password)
   ```
2. Execute the migration runner:
   ```bash
   npm run migrate
   ```
   This automatically reads `supabase/migrations/001_initial_schema.sql`, applies all 15 tables, RLS policies, trigger procedures, and inserts the 21 Indian crop catalog and research references.

### Manual SQL Editor Execution
Alternatively, in your [Supabase Cloud Dashboard](https://supabase.com/dashboard):
1. Navigate to the **SQL Editor** tab (`/sql/new`).
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`.
3. Click **RUN** to deploy the complete schema and seed data.

---

## 3. Production Deployment

### Frontend Deployment (Vercel / Cloudflare Pages / Netlify)
1. Link your Git repository.
2. Set Root Directory to `client`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_API_BASE_URL`: `https://api.yourdomain.com/api/v1`
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your_anon_key`

### Backend Deployment (Render / Railway / AWS ECS / Google Cloud Run)
1. Set Root Directory to `server`.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Configure Environment Variables:
   - `PORT`: `5000` (or host assigned)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://yourdomain.com`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your_anon_key`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your_service_role_key`

---

## 4. Verification Checklist

- [ ] `/api/v1/health` returns `status: "operational"`
- [ ] Login via Demo Farmer loads user dashboard
- [ ] Crop Recommendation wizard returns ranked crops
- [ ] Disease detection accepts JPG/PNG image and returns diagnostic report
- [ ] Cultivation schedule generates interactive phase checklist
- [ ] Chatbot responds in chosen Indian language

