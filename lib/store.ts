'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie, Theater, Showtime, Seat, CartSnack, User, City } from './types';

interface BookingState {
  // City selection
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;

  // Movie selection
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;

  // Theater and showtime selection
  selectedTheater: Theater | null;
  setSelectedTheater: (theater: Theater | null) => void;
  selectedShowtime: Showtime | null;
  setSelectedShowtime: (showtime: Showtime | null) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Seat selection
  selectedSeats: Seat[];
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  clearSeats: () => void;

  // Snacks
  cartSnacks: CartSnack[];
  addSnack: (snack: CartSnack) => void;
  removeSnack: (index: number) => void;
  updateSnackQuantity: (index: number, quantity: number) => void;
  clearSnacks: () => void;
  snackPickupTime: 'pre-show' | 'interval';
  setSnackPickupTime: (time: 'pre-show' | 'interval') => void;

  // Totals
  getTicketTotal: () => number;
  getSnackTotal: () => number;
  getConvenienceFee: () => number;
  getTax: () => number;
  getGrandTotal: () => number;

  // Reset booking
  resetBooking: () => void;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

interface UIState {
  isCityModalOpen: boolean;
  setIsCityModalOpen: (isOpen: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
}

const getDefaultDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // City
      selectedCity: null,
      setSelectedCity: (city) => set({ selectedCity: city }),

      // Movie
      selectedMovie: null,
      setSelectedMovie: (movie) => set({ selectedMovie: movie }),

      // Theater & Showtime
      selectedTheater: null,
      setSelectedTheater: (theater) => set({ selectedTheater: theater }),
      selectedShowtime: null,
      setSelectedShowtime: (showtime) => set({ selectedShowtime: showtime }),
      selectedDate: getDefaultDate(),
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Seats
      selectedSeats: [],
      addSeat: (seat) =>
        set((state) => ({
          selectedSeats: [...state.selectedSeats, seat],
        })),
      removeSeat: (seatId) =>
        set((state) => ({
          selectedSeats: state.selectedSeats.filter((s) => s.id !== seatId),
        })),
      clearSeats: () => set({ selectedSeats: [] }),

      // Snacks
      cartSnacks: [],
      addSnack: (snack) =>
        set((state) => ({
          cartSnacks: [...state.cartSnacks, snack],
        })),
      removeSnack: (index) =>
        set((state) => ({
          cartSnacks: state.cartSnacks.filter((_, i) => i !== index),
        })),
      updateSnackQuantity: (index, quantity) =>
        set((state) => ({
          cartSnacks: state.cartSnacks.map((item, i) =>
            i === index ? { ...item, quantity } : item
          ),
        })),
      clearSnacks: () => set({ cartSnacks: [] }),
      snackPickupTime: 'pre-show',
      setSnackPickupTime: (time) => set({ snackPickupTime: time }),

      // Totals
      getTicketTotal: () => {
        const { selectedSeats } = get();
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
      },
      getSnackTotal: () => {
        const { cartSnacks } = get();
        return cartSnacks.reduce((total, item) => {
          const itemTotal =
            item.variant.price +
            item.addons.reduce((sum, addon) => sum + addon.price, 0);
          return total + itemTotal * item.quantity;
        }, 0);
      },
      getConvenienceFee: () => {
        const { selectedSeats } = get();
        return selectedSeats.length * 30; // ₹30 per ticket
      },
      getTax: () => {
        const ticketTotal = get().getTicketTotal();
        const snackTotal = get().getSnackTotal();
        const convenienceFee = get().getConvenienceFee();
        return Math.round((ticketTotal + snackTotal + convenienceFee) * 0.18); // 18% GST
      },
      getGrandTotal: () => {
        const ticketTotal = get().getTicketTotal();
        const snackTotal = get().getSnackTotal();
        const convenienceFee = get().getConvenienceFee();
        const tax = get().getTax();
        return ticketTotal + snackTotal + convenienceFee + tax;
      },

      // Reset
      resetBooking: () =>
        set({
          selectedMovie: null,
          selectedTheater: null,
          selectedShowtime: null,
          selectedSeats: [],
          cartSnacks: [],
          snackPickupTime: 'pre-show',
        }),
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        selectedMovie: state.selectedMovie,
        selectedTheater: state.selectedTheater,
        selectedShowtime: state.selectedShowtime,
        selectedDate: state.selectedDate,
        selectedSeats: state.selectedSeats,
        cartSnacks: state.cartSnacks,
        snackPickupTime: state.snackPickupTime,
      }),
    }
  )
);

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);

export const useUIStore = create<UIState>((set) => ({
  isCityModalOpen: false,
  setIsCityModalOpen: (isOpen) => set({ isCityModalOpen: isOpen }),
  isAuthModalOpen: false,
  setIsAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  authMode: 'login',
  setAuthMode: (mode) => set({ authMode: mode }),
}));
