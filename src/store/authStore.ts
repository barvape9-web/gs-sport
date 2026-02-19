import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      logout: async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        set({ user: null });
      },
    }),
    {
      name: 'gs-sport-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
