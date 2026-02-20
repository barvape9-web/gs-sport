'use client';

import { useState } from 'react';
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
  Activity,
  Zap,
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
  { title: 'Total Revenue', value: '$128,450', change: '+12.5%', up: true, icon: DollarSign, color: '#f97316' },
  { title: 'Total Orders', value: '2,847', change: '+8.2%', up: true, icon: ShoppingCart, color: '#3b82f6' },
  { title: 'Total Users', value: '15,234', change: '+23.1%', up: true, icon: Users, color: '#10b981' },
  { title: 'Active Products', value: '247', change: '-3.4%', up: false, icon: Package, color: '#8b5cf6' },
];

/* ── 3D Icon ── */
function Icon3D({ icon: Icon, color, size = 22 }: { icon: typeof DollarSign; color: string; size?: number }) {
  return (
    <div
      className="icon-3d w-12 h-12"
      style={{
        background: `linear-gradient(135deg, ${color}25, ${color}10)`,
        border: `1px solid ${color}25`,
        boxShadow: `0 4px 15px ${color}15, 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
    >
      <Icon size={size} style={{ color, filter: `drop-shadow(0 2px 4px ${color}40)` }} />
    </div>
  );
}

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
      <div className="admin-page-header flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Activity size={18} className="text-[#f97316]" />
            </motion.div>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Welcome back — here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-1.5 p-1 glass rounded-xl">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <motion.button
              key={p}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs rounded-lg font-bold uppercase tracking-wider transition-all ${
                period === p
                  ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/50 hover:text-white'
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: 'spring', bounce: 0.3 }}
            className="admin-stat-card shine-sweep group"
            style={{ '--card-glow': `${stat.color}12` } as React.CSSProperties}
          >
            <div className="flex items-start justify-between mb-5">
              <Icon3D icon={stat.icon} color={stat.color} />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.08 + 0.3, type: 'spring' }}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  stat.up
                    ? 'text-green-400 bg-green-400/10'
                    : 'text-red-400 bg-red-400/10'
                }`}
              >
                {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {stat.change}
              </motion.div>
            </div>
            <p className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="xl:col-span-2 admin-chart-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="icon-3d w-8 h-8" style={{ background: 'linear-gradient(135deg, #f9731620, #f9731608)', border: '1px solid #f9731618' }}>
                <Zap size={14} style={{ color: '#f97316' }} />
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Revenue Overview</h3>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Last {period}</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={filteredTrend}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="#f97316" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10,10,10,0.95)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  borderRadius: '14px',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  fontSize: '12px',
                }}
                formatter={(value: number | undefined) => [formatPrice(value ?? 0), 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="admin-chart-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-3d w-8 h-8" style={{ background: 'linear-gradient(135deg, #3b82f620, #3b82f608)', border: '1px solid #3b82f618' }}>
              <ShoppingCart size={14} style={{ color: '#3b82f6' }} />
            </div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Order Status</h3>
          </div>
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
                stroke="none"
              >
                {orderStatusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10,10,10,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{value}</span>
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
          transition={{ delay: 0.55 }}
          className="admin-chart-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-3d w-8 h-8" style={{ background: 'linear-gradient(135deg, #10b98120, #10b98108)', border: '1px solid #10b98118' }}>
              <Package size={14} style={{ color: '#10b981' }} />
            </div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Top Products</h3>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all group"
              >
                <span
                  className="icon-3d w-8 h-8 text-[10px] font-black shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS[i]}20, ${COLORS[i]}08)`,
                    border: `1px solid ${COLORS[i]}20`,
                    color: COLORS[i],
                    boxShadow: `0 3px 10px ${COLORS[i]}15, inset 0 1px 0 rgba(255,255,255,0.08)`,
                    fontSize: '10px',
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/80 truncate group-hover:text-white transition-colors">{product.name}</p>
                  <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--overlay-bg)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(product.sales / 234) * 100}%` }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}80)` }}
                    />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{product.sales} sales</p>
                </div>
                <span className="text-sm font-bold shrink-0" style={{ color: COLORS[i] }}>
                  {formatPrice(product.revenue)}
                </span>
                <ArrowUpRight size={14} className="text-white/10 group-hover:text-white/30 transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Orders Trend Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="admin-chart-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-3d w-8 h-8" style={{ background: 'linear-gradient(135deg, #8b5cf620, #8b5cf608)', border: '1px solid #8b5cf618' }}>
              <TrendingUp size={14} style={{ color: '#8b5cf6' }} />
            </div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Orders per Day</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={filteredTrend.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10,10,10,0.95)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              />
              <Bar
                dataKey="orders"
                radius={[6, 6, 0, 0]}
                fill="url(#barGrad)"
              >
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
