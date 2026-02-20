import { useLanguageStore } from '@/store/languageStore';
import translations from '@/lib/translations';

/**
 * Translation hook for GS • Sport
 * Usage: const { t } = useTranslation();
 *        t('nav.home')  → 'მთავარი' | 'Home' | 'Главная'
 *
 * Supports interpolation: t('checkout.freeShippingHint', { amount: '$10' })
 */
export function useTranslation() {
  const locale = useLanguageStore((s) => s.locale);
  const dict = translations[locale];

  const t = (key: string, params?: Record<string, string | number>): string => {
    let value = dict[key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, String(v));
      });
    }
    return value;
  };

  return { t, locale };
}
