# Supabase Integration Guide for Shindhu Cinemas

This document explains the Supabase integration in the Shindhu Cinemas application.

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [File Structure](#file-structure)
3. [Authentication](#authentication)
4. [Database Operations](#database-operations)
5. [Real-Time Subscriptions](#real-time-subscriptions)
6. [API Routes](#api-routes)
7. [Future Modifications](#future-modifications)

---

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your project URL and API keys from **Project Settings > API**

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Create Database Schema

Run the SQL files in your Supabase SQL Editor:

1. First, run `supabase/schema.sql` to create all tables and functions
2. Then, run `supabase/seed.sql` to populate initial data (movies, cities, theaters, etc.)

### 4. Configure Authentication

In Supabase Dashboard:

1. **Email Auth**: Go to **Authentication > Providers > Email** and enable it
2. **Google OAuth**: Go to **Authentication > Providers > Google** and configure
3. **Phone Auth (OTP)**: Go to **Authentication > Providers > Phone** and enable Twilio

### 5. Enable Real-Time

In Supabase Dashboard:

1. Go to **Database > Replication**
2. Ensure `seats` and `bookings` tables have real-time enabled

---

## File Structure

```
lib/
├── supabase/
│   ├── client.ts          # Browser client configuration
│   ├── server.ts          # Server-side client (API routes, RSC)
│   ├── middleware.ts      # Auth middleware for session refresh
│   ├── auth.ts            # Authentication hooks and functions
│   ├── database.types.ts  # TypeScript types for all tables
│   ├── index.ts           # Main exports
│   └── services/          # Data fetching services
│       ├── movies.ts      # Movie queries
│       ├── theaters.ts    # Theater & city queries
│       ├── showtimes.ts   # Showtime queries
│       ├── seats.ts       # Seat queries & real-time
│       ├── snacks.ts      # Snack queries
│       ├── bookings.ts    # Booking CRUD operations
│       └── index.ts       # Service exports
├── hooks/
│   └── useRealtimeSeats.ts  # Real-time seat updates hook

app/
├── api/
│   ├── bookings/
│   │   ├── route.ts       # GET/POST bookings
│   │   └── [id]/
│   │       └── confirm/
│   │           └── route.ts  # Confirm booking
│   ├── cities/route.ts    # GET cities
│   ├── movies/
│   │   ├── route.ts       # GET movies with filters
│   │   └── [id]/route.ts  # GET single movie
│   ├── profile/route.ts   # GET/PATCH user profile
│   ├── promo/validate/route.ts  # POST validate promo code
│   ├── seats/route.ts     # GET/POST/DELETE seat operations
│   ├── showtimes/route.ts # GET showtimes
│   ├── snacks/route.ts    # GET snacks
│   └── theaters/route.ts  # GET theaters
└── auth/
    └── callback/route.ts  # OAuth callback handler

middleware.ts              # Session refresh middleware
supabase/
├── schema.sql            # Database schema
└── seed.sql              # Initial data
```

---

## Authentication

### Using the Auth Hook

```tsx
import { useAuth } from '@/lib/supabase/auth';

function MyComponent() {
  const {
    user,              // Supabase User object
    profile,           // Profile from profiles table
    isAuthenticated,   // Boolean
    isLoading,         // Loading state
    signIn,            // Email/password login
    signUp,            // Create account
    signInWithOTP,     // Phone OTP login
    verifyOTP,         // Verify OTP code
    signInWithGoogle,  // Google OAuth
    signOut,           // Logout
    updateProfile,     // Update user profile
    resetPassword,     // Send reset email
  } = useAuth();

  // Example: Sign in with email
  const handleLogin = async () => {
    const result = await signIn({ email, password });
    if (result.success) {
      // User is logged in
    } else {
      console.error(result.error);
    }
  };
}
```

### Protected Routes

The middleware automatically redirects unauthenticated users from protected paths:

- `/profile`
- `/booking/checkout`
- `/booking/confirmation`

To add more protected paths, edit `lib/supabase/middleware.ts`:

```typescript
const protectedPaths = ['/profile', '/booking/checkout', '/booking/confirmation', '/your-new-path'];
```

---

## Database Operations

### Fetching Data

Use the service functions for all database operations:

```typescript
// Movies
import { fetchMovies, fetchMovieById, fetchMoviesByStatus } from '@/lib/supabase/services';

const movies = await fetchMovies({ status: 'now_showing', language: 'Hindi' });
const movie = await fetchMovieById('movie-id');

// Theaters
import { fetchCities, fetchTheatersByCity } from '@/lib/supabase/services';

const cities = await fetchCities();
const theaters = await fetchTheatersByCity('city-id');

// Showtimes
import { fetchShowtimesByMovie, fetchShowtimesGroupedByTheater } from '@/lib/supabase/services';

const showtimes = await fetchShowtimesByMovie('movie-id', '2024-12-15');
const grouped = await fetchShowtimesGroupedByTheater('movie-id', '2024-12-15', 'city-id');

// Snacks
import { fetchSnacks, fetchSnacksByCategory } from '@/lib/supabase/services';

const snacks = await fetchSnacks();
const popcorn = await fetchSnacksByCategory('popcorn');

// Bookings
import { fetchUserBookings, createBooking, confirmBooking } from '@/lib/supabase/services';

const bookings = await fetchUserBookings();
const booking = await createBooking({ /* booking data */ });
await confirmBooking(booking.id);
```

### Direct Supabase Client Usage

For custom queries:

```typescript
// Client-side
import { getSupabaseClient } from '@/lib/supabase/client';

const supabase = getSupabaseClient();
const { data, error } = await supabase
  .from('movies')
  .select('*')
  .eq('status', 'now_showing');

// Server-side (API routes, Server Components)
import { createServerSupabaseClient } from '@/lib/supabase/server';

const supabase = await createServerSupabaseClient();
const { data, error } = await supabase.from('movies').select('*');
```

---

## Real-Time Subscriptions

### Seat Updates Hook

Use the `useRealtimeSeats` hook for live seat availability:

```tsx
import { useRealtimeSeats } from '@/lib/hooks/useRealtimeSeats';

function SeatSelection({ showtimeId, prices, selectedSeatIds }) {
  const { seatLayout, isLoading, error, refetch } = useRealtimeSeats({
    showtimeId,
    prices,
    selectedSeatIds,
  });

  // seatLayout automatically updates when seats change in the database
  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;

  return <SeatLayoutComponent layout={seatLayout} />;
}
```

### Custom Subscriptions

Create custom real-time subscriptions:

```typescript
import { getSupabaseClient } from '@/lib/supabase/client';

const supabase = getSupabaseClient();

// Subscribe to booking updates
const channel = supabase
  .channel('my-channel')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE, or *
      schema: 'public',
      table: 'bookings',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Change received:', payload);
      // Handle the update
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

---

## API Routes

### Available Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/movies` | GET | List movies with filters | No |
| `/api/movies/[id]` | GET | Get single movie | No |
| `/api/cities` | GET | List all cities | No |
| `/api/theaters` | GET | List theaters | No |
| `/api/showtimes` | GET | List showtimes | No |
| `/api/snacks` | GET | List snacks | No |
| `/api/seats` | GET | Get seats for showtime | No |
| `/api/seats` | POST | Lock seats | Yes |
| `/api/seats` | DELETE | Release seat locks | Yes |
| `/api/bookings` | GET | Get user's bookings | Yes |
| `/api/bookings` | POST | Create booking | Yes |
| `/api/bookings/[id]/confirm` | POST | Confirm booking | Yes |
| `/api/profile` | GET | Get user profile | Yes |
| `/api/profile` | PATCH | Update profile | Yes |
| `/api/promo/validate` | POST | Validate promo code | Yes |

### Query Parameters

**Movies**:
- `status`: `now_showing` or `coming_soon`
- `language`: Filter by language
- `genre`: Filter by genre
- `format`: `2D`, `3D`, or `Dolby Atmos`

**Showtimes**:
- `movieId`: Required
- `date`: Required (YYYY-MM-DD)
- `cityId`: Optional
- `theaterId`: Optional

**Snacks**:
- `category`: `popcorn`, `drinks`, `combos`, etc.
- `popular`: `true` for popular items only

---

## Future Modifications

### Adding New Tables

1. Add the table in `supabase/schema.sql`
2. Add types in `lib/supabase/database.types.ts`
3. Create service functions in `lib/supabase/services/`
4. Add API routes in `app/api/`

### Adding New Authentication Providers

1. Enable the provider in Supabase Dashboard
2. Add the sign-in method in `lib/supabase/auth.ts`
3. Add the UI button in `components/modals/AuthModal.tsx`

### Modifying Protected Routes

Edit `lib/supabase/middleware.ts`:

```typescript
const protectedPaths = [
  '/profile',
  '/booking/checkout',
  '/booking/confirmation',
  '/your-new-protected-path',
];
```

### Adding Real-Time to New Tables

1. Enable real-time in Supabase Dashboard for the table
2. Create a subscription hook similar to `useRealtimeSeats.ts`
3. Or use inline subscriptions in your components

### Database Functions

The schema includes these RPC functions:

- `lock_seats(showtime_id, seat_ids, user_id, lock_duration)` - Lock seats for booking
- `release_seat_locks(showtime_id, user_id)` - Release locked seats
- `confirm_booking(booking_id)` - Confirm booking and mark seats as booked
- `validate_promo_code(code, order_amount)` - Validate and calculate discount
- `cleanup_expired_locks()` - Clean up expired seat locks (run periodically)

---

## Troubleshooting

### Common Issues

1. **"Not authenticated" errors**: Check that the user is logged in and the session is valid
2. **Real-time not working**: Ensure the table has real-time enabled in Supabase Dashboard
3. **RLS errors**: Check Row Level Security policies in Supabase Dashboard
4. **OAuth callback errors**: Verify the callback URL is whitelisted in Supabase

### Debug Mode

Enable Supabase debug logging:

```typescript
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(url, key, {
  global: {
    headers: {
      'x-debug': 'true',
    },
  },
});
```

### Support

For issues with:
- Supabase: Check [Supabase Documentation](https://supabase.com/docs)
- This integration: Review the source code in `lib/supabase/`
