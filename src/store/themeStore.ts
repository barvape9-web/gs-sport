import { create } from 'zustand';
import { SiteTheme } from '@/types';
import axios from 'axios';

interface ThemeStore {
  theme: SiteTheme;
  loading: boolean;
  setTheme: (theme: Partial<SiteTheme>) => void;
  updatePrimaryColor: (color: string) => void;
  updateSecondaryColor: (color: string) => void;
  updateAccentColor: (color: string) => void;
  toggleDarkMode: () => void;
  applyTheme: () => void;
  fetchGlobalTheme: () => Promise<void>;
  saveGlobalTheme: () => Promise<void>;
}

const defaultTheme: SiteTheme = {
  id: 'default',
  primaryColor: '#f97316',
  secondaryColor: '#10b981',
  accentColor: '#8b5cf6',
  isDarkMode: true,
};

export const useThemeStore = create<ThemeStore>()((set, get) => ({
  theme: defaultTheme,
  loading: false,

  setTheme: (newTheme) =>
    set((state) => ({
      theme: { ...state.theme, ...newTheme },
    })),

  updatePrimaryColor: (color) => {
    set((state) => ({ theme: { ...state.theme, primaryColor: color } }));
    get().applyTheme();
  },

  updateSecondaryColor: (color) => {
    set((state) => ({ theme: { ...state.theme, secondaryColor: color } }));
    get().applyTheme();
  },

  updateAccentColor: (color) => {
    set((state) => ({ theme: { ...state.theme, accentColor: color } }));
    get().applyTheme();
  },

  toggleDarkMode: () => {
    set((state) => ({
      theme: { ...state.theme, isDarkMode: !state.theme.isDarkMode },
    }));
    get().applyTheme();
  },

  applyTheme: () => {
    if (typeof document === 'undefined') return;
    const { theme } = get();
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    if (theme.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },

  // Fetch the global theme from the database (for all visitors)
  fetchGlobalTheme: async () => {
    try {
      set({ loading: true });
      const res = await axios.get('/api/theme');
      if (res.data.success && res.data.data) {
        const t = res.data.data;
        set({
          theme: {
            id: t.id,
            primaryColor: t.primaryColor,
            secondaryColor: t.secondaryColor,
            accentColor: t.accentColor,
            isDarkMode: t.isDarkMode,
          },
        });
        get().applyTheme();
      }
    } catch (error) {
      console.error('Failed to fetch global theme:', error);
      // Fall back to default theme
      get().applyTheme();
    } finally {
      set({ loading: false });
    }
  },

  // Save the current theme to the database (admin only)
  saveGlobalTheme: async () => {
    try {
      const { theme } = get();
      const res = await axios.put('/api/theme', {
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        accentColor: theme.accentColor,
        isDarkMode: theme.isDarkMode,
      });
      if (!res.data.success) {
        throw new Error(res.data.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Failed to save global theme:', error);
      throw error;
    }
  },
}));
