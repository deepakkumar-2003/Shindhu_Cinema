# Supabase Email OTP Configuration

## Error: "relation auth.config does not exist"

This is **normal** - your Supabase project doesn't have the `auth.config` table. OTP expiry is configured differently.

## Solution: Configure via Dashboard UI

### Step 1: Check Authentication Settings

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: Shindhu Cinemas
3. **Navigate to**: Authentication → Settings (or Configuration)

### Step 2: Look for OTP/Email Settings

Look for these settings (names vary by Supabase version):

**Possible setting names:**
- "Email OTP Expiry"
- "OTP Expiry Duration"
- "Email Verification Expiry"
- "Auth Email Expiry"
- "Magic Link Expiry"

**If you find it:**
- Change from default (usually 60 or 3600 seconds)
- Set to: **600 seconds** (10 minutes)
- Click **Save**

**If you DON'T find it:**
- That's okay! The default setting will work for testing
- Most modern Supabase projects have reasonable defaults (300-3600 seconds)
- Continue to testing step

### Step 3: Enable Email Provider

1. **Navigate to**: Authentication → Providers
2. **Find**: Email
3. **Enable**: Toggle should be ON (green)
4. **Settings to check:**
   - ✅ Enable Email provider
   - ✅ Confirm email (can be OFF for testing)
   - ✅ Secure email change (can be OFF for testing)
5. **Click**: Save

## What's the Default Expiry?

**Most Supabase projects use:**
- Email Magic Link: 3600 seconds (60 minutes) - plenty of time!
- Email OTP: 300-3600 seconds (5-60 minutes)

**This is fine for testing!** You don't need to change it.

## Testing Without Changing Expiry

### Test Email OTP Right Now

1. **Start your app**:
   ```bash
   npm run dev
   ```

2. **Go to**: http://localhost:3000

3. **Test flow**:
   - Click sign up
   - Enter your real email address
   - Click "Verify Email"
   - Check your email inbox (check spam!)
   - Enter the 6-digit OTP
   - Click "Confirm"

4. **Expected result**: Should work! ✅

### If You Get "OTP Expired" Error

**Only then** we need to investigate the expiry time.

**For now**: Just proceed with testing!

## Checking Current Email Template

1. **Go to**: Authentication → Email Templates
2. **Find**: "Magic Link" or "Confirm Signup" or "Email OTP"
3. **Should see**:
   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your email:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>

   OR

   <h2>Your OTP Code</h2>
   <p>{{ .Token }}</p>
   ```

**Note**:
- Some Supabase versions use Magic Links instead of OTP codes
- Both work for email verification!
- The code will handle either method

## If Using Magic Links Instead of OTP

**Don't worry!** Supabase email auth can work with:
1. **Magic Links**: Click link in email to verify
2. **OTP Codes**: Enter 6-digit code

**Our code supports OTP**. To ensure OTP is used:

1. **Check**: Authentication → Providers → Email
2. **Look for**: "Enable Email OTP" or similar
3. **Enable it** if available

**If only Magic Link is available**:
- We'll need to adjust the code slightly
- Let me know and I'll update it

## Quick Diagnostic

**To check what type of email auth you have:**

1. Run your app
2. Try sending email OTP
3. Check your email inbox
4. **If you receive**:
   - **6-digit code** → OTP is working! ✅
   - **Click here link** → Magic Link (need to adjust code)

## Summary

### What to Do Now

1. ✅ **Enable Email Provider** in Supabase Dashboard
   - Authentication → Providers → Email → Toggle ON

2. ✅ **Don't worry about expiry time**
   - Default is usually fine (5-60 minutes)
   - Only change if you get expiry errors during testing

3. ✅ **Test email OTP immediately**
   - Use your real email
   - See what you receive (OTP code vs Magic Link)
   - Report back what happens

### Commands to Run

```bash
# Start your app
npm run dev

# Open browser
http://localhost:3000

# Test email verification
1. Enter your email
2. Click "Verify Email"
3. Check inbox
4. Follow instructions in email
```

### What to Check

**Browser Console (F12):**
```
[Auth] Sending email OTP to: your-email@gmail.com
[Auth] Email OTP sent successfully (or error message)
```

**Your Email Inbox:**
- Subject: Confirm your email / Your OTP Code
- Body: 6-digit code OR magic link
- From: noreply@mail.supabase.io (or similar)

---

**Next Step**: Try testing email verification now and let me know what happens! We'll adjust based on what you receive in your email. 📧
