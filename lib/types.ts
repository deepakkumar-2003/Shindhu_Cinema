// Movie Types
export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  trailerUrl: string;
  synopsis: string;
  duration: number; // in minutes
  releaseDate: string;
  rating: number;
  userRating: number;
  totalRatings: number;
  language: string;
  genres: string[];
  format: ('2D' | '3D' | 'IMAX')[];
  cast: CastMember[];
  crew: CrewMember[];
  certification: string;
  status: 'now_showing' | 'coming_soon';
}

export interface CastMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

// Theater Types
export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  amenities: string[];
  distance?: number; // in km
  screen?: number; // Screen number for multiplex theaters
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  time: string;
  date: string;
  format: '2D' | '3D' | 'IMAX';
  language: string;
  price: {
    standard: number;
    premium: number;
    recliner: number;
    vip: number;
  };
  availableSeats: number;
  totalSeats: number;
}

// Seat Types
export type SeatType = 'standard' | 'premium' | 'recliner' | 'vip';
export type SeatStatus = 'available' | 'booked' | 'selected' | 'locked';

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  price: number;
}

export interface SeatLayout {
  showtimeId: string;
  rows: SeatRow[];
  screen: string;
}

export interface SeatRow {
  label: string;
  seats: Seat[];
  type: SeatType;
}

// Snack Types
export interface Snack {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'popcorn' | 'drinks' | 'combos' | 'nachos' | 'hot_food' | 'merchandise';
  variants: SnackVariant[];
  addons: Addon[];
  isVeg: boolean;
  isPopular: boolean;
}

export interface SnackVariant {
  id: string;
  size: 'small' | 'medium' | 'large' | 'regular';
  price: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface CartSnack {
  snack: Snack;
  variant: SnackVariant;
  addons: Addon[];
  quantity: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  seats: Seat[];
  snacks: CartSnack[];
  snackPickupTime: 'pre-show' | 'interval';
  subtotal: number;
  convenienceFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: string;
  ticketQR: string;
  snackQR?: string;
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  city: string;
  walletBalance: number;
  referralCode: string;
  bookings: Order[];
}

// Filter Types
export interface MovieFilters {
  language?: string[];
  genre?: string[];
  format?: string[];
  rating?: number;
}

export interface ShowtimeFilters {
  date: string;
  format?: string;
  time?: 'morning' | 'afternoon' | 'evening' | 'night';
  priceRange?: [number, number];
}

// City Type
export interface City {
  id: string;
  name: string;
  state: string;
}

// Review Type
export interface Review {
  id: string;
  userId: string;
  userName: string;
  movieId: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
}
