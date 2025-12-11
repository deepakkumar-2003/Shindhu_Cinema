export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      // Users profile table (extends Supabase auth.users)
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
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          wallet_balance?: number;
          referral_code?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          wallet_balance?: number;
          referral_code?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Movies table
      movies: {
        Row: {
          id: string;
          title: string;
          poster: string;
          backdrop: string;
          trailer_url: string | null;
          synopsis: string;
          duration: number;
          release_date: string;
          rating: number;
          user_rating: number;
          total_ratings: number;
          language: string;
          genres: string[];
          formats: string[];
          certification: string;
          status: 'now_showing' | 'coming_soon';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          poster: string;
          backdrop: string;
          trailer_url?: string | null;
          synopsis: string;
          duration: number;
          release_date: string;
          rating?: number;
          user_rating?: number;
          total_ratings?: number;
          language: string;
          genres: string[];
          formats: string[];
          certification: string;
          status: 'now_showing' | 'coming_soon';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          poster?: string;
          backdrop?: string;
          trailer_url?: string | null;
          synopsis?: string;
          duration?: number;
          release_date?: string;
          rating?: number;
          user_rating?: number;
          total_ratings?: number;
          language?: string;
          genres?: string[];
          formats?: string[];
          certification?: string;
          status?: 'now_showing' | 'coming_soon';
          created_at?: string;
          updated_at?: string;
        };
      };

      // Cast members table
      cast_members: {
        Row: {
          id: string;
          movie_id: string;
          name: string;
          role: string;
          image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          movie_id: string;
          name: string;
          role: string;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          movie_id?: string;
          name?: string;
          role?: string;
          image?: string | null;
          created_at?: string;
        };
      };

      // Crew members table
      crew_members: {
        Row: {
          id: string;
          movie_id: string;
          name: string;
          role: string;
          image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          movie_id: string;
          name: string;
          role: string;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          movie_id?: string;
          name?: string;
          role?: string;
          image?: string | null;
          created_at?: string;
        };
      };

      // Cities table
      cities: {
        Row: {
          id: string;
          name: string;
          state: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          state: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          state?: string;
          created_at?: string;
        };
      };

      // Theaters table
      theaters: {
        Row: {
          id: string;
          name: string;
          location: string;
          city_id: string;
          address: string;
          amenities: string[];
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          city_id: string;
          address: string;
          amenities?: string[];
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          city_id?: string;
          address?: string;
          amenities?: string[];
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Screens table
      screens: {
        Row: {
          id: string;
          theater_id: string;
          name: string;
          total_seats: number;
          seat_layout: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          theater_id: string;
          name: string;
          total_seats: number;
          seat_layout: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          theater_id?: string;
          name?: string;
          total_seats?: number;
          seat_layout?: Json;
          created_at?: string;
        };
      };

      // Showtimes table
      showtimes: {
        Row: {
          id: string;
          movie_id: string;
          theater_id: string;
          screen_id: string;
          show_date: string;
          show_time: string;
          format: string;
          language: string;
          price_standard: number;
          price_premium: number;
          price_recliner: number;
          price_vip: number;
          available_seats: number;
          total_seats: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          movie_id: string;
          theater_id: string;
          screen_id: string;
          show_date: string;
          show_time: string;
          format: string;
          language: string;
          price_standard: number;
          price_premium: number;
          price_recliner: number;
          price_vip: number;
          available_seats: number;
          total_seats: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          movie_id?: string;
          theater_id?: string;
          screen_id?: string;
          show_date?: string;
          show_time?: string;
          format?: string;
          language?: string;
          price_standard?: number;
          price_premium?: number;
          price_recliner?: number;
          price_vip?: number;
          available_seats?: number;
          total_seats?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Seats table (for tracking seat status per showtime)
      seats: {
        Row: {
          id: string;
          showtime_id: string;
          seat_id: string;
          row_label: string;
          seat_number: number;
          seat_type: 'standard' | 'premium' | 'recliner' | 'vip';
          status: 'available' | 'booked' | 'locked' | 'blocked';
          price: number;
          locked_by: string | null;
          locked_until: string | null;
          booked_by: string | null;
          booking_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          showtime_id: string;
          seat_id: string;
          row_label: string;
          seat_number: number;
          seat_type: 'standard' | 'premium' | 'recliner' | 'vip';
          status?: 'available' | 'booked' | 'locked' | 'blocked';
          price: number;
          locked_by?: string | null;
          locked_until?: string | null;
          booked_by?: string | null;
          booking_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          showtime_id?: string;
          seat_id?: string;
          row_label?: string;
          seat_number?: number;
          seat_type?: 'standard' | 'premium' | 'recliner' | 'vip';
          status?: 'available' | 'booked' | 'locked' | 'blocked';
          price?: number;
          locked_by?: string | null;
          locked_until?: string | null;
          booked_by?: string | null;
          booking_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Snacks table
      snacks: {
        Row: {
          id: string;
          name: string;
          description: string;
          image: string;
          category: 'popcorn' | 'drinks' | 'combos' | 'nachos' | 'hot_food' | 'merchandise';
          is_veg: boolean;
          is_popular: boolean;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image: string;
          category: 'popcorn' | 'drinks' | 'combos' | 'nachos' | 'hot_food' | 'merchandise';
          is_veg?: boolean;
          is_popular?: boolean;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image?: string;
          category?: 'popcorn' | 'drinks' | 'combos' | 'nachos' | 'hot_food' | 'merchandise';
          is_veg?: boolean;
          is_popular?: boolean;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Snack variants table
      snack_variants: {
        Row: {
          id: string;
          snack_id: string;
          size: 'small' | 'medium' | 'large' | 'regular';
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          snack_id: string;
          size: 'small' | 'medium' | 'large' | 'regular';
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          snack_id?: string;
          size?: 'small' | 'medium' | 'large' | 'regular';
          price?: number;
          created_at?: string;
        };
      };

      // Snack addons table
      snack_addons: {
        Row: {
          id: string;
          snack_id: string;
          name: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          snack_id: string;
          name: string;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          snack_id?: string;
          name?: string;
          price?: number;
          created_at?: string;
        };
      };

      // Bookings/Orders table
      bookings: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          theater_id: string;
          showtime_id: string;
          booking_date: string;
          total_amount: number;
          ticket_amount: number;
          snack_amount: number;
          convenience_fee: number;
          tax_amount: number;
          discount_amount: number;
          promo_code: string | null;
          payment_method: string;
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          ticket_qr: string | null;
          snack_qr: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: string;
          theater_id: string;
          showtime_id: string;
          booking_date?: string;
          total_amount: number;
          ticket_amount: number;
          snack_amount?: number;
          convenience_fee: number;
          tax_amount: number;
          discount_amount?: number;
          promo_code?: string | null;
          payment_method: string;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          booking_status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          ticket_qr?: string | null;
          snack_qr?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: string;
          theater_id?: string;
          showtime_id?: string;
          booking_date?: string;
          total_amount?: number;
          ticket_amount?: number;
          snack_amount?: number;
          convenience_fee?: number;
          tax_amount?: number;
          discount_amount?: number;
          promo_code?: string | null;
          payment_method?: string;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          booking_status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          ticket_qr?: string | null;
          snack_qr?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Booked seats (linking table)
      booked_seats: {
        Row: {
          id: string;
          booking_id: string;
          seat_id: string;
          showtime_id: string;
          row_label: string;
          seat_number: number;
          seat_type: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          seat_id: string;
          showtime_id: string;
          row_label: string;
          seat_number: number;
          seat_type: string;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          seat_id?: string;
          showtime_id?: string;
          row_label?: string;
          seat_number?: number;
          seat_type?: string;
          price?: number;
          created_at?: string;
        };
      };

      // Booked snacks table
      booked_snacks: {
        Row: {
          id: string;
          booking_id: string;
          snack_id: string;
          variant_id: string;
          quantity: number;
          unit_price: number;
          addons: Json;
          pickup_time: 'pre-show' | 'interval';
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          snack_id: string;
          variant_id: string;
          quantity: number;
          unit_price: number;
          addons?: Json;
          pickup_time?: 'pre-show' | 'interval';
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          snack_id?: string;
          variant_id?: string;
          quantity?: number;
          unit_price?: number;
          addons?: Json;
          pickup_time?: 'pre-show' | 'interval';
          created_at?: string;
        };
      };

      // Reviews table
      reviews: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          rating: number;
          comment: string;
          likes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: string;
          rating: number;
          comment: string;
          likes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: string;
          rating?: number;
          comment?: string;
          likes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Promo codes table
      promo_codes: {
        Row: {
          id: string;
          code: string;
          description: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          min_order_amount: number;
          max_discount: number | null;
          valid_from: string;
          valid_until: string;
          usage_limit: number | null;
          used_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          min_order_amount?: number;
          max_discount?: number | null;
          valid_from: string;
          valid_until: string;
          usage_limit?: number | null;
          used_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          description?: string;
          discount_type?: 'percentage' | 'fixed';
          discount_value?: number;
          min_order_amount?: number;
          max_discount?: number | null;
          valid_from?: string;
          valid_until?: string;
          usage_limit?: number | null;
          used_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      lock_seats: {
        Args: {
          p_showtime_id: string;
          p_seat_ids: string[];
          p_user_id: string;
          p_lock_duration_minutes?: number;
        };
        Returns: Json;
      };
      release_seat_locks: {
        Args: {
          p_showtime_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      confirm_booking: {
        Args: {
          p_booking_id: string;
        };
        Returns: boolean;
      };
      validate_promo_code: {
        Args: {
          p_code: string;
          p_order_amount: number;
        };
        Returns: Json;
      };
    };
    Enums: {
      seat_type: 'standard' | 'premium' | 'recliner' | 'vip';
      seat_status: 'available' | 'booked' | 'locked' | 'blocked';
      movie_status: 'now_showing' | 'coming_soon';
      snack_category: 'popcorn' | 'drinks' | 'combos' | 'nachos' | 'hot_food' | 'merchandise';
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    };
  };
};

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Specific table types
export type Profile = Tables<'profiles'>;
export type Movie = Tables<'movies'>;
export type CastMember = Tables<'cast_members'>;
export type CrewMember = Tables<'crew_members'>;
export type City = Tables<'cities'>;
export type Theater = Tables<'theaters'>;
export type Screen = Tables<'screens'>;
export type Showtime = Tables<'showtimes'>;
export type Seat = Tables<'seats'>;
export type Snack = Tables<'snacks'>;
export type SnackVariant = Tables<'snack_variants'>;
export type SnackAddon = Tables<'snack_addons'>;
export type Booking = Tables<'bookings'>;
export type BookedSeat = Tables<'booked_seats'>;
export type BookedSnack = Tables<'booked_snacks'>;
export type Review = Tables<'reviews'>;
export type PromoCode = Tables<'promo_codes'>;
