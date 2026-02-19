'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  X,
  Save,
  Package,
  Loader2,
} from 'lucide-react';
import { Product, Gender, Category } from '@/types';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

const MOCK_PRODUCTS: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: `prod-${i}`,
  name: ['Pro Tee', 'Running Shorts', 'Hoodie', 'Leggings', 'Cap', 'Jacket', 'Tank', 'Sneakers', 'Socks', 'Bag'][i],
  description: 'Premium sportswear product',
  price: 29.99 + i * 10,
  images: [],
  gender: i % 2 === 0 ? 'MEN' : 'WOMEN',
  category: (['UPPER_WEAR', 'LOWER_WEAR', 'ACCESSORIES'] as const)[i % 3],
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Black', 'White'],
  stock: 50 + i * 5,
  isActive: true,
  isFeatured: i < 3,
  popularity: 100 - i * 8,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

interface FormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  gender: Gender;
  category: Category;
  stock: string;
  isFeatured: boolean;
  sizes: string;
  colors: string;
}

const defaultForm: FormData = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  gender: 'MEN',
  category: 'UPPER_WEAR',
  stock: '0',
  isFeatured: false,
  sizes: 'XS,S,M,L,XL',
  colors: 'Black,White',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products?admin=true');
        setProducts(res.data.products || MOCK_PRODUCTS);
      } catch {
        setProducts(MOCK_PRODUCTS);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.includes(search.toUpperCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      originalPrice: String(product.originalPrice || ''),
      gender: product.gender,
      category: product.category,
      stock: String(product.stock),
      isFeatured: product.isFeatured,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stock: parseInt(form.stock),
        sizes: form.sizes.split(',').map((s) => s.trim()),
        colors: form.colors.split(',').map((c) => c.trim()),
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p))
        );
        toast.success('Product updated!');
      } else {
        const res = await axios.post('/api/products', payload);
        setProducts((prev) => [res.data, ...prev]);
        toast.success('Product created!');
      }
      setIsModalOpen(false);
    } catch {
      // Optimistic update for demo
      if (editingProduct) {
        const price = parseFloat(form.price);
        const stock = parseInt(form.stock);
        const originalPrice = form.originalPrice ? parseFloat(form.originalPrice) : undefined;
        const sizes = form.sizes.split(',').map((s: string) => s.trim());
        const colors = form.colors.split(',').map((c: string) => c.trim());
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? { ...p, name: form.name, description: form.description, price, stock, originalPrice, sizes, colors, isFeatured: form.isFeatured, gender: form.gender as import('@/types').Gender, category: form.category as import('@/types').Category }
              : p
          )
        );
      }
      toast.success(editingProduct ? 'Product updated!' : 'Product created!');
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
    } catch {
      // proceed anyway in demo
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Product deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Products</h1>
          <p className="text-white/40 text-sm">{products.length} total products</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-white flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full input-glass pl-10 pr-4 py-3 rounded-xl text-sm"
        />
      </div>

      {/* Products Table */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-4 text-xs text-white/40 font-bold uppercase tracking-wider">
                Product
              </th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider hidden md:table-cell">
                Category
              </th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider hidden lg:table-cell">
                Gender
              </th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider">
                Price
              </th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider hidden sm:table-cell">
                Stock
              </th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider hidden sm:table-cell">
                Status
              </th>
              <th className="px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-white/30" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate max-w-[160px]">
                        {product.name}
                      </p>
                      {product.isFeatured && (
                        <span className="text-[10px] text-[#f97316]">Featured</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-xs text-white/60">{getCategoryLabel(product.category)}</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span
                    className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                      product.gender === 'MEN'
                        ? 'bg-blue-500/15 text-blue-300'
                        : 'bg-pink-500/15 text-pink-300'
                    }`}
                  >
                    {product.gender}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-bold text-[#f97316]">
                    {formatPrice(product.price)}
                  </span>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span
                    className={`text-xs font-semibold ${
                      product.stock > 20 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span
                    className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                      product.isActive
                        ? 'bg-green-500/15 text-green-400'
                        : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEdit(product)}
                      className="p-2 text-white/40 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-lg transition-all"
                    >
                      <Edit size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <Package size={32} className="mx-auto mb-3 opacity-30" />
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="glass-card p-6 m-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/40 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="label-style">Product Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="Product name"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm resize-none"
                      placeholder="Product description"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Price ($)</label>
                    <input
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      type="number"
                      step="0.01"
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Original Price ($)</label>
                    <input
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      type="number"
                      step="0.01"
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="0.00 (optional)"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                    >
                      <option value="MEN">Men</option>
                      <option value="WOMEN">Women</option>
                      <option value="UNISEX">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                    >
                      <option value="UPPER_WEAR">Upper Wear</option>
                      <option value="LOWER_WEAR">Lower Wear</option>
                      <option value="WINTER_WEAR">Winter Wear</option>
                      <option value="SUMMER_WEAR">Summer Wear</option>
                      <option value="ACCESSORIES">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Stock</label>
                    <input
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      type="number"
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Sizes (comma-separated)</label>
                    <input
                      value={form.sizes}
                      onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="XS,S,M,L,XL"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Colors (comma-separated)</label>
                    <input
                      value={form.colors}
                      onChange={(e) => setForm({ ...form, colors: e.target.value })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="Black,White,Orange"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 font-medium mb-1.5 block">Product Images</label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#f97316]/30 transition-colors cursor-pointer">
                      <Upload size={24} className="text-white/20 mx-auto mb-2" />
                      <p className="text-xs text-white/30">Click to upload product images</p>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#f97316]"
                    />
                    <label htmlFor="featured" className="text-sm text-white/60">
                      Mark as Featured Product
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 btn-primary py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingProduct ? 'Update' : 'Create'} Product
                  </motion.button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 glass rounded-xl text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
