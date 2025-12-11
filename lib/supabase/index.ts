// Main exports for Supabase integration
export { createClient, getSupabaseClient } from './client';
export { createServerSupabaseClient, createAdminSupabaseClient } from './server';
export { updateSession } from './middleware';
export { useAuth } from './auth';
export { getServerAuth } from './auth-server';
export type {
  AuthState,
  SignUpCredentials,
  SignInCredentials,
  OTPCredentials,
  AuthResult,
} from './auth';
export type {
  Database,
  Tables,
  InsertTables,
  UpdateTables,
  Profile,
  Movie,
  CastMember,
  CrewMember,
  City,
  Theater,
  Screen,
  Showtime,
  Seat,
  Snack,
  SnackVariant,
  SnackAddon,
  Booking,
  BookedSeat,
  BookedSnack,
  Review,
  PromoCode,
} from './database.types';
