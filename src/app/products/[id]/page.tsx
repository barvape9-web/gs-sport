'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

const MOCK_PRODUCT: Product = {
  id: '1',
  name: 'GS Pro Elite Running Jacket',
  description:
    'Engineered for peak performance, the GS Pro Elite Running Jacket combines cutting-edge fabric technology with a sleek aerodynamic design. Featuring moisture-wicking MoistureGuard™ fabric, reflective details for visibility, and an adjustable fit system, this jacket keeps you comfortable mile after mile.',
  price: 129.99,
  originalPrice: 179.99,
  images: [],
  category: 'UPPER_WEAR',
  gender: 'MEN',
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: ['#0ea5e9', '#1e293b', '#f97316'],
  stock: 42,
  isFeatured: true,
  rating: 4.8,
  reviewCount: 124,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product>(MOCK_PRODUCT);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addItem, toggleCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch {
        // Use mock data
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
    toast.success('Added to cart!');
    toggleCart();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const placeholderImages = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600',
  ];

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/30 mb-8">
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-white/60 transition-colors">Products</Link>
            <ChevronRight size={12} />
            <span className="text-white/60 truncate max-w-[200px]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/5"
              >
                <img
                  src={product.images?.[activeImg] || placeholderImages[activeImg] || placeholderImages[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = placeholderImages[activeImg % 3]; }}
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-[#f97316] text-white text-xs font-black px-2 py-1 rounded-lg">
                    -{discount}%
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setWishlist(!wishlist)}
                  className="absolute top-4 right-4 p-2.5 rounded-xl glass border border-white/10"
                >
                  <Heart
                    size={18}
                    className={wishlist ? 'fill-[#f97316] text-[#f97316]' : 'text-white/50'}
                  />
                </motion.button>
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {[...Array(3)].map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-[#f97316]' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={product.images?.[i] || placeholderImages[i]}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = placeholderImages[i]; }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Name + rating */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    product.gender === 'MEN'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                  }`}>
                    {product.gender}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                    {product.category?.replace('_', ' ')}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{product.name}</h1>
                {product.rating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating!) ? 'fill-[#f97316] text-[#f97316]' : 'text-white/20'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-white/50">{product.rating} ({product.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-white">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-white/30 line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-bold text-[#f97316] mb-0.5">Save {formatPrice(product.originalPrice! - product.price)}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-white/50 leading-relaxed">{product.description}</p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                    Color {selectedColor && <span className="normal-case text-white/60">selected</span>}
                  </p>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all ${
                          selectedSize === size
                            ? 'border-[#f97316] bg-[#f97316]/10 text-[#f97316]'
                            : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center glass border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 transition-all"
                    >
                      -
                    </button>
                    <span className="px-4 py-3 text-sm font-bold text-white w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 transition-all"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-white/30">{product.stock} in stock</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 py-4 rounded-xl font-bold glass border border-[#f97316]/30 text-[#f97316] hover:bg-[#f97316]/10 transition-all"
                >
                  Buy Now
                </motion.button>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Truck, text: 'Free Shipping', sub: 'Orders over $75' },
                  { icon: Shield, text: 'Guaranteed', sub: '100% authentic' },
                  { icon: RotateCcw, text: 'Easy Returns', sub: '30-day policy' },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="glass p-3 rounded-xl border border-white/5 text-center">
                    <Icon size={16} className="text-[#f97316] mx-auto mb-1.5" />
                    <p className="text-[10px] font-bold text-white/60">{text}</p>
                    <p className="text-[9px] text-white/30">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
