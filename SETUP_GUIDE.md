# 🚀 AuraCarbon Full-Stack Implementation Guide

## Phase 0: Environment Setup (You are here)

### Step 1: Supabase Setup (Step-by-Step)

#### 1.1 Create Supabase Project
1. Go to **[supabase.com](https://supabase.com)**
2. Click **"Start your project"** → Sign up or login
3. Create new organisation: `auracarbon`
4. Create project:
   - **Name**: `auracarbon-prod`
   - **Password**: Save this securely! ⚠️
   - **Region**: Pick closest to you
5. Wait 2-3 minutes...

#### 1.2 Get Connection Strings
After project creation:
1. Go to **Settings** → **Database** → **Connection Info**
2. Copy the **"Connection string"** (PostgreSQL)
3. Go to **Settings** → **API** → copy:
   - `Project URL` (e.g., `https://xyzabc.supabase.co`)
   - `anon public key`
   - `service_role key` (keep secret!)

#### 1.3 Set Up Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **Create new project** or select existing
3. Go to **APIs & Services** → **Credentials**
4. **Create Credentials** → **OAuth 2.0 Client ID** → **Web Application**
5. Add URIs:
   ```
   Authorized JavaScript origins:
   - http://localhost:3001
   - https://yourdomain.com (production)
   
   Authorized redirect URIs:
   - http://localhost:3001/api/auth/callback/google
   - https://yourdomain.com/api/auth/callback/google
   ```
6. Copy **Client ID** and **Client Secret**

#### 1.4 Set Up GitHub OAuth
1. Go to **GitHub** → **Settings** → **Developer settings** → **OAuth Apps**
2. **New OAuth App**
   - **Application name**: `AuraCarbon`
   - **Homepage URL**: `http://localhost:3001`
   - **Authorization callback URL**: `http://localhost:3001/api/auth/callback/github`
3. Copy **Client ID** and **Client Secret**

#### 1.5 Create `.env.local`
Create file: `auracarbon_rebuilt/.env.local`

```bash
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Supabase API
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE_ROLE_KEY]"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"  # Run this command to generate
NEXTAUTH_URL="http://localhost:3001"

# OAuth
GOOGLE_CLIENT_ID="[PASTE_HERE]"
GOOGLE_CLIENT_SECRET="[PASTE_HERE]"

GITHUB_CLIENT_ID="[PASTE_HERE]"
GITHUB_CLIENT_SECRET="[PASTE_HERE]"
```

---

### Step 2: Install Dependencies & Push Schema

```bash
cd auracarbon_rebuilt

# Install all dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to Supabase (creates tables)
npm run db:push

# Seed with 50 materials + 150 countries
npm run db:seed
```

Expected output:
```
✅ Created 150 grid factors
✅ Created 50 raw materials
✅ Created ~750 material factors
✅ Created 1 sample tenant
✨ Seed completed successfully!
```

---

### Step 3: Start the App

```bash
npm run dev
# Server running at http://localhost:3001
```

---

## What's Been Completed ✅

### Backend Infrastructure
- ✅ **Prisma Schema**: Complete DB design (users, materials, calculations, audit logs, etc.)
- ✅ **Carbon Engine**: IPCC 2019 compliant calculation engine (TypeScript)
- ✅ **Carbon Engine Tests**: 30+ unit tests covering all scenarios
- ✅ **Seed Script**: 50 materials + 150 countries + grid EFs
- ✅ **NextAuth Setup**: Email/password + Google + GitHub OAuth
- ✅ **API Endpoints**:
  - `POST /api/calculations/create` - Main calculation endpoint
  - `GET /api/calculations/records` - Fetch user's records
  - `GET /api/dashboard/stats` - KPI aggregation
  - `GET /api/materials` - Material library (searchable, filterable)
  - `GET /api/grid-factors` - All countries and grid EFs

### What's NOT Yet Done (Next Steps)

#### UI Components (Pages)
- [ ] `/auth/login` - Login form (email/password/OAuth buttons)
- [ ] `/auth/register` - Signup form
- [ ] `/dashboard` - KPI dashboard with 3D charts
- [ ] `/calculator` - Enhanced spatial calculator UI
- [ ] `/materials` - Material library browser
- [ ] `/records` - Calculation history with export
- [ ] `/admin` - Admin panel (manage users, materials)

#### Features
- [ ] PDF export for calculations
- [ ] 3D pie chart visualization (Three.js)
- [ ] Animated gauges and sparklines
- [ ] Email verification
- [ ] Rate limiting
- [ ] Stripe integration (subscription tiers)
- [ ] CI/CD pipeline

---

## Quick Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│  NEXT.JS FRONTEND (React 18, Tailwind, Framer Motion) │
│  - Login/Register/OAuth                             │
│  - Calculator (Spatial, 3D pie chart)               │
│  - Dashboard (3D charts, KPIs, sparklines)          │
│  - Material Library (searchable, drilldown)         │
│  - Records (history, export, filters)               │
└────────────────┬────────────────────────────────────┘
                 │ API Routes
┌────────────────▼────────────────────────────────────┐
│  NEXT.JS API ROUTES (TypeScript)                    │
│  - NextAuth (JWT + session management)              │
│  - Calculations (POST with payload)                 │
│  - Dashboard Stats (aggregations)                   │
│  - Material CRUD                                    │
│  - Records (list, export, delete)                   │
└────────────────┬────────────────────────────────────┘
                 │ ORM
┌────────────────▼────────────────────────────────────┐
│  PRISMA (ORM)                                       │
│  - Type-safe DB access                              │
│  - Auto-migrations                                  │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│  SUPABASE PostgreSQL (Cloud DB)                     │
│  - Users, Materials, Calculations, Audit Logs       │
│  - Grid Factors (countries + EFs)                   │
│  - Multi-tenant support                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CARBON ENGINE (lib/carbon-engine.ts)               │
│  - E = A × EF × GWP formula                         │
│  - Unit conversions (ton, kg, m3, liter, kWh)       │
│  - CBAM risk assessment                             │
│  - Forecasting, delta calculations, recommendations │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Next: Build the UI Components

Once environment setup is complete, I'll build:

1. **Login/Register Pages** (2 files)
2. **Enhanced Calculator** with 3D pie chart (3 files)
3. **Dashboard** with animated KPIs (3 files)
4. **Material Library** browser (1 file)
5. **Records** page with export (2 files)
6. **Admin Panel** (3 files)
7. **Utility components**: GlassCard, Gauges, Charts (5 files)

**Total**: ~20 new files (all UI + hooks)

Ready? After you complete the Supabase setup, run:
```bash
npm install && npm run db:push && npm run db:seed
```

Then confirm and I'll build the entire UI in one shot! 🎨
