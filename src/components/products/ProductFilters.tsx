'use client';

import { motion } from 'framer-motion';
import { Percent } from 'lucide-react';
import { ProductFilters as IProductFilters, Gender, Category } from '@/types';
import { useTranslation } from '@/lib/useTranslation';

interface ProductFiltersProps {
  filters: IProductFilters;
  onFiltersChange: (filters: IProductFilters) => void;
  onClose?: () => void;
}

const categoryKeys: { value: Category; key: string }[] = [
  { value: 'UPPER_WEAR', key: 'products.upperWear' },
  { value: 'LOWER_WEAR', key: 'products.lowerWear' },
  { value: 'WINTER_WEAR', key: 'products.winterWear' },
  { value: 'SUMMER_WEAR', key: 'products.summerWear' },
  { value: 'ACCESSORIES', key: 'products.accessories' },
];

export default function ProductFilters({ filters, onFiltersChange, onClose }: ProductFiltersProps) {
  const { t } = useTranslation();

  const categories = categoryKeys.map(({ value, key }) => ({ value, label: t(key) }));

  const genders: { value: Gender; label: string }[] = [
    { value: 'MEN', label: t('products.mens') },
    { value: 'WOMEN', label: t('products.womens') },
    { value: 'UNISEX', label: t('products.unisex') },
  ];

  const priceRanges = [
    { label: t('products.under30'), min: 0, max: 30 },
    { label: t('products.range30_60'), min: 30, max: 60 },
    { label: t('products.range60_100'), min: 60, max: 100 },
    { label: t('products.over100'), min: 100, max: 9999 },
  ];

  const update = (key: keyof IProductFilters, value: unknown) => {
    onFiltersChange({ ...filters, [key]: filters[key] === value ? undefined : value });
  };

  const clearAll = () => onFiltersChange({ sortBy: filters.sortBy });

  const hasActiveFilters = !!(filters.gender || filters.category || filters.minPrice || filters.maxPrice || filters.onSale);

  return (
    <div className="glass-card p-5 space-y-7 sticky top-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{t('products.filters')}</h3>
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAll}
            className="text-xs flex items-center gap-1"
            style={{ color: 'var(--color-primary)' }}
          >
            {t('products.clearAll')}
          </motion.button>
        )}
      </div>

      {/* Sale / Discount */}
      <div>
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => {
            onFiltersChange({ ...filters, onSale: filters.onSale ? undefined : true });
            onClose?.();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            filters.onSale ? 'border' : ''
          }`}
          style={filters.onSale ? {
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: '#f87171',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          } : { color: 'var(--text-secondary)' }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: filters.onSale
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'var(--overlay-bg)',
              boxShadow: filters.onSale ? '0 4px 12px rgba(239,68,68,0.3)' : undefined,
            }}
          >
            <Percent size={14} className={filters.onSale ? 'text-white' : ''} style={!filters.onSale ? { color: 'var(--text-muted)' } : undefined} />
          </div>
          {t('products.onSale')}
          {filters.onSale && <span className="w-2 h-2 rounded-full ml-auto" style={{ backgroundColor: '#ef4444' }} />}
        </motion.button>
      </div>

      {/* Gender */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>{t('products.gender')}</p>
        <div className="space-y-1">
          {genders.map(({ value, label }) => (
            <motion.button
              key={value}
              whileHover={{ x: 4 }}
              onClick={() => { update('gender', value); onClose?.(); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                filters.gender === value ? 'border' : ''
              }`}
              style={filters.gender === value ? {
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                color: 'var(--color-primary)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
              } : { color: 'var(--text-secondary)' }}
            >
              {label}
              {filters.gender === value && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>{t('products.category')}</p>
        <div className="space-y-1">
          {categories.map(({ value, label }) => (
            <motion.button
              key={value}
              whileHover={{ x: 4 }}
              onClick={() => { update('category', value); onClose?.(); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                filters.category === value ? 'border' : ''
              }`}
              style={filters.category === value ? {
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                color: 'var(--color-primary)',
                borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
              } : { color: 'var(--text-secondary)' }}
            >
              {label}
              {filters.category === value && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>{t('products.priceRange')}</p>
        <div className="space-y-1">
          {priceRanges.map((range) => {
            const isActive = filters.minPrice === range.min && filters.maxPrice === range.max;
            return (
              <motion.button
                key={range.label}
                whileHover={{ x: 4 }}
                onClick={() => {
                  if (isActive) {
                    onFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined });
                  } else {
                    onFiltersChange({ ...filters, minPrice: range.min, maxPrice: range.max });
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive ? 'border' : ''
                }`}
                style={isActive ? {
                  backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                  color: 'var(--color-primary)',
                  borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
                } : { color: 'var(--text-secondary)' }}
              >
                {range.label}
                {isActive && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
