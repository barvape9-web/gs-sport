import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SiteTheme } from '@/types';

interface ThemeStore {
  theme: SiteTheme;
  setTheme: (theme: Partial<SiteTheme>) => void;
  updatePrimaryColor: (color: string) => void;
  updateSecondaryColor: (color: string) => void;
  updateAccentColor: (color: string) => void;
  toggleDarkMode: () => void;
  applyTheme: () => void;
}

const defaultTheme: SiteTheme = {
  id: 'default',
  primaryColor: '#f97316',
  secondaryColor: '#ffffff',
  accentColor: '#000000',
  isDarkMode: true,
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: defaultTheme,

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
    }),
    { name: 'gs-sport-theme' }
  )
);
