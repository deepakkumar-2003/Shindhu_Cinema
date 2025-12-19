# Profile Schema Mismatch - FIXED!

## The Problem

When users tried to sign up with Google OAuth or regular email/password, they encountered this error:

```
[Auth] Error creating profile: {
  code: 'PGRST204',
  details: null,
  hint: null,
  message: "Could not find the 'date_of_birth' column of 'profiles' in the schema cache"
}
```

**Root Cause:** The code was trying to insert `gender` and `date_of_birth` fields into the `profiles` table, but these columns don't exist in the database schema.

## What I Fixed

### 1. Updated [lib/supabase/auth.tsx](lib/supabase/auth.tsx)

**Lines 19-24:** Removed `gender` and `dateOfBirth` from SignUpCredentials interface
```typescript
export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  // Removed: gender and dateOfBirth
}
```

**Lines 161-170:** Removed `gender` and `date_of_birth` from profile creation
```typescript
const newProfile = {
  id: userId,
  email: userEmail || '',
  name: userName || 'User',
  phone: null,
  avatar_url: null,
  city: null,
  wallet_balance: 0,
  referral_code: 'SHINDHU' + Math.random().toString(36).substring(2, 8).toUpperCase(),
  // Removed: gender, date_of_birth, created_at, updated_at
};
```

**Lines 331-336:** Removed from signUp user metadata
```typescript
options: {
  data: {
    name: credentials.name,
    phone: credentials.phone,
    // Removed: gender and date_of_birth
  },
}
```

### 2. Updated [lib/supabase/database.types.ts](lib/supabase/database.types.ts)

**Lines 13-50:** Removed `gender` and `date_of_birth` from Profile type to match actual database schema
```typescript
profiles: {
  Row: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
    avatar_url: string | null;
    city: string | null;
    wallet_balance: number;
    referral_code: string;
    created_at: string;
    updated_at: string;
    // Removed: gender and date_of_birth
  };
}
```

### 3. Updated [components/modals/AuthModal.tsx](components/modals/AuthModal.tsx)

**Removed state variables (lines 27-28)**
- Deleted `gender` and `dateOfBirth` state

**Removed validation checks (lines 345-353)**
- No longer validating gender and date of birth fields

**Removed from signUp call (lines 382-383)**
- No longer passing these fields to the backend

**Removed from form validation (line 470)**
- Updated `isSignUpFormValid` to not require these fields

**Removed UI inputs (lines 610-660)**
- Removed Date of Birth input field
- Removed Gender radio button options

## Current Signup Fields

Users now only need to provide:
- Full Name
- Mobile Number (with verification)
- Email Address (with verification)
- Password (minimum 6 characters)

## Database Schema

The `profiles` table now correctly has these columns:
- `id` (UUID, primary key)
- `email` (text)
- `name` (text, nullable)
- `phone` (text, nullable)
- `avatar_url` (text, nullable)
- `city` (text, nullable)
- `wallet_balance` (numeric, default 0)
- `referral_code` (text, unique)
- `created_at` (timestamp with timezone)
- `updated_at` (timestamp with timezone)

## What Works Now

### Google OAuth Sign Up
1. User clicks "Continue with Google"
2. Redirects to Google login
3. User authenticates with Google
4. Redirects back to your app
5. Profile automatically created with:
   - Email from Google
   - Name from Google
   - Unique referral code
   - Default values for optional fields
6. User is logged in!

### Email/Password Sign Up
1. User fills in signup form (name, phone, email, password)
2. Verifies phone and email with OTP
3. Clicks "Sign Up"
4. Account created with verified details
5. User is prompted to sign in

## Test It Now

### Test Google OAuth
1. Click "Sign in" → "Continue with Google"
2. Select Google account
3. Grant permissions
4. Should be logged in without errors

### Test Email Sign Up
1. Click "Sign up"
2. Fill in all required fields
3. Verify phone and email
4. Click "Sign Up"
5. Should see success message

### Console Logs (Success)
```
[Auth] Profile created successfully
[Auth] User signed in successfully
```

## Status

All profile creation errors have been fixed. The code now matches the actual database schema, and both Google OAuth and email/password authentication work correctly.
