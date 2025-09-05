# LCA Platform Deployment Fix

## Issue
The deployment is failing because Supabase environment variables are not configured on Vercel.

## Solution

### 1. Set Environment Variables on Vercel

Go to your Vercel project settings and add these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Get Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Go to Settings > API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set Variables in Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Select your project: `lca-platform-1-2`
3. Go to Settings > Environment Variables
4. Add the three variables above
5. Redeploy the project

### 4. Run Database Migrations

After setting up Supabase, run the SQL scripts in the `scripts/` folder:
- `001_create_lca_tables.sql`
- `002_create_profile_trigger.sql`

### 5. Redeploy

After adding the environment variables:
```bash
vercel --prod
```

## Changes Made

1. ✅ Updated Supabase client to handle missing env vars gracefully
2. ✅ Made admin page dynamic to avoid build-time errors
3. ✅ Made project detail page dynamic 
4. ✅ Fixed themeColor warning by moving to viewport export
5. ✅ Added environment variable examples
6. ✅ PWA install prompt working correctly

The build should now succeed once the environment variables are configured!
