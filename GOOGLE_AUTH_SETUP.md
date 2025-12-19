# Google OAuth Authentication Setup Guide

This guide will help you set up real Google OAuth authentication for your application.

## Prerequisites

- A Supabase project (you already have this configured)
- A Google Cloud Platform account

## Step 1: Configure Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Configure the consent screen if prompted:
   - Select "External" user type
   - Fill in the required fields (App name, User support email, Developer contact)
   - Add scopes: `email` and `profile`
   - Add test users if needed
   - Save and continue

4. Create OAuth Client ID:
   - Application type: "Web application"
   - Name: "Shindhu Cinemas"
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://your-production-domain.com
     ```
   - Authorized redirect URIs:
     ```
     https://mrdmwlbelgczpzmfbtsi.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     https://your-production-domain.com/auth/callback
     ```
   - Click "Create"

5. Copy the **Client ID** and **Client Secret**

## Step 3: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `mrdmwlbelgczpzmfbtsi`
3. Navigate to "Authentication" > "Providers"
4. Find "Google" in the list and enable it
5. Paste your Google OAuth credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
6. Save the configuration

## Step 4: Test the Integration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Click "Sign up" or "Sign in"
3. Click "Continue with Google"
4. You should be redirected to Google's login page
5. After successful authentication, you'll be redirected back to your app

## How It Works

1. When user clicks "Continue with Google", the app calls `signInWithGoogle()`
2. Supabase redirects the user to Google's OAuth consent screen
3. User logs in with their Google account and grants permissions
4. Google redirects back to `/auth/callback` with an authorization code
5. The callback handler exchanges the code for a session
6. User is authenticated and redirected to the home page

## Important Notes

- The callback URL must match exactly what you configured in Google Cloud Console
- Make sure your Supabase URL and Anon Key are correctly set in `.env.local`
- For production, add your production domain to both Google Cloud Console and Supabase settings

## Troubleshooting

### "Redirect URI mismatch" error
- Verify the redirect URI in Google Cloud Console matches exactly: `https://mrdmwlbelgczpzmfbtsi.supabase.co/auth/v1/callback`

### "OAuth not configured" error
- Make sure you've enabled the Google provider in Supabase
- Verify Client ID and Client Secret are correctly entered

### User redirected but not logged in
- Check browser console for errors
- Verify the callback route is working: `/auth/callback`
- Check Supabase logs in the dashboard

## Testing with Demo Mode

If Supabase is not configured, the app will fall back to demo mode automatically. To test with real Google authentication, make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mrdmwlbelgczpzmfbtsi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Security Best Practices

1. Never commit your Client Secret to version control
2. Use environment variables for sensitive data
3. Regularly rotate your OAuth credentials
4. Monitor authentication logs in Supabase dashboard
5. Keep your authorized redirect URIs list minimal and specific
