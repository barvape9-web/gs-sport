'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ProductFilters as IProductFilters, Gender, Category } from '@/types';
import { getCategoryLabel } from '@/lib/utils';

interface ProductFiltersProps {
  filters: IProductFilters;
  onFiltersChange: (filters: IProductFilters) => void;
}

const genders: { value: Gender; label: string }[] = [
  { value: 'MEN', label: "Men's" },
  { value: 'WOMEN', label: "Women's" },
  { value: 'UNISEX', label: 'Unisex' },
];

const categories: { value: Category; label: string }[] = [
  { value: 'UPPER_WEAR', label: getCategoryLabel('UPPER_WEAR') },
  { value: 'LOWER_WEAR', label: getCategoryLabel('LOWER_WEAR') },
  { value: 'WINTER_WEAR', label: getCategoryLabel('WINTER_WEAR') },
  { value: 'SUMMER_WEAR', label: getCategoryLabel('SUMMER_WEAR') },
  { value: 'ACCESSORIES', label: getCategoryLabel('ACCESSORIES') },
];

const priceRanges = [
  { label: 'Under $30', min: 0, max: 30 },
  { label: '$30 – $60', min: 30, max: 60 },
  { label: '$60 – $100', min: 60, max: 100 },
  { label: 'Over $100', min: 100, max: 9999 },
];

export default function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const update = (key: keyof IProductFilters, value: unknown) => {
    onFiltersChange({ ...filters, [key]: filters[key] === value ? undefined : value });
  };

  const clearAll = () => onFiltersChange({ sortBy: filters.sortBy });

  return (
    <div className="glass-card p-5 space-y-7 sticky top-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">Filters</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearAll}
          className="text-xs text-[#f97316] hover:text-[#fb923c] flex items-center gap-1"
        >
          <X size={12} />
          Clear All
        </motion.button>
      </div>

      {/* Gender */}
      <div>
        <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-3">Gender</p>
        <div className="space-y-1">
          {genders.map(({ value, label }) => (
            <motion.button
              key={value}
              whileHover={{ x: 4 }}
              onClick={() => update('gender', value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                filters.gender === value
                  ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
              {filters.gender === value && <span className="w-2 h-2 rounded-full bg-[#f97316]" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-3">Category</p>
        <div className="space-y-1">
          {categories.map(({ value, label }) => (
            <motion.button
              key={value}
              whileHover={{ x: 4 }}
              onClick={() => update('category', value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                filters.category === value
                  ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
              {filters.category === value && <span className="w-2 h-2 rounded-full bg-[#f97316]" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-3">Price Range</p>
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
                  isActive
                    ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {range.label}
                {isActive && <span className="w-2 h-2 rounded-full bg-[#f97316]" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
