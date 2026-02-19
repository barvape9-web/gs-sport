'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { applyTheme } = useThemeStore();

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return <>{children}</>;
}
