-- Shindhu Cinemas Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUM TYPES
-- ===========================================

CREATE TYPE seat_type AS ENUM ('standard', 'premium', 'recliner', 'vip');
CREATE TYPE seat_status AS ENUM ('available', 'booked', 'locked', 'blocked');
CREATE TYPE movie_status AS ENUM ('now_showing', 'coming_soon');
CREATE TYPE snack_category AS ENUM ('popcorn', 'drinks', 'combos', 'nachos', 'hot_food', 'merchandise');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE snack_size AS ENUM ('small', 'medium', 'large', 'regular');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE pickup_time AS ENUM ('pre-show', 'interval');

-- ===========================================
-- PROFILES TABLE (extends auth.users)
-- ===========================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  city TEXT,
  wallet_balance DECIMAL(10, 2) DEFAULT 0,
  referral_code TEXT UNIQUE DEFAULT 'SHINDHU' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- CITIES TABLE
-- ===========================================

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Anyone can read cities
CREATE POLICY "Cities are viewable by everyone" ON cities
  FOR SELECT USING (true);

-- ===========================================
-- MOVIES TABLE
-- ===========================================

CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  poster TEXT NOT NULL,
  backdrop TEXT NOT NULL,
  trailer_url TEXT,
  synopsis TEXT NOT NULL,
  duration INTEGER NOT NULL,
  release_date DATE NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 0,
  user_rating DECIMAL(2, 1) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  language TEXT NOT NULL,
  genres TEXT[] NOT NULL DEFAULT '{}',
  formats TEXT[] NOT NULL DEFAULT '{}',
  certification TEXT NOT NULL,
  status movie_status NOT NULL DEFAULT 'coming_soon',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Anyone can read movies
CREATE POLICY "Movies are viewable by everyone" ON movies
  FOR SELECT USING (true);

-- ===========================================
-- CAST & CREW TABLES
-- ===========================================

CREATE TABLE cast_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crew_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cast_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cast members viewable by everyone" ON cast_members FOR SELECT USING (true);
CREATE POLICY "Crew members viewable by everyone" ON crew_members FOR SELECT USING (true);

-- ===========================================
-- THEATERS TABLE
-- ===========================================

CREATE TABLE theaters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city_id UUID REFERENCES cities(id),
  address TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE theaters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Theaters are viewable by everyone" ON theaters FOR SELECT USING (true);

-- ===========================================
-- SCREENS TABLE
-- ===========================================

CREATE TABLE screens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theater_id UUID REFERENCES theaters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_seats INTEGER NOT NULL,
  seat_layout JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE screens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Screens are viewable by everyone" ON screens FOR SELECT USING (true);

-- ===========================================
-- SHOWTIMES TABLE
-- ===========================================

CREATE TABLE showtimes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  theater_id UUID REFERENCES theaters(id) ON DELETE CASCADE,
  screen_id UUID REFERENCES screens(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  format TEXT NOT NULL,
  language TEXT NOT NULL,
  price_standard DECIMAL(10, 2) NOT NULL,
  price_premium DECIMAL(10, 2) NOT NULL,
  price_recliner DECIMAL(10, 2) NOT NULL,
  price_vip DECIMAL(10, 2) NOT NULL,
  available_seats INTEGER NOT NULL,
  total_seats INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE showtimes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Showtimes are viewable by everyone" ON showtimes FOR SELECT USING (true);

-- Create index for efficient queries
CREATE INDEX idx_showtimes_movie_date ON showtimes(movie_id, show_date);
CREATE INDEX idx_showtimes_theater_date ON showtimes(theater_id, show_date);

-- ===========================================
-- SEATS TABLE
-- ===========================================

CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  showtime_id UUID REFERENCES showtimes(id) ON DELETE CASCADE,
  seat_id TEXT NOT NULL,
  row_label TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  seat_type seat_type NOT NULL,
  status seat_status DEFAULT 'available',
  price DECIMAL(10, 2) NOT NULL,
  locked_by UUID REFERENCES auth.users(id),
  locked_until TIMESTAMPTZ,
  booked_by UUID REFERENCES auth.users(id),
  booking_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(showtime_id, seat_id)
);

-- Enable RLS
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Seats are viewable by everyone" ON seats FOR SELECT USING (true);

CREATE POLICY "Users can lock available seats" ON seats
  FOR UPDATE USING (
    status = 'available' OR
    (status = 'locked' AND locked_by = auth.uid())
  );

-- Index for efficient seat queries
CREATE INDEX idx_seats_showtime ON seats(showtime_id);
CREATE INDEX idx_seats_status ON seats(showtime_id, status);

-- Enable real-time for seats
ALTER PUBLICATION supabase_realtime ADD TABLE seats;

-- ===========================================
-- SNACKS TABLE
-- ===========================================

CREATE TABLE snacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  category snack_category NOT NULL,
  is_veg BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE snacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Snacks are viewable by everyone" ON snacks FOR SELECT USING (true);

-- ===========================================
-- SNACK VARIANTS TABLE
-- ===========================================

CREATE TABLE snack_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snack_id UUID REFERENCES snacks(id) ON DELETE CASCADE,
  size snack_size NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE snack_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Snack variants are viewable by everyone" ON snack_variants FOR SELECT USING (true);

-- ===========================================
-- SNACK ADDONS TABLE
-- ===========================================

CREATE TABLE snack_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snack_id UUID REFERENCES snacks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE snack_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Snack addons are viewable by everyone" ON snack_addons FOR SELECT USING (true);

-- ===========================================
-- BOOKINGS TABLE
-- ===========================================

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  movie_id UUID REFERENCES movies(id),
  theater_id UUID REFERENCES theaters(id),
  showtime_id UUID REFERENCES showtimes(id),
  booking_date TIMESTAMPTZ DEFAULT NOW(),
  total_amount DECIMAL(10, 2) NOT NULL,
  ticket_amount DECIMAL(10, 2) NOT NULL,
  snack_amount DECIMAL(10, 2) DEFAULT 0,
  convenience_fee DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  promo_code TEXT,
  payment_method TEXT NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  booking_status booking_status DEFAULT 'pending',
  ticket_qr TEXT,
  snack_qr TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id AND booking_status = 'pending');

-- Enable real-time for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- ===========================================
-- BOOKED SEATS TABLE
-- ===========================================

CREATE TABLE booked_seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id TEXT NOT NULL,
  showtime_id UUID REFERENCES showtimes(id),
  row_label TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  seat_type TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE booked_seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booked seats" ON booked_seats
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booked_seats.booking_id AND bookings.user_id = auth.uid())
  );

CREATE POLICY "Users can create booked seats for own bookings" ON booked_seats
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booked_seats.booking_id AND bookings.user_id = auth.uid())
  );

-- ===========================================
-- BOOKED SNACKS TABLE
-- ===========================================

CREATE TABLE booked_snacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  snack_id UUID REFERENCES snacks(id),
  variant_id UUID REFERENCES snack_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  addons JSONB DEFAULT '[]',
  pickup_time pickup_time DEFAULT 'pre-show',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE booked_snacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booked snacks" ON booked_snacks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booked_snacks.booking_id AND bookings.user_id = auth.uid())
  );

CREATE POLICY "Users can create booked snacks for own bookings" ON booked_snacks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM bookings WHERE bookings.id = booked_snacks.booking_id AND bookings.user_id = auth.uid())
  );

-- ===========================================
-- REVIEWS TABLE
-- ===========================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ===========================================
-- PROMO CODES TABLE
-- ===========================================

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  discount_type discount_type NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount DECIMAL(10, 2),
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promo codes are viewable by authenticated users" ON promo_codes
  FOR SELECT USING (auth.role() = 'authenticated' AND is_active = true);

-- ===========================================
-- DATABASE FUNCTIONS
-- ===========================================

-- Function to lock seats for a user
CREATE OR REPLACE FUNCTION lock_seats(
  p_showtime_id UUID,
  p_seat_ids TEXT[],
  p_user_id UUID,
  p_lock_duration_minutes INTEGER DEFAULT 8
)
RETURNS JSONB AS $$
DECLARE
  v_locked_seats TEXT[] := '{}';
  v_unavailable_seats TEXT[] := '{}';
  v_seat_id TEXT;
BEGIN
  -- First, release any expired locks
  UPDATE seats
  SET status = 'available', locked_by = NULL, locked_until = NULL
  WHERE showtime_id = p_showtime_id
    AND status = 'locked'
    AND locked_until < NOW();

  -- Check each seat
  FOREACH v_seat_id IN ARRAY p_seat_ids
  LOOP
    -- Try to lock the seat
    UPDATE seats
    SET
      status = 'locked',
      locked_by = p_user_id,
      locked_until = NOW() + (p_lock_duration_minutes || ' minutes')::INTERVAL,
      updated_at = NOW()
    WHERE showtime_id = p_showtime_id
      AND seat_id = v_seat_id
      AND (status = 'available' OR (status = 'locked' AND locked_by = p_user_id));

    IF FOUND THEN
      v_locked_seats := array_append(v_locked_seats, v_seat_id);
    ELSE
      v_unavailable_seats := array_append(v_unavailable_seats, v_seat_id);
    END IF;
  END LOOP;

  -- If some seats couldn't be locked, release the ones we locked
  IF array_length(v_unavailable_seats, 1) > 0 THEN
    UPDATE seats
    SET status = 'available', locked_by = NULL, locked_until = NULL
    WHERE showtime_id = p_showtime_id
      AND seat_id = ANY(v_locked_seats)
      AND locked_by = p_user_id;

    RETURN jsonb_build_object(
      'success', false,
      'message', 'Some seats are no longer available',
      'locked_seats', '{}',
      'unavailable_seats', v_unavailable_seats
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Seats locked successfully',
    'locked_seats', v_locked_seats,
    'unavailable_seats', '{}'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to release seat locks
CREATE OR REPLACE FUNCTION release_seat_locks(
  p_showtime_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE seats
  SET
    status = 'available',
    locked_by = NULL,
    locked_until = NULL,
    updated_at = NOW()
  WHERE showtime_id = p_showtime_id
    AND locked_by = p_user_id
    AND status = 'locked';

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to confirm booking and mark seats as booked
CREATE OR REPLACE FUNCTION confirm_booking(p_booking_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_showtime_id UUID;
  v_user_id UUID;
BEGIN
  -- Get booking details
  SELECT showtime_id, user_id INTO v_showtime_id, v_user_id
  FROM bookings
  WHERE id = p_booking_id AND booking_status = 'pending';

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Update seats to booked
  UPDATE seats
  SET
    status = 'booked',
    booked_by = v_user_id,
    booking_id = p_booking_id,
    locked_by = NULL,
    locked_until = NULL,
    updated_at = NOW()
  WHERE showtime_id = v_showtime_id
    AND locked_by = v_user_id
    AND status = 'locked';

  -- Update booking status
  UPDATE bookings
  SET
    booking_status = 'confirmed',
    payment_status = 'completed',
    updated_at = NOW()
  WHERE id = p_booking_id;

  -- Update available seats count in showtime
  UPDATE showtimes
  SET available_seats = available_seats - (
    SELECT COUNT(*) FROM booked_seats WHERE booking_id = p_booking_id
  )
  WHERE id = v_showtime_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate promo code
CREATE OR REPLACE FUNCTION validate_promo_code(
  p_code TEXT,
  p_order_amount DECIMAL
)
RETURNS JSONB AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_discount DECIMAL;
BEGIN
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE UPPER(code) = UPPER(p_code)
    AND is_active = true
    AND valid_from <= NOW()
    AND valid_until >= NOW()
    AND (usage_limit IS NULL OR used_count < usage_limit);

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'discount_amount', 0,
      'message', 'Invalid or expired promo code'
    );
  END IF;

  IF p_order_amount < v_promo.min_order_amount THEN
    RETURN jsonb_build_object(
      'valid', false,
      'discount_amount', 0,
      'message', 'Minimum order amount is ' || v_promo.min_order_amount
    );
  END IF;

  -- Calculate discount
  IF v_promo.discount_type = 'percentage' THEN
    v_discount := p_order_amount * (v_promo.discount_value / 100);
    IF v_promo.max_discount IS NOT NULL AND v_discount > v_promo.max_discount THEN
      v_discount := v_promo.max_discount;
    END IF;
  ELSE
    v_discount := v_promo.discount_value;
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'discount_amount', v_discount,
    'message', 'Promo code applied successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired seat locks (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_locks()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE seats
  SET status = 'available', locked_by = NULL, locked_until = NULL
  WHERE status = 'locked' AND locked_until < NOW();

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- UPDATE TIMESTAMP TRIGGER
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_theaters_updated_at BEFORE UPDATE ON theaters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_showtimes_updated_at BEFORE UPDATE ON showtimes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_seats_updated_at BEFORE UPDATE ON seats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_snacks_updated_at BEFORE UPDATE ON snacks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
