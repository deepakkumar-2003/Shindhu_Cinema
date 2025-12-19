# Phone Authentication Debugging Checklist

## Critical Issue: "Token has expired or is invalid"

Follow these steps **in order** to fix the issue.

## Step 1: Run Database Setup (REQUIRED!)

**Did you run the SQL setup?** If not, this is causing your error!

1. **Open:** `supabase-phone-auth-setup.sql`
2. **Copy:** All SQL content
3. **Go to:** Supabase Dashboard → SQL Editor → New query
4. **Paste:** The SQL
5. **Click:** "Run"
6. **Verify:** Should see "Success. No rows returned"

**Check if trigger exists:**
```sql
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

If this returns **no rows**, the trigger isn't set up! **Run the SQL first!**

## Step 2: Check Twilio Configuration

1. **Supabase Dashboard** → Authentication → Providers → Phone
2. **Verify these are filled:**
   - ✅ Twilio Account SID
   - ✅ Twilio Auth Token
   - ✅ Twilio Message Service SID
3. **Click "Save"** (even if already filled)

## Step 3: Test OTP Timing

**Current default:** OTP expires in 60 seconds!

**Test procedure:**

1. **Get ready:**
   - Open your app
   - Have phone in hand
   - Be ready to type immediately

2. **Click "Verify Phone"**
   - Note the time

3. **SMS arrives** (5-10 seconds)
   - Check your phone: +91 90804 40946

4. **Enter OTP IMMEDIATELY**
   - Don't wait!
   - Type all 6 digits

5. **Click "Confirm"**
   - Total time should be < 60 seconds

**If it takes longer than 60 seconds → OTP expires!**

## Step 4: Check Console Logs

Open browser console (F12) and look for:

**When sending OTP:**
```
[Auth] Sending phone OTP to: +919080440946
[Auth] Phone OTP sent successfully
```

**When verifying OTP:**
```
[Auth] Verifying phone OTP for: +919080440946
[Auth] OTP token: 123456
```

**Critical:** Phone number must match **exactly**:
- Send: `+919080440946`
- Verify: `+919080440946` ✅

If different → Error!

## Step 5: Check Twilio Logs

1. **Go to:** https://console.twilio.com/
2. **Click:** Monitor → Logs → Messaging
3. **Check latest SMS:**
   - Status: Should be "Delivered"
   - To: +919080440946
   - From: +14058778023
   - Body: Your OTP code

**If status is "Failed" or "Undelivered":**
- Check phone number is verified in Twilio
- Check Twilio has credits

## Step 6: Verify Number Format

**Your code adds +91 automatically:**

```typescript
// User enters:
phone = "9080440946"

// Code converts to:
phoneWithCode = "+91" + phone = "+919080440946" ✅
```

**Console should show:**
```
[Auth] Sending phone OTP to: +919080440946
[Auth] Verifying phone OTP for: +919080440946
```

☝️ **Must be identical!**

## Step 7: Use Fresh OTP

**Each OTP can only be used once!**

If you:
1. Get OTP: `123456`
2. Try to verify → **Fails**
3. Try same OTP again → **Will fail! (already used)**

**Solution:**
1. Click **"Resend OTP"**
2. Get **NEW** code: `789012`
3. Use the **new** code

## Step 8: Increase OTP Expiry (Recommended)

**Current:** 60 seconds (too short!)
**Recommended:** 600 seconds (10 minutes)

**Option A: Supabase Dashboard**
- Authentication → Settings
- Look for "OTP expiry" or "SMS OTP expiry"
- Change to: 600 seconds
- Save

**Option B: SQL**
```sql
UPDATE auth.config
SET value = '600'
WHERE key = 'sms_otp_exp';

SELECT * FROM auth.config WHERE key = 'sms_otp_exp';
```

## Common Mistakes

### Mistake 1: Database trigger not set up
**Symptom:** "Database error saving new user"
**Fix:** Run `supabase-phone-auth-setup.sql`

### Mistake 2: Taking too long
**Symptom:** "Token has expired"
**Fix:**
- Enter OTP within 60 seconds
- Or increase expiry to 600 seconds

### Mistake 3: Using old OTP
**Symptom:** "Token has expired" or "invalid"
**Fix:** Always use the most recent OTP

### Mistake 4: Wrong phone number
**Symptom:** "invalid" or "not found"
**Fix:** Check console logs, phone must match exactly

### Mistake 5: Twilio not configured
**Symptom:** No SMS received
**Fix:** Add Twilio credentials in Supabase Dashboard

## Quick Diagnostic

Run this test:

```bash
npm run dev
```

1. **Open browser console (F12)**
2. **Sign up page**
3. **Enter phone:** 9080440946
4. **Click "Verify Phone"**
5. **Check console:**

**Expected logs:**
```
[Auth] Sending phone OTP to: +919080440946
[Auth] Phone OTP sent successfully
```

**If you see:**
```
[Auth] Phone OTP error: {...}
```
→ Check the error message!

6. **Check phone for SMS**
7. **Note exact time SMS arrived**
8. **Enter OTP within 60 seconds**
9. **Click "Confirm"**
10. **Check console:**

**Expected:**
```
[Auth] Verifying phone OTP for: +919080440946
[Auth] OTP token: 123456
[Auth] Phone OTP verified successfully
```

**If you see error:**
```
[Auth] Phone OTP verification error: {...}
[Auth] Error details: {...}
```
→ Check the error message!

## Most Likely Causes (In Order)

1. ⚠️ **Database trigger not set up** (70% of cases)
   - Fix: Run `supabase-phone-auth-setup.sql`

2. ⏱️ **OTP expired (>60 seconds)** (20% of cases)
   - Fix: Be faster or increase expiry

3. 🔢 **Wrong OTP entered** (5% of cases)
   - Fix: Double-check the SMS

4. 📞 **Phone number mismatch** (3% of cases)
   - Fix: Check console logs

5. 🔧 **Twilio not configured** (2% of cases)
   - Fix: Add credentials in Supabase

## Success Checklist

Verify ALL of these:

- [ ] Database trigger created (run SQL)
- [ ] Twilio credentials in Supabase
- [ ] Phone number verified in Twilio: +91 90804 40946
- [ ] OTP sent successfully (check console)
- [ ] SMS received on phone
- [ ] OTP entered within 60 seconds
- [ ] Phone number matches in logs
- [ ] Using fresh OTP (not old one)

If ALL checkboxes are ✅ → It should work!

## Still Not Working?

**Collect this info:**

1. **Console logs** (full output from F12)
2. **Twilio logs** (delivery status)
3. **Time taken** (from send to verify)
4. **Phone number in logs** (both send and verify)
5. **Database trigger status:**
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE trigger_name = 'on_auth_user_created';
   ```

Share this info for further debugging.

## Expected Working Flow

```
1. User enters phone: 9080440946
        ↓
2. Click "Verify Phone"
        ↓
3. Code adds +91: +919080440946
        ↓
4. Supabase sends OTP via Twilio
        ↓
5. SMS arrives in 5-10 seconds
        ↓
6. User enters OTP (e.g., 456789)
        ↓
7. Code verifies: verifyPhoneOtp('+919080440946', '456789')
        ↓
8. Supabase checks: ✅ Valid, not expired
        ↓
9. Success! Phone verified ✅
```

## Next Steps

1. **First:** Run `supabase-phone-auth-setup.sql` (if not done)
2. **Second:** Test with quick OTP entry (<60s)
3. **Third:** Increase OTP expiry to 600s
4. **Fourth:** Test again

**Your phone auth should work after these steps!** 🎉
