'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, User, Trash2, Filter, ChevronDown } from 'lucide-react';
import { User as UserType } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';

const MOCK_USERS: UserType[] = Array.from({ length: 20 }, (_, i) => ({
  id: `user-${String(i).padStart(6, '0')}`,
  name: ['Alex Johnson', 'Sam Williams', 'Jordan Smith', 'Casey Brown', 'Riley Davis'][i % 5] + (i >= 5 ? ` ${i}` : ''),
  email: `user${i + 1}@example.com`,
  role: i === 0 ? 'ADMIN' : 'USER',
  createdAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

type RoleFilter = 'ALL' | 'USER' | 'ADMIN';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleRole = async (userId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      await axios.put(`/api/admin/users/${userId}`, { role: newRole }).catch(() => {});
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`).catch(() => {});
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const initials = (name?: string | null) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  const colors = ['#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Users</h1>
          <p className="text-white/40 text-sm">{users.length} registered users</p>
        </div>
        <div className="flex gap-3">
          <div className="glass px-4 py-2 rounded-xl text-center border border-white/5">
            <p className="text-lg font-black text-white">{users.filter((u) => u.role === 'ADMIN').length}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Admins</p>
          </div>
          <div className="glass px-4 py-2 rounded-xl text-center border border-white/5">
            <p className="text-lg font-black text-white">{users.filter((u) => u.role === 'USER').length}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Users</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full input-glass pl-10 pr-4 py-3 rounded-xl text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="input-glass pl-9 pr-10 py-3 rounded-xl text-sm appearance-none cursor-pointer min-w-36"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-6 py-4 text-xs text-white/40 font-bold uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider hidden md:table-cell">Joined</th>
              <th className="text-left px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider">Role</th>
              <th className="text-right px-4 py-4 text-xs text-white/40 font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((user, idx) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-white/2 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ background: colors[idx % colors.length] + '33', border: `1px solid ${colors[idx % colors.length]}40` }}
                    >
                      <span style={{ color: colors[idx % colors.length] }}>{initials(user.name)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name || 'Unknown'}</p>
                      <p className="text-xs text-white/30">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-xs text-white/40">{formatDate(user.createdAt)}</span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    {user.role === 'ADMIN' ? (
                      <span className="flex items-center gap-1">
                        <Shield size={9} />
                        ADMIN
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <User size={9} />
                        USER
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleRole(user.id)}
                      className="px-3 py-1.5 text-[10px] font-bold rounded-lg glass border border-white/10 hover:border-[#f97316]/30 text-white/50 hover:text-white transition-all"
                    >
                      {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => deleteUser(user.id)}
                      className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={13} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
