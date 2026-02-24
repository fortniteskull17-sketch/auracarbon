## 🚀 Supabase Setup - Quick Reference

### Step 1: Create Supabase Account & Project (3 min)
1. Go to **https://supabase.com**
2. Click **"Start your project"** → Sign up (email or GitHub)
3. Create **Organization**: `auracarbon`
4. Create **Project**:
   - Name: `auracarbon-prod`
   - Database password: **[SAVE THIS!]** 
   - Region: Closest to you
   - Click "Create new project"
5. Wait 2-3 min for initialization...

---

### Step 2: Get Your Database Connection String (1 min)
Once project is ready:
1. Go **Settings** → **Database**
2. Under **Connection Info**, find and copy this:
   ```
   postgresql://postgres:YOUR_PASSWORD@db.XXXXXX.supabase.co:5432/postgres
   ```
3. Replace `YOUR_PASSWORD` with your database password from Step 1

---

### Step 3: Get API Keys (1 min)
1. Go **Settings** → **API**
2. Copy these:
   - **Project URL**: `https://XXXXXX.supabase.co`
   - **Anon Key**: `eyJhbGc...` (long string starting with `ey`)
   - **Service Role Key**: `eyJhbGc...` (another long string)
   - **Keep service role key SECRET!**

---

### Step 4: Set Up Google OAuth (2 min)
1. Go **https://console.cloud.google.com**
2. Create new project (or use existing)
3. **APIs & Services** → **Credentials**
4. **Create Credentials** → **OAuth 2.0 Client ID** → **Web Application**
5. Add these **Authorized Redirect URIs**:
   ```
   http://localhost:3001/api/auth/callback/google
   ```
6. Copy **Client ID** and **Client Secret**

---

### Step 5: Set Up GitHub OAuth (2 min)
1. Go **https://github.com/settings/developers**
2. **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: AuraCarbon
   - **Homepage URL**: http://localhost:3001
   - **Authorization callback URL**: http://localhost:3001/api/auth/callback/github
4. Copy **Client ID** and **Client Secret**

---

### Step 6: Create `.env.local` File (2 min)

Create a file: `auracarbon_rebuilt/.env.local`

Copy-paste this and fill in YOUR values (replace `[...]`):

```
# DATABASE
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.XXXXXX.supabase.co:5432/postgres"

# SUPABASE API
NEXT_PUBLIC_SUPABASE_URL="https://XXXXXX.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGc..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# NEXTAUTH
NEXTAUTH_SECRET="iH6+QDQ1v5pK2nL3mN4oP5qR6sT7uV8w"
NEXTAUTH_URL="http://localhost:3001"

# GOOGLE OAUTH
GOOGLE_CLIENT_ID="123456789-abcdefg.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx_xxxxx"

# GITHUB OAUTH
GITHUB_CLIENT_ID="Iv1.abc123def456"
GITHUB_CLIENT_SECRET="abcdef1234567890"
```

**Replace all `[...]` sections with actual values from Steps 2, 3, 4, 5**

---

### Step 7: Verify Connection (1 min)
Once `.env.local` is created, run:
```bash
npm run db:push
```

Expected output:
```
✅ Prisma schema pushed successfully
```

If you get an error, double-check your `DATABASE_URL` in `.env.local`

---

### Step 8: Seed Data (1 min)
After schema is pushed:
```bash
npm run db:seed
```

Should see:
```
✅ Created 150 grid factors
✅ Created 50 raw materials
✅ Created ~750 material factors
✨ Seed completed successfully!
```

---

## ✅ Complete!

After all steps:
```bash
npm run dev
```

Visit: **http://localhost:3001**

---

### 🆘 Troubleshooting

| Error | Fix |
|-------|-----|
| `ECONNREFUSED` | Check DATABASE_URL is correct (copy from Supabase Settings) |
| `Invalid JWT` | Check NEXT_PUBLIC_SUPABASE_ANON_KEY is pasted correctly |
| `OAuth error` | Verify redirect URIs exactly match: `http://localhost:3001/api/auth/callback/[google\|github]` |
| `Seed failed` | Make sure `npm run db:push` succeeded first |

---

💡 **Total time**: ~15 minutes (if you already have Google & GitHub accounts)
