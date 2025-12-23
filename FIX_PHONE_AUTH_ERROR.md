# Fix: "Database error saving new user"

## Problem

When trying to send phone OTP, you get:
```
AuthApiError: Database error saving new user
```

This happens because Supabase cannot create a profile when a user signs up with phone authentication.

## Root Cause

**Missing database trigger** - When a user signs up with phone OTP, Supabase creates a record in `auth.users` but there's no automatic trigger to create a corresponding record in the `profiles` table.

## Solution (5 Minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: **Shindhu Cinemas** (mrdmwlbelgczpzmfbtsi)
3. Click **SQL Editor** in the left sidebar
4. Click **"New query"**

### Step 2: Run the Setup SQL

1. **Open the file**: `supabase-phone-auth-setup.sql` (in your project root)
2. **Copy ALL the SQL** from that file
3. **Paste into Supabase SQL Editor**
4. Click **"Run"** button (or press Ctrl+Enter)

### Step 3: Verify Setup

After running the SQL, you should see:
```
Success. No rows returned
```

**Check if trigger was created:**
```sql
SELECT trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Should return:
```
trigger_name: on_auth_user_created
```

### Step 4: Test Phone Auth

```bash
npm run dev
```

1. Go to http://localhost:3000
2. Sign up with phone: **9080440946** (your verified number)
3. Click "Verify Phone"
4. Should work now! ✅

## What the SQL Does

### 1. Creates Trigger Function
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
```
- Automatically creates a profile when a user signs up
- Works for phone, email, or Google OAuth

### 2. Creates Trigger
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
```
- Fires after any user is created
- Calls `handle_new_user()` function

### 3. Sets Up RLS Policies
- Users can view their own profile
- Users can update their own profile
- Allows automatic profile creation

## Alternative: Manual SQL (If file doesn't work)

If you can't open the file, run this SQL directly in Supabase:

```sql
-- Create trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone, avatar_url, city, wallet_balance, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    NULL,
    0,
    'SHINDHU' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users"
  ON public.profiles FOR INSERT
  WITH CHECK (true);
```

## Troubleshooting

### Error: "permission denied for schema public"

**Fix:** Run as postgres user or use service role:
```sql
GRANT ALL ON SCHEMA public TO postgres, service_role;
```

### Error: "trigger already exists"

**Fix:** Drop it first:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

### Error: "function already exists"

**Fix:** Use `CREATE OR REPLACE FUNCTION` (already in the script)

### Still getting "Database error"?

**Check:**

1. **Trigger exists:**
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE trigger_name = 'on_auth_user_created';
   ```

2. **Function exists:**
   ```sql
   SELECT * FROM information_schema.routines
   WHERE routine_name = 'handle_new_user';
   ```

3. **Profiles table structure:**
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'profiles';
   ```

## After Setup

Once the trigger is set up:

✅ **Phone sign up** - Works automatically
✅ **Email sign up** - Works automatically
✅ **Google OAuth** - Works automatically
✅ **Profile auto-created** - For all auth methods

## Test Checklist

After running the SQL:

- [ ] Run SQL in Supabase SQL Editor
- [ ] Verify trigger exists
- [ ] Restart dev server: `npm run dev`
- [ ] Test phone OTP with verified number
- [ ] Check profile was created in `profiles` table

## Expected Flow (After Fix)

```
1. User signs up with phone: +919080440946
        ↓
2. Supabase creates user in auth.users
        ↓
3. Trigger fires: on_auth_user_created
        ↓
4. Function runs: handle_new_user()
        ↓
5. Profile created in profiles table automatically
        ↓
6. OTP sent via Twilio
        ↓
7. User verifies OTP
        ↓
8. ✅ Success!
```

## Status After Fix

✅ Database trigger set up
✅ Profiles auto-created
✅ Phone auth works
✅ No more "Database error"

---

## Quick Fix Summary

1. **Copy** all SQL from `supabase-phone-auth-setup.sql`
2. **Paste** into Supabase SQL Editor
3. **Click** "Run"
4. **Test** phone auth
5. **Done!** ✅

This will fix the "Database error saving new user" error permanently for all authentication methods!
