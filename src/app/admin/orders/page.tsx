'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronDown, Eye, Edit, Loader2 } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/orders');
        setOrders(res.data.orders || []);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
    } catch { /* optimistic */ }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    toast.success(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Orders</h1>
          <p className="text-white/40 text-sm">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, email..."
            className="w-full input-glass pl-10 pr-4 py-3 rounded-xl text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
            className="input-glass pl-9 pr-10 py-3 rounded-xl text-sm appearance-none cursor-pointer min-w-40"
          >
            <option value="ALL">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-[#f97316]" size={32} />
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['ALL', ...ALL_STATUSES] as const).map((status) => {
          const count = status === 'ALL' ? orders.length : orders.filter((o) => o.status === status).length;
          return (
            <motion.button
              key={status}
              whileHover={{ y: -2 }}
              onClick={() => setStatusFilter(status as OrderStatus | 'ALL')}
              className={`glass-card p-3 text-center transition-all ${
                statusFilter === status ? 'border-[#f97316]/40 bg-[#f97316]/5' : ''
              }`}
            >
              <p className="text-xl font-black text-white">{count}</p>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider font-medium">{status}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-4 text-xs text-white/40 font-bold uppercase tracking-wider">Order ID</th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider hidden md:table-cell">Customer</th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider">Total</th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-mono font-bold text-white">
                    #{order.id.replace('ord-', '').toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-xs text-white/70">{order.user?.name}</p>
                  <p className="text-[10px] text-white/30">{order.user?.email}</p>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-xs text-white/50">{formatDate(order.createdAt)}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-bold text-[#f97316]">{formatPrice(order.total)}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="relative group">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full cursor-pointer ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    {/* Status dropdown */}
                    <div className="absolute left-0 top-full mt-1 glass-card p-1.5 z-10 w-36 hidden group-hover:block shadow-2xl">
                      {ALL_STATUSES.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(order.id, s)}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-white/5 transition-colors ${
                            order.status === s ? 'text-[#f97316]' : 'text-white/60'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                      <Eye size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-white/30 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-lg transition-all"
                    >
                      <Edit size={14} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
