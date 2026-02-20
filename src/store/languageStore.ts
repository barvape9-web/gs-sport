import { create } from 'zustand';

export type Locale = 'ka' | 'en' | 'ru';

interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  locale: (typeof window !== 'undefined'
    ? (localStorage.getItem('gs-sport-locale') as Locale) || 'ka'
    : 'ka') as Locale,
  setLocale: (locale: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gs-sport-locale', locale);
    }
    set({ locale });
  },
}));
