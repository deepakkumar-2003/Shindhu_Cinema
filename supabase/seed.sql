-- Seed data for Shindhu Cinemas
-- Run this after schema.sql to populate initial data

-- ===========================================
-- CITIES
-- ===========================================

INSERT INTO cities (id, name, state) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Mumbai', 'Maharashtra'),
  ('c0000002-0000-0000-0000-000000000002', 'Delhi', 'Delhi'),
  ('c0000003-0000-0000-0000-000000000003', 'Bangalore', 'Karnataka'),
  ('c0000004-0000-0000-0000-000000000004', 'Chennai', 'Tamil Nadu'),
  ('c0000005-0000-0000-0000-000000000005', 'Hyderabad', 'Telangana'),
  ('c0000006-0000-0000-0000-000000000006', 'Kolkata', 'West Bengal'),
  ('c0000007-0000-0000-0000-000000000007', 'Pune', 'Maharashtra'),
  ('c0000008-0000-0000-0000-000000000008', 'Ahmedabad', 'Gujarat'),
  ('c0000009-0000-0000-0000-000000000009', 'Jaipur', 'Rajasthan'),
  ('c0000010-0000-0000-0000-000000000010', 'Lucknow', 'Uttar Pradesh'),
  ('c0000011-0000-0000-0000-000000000011', 'Kanpur', 'Uttar Pradesh'),
  ('c0000012-0000-0000-0000-000000000012', 'Nagpur', 'Maharashtra'),
  ('c0000013-0000-0000-0000-000000000013', 'Indore', 'Madhya Pradesh'),
  ('c0000014-0000-0000-0000-000000000014', 'Thane', 'Maharashtra'),
  ('c0000015-0000-0000-0000-000000000015', 'Bhopal', 'Madhya Pradesh'),
  ('c0000016-0000-0000-0000-000000000016', 'Visakhapatnam', 'Andhra Pradesh'),
  ('c0000017-0000-0000-0000-000000000017', 'Patna', 'Bihar'),
  ('c0000018-0000-0000-0000-000000000018', 'Vadodara', 'Gujarat'),
  ('c0000019-0000-0000-0000-000000000019', 'Ghaziabad', 'Uttar Pradesh'),
  ('c0000020-0000-0000-0000-000000000020', 'Ludhiana', 'Punjab');

-- ===========================================
-- MOVIES
-- ===========================================

INSERT INTO movies (id, title, poster, backdrop, trailer_url, synopsis, duration, release_date, rating, user_rating, total_ratings, language, genres, formats, certification, status) VALUES
  (
    'a0000001-0000-0000-0000-000000000001',
    'Pushpa 2: The Rule',
    'https://image.tmdb.org/t/p/w500/bGLvMPSRsVTLP4vUvtSwUvN1AK9.jpg',
    'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    'https://www.youtube.com/embed/Q1NKMPhP8PY',
    'Pushpa Raj returns with even more power and intensity as he continues his rise in the world of red sandalwood smuggling. Facing new enemies and bigger challenges, Pushpa must prove that he truly rules.',
    180,
    '2024-12-05',
    8.5,
    4.3,
    125000,
    'Telugu',
    ARRAY['Action', 'Drama', 'Thriller'],
    ARRAY['2D', '3D', 'IMAX'],
    'UA',
    'now_showing'
  ),
  (
    'a0000002-0000-0000-0000-000000000002',
    'Dune: Part Two',
    'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    'https://www.youtube.com/embed/Way9Dexny3w',
    'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.',
    166,
    '2024-03-01',
    8.8,
    4.5,
    250000,
    'English',
    ARRAY['Sci-Fi', 'Adventure', 'Drama'],
    ARRAY['2D', '3D', 'IMAX'],
    'UA',
    'now_showing'
  ),
  (
    'a0000003-0000-0000-0000-000000000003',
    'Kalki 2898 AD',
    'https://image.tmdb.org/t/p/w500/kLj8UkMBqvP0hhuKbXq2G3wZHDH.jpg',
    'https://image.tmdb.org/t/p/original/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg',
    'https://www.youtube.com/embed/pmddGTuVwLI',
    'Set in a dystopian future in the year 2898 AD, the epic mythological sci-fi film follows the story of a mysterious warrior who embarks on a journey to save the world.',
    181,
    '2024-06-27',
    8.2,
    4.1,
    180000,
    'Telugu',
    ARRAY['Sci-Fi', 'Action', 'Fantasy'],
    ARRAY['2D', '3D', 'IMAX'],
    'UA',
    'now_showing'
  ),
  (
    'a0000004-0000-0000-0000-000000000004',
    'Deadpool & Wolverine',
    'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    'https://www.youtube.com/embed/73_1biulkYk',
    'Deadpool is offered a place in the Marvel Cinematic Universe by the TVA. But instead, he recruits a variant of Wolverine to save his universe from extinction.',
    127,
    '2024-07-26',
    8.0,
    4.2,
    320000,
    'English',
    ARRAY['Action', 'Comedy', 'Superhero'],
    ARRAY['2D', '3D', 'IMAX'],
    'A',
    'now_showing'
  ),
  (
    'a0000005-0000-0000-0000-000000000005',
    'Stree 2',
    'https://image.tmdb.org/t/p/w500/pHHQBTsP6LlcgF5D92PYCCHdnG8.jpg',
    'https://image.tmdb.org/t/p/original/stKGOm8UyhuLPR9sZLjs5AkmncA.jpg',
    'https://www.youtube.com/embed/KxB25_1O7Hs',
    'The residents of Chanderi face a new threat when a headless entity called Sarkata begins terrorizing the town. Vicky and his friends must once again seek Stree''s help.',
    150,
    '2024-08-15',
    7.8,
    4.0,
    95000,
    'Hindi',
    ARRAY['Horror', 'Comedy'],
    ARRAY['2D'],
    'UA',
    'now_showing'
  ),
  (
    'a0000006-0000-0000-0000-000000000006',
    'Singham Again',
    'https://image.tmdb.org/t/p/w500/uFS0JJwMYfBHHdMU1mMJyB3ADAe.jpg',
    'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'Bajirao Singham returns for another action-packed adventure. When his wife is kidnapped, Singham must face his biggest challenge yet in a battle against an international crime syndicate.',
    165,
    '2024-11-01',
    7.5,
    3.9,
    75000,
    'Hindi',
    ARRAY['Action', 'Drama'],
    ARRAY['2D', 'IMAX'],
    'UA',
    'now_showing'
  ),
  (
    'a0000007-0000-0000-0000-000000000007',
    'Avatar 3',
    'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
    'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'Jake Sully and Neytiri return in the next chapter of the Avatar saga. The Sully family faces new challenges as they explore uncharted territories of Pandora.',
    190,
    '2025-12-19',
    0,
    0,
    0,
    'English',
    ARRAY['Sci-Fi', 'Adventure', 'Fantasy'],
    ARRAY['3D', 'IMAX'],
    'UA',
    'coming_soon'
  ),
  (
    'a0000008-0000-0000-0000-000000000008',
    'The Batman 2',
    'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvber3r2eGeBsEj1.jpg',
    'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'The Dark Knight returns to face new threats in Gotham City. As new villains emerge, Batman must confront his past while protecting the city he loves.',
    175,
    '2025-10-03',
    0,
    0,
    0,
    'English',
    ARRAY['Action', 'Crime', 'Drama'],
    ARRAY['2D', 'IMAX'],
    'UA',
    'coming_soon'
  ),
  (
    'a0000009-0000-0000-0000-000000000009',
    'The Deepakkumar',
    'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fvber3r2eGeBsEj1.jpg',
    'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'The Dark Knight returns to face new threats in Gotham City. As new villains emerge, Batman must confront his past while protecting the city he loves.',
    175,
    '2025-10-03',
    0,
    0,
    0,
    'English',
    ARRAY['Action', 'Crime', 'Drama'],
    ARRAY['2D', 'IMAX'],
    'UA',
    'coming_soon'
  );

-- ===========================================
-- CAST MEMBERS
-- ===========================================

INSERT INTO cast_members (movie_id, name, role, image) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Allu Arjun', 'Pushpa Raj', 'https://image.tmdb.org/t/p/w200/7rGzKjYgQNgcCaOqTa2LjSP9g4m.jpg'),
  ('a0000001-0000-0000-0000-000000000001', 'Rashmika Mandanna', 'Srivalli', 'https://image.tmdb.org/t/p/w200/zn9qTKEYMNf7lLGUjqw4tIyH0nG.jpg'),
  ('a0000001-0000-0000-0000-000000000001', 'Fahadh Faasil', 'Bhanwar Singh Shekhawat', 'https://image.tmdb.org/t/p/w200/t8y0Z0lHgGDBZFmBiRnm9N8wEW9.jpg'),
  ('a0000002-0000-0000-0000-000000000002', 'Timothée Chalamet', 'Paul Atreides', 'https://image.tmdb.org/t/p/w200/BE2sdjpgsa2rNTFa66f7upkaOP.jpg'),
  ('a0000002-0000-0000-0000-000000000002', 'Zendaya', 'Chani', 'https://image.tmdb.org/t/p/w200/uh3bLzUv1GSRT7MizKCLajZPihl.jpg'),
  ('a0000002-0000-0000-0000-000000000002', 'Rebecca Ferguson', 'Lady Jessica', 'https://image.tmdb.org/t/p/w200/lJloTOheuQSirSLXNA3JHsrMNfH.jpg'),
  ('a0000003-0000-0000-0000-000000000003', 'Prabhas', 'Bhairava', 'https://image.tmdb.org/t/p/w200/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg'),
  ('a0000003-0000-0000-0000-000000000003', 'Deepika Padukone', 'SUM-80', 'https://image.tmdb.org/t/p/w200/huV2CDrBrCm5hh2jxmWGZ91L7cL.jpg'),
  ('a0000003-0000-0000-0000-000000000003', 'Amitabh Bachchan', 'Ashwatthama', 'https://image.tmdb.org/t/p/w200/sfhfkRHRsZkLRRhMmgywNMkfPfX.jpg'),
  ('a0000004-0000-0000-0000-000000000004', 'Ryan Reynolds', 'Deadpool', 'https://image.tmdb.org/t/p/w200/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg'),
  ('a0000004-0000-0000-0000-000000000004', 'Hugh Jackman', 'Wolverine', 'https://image.tmdb.org/t/p/w200/oX6pNtGsGWGHe18fTH0jGMhMi5X.jpg'),
  ('a0000005-0000-0000-0000-000000000005', 'Rajkummar Rao', 'Vicky', 'https://image.tmdb.org/t/p/w200/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg'),
  ('a0000005-0000-0000-0000-000000000005', 'Shraddha Kapoor', 'Stree', 'https://image.tmdb.org/t/p/w200/huV2CDrBrCm5hh2jxmWGZ91L7cL.jpg'),
  ('a0000006-0000-0000-0000-000000000006', 'Ajay Devgn', 'Bajirao Singham', 'https://image.tmdb.org/t/p/w200/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg'),
  ('a0000006-0000-0000-0000-000000000006', 'Kareena Kapoor Khan', 'Avni Singham', 'https://image.tmdb.org/t/p/w200/huV2CDrBrCm5hh2jxmWGZ91L7cL.jpg'),
  ('a0000007-0000-0000-0000-000000000007', 'Sam Worthington', 'Jake Sully', 'https://image.tmdb.org/t/p/w200/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg'),
  ('a0000007-0000-0000-0000-000000000007', 'Zoe Saldana', 'Neytiri', 'https://image.tmdb.org/t/p/w200/huV2CDrBrCm5hh2jxmWGZ91L7cL.jpg'),
  ('a0000008-0000-0000-0000-000000000008', 'Robert Pattinson', 'Bruce Wayne / Batman', 'https://image.tmdb.org/t/p/w200/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg');

-- ===========================================
-- CREW MEMBERS
-- ===========================================

INSERT INTO crew_members (movie_id, name, role, image) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Sukumar', 'Director', 'https://image.tmdb.org/t/p/w200/qsQqYj0a6t2QwqB2dLJvHLxhUH.jpg'),
  ('a0000001-0000-0000-0000-000000000001', 'Devi Sri Prasad', 'Music Director', 'https://image.tmdb.org/t/p/w200/6DJhzOdMzWl5XZjRkJ7XQq2lYK.jpg'),
  ('a0000002-0000-0000-0000-000000000002', 'Denis Villeneuve', 'Director', 'https://image.tmdb.org/t/p/w200/zdDx9Xs93UIrJFWv9cmMXJlDjD4.jpg'),
  ('a0000002-0000-0000-0000-000000000002', 'Hans Zimmer', 'Music Director', 'https://image.tmdb.org/t/p/w200/tpQnDeHY15szIXvpnhlprufz4d.jpg'),
  ('a0000003-0000-0000-0000-000000000003', 'Nag Ashwin', 'Director', 'https://image.tmdb.org/t/p/w200/qsQqYj0a6t2QwqB2dLJvHLxhUH.jpg'),
  ('a0000003-0000-0000-0000-000000000003', 'Santhosh Narayanan', 'Music Director', 'https://image.tmdb.org/t/p/w200/6DJhzOdMzWl5XZjRkJ7XQq2lYK.jpg'),
  ('a0000004-0000-0000-0000-000000000004', 'Shawn Levy', 'Director', 'https://image.tmdb.org/t/p/w200/qsQqYj0a6t2QwqB2dLJvHLxhUH.jpg'),
  ('a0000005-0000-0000-0000-000000000005', 'Amar Kaushik', 'Director', 'https://image.tmdb.org/t/p/w200/qsQqYj0a6t2QwqB2dLJvHLxhUH.jpg'),
  ('a0000006-0000-0000-0000-000000000006', 'Rohit Shetty', 'Director', 'https://image.tmdb.org/t/p/w200/qsQqYj0a6t2QwqB2dLJvHLxhUH.jpg'),
  ('a0000007-0000-0000-0000-000000000007', 'James Cameron', 'Director', 'https://image.tmdb.org/t/p/w200/qsQqYj0a6t2QwqB2dLJvHLxhUH.jpg'),
  ('a0000008-0000-0000-0000-000000000008', 'Matt Reeves', 'Director', 'https://image.tmdb.org/t/p/w200/qsQqYj0a6t2QwqB2dLJvHLxhUH.jpg');

-- ===========================================
-- THEATERS
-- ===========================================

INSERT INTO theaters (id, name, location, city_id, address, amenities) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'PVR Cinemas - Phoenix Mall', 'Lower Parel', 'c0000001-0000-0000-0000-000000000001', 'Phoenix Mills, 462 Senapati Bapat Marg, Lower Parel', ARRAY['Dolby Atmos', 'IMAX', 'Recliner Seats', 'F&B', 'Parking']),
  ('b0000002-0000-0000-0000-000000000002', 'INOX - Nariman Point', 'Nariman Point', 'c0000001-0000-0000-0000-000000000001', 'NCPA Marg, Nariman Point', ARRAY['Dolby Atmos', '4DX', 'Premium Lounge', 'F&B', 'Valet Parking']),
  ('b0000003-0000-0000-0000-000000000003', 'Cinepolis - Andheri', 'Andheri West', 'c0000001-0000-0000-0000-000000000001', 'Fun Republic Mall, Link Road, Andheri West', ARRAY['Dolby Atmos', 'VIP Seats', 'F&B', 'Parking']),
  ('b0000004-0000-0000-0000-000000000004', 'PVR LUXE - Bandra', 'Bandra', 'c0000001-0000-0000-0000-000000000001', 'Linking Road, Bandra West', ARRAY['Dolby Atmos', 'IMAX', 'Luxury Recliners', 'In-seat Service', 'Valet Parking']),
  ('b0000005-0000-0000-0000-000000000005', 'Carnival Cinemas - Wadala', 'Wadala', 'c0000001-0000-0000-0000-000000000001', 'R City Mall, LBS Marg, Ghatkopar West', ARRAY['Dolby', 'F&B', 'Parking']);

-- ===========================================
-- SCREENS
-- ===========================================

INSERT INTO screens (id, theater_id, name, total_seats, seat_layout) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Screen 1', 200, '{"rows": 12, "seatsPerRow": 16, "types": {"A-C": "standard", "D-G": "premium", "H-J": "recliner", "K-L": "vip"}}'::JSONB),
  ('d0000002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'Screen 2 - IMAX', 300, '{"rows": 15, "seatsPerRow": 20, "types": {"A-E": "standard", "F-J": "premium", "K-M": "recliner", "N-O": "vip"}}'::JSONB),
  ('d0000003-0000-0000-0000-000000000003', 'b0000002-0000-0000-0000-000000000002', 'Screen 1', 180, '{"rows": 10, "seatsPerRow": 18, "types": {"A-C": "standard", "D-G": "premium", "H-J": "recliner"}}'::JSONB),
  ('d0000004-0000-0000-0000-000000000004', 'b0000003-0000-0000-0000-000000000003', 'Screen 1', 200, '{"rows": 12, "seatsPerRow": 16, "types": {"A-C": "standard", "D-G": "premium", "H-J": "recliner", "K-L": "vip"}}'::JSONB),
  ('d0000005-0000-0000-0000-000000000005', 'b0000004-0000-0000-0000-000000000004', 'LUXE Screen', 100, '{"rows": 8, "seatsPerRow": 12, "types": {"A-B": "premium", "C-E": "recliner", "F-H": "vip"}}'::JSONB);

-- ===========================================
-- SNACKS
-- ===========================================

INSERT INTO snacks (id, name, description, image, category, is_veg, is_popular) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'Classic Salted Popcorn', 'Freshly popped corn with perfect saltiness', 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400', 'popcorn', true, true),
  ('e0000002-0000-0000-0000-000000000002', 'Caramel Popcorn', 'Sweet caramelized popcorn for the sweet tooth', 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', 'popcorn', true, true),
  ('e0000003-0000-0000-0000-000000000003', 'Pepsi', 'Ice-cold refreshing cola', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400', 'drinks', true, true),
  ('e0000004-0000-0000-0000-000000000004', 'Sprite', 'Crisp, refreshing lemon-lime soda', 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400', 'drinks', true, false),
  ('e0000005-0000-0000-0000-000000000005', 'Popcorn + Pepsi Combo', 'Large popcorn with large Pepsi - best value!', 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400', 'combos', true, true),
  ('e0000006-0000-0000-0000-000000000006', 'Family Combo', '2 Large popcorns + 4 Regular drinks', 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400', 'combos', true, true),
  ('e0000007-0000-0000-0000-000000000007', 'Nachos with Cheese', 'Crispy nachos with warm cheese dip', 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', 'nachos', true, true),
  ('e0000008-0000-0000-0000-000000000008', 'Hot Dog', 'Classic hot dog with mustard and ketchup', 'https://images.unsplash.com/photo-1612392062631-94e1e1f51bc4?w=400', 'hot_food', false, false),
  ('e0000009-0000-0000-0000-000000000009', 'Veg Burger', 'Crispy veg patty burger with fresh veggies', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 'hot_food', true, false),
  ('e0000010-0000-0000-0000-000000000010', 'Samosa (2 pcs)', 'Crispy samosas with mint chutney', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', 'hot_food', true, true);

-- ===========================================
-- SNACK VARIANTS
-- ===========================================

INSERT INTO snack_variants (snack_id, size, price) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'small', 150),
  ('e0000001-0000-0000-0000-000000000001', 'medium', 220),
  ('e0000001-0000-0000-0000-000000000001', 'large', 290),
  ('e0000002-0000-0000-0000-000000000002', 'small', 180),
  ('e0000002-0000-0000-0000-000000000002', 'medium', 260),
  ('e0000002-0000-0000-0000-000000000002', 'large', 340),
  ('e0000003-0000-0000-0000-000000000003', 'small', 100),
  ('e0000003-0000-0000-0000-000000000003', 'medium', 150),
  ('e0000003-0000-0000-0000-000000000003', 'large', 200),
  ('e0000004-0000-0000-0000-000000000004', 'small', 100),
  ('e0000004-0000-0000-0000-000000000004', 'medium', 150),
  ('e0000004-0000-0000-0000-000000000004', 'large', 200),
  ('e0000005-0000-0000-0000-000000000005', 'regular', 399),
  ('e0000006-0000-0000-0000-000000000006', 'regular', 799),
  ('e0000007-0000-0000-0000-000000000007', 'small', 180),
  ('e0000007-0000-0000-0000-000000000007', 'large', 280),
  ('e0000008-0000-0000-0000-000000000008', 'regular', 220),
  ('e0000009-0000-0000-0000-000000000009', 'regular', 250),
  ('e0000010-0000-0000-0000-000000000010', 'regular', 120);

-- ===========================================
-- SNACK ADDONS
-- ===========================================

INSERT INTO snack_addons (snack_id, name, price) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'Butter Topping', 30),
  ('e0000001-0000-0000-0000-000000000001', 'Cheese Topping', 40),
  ('e0000005-0000-0000-0000-000000000005', 'Butter Topping', 30),
  ('e0000005-0000-0000-0000-000000000005', 'Extra Drink', 100),
  ('e0000006-0000-0000-0000-000000000006', 'Butter Topping', 50),
  ('e0000007-0000-0000-0000-000000000007', 'Salsa Dip', 40),
  ('e0000007-0000-0000-0000-000000000007', 'Extra Cheese', 50),
  ('e0000007-0000-0000-0000-000000000007', 'Jalapenos', 30),
  ('e0000008-0000-0000-0000-000000000008', 'Extra Sauce', 20),
  ('e0000008-0000-0000-0000-000000000008', 'Cheese Slice', 30),
  ('e0000009-0000-0000-0000-000000000009', 'Extra Cheese', 40),
  ('e0000009-0000-0000-0000-000000000009', 'Fries', 80),
  ('e0000010-0000-0000-0000-000000000010', 'Extra Chutney', 20);

-- ===========================================
-- PROMO CODES
-- ===========================================

INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, max_discount, valid_from, valid_until) VALUES
  ('FIRST20', 'Get 20% off on your first booking', 'percentage', 20, 200, 150, '2024-01-01', '2025-12-31'),
  ('WEEKEND50', 'Flat Rs.50 off on weekend bookings', 'fixed', 50, 300, NULL, '2024-01-01', '2025-12-31'),
  ('SNACKS25', '25% off on snacks', 'percentage', 25, 100, 100, '2024-01-01', '2025-12-31'),
  ('IMAX100', 'Rs.100 off on IMAX shows', 'fixed', 100, 500, NULL, '2024-01-01', '2025-12-31');

-- ===========================================
-- SAMPLE SHOWTIMES (for today and next 7 days)
-- ===========================================

DO $$
DECLARE
  v_movie RECORD;
  v_screen RECORD;
  v_theater RECORD;
  v_date DATE;
  v_time TIME;
  v_times TIME[] := ARRAY['09:30:00'::TIME, '12:45:00'::TIME, '16:00:00'::TIME, '19:30:00'::TIME, '22:45:00'::TIME];
  v_formats TEXT[] := ARRAY['2D', '3D', 'IMAX'];
  v_languages TEXT[] := ARRAY['Hindi', 'English', 'Telugu'];
  v_format TEXT;
  v_language TEXT;
  v_price_standard DECIMAL;
  v_price_premium DECIMAL;
  v_price_recliner DECIMAL;
  v_price_vip DECIMAL;
BEGIN
  -- Loop through dates (today + 7 days)
  FOR i IN 0..7 LOOP
    v_date := CURRENT_DATE + i;

    -- Loop through movies (only now_showing)
    FOR v_movie IN SELECT id, language FROM movies WHERE status = 'now_showing' LOOP
      -- Loop through screens with theater info
      FOR v_screen IN
        SELECT s.id as screen_id, s.theater_id, s.total_seats, t.id as tid
        FROM screens s
        JOIN theaters t ON s.theater_id = t.id
      LOOP
        -- Loop through show times
        FOREACH v_time IN ARRAY v_times LOOP
          -- Random format and language
          v_format := v_formats[1 + floor(random() * 3)::int];
          v_language := v_languages[1 + floor(random() * 3)::int];

          -- Generate prices based on format
          IF v_format = 'IMAX' THEN
            v_price_standard := 250 + floor(random() * 50);
            v_price_premium := 350 + floor(random() * 50);
            v_price_recliner := 550 + floor(random() * 100);
            v_price_vip := 750 + floor(random() * 150);
          ELSIF v_format = '3D' THEN
            v_price_standard := 200 + floor(random() * 50);
            v_price_premium := 300 + floor(random() * 50);
            v_price_recliner := 450 + floor(random() * 100);
            v_price_vip := 650 + floor(random() * 150);
          ELSE
            v_price_standard := 150 + floor(random() * 50);
            v_price_premium := 250 + floor(random() * 50);
            v_price_recliner := 400 + floor(random() * 100);
            v_price_vip := 600 + floor(random() * 150);
          END IF;

          INSERT INTO showtimes (
            movie_id, theater_id, screen_id, show_date, show_time,
            format, language,
            price_standard, price_premium, price_recliner, price_vip,
            available_seats, total_seats, is_active
          ) VALUES (
            v_movie.id,
            v_screen.theater_id,
            v_screen.screen_id,
            v_date,
            v_time,
            v_format,
            v_language,
            v_price_standard,
            v_price_premium,
            v_price_recliner,
            v_price_vip,
            v_screen.total_seats,
            v_screen.total_seats,
            true
          );
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- ===========================================
-- GENERATE SEATS FOR EACH SHOWTIME
-- ===========================================

DO $$
DECLARE
  v_showtime RECORD;
  v_row_num INT;
  v_seat_num INT;
  v_row_label TEXT;
  v_seat_type seat_type;
  v_price DECIMAL;
BEGIN
  -- For each showtime
  FOR v_showtime IN SELECT id, price_standard, price_premium, price_recliner, price_vip FROM showtimes LOOP
    -- Generate seats (12 rows, 16 seats per row)
    FOR v_row_num IN 1..12 LOOP
      v_row_label := CHR(64 + v_row_num); -- A, B, C, etc.

      -- Determine seat type and price based on row
      IF v_row_num <= 3 THEN
        v_seat_type := 'standard';
        v_price := v_showtime.price_standard;
      ELSIF v_row_num <= 7 THEN
        v_seat_type := 'premium';
        v_price := v_showtime.price_premium;
      ELSIF v_row_num <= 10 THEN
        v_seat_type := 'recliner';
        v_price := v_showtime.price_recliner;
      ELSE
        v_seat_type := 'vip';
        v_price := v_showtime.price_vip;
      END IF;

      FOR v_seat_num IN 1..16 LOOP
        INSERT INTO seats (
          showtime_id, seat_id, row_label, seat_number, seat_type, status, price
        ) VALUES (
          v_showtime.id,
          v_row_label || v_seat_num,
          v_row_label,
          v_seat_num,
          v_seat_type,
          CASE
            WHEN random() > 0.85 THEN 'booked'::seat_status
            ELSE 'available'::seat_status
          END,
          v_price
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- ===========================================
-- SAMPLE REVIEWS (anonymous - no user_id)
-- ===========================================

INSERT INTO reviews (movie_id, user_id, rating, comment, likes, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000001', NULL, 5, 'Absolutely phenomenal! Allu Arjun delivers a performance of a lifetime. The action sequences are mind-blowing!', 1250, '2024-12-06'),
  ('a0000001-0000-0000-0000-000000000001', NULL, 4, 'Great movie with excellent cinematography. The interval block is absolutely stunning. A must-watch!', 890, '2024-12-05'),
  ('a0000002-0000-0000-0000-000000000002', NULL, 5, 'Denis Villeneuve has created a masterpiece. The visuals in IMAX are breathtaking!', 2100, '2024-03-05');
