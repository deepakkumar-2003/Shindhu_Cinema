# Google Authentication Test Guide

## What I Fixed

The code was checking `isSupabaseConfigured` (a cached constant) instead of calling `getIsSupabaseConfigured()` dynamically. This caused it to always use demo mode even when Supabase was configured.

**Fixed in:** `lib/supabase/auth.tsx` (lines 433-515)

## How to Test

### Step 1: Restart Dev Server (REQUIRED)

You MUST restart your dev server to pick up the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 2: Clear Browser Cache

1. Open Chrome DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR

1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"

### Step 3: Test Authentication

1. Go to http://localhost:3000
2. Open browser console (F12) → Console tab
3. Click "Sign in" or "Sign up"
4. Click "Continue with Google"

### Step 4: Check Console Logs

You should see these logs in the console:

✅ **If working correctly (Real OAuth):**
```
[Supabase] Configuration check: { isConfigured: true, hasUrl: true, hasKey: true, url: 'https://mrdmwlbelgc...' }
[Auth] Google sign-in initiated, Supabase configured: true
[Auth] Attempting real Google OAuth sign-in...
[Auth] Google OAuth initiated successfully - redirecting to Google...
```

Then you'll be redirected to Google's login page.

❌ **If still using demo mode:**
```
[Supabase] Configuration check: { isConfigured: false, ... }
[Auth] Google sign-in initiated, Supabase configured: false
[Auth] Supabase not configured, using demo mode
[Auth] Google sign-in (demo mode) completed
```

## Troubleshooting

### Still Shows Demo Mode?

**Solution 1: Verify Environment Variables**

Run this in terminal:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

They should show your Supabase credentials. If empty, the env file isn't loaded.

**Solution 2: Check .env.local File**

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://mrdmwlbelgczpzmfbtsi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Solution 3: Clear Next.js Cache**

```bash
# Stop dev server
# Delete cache
rm -rf .next
# Restart
npm run dev
```

**Solution 4: Restart Computer**

Sometimes environment variables need a full restart to load properly.

### OAuth Error After Redirect?

**Check Console for Error Message:**

If you see `[Auth] Google sign-in failed:` with an error:

1. **"Provider not enabled"**
   - Go to Supabase Dashboard
   - Verify Google provider is enabled
   - Check Client ID and Secret are saved

2. **"Invalid redirect URI"**
   - Go to Google Cloud Console
   - Verify redirect URI: `https://mrdmwlbelgczpzmfbtsi.supabase.co/auth/v1/callback`

3. **"Invalid client"**
   - Double-check Client ID and Secret in Supabase
   - Make sure they match Google Cloud Console

## Expected Flow (Real OAuth)

1. Click "Continue with Google"
2. Console shows: "Attempting real Google OAuth sign-in..."
3. Page redirects to accounts.google.com
4. You see Google's login/consent screen
5. After login, redirects back to your app
6. You're logged in with your real Google account

## Expected Flow (Demo Mode - Should NOT Happen)

1. Click "Continue with Google"
2. Console shows: "Supabase not configured, using demo mode"
3. Instantly logged in as "demo.google@example.com"
4. No redirect to Google

---

## Quick Checklist

Before testing:

- ✅ Enabled Google provider in Supabase
- ✅ Added Client ID and Secret in Supabase
- ✅ Saved configuration in Supabase
- ✅ `.env.local` has correct Supabase URL and Key
- ✅ Restarted dev server
- ✅ Cleared browser cache

After testing:

- ✅ Console shows "Supabase configured: true"
- ✅ Console shows "Attempting real Google OAuth"
- ✅ Redirects to Google login page
- ✅ Can login with real Google account
