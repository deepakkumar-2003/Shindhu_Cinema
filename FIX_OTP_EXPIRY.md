# Fix: "Token has expired or is invalid"

## Problem

When verifying phone OTP, you get:
```
AuthApiError: Token has expired or is invalid
```

## Common Causes

1. **OTP Expired** - Default Supabase OTP expires in 60 seconds (very short!)
2. **Wrong OTP** - Incorrect code entered
3. **OTP Already Used** - Can only use each OTP once
4. **Phone Number Mismatch** - Different phone number used for send vs verify

## Quick Solutions

### Solution 1: Use Fresh OTP (Immediate Fix)

**Problem:** OTP expires in 60 seconds by default

**Fix:**
1. Click **"Resend OTP"** in your app
2. **Immediately** enter the new OTP (don't wait!)
3. Click "Confirm" quickly

⏱️ **You have 60 seconds!** Be ready to enter the code as soon as it arrives.

### Solution 2: Extend OTP Expiry (Recommended)

**Update Supabase Settings to 10 minutes:**

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings**
   - Click **Authentication** (left sidebar)
   - Click **Providers**
   - Scroll to **Phone**

3. **Configure OTP Expiry**
   - Look for: **"OTP expiry duration"** or similar setting
   - Change from: `60` seconds
   - To: `600` seconds (10 minutes)
   - Click **Save**

**Note:** If you don't see this setting in the UI, you can configure it via SQL (see below).

### Solution 3: Configure via SQL (Advanced)

If the UI doesn't have OTP expiry settings, run this SQL:

```sql
-- Set OTP expiry to 600 seconds (10 minutes)
UPDATE auth.config
SET value = '600'
WHERE key = 'sms_otp_exp';

-- Verify the change
SELECT * FROM auth.config WHERE key = 'sms_otp_exp';
```

**Run in:** Supabase Dashboard → SQL Editor

### Solution 4: Double-Check Phone Number

**Make sure phone number matches exactly:**

**When sending OTP:**
```
Phone entered: 9080440946
Phone sent to Supabase: +919080440946 ✅
```

**When verifying OTP:**
```
Phone used: +919080440946 ✅ (must match!)
```

**Check console logs:**
```
[Auth] Sending phone OTP to: +919080440946
[Auth] Verifying phone OTP for: +919080440946
```
☝️ **These must match exactly!**

## Updated Error Messages

I've updated the code to show clearer errors:

**Before:**
```
Token has expired or is invalid
```

**After:**
```
✅ "OTP has expired. Please click 'Resend OTP' to get a new code."
✅ "Incorrect OTP. Please check the code and try again."
✅ "This OTP has already been used. Please request a new one."
```

## Testing Steps

### Test 1: Quick Entry (With Default 60s)

1. Click "Verify Phone"
2. **Wait for SMS** (should arrive in 5-10 seconds)
3. **Immediately enter OTP**
4. Click "Confirm"
5. ✅ Should work if done quickly!

### Test 2: After Expiry Increase

1. Set OTP expiry to 600 seconds (10 min)
2. Restart your app: `npm run dev`
3. Request OTP
4. **Wait 2-3 minutes** (to test longer expiry)
5. Enter OTP
6. ✅ Should still work!

### Test 3: Resend OTP

1. Request OTP
2. **Wait 65 seconds** (let it expire)
3. Try to verify → Should show error
4. Click **"Resend OTP"**
5. Enter the **new OTP** (ignore old one)
6. ✅ Should work!

## Console Debugging

Open browser console (F12) when testing:

**Successful verification:**
```
[Auth] Sending phone OTP to: +919080440946
[Auth] Phone OTP sent successfully
[Auth] Verifying phone OTP for: +919080440946
[Auth] OTP token: 123456
[Auth] Phone OTP verified successfully
```

**Expired OTP:**
```
[Auth] Phone OTP verification error: {message: "Token has expired or is invalid"}
[Auth] Error details: {
  message: "Token has expired or is invalid",
  status: 400,
  phone: "+919080440946",
  tokenLength: 6
}
```

## Troubleshooting

### Error: "OTP has expired"

**Causes:**
- Took more than 60 seconds to enter code
- OTP was generated a while ago

**Fix:**
1. Click "Resend OTP"
2. Enter new code immediately
3. Or increase OTP expiry (Solution 2)

### Error: "Incorrect OTP"

**Causes:**
- Wrong code entered
- Typo in the code

**Fix:**
1. Check the SMS for the exact code
2. Make sure all 6 digits are correct
3. Try again or request new OTP

### Error: "OTP already been used"

**Causes:**
- Trying to use the same OTP twice

**Fix:**
1. Click "Resend OTP"
2. Get a fresh code
3. Use the new code

### Error: Still not working?

**Check these:**

1. **Phone number format:**
   ```javascript
   // Console should show:
   [Auth] Sending phone OTP to: +919080440946
   [Auth] Verifying phone OTP for: +919080440946
   // ☝️ Must be identical!
   ```

2. **Twilio is working:**
   - Check Twilio Console → Messaging → Logs
   - Should show "Delivered" status

3. **Correct SMS received:**
   - Check your phone for the SMS
   - Make sure you're using the latest code

4. **Timer hasn't run out:**
   - Default: 60 seconds
   - Act fast or increase expiry time

## Best Practices

### For Development

✅ **Set OTP expiry to 600 seconds (10 min)**
- Gives you time to test without rushing
- Can debug issues without OTP expiring

✅ **Check console logs**
- Verify phone number matches
- See exact error messages

✅ **Use Resend OTP liberally**
- If in doubt, get a fresh code
- Each code is single-use

### For Production

⚠️ **Keep OTP expiry reasonable**
- 300-600 seconds (5-10 min) is good
- Don't make it too long (security risk)
- Don't make it too short (user frustration)

✅ **Clear error messages**
- Already updated in code
- Users know what went wrong

✅ **Show countdown timer**
- Let users know how long they have
- Warn when time is running out

## Summary

**Immediate fix:**
1. ⚡ Enter OTP quickly (within 60 seconds)
2. ⚡ Use "Resend OTP" if expired

**Permanent fix:**
1. 🔧 Increase OTP expiry to 600 seconds in Supabase
2. 🔧 Restart your app
3. ✅ Test with more relaxed timing

**Code improvements made:**
1. ✅ Better error messages
2. ✅ Detailed console logs
3. ✅ Specific error handling

---

## Quick Reference

| Issue | Solution |
|-------|----------|
| OTP expired | Click "Resend OTP", enter new code quickly |
| Wrong OTP | Double-check SMS, try again |
| OTP used | Request new OTP |
| Too slow | Increase OTP expiry to 600s in Supabase |

**Your OTP verification should work smoothly now!** 🎉
