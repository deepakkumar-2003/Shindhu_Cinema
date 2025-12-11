import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

// Convenience functions for easy usage
export const toast = {
  success: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ message, type: 'success', duration });
  },
  error: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ message, type: 'error', duration });
  },
  info: (message: string, duration?: number) => {
    useToastStore.getState().addToast({ message, type: 'info', duration });
  },
};
