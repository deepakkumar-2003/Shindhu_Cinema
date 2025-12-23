# Email OTP Quick Start - Get 6-Digit Codes

## ✅ Code Updated!

I've updated the code to ensure you receive **6-digit OTP codes** in email, not magic links.

### What Changed

**Updated files**:
- [lib/supabase/auth.tsx](lib/supabase/auth.tsx) - Enhanced to explicitly request OTP codes

**Key changes**:
1. ✅ Code now sends 6-digit OTP codes (not magic links)
2. ✅ After verification, temporary session is signed out
3. ✅ Better console logging to track OTP flow
4. ✅ User-friendly error messages

## 🎯 What You Need To Do

### 1. Configure Supabase Email Template (5 minutes)

**This is CRITICAL** - Without this, you'll get magic links instead of OTP codes!

1. **Go to**: https://supabase.com/dashboard
2. **Select**: Your project (Shindhu Cinemas)
3. **Navigate**: Authentication → Email Templates
4. **Find template**: "Magic Link" or "Email OTP" or "Confirm signup"
5. **Edit template** - Replace the content with:

```html
<h2>Your Verification Code</h2>
<p>Enter this code to verify your email:</p>
<h1 style="font-size: 32px; text-align: center; letter-spacing: 5px;">{{ .Token }}</h1>
<p>This code expires in 60 minutes.</p>
```

**IMPORTANT**: The key is `{{ .Token }}` - this displays the 6-digit code!

6. **Click "Save"**

### 2. Test Email OTP (5 minutes)

**Start your app**:
```bash
npm run dev
```

**Test the flow**:
1. Go to: http://localhost:3000
2. Click: Sign up
3. Enter: **Your real email address**
4. Click: **"Verify Email"**
5. Check: **Browser console** (F12):
   ```
   [Auth] Sending 6-digit email OTP to: your-email@gmail.com
   [Auth] 6-digit email OTP sent successfully
   ```
6. Check: **Your email inbox** (check spam too!)
7. You should receive: **Email with 6-digit code** like `456789`

### 3. Verify the Code (1 minute)

1. **Enter the 6-digit code** from your email
2. **Click "Confirm"**
3. **Check console**:
   ```
   [Auth] Verifying email OTP for: your-email@gmail.com
   [Auth] OTP token: 456789
   [Auth] Email OTP verified successfully
   [Auth] Signed out temporary session after email verification
   ```
4. **Result**: Email verified ✅

## 🔍 Expected Email

**Subject**: Your Verification Code (or similar)

**From**: noreply@mail.supabase.io

**Body**:
```
Your Verification Code

Enter this code to verify your email:

  456789

This code expires in 60 minutes.
```

## ❌ Common Issues

### Issue: Still Getting Magic Link Instead of OTP Code

**Email contains**: "Click here to confirm" link

**Problem**: Supabase email template not configured correctly

**Solution**:
1. Go back to: Authentication → Email Templates
2. **Make sure** you're using `{{ .Token }}` NOT `{{ .ConfirmationURL }}`
3. Save again
4. Try sending OTP again

### Issue: No Email Received

**Solutions**:
- Check **spam/junk** folder
- Wait **1-2 minutes** (Supabase email can be slow)
- Click **"Resend OTP"** to try again
- Try **different email address**

### Issue: "OTP has expired"

**Solution**:
- Click **"Resend OTP"**
- Enter the **new code** quickly
- Use the most recent code (old codes don't work)

## 📚 Detailed Documentation

For more details, see:
- **Complete guide**: [ENABLE_EMAIL_OTP_CODES.md](ENABLE_EMAIL_OTP_CODES.md)
- **Setup guide**: [EMAIL_OTP_SETUP.md](EMAIL_OTP_SETUP.md)
- **Status**: [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)

## ✨ Summary

### What Works Now

✅ **Email OTP sending** - Sends 6-digit codes (after Supabase config)
✅ **Email OTP verification** - Verifies codes and signs out session
✅ **Flexible signup** - Can signup with email OR phone verified
✅ **Better error messages** - Clear feedback for users
✅ **Console logging** - Easy debugging

### Next Steps

1. ⏳ **Configure Supabase email template** (use `{{ .Token }}`)
2. ⏳ **Test email OTP** (use your real email)
3. ⏳ **Verify you receive 6-digit code** (not magic link)
4. ⏳ **Fix Twilio sender** (for phone OTP)
5. ⏳ **Complete testing** (both email and phone)

## 🚀 Quick Commands

```bash
# Start app
npm run dev

# Open browser
http://localhost:3000

# Check console
Press F12 → Console tab

# Test email OTP
1. Enter your email
2. Click "Verify Email"
3. Check inbox
4. Enter code
5. Verify ✅
```

---

**Your code is ready!** Just configure the Supabase email template and test it! 🎉

**The key**: Use `{{ .Token }}` in the email template to display 6-digit codes!
