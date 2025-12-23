# Email OTP Verification Setup Guide

## Overview

This guide will help you set up **real email OTP verification** (6-digit codes) for your Shindhu Cinemas application using Supabase's built-in email authentication.

## Current Registration Rules

**Flexible Registration** (Current Setup):
- Users can create accounts with **EITHER** email OR phone verification
- Not both mandatory (for easier testing)
- Later you can change to require **BOTH** email AND phone verification

## Step 1: Verify Supabase Email Configuration

### 1.1 Check Email Provider Settings

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Select your project: **Shindhu Cinemas** (mrdmwlbelgczpzmfbtsi)

2. **Navigate to Authentication Settings**
   - Click **Authentication** (left sidebar)
   - Click **Providers**
   - Find **Email** section

3. **Verify Email is Enabled**
   - Toggle should be **ON** (green)
   - If OFF, enable it and click **Save**

### 1.2 Configure Email Templates

1. **Go to Email Templates**
   - Authentication → Email Templates
   - You should see templates for:
     - Confirm signup
     - Magic Link
     - **Email OTP** ← This one is for OTP verification

2. **Customize OTP Email Template** (Optional)
   - Click on **"Email OTP"** template
   - Default template looks like:
     ```
     <h2>Your OTP Code</h2>
     <p>Enter this code to verify your email:</p>
     <h1>{{ .Token }}</h1>
     <p>This code expires in 60 seconds.</p>
     ```
   - You can customize the design/text
   - Make sure `{{ .Token }}` is included (this is the 6-digit OTP)

### 1.3 Configure SMTP Settings (Optional)

**Default**: Supabase uses its own email service (works for testing)

**For Production** (better deliverability):
1. Go to **Settings** → **Authentication**
2. Scroll to **SMTP Settings**
3. Configure your own email service:
   - **Gmail**: Use Gmail SMTP
   - **SendGrid**: Professional email service
   - **AWS SES**: Amazon email service
   - **Custom SMTP**: Your own email server

**For now**, the default Supabase email service is fine for testing!

## Step 2: Configure OTP Expiry Time

**Important**: Like phone OTP, email OTP also expires quickly!

### Default Expiry
- **Current**: 60 seconds (too short!)
- **Recommended**: 600 seconds (10 minutes)

### Option A: Via Supabase Dashboard

1. Go to **Authentication** → **Settings**
2. Look for **"Email OTP expiry"** or **"OTP expiry duration"**
3. Change from `60` to `600` seconds
4. Click **Save**

### Option B: Via SQL (If UI doesn't have setting)

1. Go to **SQL Editor** in Supabase
2. Run this SQL:
   ```sql
   -- Set email OTP expiry to 600 seconds (10 minutes)
   UPDATE auth.config
   SET value = '600'
   WHERE key = 'email_otp_exp';

   -- Verify the change
   SELECT * FROM auth.config WHERE key = 'email_otp_exp';
   ```

**Note**: This is separate from phone OTP expiry (`sms_otp_exp`)

## Step 3: Test Email OTP Flow

### 3.1 Start Your Application

```bash
npm run dev
```

Navigate to: http://localhost:3000

### 3.2 Test Sending Email OTP

1. **Open Sign Up Page**
2. **Fill in details:**
   - Name: Test User
   - Phone: 9080440946
   - Email: **your-real-email@gmail.com** (use your actual email!)
   - Password: testpass123

3. **Click "Verify Email"**

4. **Check browser console (F12):**
   ```
   [Auth] Sending email OTP to: your-email@gmail.com
   [Auth] Email OTP sent successfully
   ```

5. **Check your email inbox:**
   - Should receive email from Supabase
   - Subject: "Your OTP Code" (or custom subject)
   - Contains 6-digit code like: **456789**

### 3.3 Test Verifying Email OTP

1. **Enter the 6-digit code** from your email
2. **Click "Confirm"**

3. **Check console:**
   ```
   [Auth] Verifying email OTP for: your-email@gmail.com
   [Auth] OTP token: 456789
   [Auth] Email OTP verified successfully
   ```

4. **Result:**
   - ✅ Email verified successfully!
   - Can now create account (if phone OR email verified)

## Step 4: Understanding Flexible Registration

### Current Validation Logic

In [AuthModal.tsx:484-488](components/modals/AuthModal.tsx#L484-L488):

```typescript
// Allow signup with EITHER email OR phone verified (not both mandatory)
const hasVerifiedContact = phoneVerified || emailVerified; // At least one must be verified
const isSignUpFormValid = name.trim() && phone.length === 10 && email && hasVerifiedContact && password.length >= 6;
```

### Test Cases

**✅ Valid - Email verified only:**
- Phone: Not verified
- Email: ✅ Verified
- Result: Can create account

**✅ Valid - Phone verified only:**
- Phone: ✅ Verified
- Email: Not verified
- Result: Can create account

**✅ Valid - Both verified:**
- Phone: ✅ Verified
- Email: ✅ Verified
- Result: Can create account

**❌ Invalid - Neither verified:**
- Phone: Not verified
- Email: Not verified
- Result: Cannot create account (button disabled)

### Future: Make Both Mandatory

When ready to require both verifications, change this line:

```typescript
// Change FROM:
const hasVerifiedContact = phoneVerified || emailVerified; // OR logic

// Change TO:
const hasVerifiedContact = phoneVerified && emailVerified; // AND logic
```

## Step 5: Common Email OTP Issues

### Issue 1: Email Not Received

**Possible Causes:**
1. Email in spam/junk folder
2. Wrong email entered
3. Supabase email service delay (usually 5-30 seconds)

**Solutions:**
- Check spam/junk folder
- Wait up to 1 minute
- Click "Resend OTP" to send again
- Try different email address

### Issue 2: "OTP has expired"

**Cause**: Took more than 60 seconds to enter code

**Solutions:**
- Click "Resend OTP" to get new code
- Enter code more quickly
- Increase OTP expiry to 600 seconds (Step 2)

### Issue 3: "Invalid OTP"

**Possible Causes:**
1. Wrong code entered (typo)
2. Using old code (if resent OTP)
3. OTP already used

**Solutions:**
- Double-check the code in email
- Make sure using latest code (if resent)
- Request fresh OTP if in doubt

### Issue 4: "This OTP has already been used"

**Cause**: Each OTP can only be used once

**Solution:**
- Click "Resend OTP"
- Get new code
- Use the new code

## Step 6: Production Best Practices

### 6.1 Email Deliverability

For production, configure custom SMTP to avoid spam:
- **SendGrid**: Free tier allows 100 emails/day
- **AWS SES**: Very cheap, high deliverability
- **Gmail SMTP**: Good for small projects

### 6.2 Email Template Design

Customize your email template to match your brand:
- Add Shindhu Cinemas logo
- Use brand colors
- Clear, professional text
- Mobile-friendly design

### 6.3 Security Settings

**Rate Limiting:**
- Supabase automatically rate limits OTP requests
- Default: Max 4 OTP emails per hour per email address
- Prevents spam and abuse

**OTP Expiry:**
- Don't make it too long (security risk)
- 5-10 minutes is ideal (300-600 seconds)

## Step 7: Complete Testing Checklist

### Before Testing
- [ ] Email provider enabled in Supabase
- [ ] Email templates configured
- [ ] OTP expiry set to 600 seconds
- [ ] Dev server running: `npm run dev`

### Email Verification Test
- [ ] Enter real email address
- [ ] Click "Verify Email"
- [ ] Check console: "Email OTP sent successfully"
- [ ] Check email inbox (including spam)
- [ ] Receive 6-digit OTP code
- [ ] Enter OTP within expiry time
- [ ] Click "Confirm"
- [ ] Check console: "Email OTP verified successfully"
- [ ] Email shows as verified ✅

### Phone Verification Test (Optional)
- [ ] Enter phone: 9080440946
- [ ] Click "Verify Phone"
- [ ] Receive SMS with OTP
- [ ] Enter OTP and confirm
- [ ] Phone shows as verified ✅

### Registration Test - Email Only
- [ ] Name filled
- [ ] Phone filled (but not verified)
- [ ] Email verified ✅
- [ ] Password filled
- [ ] "Sign Up" button enabled
- [ ] Click "Sign Up"
- [ ] Account created successfully ✅

### Registration Test - Phone Only
- [ ] Name filled
- [ ] Phone verified ✅
- [ ] Email filled (but not verified)
- [ ] Password filled
- [ ] "Sign Up" button enabled
- [ ] Click "Sign Up"
- [ ] Account created successfully ✅

### Registration Test - Both Verified
- [ ] Name filled
- [ ] Phone verified ✅
- [ ] Email verified ✅
- [ ] Password filled
- [ ] "Sign Up" button enabled
- [ ] Click "Sign Up"
- [ ] Account created successfully ✅

### Error Test - Neither Verified
- [ ] Name filled
- [ ] Phone not verified ❌
- [ ] Email not verified ❌
- [ ] Password filled
- [ ] "Sign Up" button DISABLED ✅
- [ ] Cannot create account (correct!)

## Step 8: Console Debugging

### Successful Email OTP Flow

Open browser console (F12) during testing:

**1. Sending OTP:**
```
[Auth] Sending email OTP to: user@example.com
[Auth] Email OTP sent successfully
```

**2. Verifying OTP:**
```
[Auth] Verifying email OTP for: user@example.com
[Auth] OTP token: 456789
[Auth] Email OTP verified successfully
```

### Error Examples

**Expired OTP:**
```
[Auth] Email OTP verification error: {message: "Token has expired or is invalid"}
[Auth] Error details: {
  message: "Token has expired or is invalid",
  status: 400,
  email: "user@example.com",
  tokenLength: 6
}
```

**Invalid OTP:**
```
[Auth] Email OTP verification error: {message: "Invalid token"}
```

**Rate Limited:**
```
[Auth] Email OTP error: {message: "Email rate limit exceeded"}
```

## Step 9: Quick Reference

### OTP Settings Summary

| Setting | Default | Recommended | Why |
|---------|---------|-------------|-----|
| Email OTP Expiry | 60s | 600s (10 min) | Users need time to check email |
| Phone OTP Expiry | 60s | 600s (10 min) | Users need time to receive SMS |
| Rate Limit | 4/hour | Keep default | Prevents spam/abuse |

### Console Commands

**Check email OTP expiry:**
```sql
SELECT * FROM auth.config WHERE key = 'email_otp_exp';
```

**Check phone OTP expiry:**
```sql
SELECT * FROM auth.config WHERE key = 'sms_otp_exp';
```

**Update email OTP expiry:**
```sql
UPDATE auth.config SET value = '600' WHERE key = 'email_otp_exp';
```

## Summary

### What We Implemented

✅ **Real email OTP verification** (6-digit codes)
✅ **Flexible registration** - EITHER email OR phone required
✅ **Better error messages** - Clear feedback for users
✅ **Detailed logging** - Easy debugging in console
✅ **Input validation** - Check email format and OTP length

### Current Flow

```
1. User enters email address
        ↓
2. Click "Verify Email"
        ↓
3. Supabase sends 6-digit OTP to email
        ↓
4. Email arrives in inbox (5-30 seconds)
        ↓
5. User enters OTP code
        ↓
6. Click "Confirm"
        ↓
7. Code verified ✅
        ↓
8. Email marked as verified
        ↓
9. User can create account (if email OR phone verified)
```

### Next Steps

1. ✅ **Test email OTP** - Use your real email address
2. ✅ **Check email inbox** - Should receive OTP within 30 seconds
3. ✅ **Verify the code** - Enter and confirm OTP
4. ⏳ **Fix Twilio** - Add sender phone to messaging service (for phone OTP)
5. ⏳ **Full testing** - Test both email and phone verification
6. ⏳ **Production** - Configure custom SMTP for better deliverability

### Support Resources

- **Email issues**: [FIX_OTP_EXPIRY.md](FIX_OTP_EXPIRY.md)
- **Phone issues**: [PHONE_AUTH_CHECKLIST.md](PHONE_AUTH_CHECKLIST.md)
- **Database issues**: [FIX_PHONE_AUTH_ERROR.md](FIX_PHONE_AUTH_ERROR.md)

**Your email OTP verification is now ready to test!** 🎉

Check your email and try it out!
