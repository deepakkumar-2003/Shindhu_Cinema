# Enable 6-Digit Email OTP Codes in Supabase

## Goal

Receive **6-digit OTP codes** in email (like `456789`), NOT magic links.

## Step-by-Step Configuration

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard
2. Select project: **Shindhu Cinemas** (mrdmwlbelgczpzmfbtsi)

### Step 2: Enable Email Provider

1. Click: **Authentication** (left sidebar)
2. Click: **Providers**
3. Find: **Email**
4. Make sure toggle is **ON** (green)
5. Click: **Save**

### Step 3: Configure Email Template for OTP Codes

This is the **most important step** to get 6-digit codes instead of magic links!

1. **Navigate to Email Templates**:
   - Click: **Authentication** → **Email Templates**

2. **Find the OTP/Magic Link template**:
   - Look for one of these:
     - "Magic Link"
     - "Confirm signup"
     - "Email OTP"
     - "Authenticate"

3. **Edit the template** to use OTP codes:

**Current template** (sends magic links):
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

**Change to** (sends 6-digit OTP):
```html
<h2>Your Verification Code</h2>
<p>Enter this code to verify your email address:</p>
<h1 style="font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; padding: 20px; background: #f0f0f0; border-radius: 8px;">{{ .Token }}</h1>
<p>This code will expire in 60 minutes.</p>
<p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
```

**Important**: The key is using `{{ .Token }}` instead of `{{ .ConfirmationURL }}`!

4. **Click "Save"**

### Step 4: Configure Email Settings (Optional but Recommended)

1. **In the same Email Templates section**, look for settings:
   - **Email Change Confirmation**: Can be OFF for testing
   - **Confirm Email**: Can be OFF for testing
   - **Secure Email Change**: Can be OFF for testing

2. **For the template you edited**, make sure:
   - Template is **enabled**
   - Subject line is clear (e.g., "Your Verification Code for Shindhu Cinemas")

### Step 5: Check Authentication Settings

1. **Go to**: Authentication → Settings (or Configuration)
2. **Look for**: "Email confirmation" or "Require email confirmation"
3. **For testing**: You can turn this OFF (we're handling verification manually)
4. **Click**: Save

### Step 6: Verify Template Variables

**Available variables in Supabase email templates**:

| Variable | What it contains | Use for |
|----------|------------------|---------|
| `{{ .Token }}` | 6-digit OTP code | **OTP verification** ✅ |
| `{{ .ConfirmationURL }}` | Magic link URL | Magic link verification |
| `{{ .Email }}` | User's email address | Personalization |
| `{{ .SiteURL }}` | Your app URL | Branding |

**For 6-digit OTP**, you MUST use `{{ .Token }}`!

## Template Examples

### Minimal Template (Works!)

```html
<h2>Verification Code</h2>
<p>Your code is: <strong>{{ .Token }}</strong></p>
```

### Professional Template (Recommended)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #4CAF50;
    }
    .otp-code {
      font-size: 36px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 8px;
      padding: 30px;
      margin: 30px 0;
      background: #f5f5f5;
      border-radius: 10px;
      color: #4CAF50;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Shindhu Cinemas</h1>
      <p>Email Verification</p>
    </div>

    <p>Hello,</p>
    <p>Thank you for registering with Shindhu Cinemas! Please use the following code to verify your email address:</p>

    <div class="otp-code">{{ .Token }}</div>

    <p>This verification code will expire in <strong>60 minutes</strong>.</p>

    <p>If you didn't request this code, please ignore this email.</p>

    <div class="footer">
      <p>&copy; 2024 Shindhu Cinemas. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
```

### Simple & Clean Template

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #333;">Verify Your Email</h2>

  <p>Welcome to Shindhu Cinemas! Enter this verification code to complete your registration:</p>

  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="text-align: center; margin: 0; font-size: 14px; color: #666;">Your verification code:</p>
    <h1 style="text-align: center; font-size: 42px; letter-spacing: 10px; color: #4CAF50; margin: 10px 0;">{{ .Token }}</h1>
  </div>

  <p style="color: #666; font-size: 14px;">This code expires in 60 minutes.</p>

  <p style="color: #999; font-size: 12px; margin-top: 30px;">
    If you didn't request this, please ignore this email.
  </p>
</div>
```

## Testing the Configuration

### Test 1: Send Email OTP

1. **Start your app**:
   ```bash
   npm run dev
   ```

2. **Open**: http://localhost:3000

3. **Try sending OTP**:
   - Go to signup page
   - Enter **your real email address**
   - Click **"Verify Email"**

4. **Check browser console** (F12):
   ```
   [Auth] Sending 6-digit email OTP to: your-email@gmail.com
   [Auth] 6-digit email OTP sent successfully
   [Auth] Check your email inbox for the verification code
   ```

### Test 2: Check Your Email

1. **Open your email inbox**
2. **Look for email from**: `noreply@mail.supabase.io` or `noreply@supabase.io`
3. **Subject**: Your custom subject (e.g., "Your Verification Code")
4. **Email should contain**: **6-digit code** like `456789`

**✅ Success**: If you see the 6-digit code!
**❌ Problem**: If you see a "Click here" link instead, the template is wrong

### Test 3: Verify the Code

1. **Enter the 6-digit code** from your email
2. **Click "Confirm"**
3. **Check console**:
   ```
   [Auth] Verifying email OTP for: your-email@gmail.com
   [Auth] OTP token: 456789
   [Auth] Email OTP verified successfully
   [Auth] Signed out temporary session after email verification
   ```

4. **Result**: Email should show as verified ✅

## Troubleshooting

### Issue 1: Still Receiving Magic Links Instead of OTP Codes

**Problem**: Email has "Click here" link instead of 6-digit code

**Solution**:
1. Go back to Email Templates
2. **Make absolutely sure** you're using `{{ .Token }}` not `{{ .ConfirmationURL }}`
3. Save the template again
4. **Try a different template** if multiple exist (Magic Link vs Email OTP)
5. Clear your browser cache and try again

### Issue 2: No Email Received

**Possible causes**:
1. Email in spam/junk folder → Check spam
2. Wrong email address → Double-check spelling
3. Supabase email service delay → Wait up to 2 minutes
4. Email provider not enabled → Go to Providers, enable Email

**Solution**:
- Check spam folder
- Wait 1-2 minutes
- Try "Resend OTP"
- Try different email address

### Issue 3: "OTP has expired"

**Cause**: OTP codes expire (default: 60 minutes for email)

**Solution**:
- Click "Resend OTP" to get new code
- Enter code more quickly
- Use the most recent code

### Issue 4: Template Not Saving

**Solution**:
1. Copy your template HTML
2. Clear the template field
3. Paste fresh template
4. Click Save
5. Refresh the page to verify it saved

### Issue 5: Received Code But Verification Fails

**Check**:
1. Entered all 6 digits correctly
2. No spaces before/after the code
3. Using the latest code (if you resent)
4. Code hasn't expired yet

**Solution**:
- Double-check the code
- Request new OTP
- Check browser console for errors

## Verifying Configuration

### Quick Check: Is OTP Enabled?

Run this test:

1. Send email OTP
2. Check email inbox within 1 minute
3. **If you see**: 6-digit code → ✅ OTP is working!
4. **If you see**: Magic link → ❌ Template needs `{{ .Token }}`

### Console Verification

**Sending OTP**:
```
✅ [Auth] Sending 6-digit email OTP to: user@example.com
✅ [Auth] 6-digit email OTP sent successfully
```

**Verifying OTP**:
```
✅ [Auth] Verifying email OTP for: user@example.com
✅ [Auth] OTP token: 456789
✅ [Auth] Email OTP verified successfully
✅ [Auth] Signed out temporary session after email verification
```

## Summary Checklist

Before testing, make sure:

- [ ] Email provider enabled in Supabase
- [ ] Email template edited to use `{{ .Token }}`
- [ ] Template saved successfully
- [ ] Dev server running: `npm run dev`
- [ ] Using real email address for testing
- [ ] Checked spam folder if no email

After configuration:

- [ ] Sent test email OTP
- [ ] Received 6-digit code in email (not magic link)
- [ ] Successfully verified code
- [ ] Email shows as verified ✅

## What The Code Does

### When Sending OTP

1. **User clicks "Verify Email"**
2. **Code calls**: `sendEmailOtp(email)`
3. **Supabase sends**: Email with 6-digit code via `signInWithOtp`
4. **Email arrives**: Within 10-60 seconds
5. **User sees**: The 6-digit code in their inbox

### When Verifying OTP

1. **User enters code**: e.g., `456789`
2. **Code calls**: `verifyEmailOtp(email, token)`
3. **Supabase verifies**: Token matches and not expired
4. **Code signs out**: Temporary session (we don't want them logged in yet)
5. **Returns success**: Email is now verified ✅
6. **User can signup**: With verified email OR phone

## Important Notes

**OTP vs Magic Link**:
- **OTP** (what we want): User receives 6-digit code, enters it manually
- **Magic Link** (we don't want): User receives link, clicks it to verify

**Session Management**:
- Verifying OTP creates a temporary Supabase session
- We immediately sign out after verification
- User will create real account with password later
- This prevents issues with duplicate sessions

**Multiple Email Templates**:
- Supabase may have multiple email templates
- Make sure you edit the right one (usually "Magic Link" or "Email OTP")
- If unsure, edit ALL templates to use `{{ .Token }}`

---

## Quick Start (TL;DR)

1. **Supabase Dashboard** → Authentication → Email Templates
2. **Edit template** → Replace `{{ .ConfirmationURL }}` with `{{ .Token }}`
3. **Save template**
4. **Test**: Send OTP → Check email → Should have 6-digit code!

**That's it!** Your email OTP with 6-digit codes is ready! 🎉
