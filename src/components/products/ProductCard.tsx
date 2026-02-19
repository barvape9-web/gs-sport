'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye, Star, Zap } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
    toggleCart();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="product-card glass-card group cursor-pointer overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-gradient-to-br from-white/5 to-white/10">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#f97316]/20 flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag size={24} className="text-[#f97316]" />
                </div>
                <p className="text-xs text-white/30">No image</p>
              </div>
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="px-2 py-1 bg-[#f97316] text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                <Zap size={10} />
                HOT
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full">
                -{discount}%
              </span>
            )}
          </div>

          {/* Gender badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 text-[10px] font-bold rounded-full ${
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
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 btn-primary py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1"
            >
              <ShoppingBag size={14} />
              Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center"
            >
              <Eye size={14} className="text-white/70" />
            </motion.button>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider mb-1">
                {getCategoryLabel(product.category)}
              </p>
              <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-[#f97316] transition-colors">
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
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={10}
                className={`${star <= 4 ? 'fill-[#f97316] stroke-[#f97316]' : 'stroke-white/20'}`}
              />
            ))}
            <span className="text-[10px] text-white/30 ml-1">({product.popularity})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg font-black text-[#f97316]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-white/30 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Sizes preview */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex gap-1 mt-3">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="px-1.5 py-0.5 text-[9px] font-bold border border-white/10 rounded text-white/40"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[9px] text-white/30 self-center">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
