# Twilio Phone Authentication Setup Guide

## What I Updated

Your phone and email OTP authentication now connects to real Supabase with Twilio SMS!

### Files Modified:
1. **[lib/supabase/auth.tsx](lib/supabase/auth.tsx)**
   - Added `sendPhoneOtp()` - Sends real OTP via Twilio
   - Added `verifyPhoneOtp()` - Verifies real OTP
   - Added `sendEmailOtp()` - Sends email OTP
   - Added `verifyEmailOtp()` - Verifies email OTP

2. **[components/modals/AuthModal.tsx](components/modals/AuthModal.tsx)**
   - Updated to use real Supabase OTP functions
   - Automatically adds +91 country code for Indian phone numbers

## Step-by-Step Setup

### Step 1: Create Twilio Account (Free Trial)

1. **Go to Twilio**: https://www.twilio.com/try-twilio
2. **Sign up** with your email
3. **Verify your email** and phone number
4. **You'll get $15 trial credit** - enough for testing!

### Step 2: Get Your Twilio Credentials

After signing up, you'll be on the Twilio Console Dashboard:

#### A. Get Account SID and Auth Token
1. On the dashboard home page, you'll see:
   - **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Auth Token**: Click "Show" to reveal it
2. **Copy both** - you'll need them for Supabase

#### B. Create a Messaging Service
1. In the left sidebar, click **Messaging** → **Services**
2. Click **Create Messaging Service**
3. **Friendly name**: Enter "Shindhu Cinemas OTP" (or any name)
4. **Use case**: Select "Verify users"
5. Click **Create Messaging Service**
6. You'll see your **Messaging Service SID**: `MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
7. **Copy this SID** - you'll need it

#### C. Add a Sender (Required for Trial)
1. After creating the service, click **Add Senders**
2. Select **Phone Number**
3. Click **Continue**
4. Click **Get a trial number** (or use an existing Twilio number if you have one)
5. Twilio will assign you a free trial phone number
6. Click **Done**

### Step 3: Configure Supabase

Now connect your Twilio credentials to Supabase:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: **Shindhu Cinemas** (mrdmwlbelgczpzmfbtsi)
3. Click **Authentication** (left sidebar)
4. Click **Providers** tab
5. Scroll down to **Phone**
6. Click **Enable Phone Sign-In**

#### Fill in the settings:
- **Enable Phone Sign-Up**: Toggle ON
- **SMS provider**: Select **Twilio**
- **Twilio Account SID**: Paste from Step 2A
- **Twilio Auth Token**: Paste from Step 2A
- **Twilio Message Service SID**: Paste from Step 2B
- **Twilio Content SID**: Leave empty (optional, for WhatsApp)

7. **Click Save** at the bottom

### Step 4: Test Your Setup

#### Important: Trial Account Limitations
- **Twilio trial accounts** can only send SMS to **verified phone numbers**
- You must verify your phone number in Twilio Console first

#### Verify Your Phone Number in Twilio:
1. Go to Twilio Console
2. Click **Phone Numbers** → **Manage** → **Verified Caller IDs**
3. Click **Add a new Caller ID**
4. Enter your Indian phone number with +91 (e.g., +919876543210)
5. You'll receive a verification code via SMS
6. Enter the code to verify

#### Test in Your App:
1. **Restart your dev server** (IMPORTANT!)
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. Open your app: http://localhost:3000
3. Click **Sign up**
4. Fill in all fields
5. For **Mobile Number**, enter YOUR VERIFIED number (without +91, just 10 digits)
6. Click **Verify Phone**
7. Check your phone for the SMS with OTP code
8. Enter the OTP code
9. Should verify successfully!

### Step 5: Check Console Logs

Open browser console (F12) when testing:

**✅ Success logs:**
```
[Auth] Sending phone OTP to: +919876543210
[Auth] Phone OTP sent successfully
[Auth] Verifying phone OTP for: +919876543210
[Auth] Phone OTP verified successfully
```

**❌ Error logs:**
```
[Auth] Phone OTP error: [error message]
```

Common errors and solutions:

| Error | Solution |
|-------|----------|
| "To number is not a valid mobile number" | Make sure phone has +91 country code |
| "Unverified numbers" | Verify your phone number in Twilio Console (Step 4) |
| "Invalid credentials" | Double-check Account SID and Auth Token |
| "Service not found" | Verify Messaging Service SID is correct |
| "Insufficient funds" | Trial credit ran out - add payment method in Twilio |

## How It Works

### Phone Verification Flow:
1. User enters phone number (10 digits)
2. User clicks "Verify Phone"
3. App adds +91 and calls `sendPhoneOtp('+919876543210')`
4. Supabase → Twilio → Sends SMS with 6-digit OTP
5. User receives SMS with OTP code
6. User enters OTP
7. User clicks "Confirm"
8. App calls `verifyPhoneOtp('+919876543210', '123456')`
9. Supabase verifies the OTP
10. Phone marked as verified ✓

### Email Verification Flow:
Same as phone, but uses email instead of SMS.

## Cost Breakdown (After Trial)

If you upgrade Twilio account:
- **SMS to India**: ~$0.0055 per SMS
- **1000 OTPs** ≈ $5.50
- **10,000 OTPs** ≈ $55

For production, you might want to look into:
- Local SMS providers (cheaper for India)
- MSG91, Twilio, etc.

## Production Checklist

Before going live:

- [ ] Verify all Twilio credentials are correct
- [ ] Test with multiple phone numbers
- [ ] Add payment method to Twilio (remove trial restrictions)
- [ ] Consider upgrading to paid Twilio account
- [ ] Set up error monitoring
- [ ] Add rate limiting for OTP requests
- [ ] Store Twilio credentials in secure environment variables (already done!)

## Demo Mode Fallback

If Supabase is not configured, the app automatically falls back to demo mode:
- Accepts any phone number
- OTP "123456" works for verification
- No real SMS sent

This allows development without Twilio setup.

## Troubleshooting

### Phone OTP Not Sending?

1. **Check Supabase configuration**:
   - Auth → Providers → Phone is enabled
   - Twilio credentials are saved

2. **Check Twilio account**:
   - Account is active
   - Messaging Service has a sender
   - Phone number is verified (for trial)

3. **Check console logs**:
   - Look for error messages
   - Check if Supabase is configured: `isConfigured: true`

### OTP Verification Failing?

1. **Check OTP expiry**: OTPs expire after 60 seconds
2. **Check phone number format**: Must include +91
3. **Try resending OTP**: Click "Resend OTP"

### Still Issues?

Check the browser console for detailed error logs. All errors are logged with `[Auth]` prefix.

---

## Status: ✅ READY TO TEST

Your phone authentication is now fully connected to Supabase + Twilio!

**Next Steps:**
1. Create Twilio account
2. Get credentials
3. Configure Supabase
4. Verify your phone number in Twilio
5. Test signup with your number
6. Enjoy real SMS OTP! 🎉
