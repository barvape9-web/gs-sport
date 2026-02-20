'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { fetchGlobalTheme, applyTheme } = useThemeStore();

  useEffect(() => {
    // Apply default immediately to prevent flash
    applyTheme();
    // Then fetch the global theme from the database
    fetchGlobalTheme();
  }, [fetchGlobalTheme, applyTheme]);

  return <>{children}</>;
}
