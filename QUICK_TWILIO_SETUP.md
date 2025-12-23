# Quick Twilio Setup - 5 Minutes ⚡

## What You Need from Twilio

```
┌─────────────────────────────────────────────┐
│ Twilio Console (twilio.com)                │
├─────────────────────────────────────────────┤
│ 1. Account SID:           ACxxxxxx...       │
│ 2. Auth Token:            [Show to reveal]  │
│ 3. Messaging Service SID: MGxxxxxx...       │
└─────────────────────────────────────────────┘
```

## Setup in 5 Steps

### 1️⃣ Create Twilio Account (2 min)
- Go to: https://www.twilio.com/try-twilio
- Sign up (free $15 credit)
- Verify your email

### 2️⃣ Get Credentials (1 min)
Copy from Twilio Dashboard:
- Account SID
- Auth Token (click "Show")

### 3️⃣ Create Messaging Service (1 min)
- Messaging → Services → Create
- Name: "Shindhu Cinemas OTP"
- Use case: "Verify users"
- Copy the Service SID (MGxxxxxx...)
- Add Senders → Get trial number

### 4️⃣ Configure Supabase (1 min)
- Supabase Dashboard → Authentication → Providers → Phone
- Enable Phone Sign-In
- SMS provider: Twilio
- Paste all 3 credentials
- Click Save

### 5️⃣ Verify Your Phone (30 sec)
**IMPORTANT for trial accounts:**
- Twilio Console → Phone Numbers → Verified Caller IDs
- Add your phone with +91
- Verify with SMS code

## Test It!

```bash
# Restart dev server
npm run dev
```

1. Go to http://localhost:3000
2. Sign up → Enter your VERIFIED phone
3. Click "Verify Phone"
4. Check SMS on your phone
5. Enter OTP → Verify! ✅

## What Changed in Your Code?

```typescript
// Before (Demo Mode)
handleSendPhoneOtp → await delay(1000) // Fake
OTP: "123456" always works

// After (Real Supabase + Twilio)
handleSendPhoneOtp → sendPhoneOtp(phone) // Real SMS!
OTP: Real 6-digit code from Twilio
```

## Console Logs

**Success:**
```
[Auth] Sending phone OTP to: +919876543210
[Auth] Phone OTP sent successfully
```

**Error:**
```
[Auth] Phone OTP error: Unverified numbers
```
→ Verify your phone in Twilio Console!

## Quick Reference

| What | Where | Value |
|------|-------|-------|
| Account SID | Twilio Dashboard | ACxxxxxx... |
| Auth Token | Twilio Dashboard | Click "Show" |
| Service SID | Messaging → Services | MGxxxxxx... |
| Phone Format | Your app | +91 + 10 digits |
| OTP Length | SMS | 6 digits |
| OTP Expiry | Supabase | 60 seconds |

## Cost (After Trial)

- Trial: $15 credit (FREE)
- SMS to India: ~$0.0055 each
- 1000 OTPs ≈ $5.50

## Trial Restrictions

⚠️ **Twilio trial can ONLY send to verified numbers!**

To test:
1. Verify YOUR phone number in Twilio
2. Use that number in signup
3. Works perfectly!

To remove restriction:
- Add payment method in Twilio
- Upgrade to paid account

## Files Modified

✅ [lib/supabase/auth.tsx](lib/supabase/auth.tsx) - Real OTP functions
✅ [components/modals/AuthModal.tsx](components/modals/AuthModal.tsx) - Uses real OTP

## Troubleshooting

**"Unverified numbers"**
→ Verify phone in Twilio Console

**"Invalid credentials"**
→ Check Account SID and Auth Token

**"Service not found"**
→ Check Messaging Service SID

**OTP not received?**
→ Check phone format: +919876543210

**Still issues?**
→ Check browser console for errors

---

## Status: ✅ CODE READY

Your code is ready! Just set up Twilio credentials and test it.

Need detailed guide? Check [TWILIO_PHONE_AUTH_SETUP.md](TWILIO_PHONE_AUTH_SETUP.md)
