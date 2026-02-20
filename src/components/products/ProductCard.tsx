'use client';

import { useState, memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Star, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useTranslation } from '@/lib/useTranslation';

interface ProductCardProps {
  product: Product;
  isSaved?: boolean;
  onToggleSave?: (productId: string, saved: boolean) => void;
}

function ProductCard({ product, isSaved = false, onToggleSave }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(isSaved);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, toggleCart } = useCartStore();
  const { t } = useTranslation();

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
    toggleCart();
  }, [product, addItem, toggleCart]);

  const handleWishlist = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await axios.post('/api/saved', { productId: product.id });
      setIsWishlisted(res.data.saved);
      toast.success(res.data.message);
      onToggleSave?.(product.id, res.data.saved);
    } catch {
      toast.error('Sign in to save items');
    }
  }, [product.id, onToggleSave]);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isWomen = product.gender === 'WOMEN';

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="product-card group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 h-full"
      style={{
        backgroundColor: isWomen ? 'rgba(236,72,153,0.04)' : 'var(--card-bg)',
        border: isWomen ? '1px solid rgba(236,72,153,0.15)' : '1px solid var(--card-border)',
        boxShadow: isWomen ? '0 0 20px rgba(236,72,153,0.06), inset 0 0 30px rgba(236,72,153,0.03)' : undefined,
        willChange: 'transform',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl flex-shrink-0" style={{ backgroundColor: 'var(--bg-inset)' }}>
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 25vw"
              className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}>
                  <ShoppingBag size={24} style={{ color: 'var(--color-primary)' }} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('productDetail.noImage')}</p>
              </div>
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="px-2 py-1 text-white text-[10px] font-extrabold rounded-md flex items-center gap-1 uppercase tracking-widest" style={{ backgroundColor: 'var(--color-primary)' }}>
                <Zap size={10} />
                {t('productDetail.hot')}
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-extrabold rounded-md uppercase tracking-widest">
                -{discount}%
              </span>
            )}
          </div>

          {/* Gender badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-widest ${
                product.gender === 'MEN'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : product.gender === 'WOMEN'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'bg-white/10 text-white/60 border border-white/20'
              }`}
            >
              {product.gender}
            </span>
          </div>

          {/* Action buttons on hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 relative overflow-hidden py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 backdrop-blur-md"
              style={{
                background: isWomen
                  ? 'linear-gradient(135deg, #ec4899, #db2777, #ec4899)'
                  : 'linear-gradient(135deg, #f97316, #ea580c, #f97316)',
                boxShadow: isWomen
                  ? '0 4px 20px rgba(236,72,153,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                  : '0 4px 20px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                borderTop: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <ShoppingBag size={14} className="drop-shadow-sm" />
              <span className="drop-shadow-sm">{t('productDetail.addToCart')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center backdrop-blur-md"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <Eye size={14} className="text-white/80" />
            </motion.button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col" style={isWomen ? { background: 'linear-gradient(180deg, rgba(236,72,153,0.04) 0%, rgba(236,72,153,0.08) 100%)' } : undefined}>
          <div className="flex items-start justify-between gap-1 sm:gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mb-0.5 sm:mb-1" style={{ color: 'var(--text-muted)' }}>
                {getCategoryLabel(product.category)}
              </p>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide leading-tight line-clamp-2 transition-colors duration-300" style={{ color: 'var(--text-primary)' } as React.CSSProperties}
                onMouseEnter={(e) => (e.currentTarget.style.color = isWomen ? '#ec4899' : 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                {product.name}
              </h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className="flex-shrink-0 mt-1"
            >
              <Heart
                size={16}
                className={`transition-all duration-200 ${
                  isWishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-white/30 hover:stroke-red-400'
                }`}
              />
            </motion.button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-0.5 sm:gap-1 mt-1.5 sm:mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={10}
                className={`${star <= 4 ? '' : 'stroke-white/20'}`}
                style={star <= 4 ? { fill: isWomen ? '#ec4899' : 'var(--color-primary)', stroke: isWomen ? '#ec4899' : 'var(--color-primary)' } : undefined}
              />
            ))}
            <span className="text-[9px] sm:text-[10px] ml-1" style={{ color: 'var(--text-muted)' }}>({product.popularity})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
            <span className="text-base sm:text-lg font-black" style={{ color: isWomen ? '#ec4899' : 'var(--color-primary)' }}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm line-through" style={{ color: 'var(--text-muted)' }}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Sizes preview */}
          <div className="mt-auto" />
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex gap-1 mt-2 sm:mt-3">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest rounded-md"
                  style={{ border: isWomen ? '1px solid rgba(236,72,153,0.15)' : '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[8px] sm:text-[9px] self-center" style={{ color: 'var(--text-muted)' }}>+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default memo(ProductCard);