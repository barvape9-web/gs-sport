'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

const generateRevenueTrend = () =>
  Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
    }),
    revenue: Math.floor(Math.random() * 3000) + 1000,
    orders: Math.floor(Math.random() * 30) + 10,
  }));

const orderStatusData = [
  { name: 'Delivered', value: 45 },
  { name: 'Shipped', value: 20 },
  { name: 'Processing', value: 15 },
  { name: 'Pending', value: 12 },
  { name: 'Cancelled', value: 8 },
];

const topProducts = [
  { name: 'Pro Training Tee', sales: 234, revenue: 11700 },
  { name: 'Elite Running Shorts', sales: 187, revenue: 11220 },
  { name: 'Performance Hoodie', sales: 143, revenue: 12870 },
  { name: 'Compression Leggings', sales: 126, revenue: 10080 },
  { name: 'Sport Cap', sales: 98, revenue: 2940 },
];

const statCards = [
  {
    title: 'Total Revenue',
    value: '$128,450',
    change: '+12.5%',
    up: true,
    icon: DollarSign,
    color: '#f97316',
  },
  {
    title: 'Total Orders',
    value: '2,847',
    change: '+8.2%',
    up: true,
    icon: ShoppingCart,
    color: '#3b82f6',
  },
  {
    title: 'Total Users',
    value: '15,234',
    change: '+23.1%',
    up: true,
    icon: Users,
    color: '#10b981',
  },
  {
    title: 'Active Products',
    value: '247',
    change: '-3.4%',
    up: false,
    icon: Package,
    color: '#8b5cf6',
  },
];

export default function AdminDashboard() {
  const [revenueTrend] = useState(generateRevenueTrend);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const filteredTrend =
    period === '7d'
      ? revenueTrend.slice(-7)
      : period === '30d'
      ? revenueTrend.slice(-30)
      : revenueTrend;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <motion.button
              key={p}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm rounded-full font-medium transition-all ${
                period === p
                  ? 'bg-[#f97316] text-white'
                  : 'glass text-white/60 hover:text-white'
              }`}
            >
              {p}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}20` }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold ${
                  stat.up ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white">Revenue Overview</h3>
            <span className="text-xs text-white/40">Last {period}</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={filteredTrend}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,15,15,0.9)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  borderRadius: '12px',
                  color: 'white',
                }}
                formatter={(value: number | undefined) => [formatPrice(value ?? 0), 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#revenueGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="font-bold text-white mb-6">Order Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {orderStatusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,15,15,0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="font-bold text-white mb-6">Top Products</h3>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-4">
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{
                    backgroundColor: `${COLORS[i]}20`,
                    color: COLORS[i],
                    border: `1px solid ${COLORS[i]}30`,
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/80 truncate">{product.name}</p>
                  <p className="text-[10px] text-white/30">{product.sales} sales</p>
                </div>
                <span className="text-sm font-bold" style={{ color: COLORS[i] }}>
                  {formatPrice(product.revenue)}
                </span>
                <ArrowUpRight size={14} className="text-white/20" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Orders Trend Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="font-bold text-white mb-6">Orders per Day</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={filteredTrend.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,15,15,0.9)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
