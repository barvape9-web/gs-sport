'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Monitor, Moon, Sun, RotateCcw, Check, Loader2 } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import toast from 'react-hot-toast';

const PRESET_THEMES = [
  { name: 'GS Orange', primary: '#f97316', secondary: '#10b981', accent: '#8b5cf6' },
  { name: 'Electric Blue', primary: '#3b82f6', secondary: '#06b6d4', accent: '#ec4899' },
  { name: 'Emerald', primary: '#10b981', secondary: '#3b82f6', accent: '#f59e0b' },
  { name: 'Crimson', primary: '#ef4444', secondary: '#f97316', accent: '#7c3aed' },
  { name: 'Rose Gold', primary: '#f43f5e', secondary: '#ec4899', accent: '#a855f7' },
  { name: 'Cyber Purple', primary: '#a855f7', secondary: '#8b5cf6', accent: '#06b6d4' },
];

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{value}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg shadow-inner" style={{ background: value, border: '1px solid var(--glass-border)' }} />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
        />
      </div>
    </div>
  );
}

export default function AdminThemePage() {
  const { theme, updatePrimaryColor, updateSecondaryColor, updateAccentColor, toggleDarkMode, saveGlobalTheme } = useThemeStore();
  const { primaryColor, secondaryColor, accentColor, isDarkMode } = theme;
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const applyPreset = (preset: (typeof PRESET_THEMES)[0]) => {
    updatePrimaryColor(preset.primary);
    updateSecondaryColor(preset.secondary);
    updateAccentColor(preset.accent);
    toast.success(`Applied "${preset.name}" theme — click Save to apply globally`);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveGlobalTheme();
      setSaved(true);
      toast.success('Theme saved globally for all users!');
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error('Failed to save theme. Are you logged in as admin?');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    updatePrimaryColor('#f97316');
    updateSecondaryColor('#10b981');
    updateAccentColor('#8b5cf6');
    try {
      await saveGlobalTheme();
      toast.success('Theme reset to defaults globally');
    } catch {
      toast.error('Failed to save reset. Changes are local only.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="admin-page-header flex items-center gap-3">
        <div
          className="icon-3d w-11 h-11"
          style={{
            background: 'linear-gradient(135deg, #06b6d425, #06b6d410)',
            border: '1px solid #06b6d420',
            boxShadow: '0 4px 15px rgba(6,182,212,0.15), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          <Palette size={18} style={{ color: '#06b6d4', filter: 'drop-shadow(0 2px 4px rgba(6,182,212,0.4))' }} />
        </div>
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Theme Customization</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Customize the visual appearance of GS • Sport store</p>
        </div>
      </div>

      {/* Preset Themes */}
      <div className="admin-chart-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="icon-3d w-7 h-7" style={{ background: 'linear-gradient(135deg, #f9731618, #f9731608)', border: '1px solid #f9731612' }}>
            <Palette size={12} style={{ color: '#f97316' }} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Preset Themes</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESET_THEMES.map((preset) => (
            <motion.button
              key={preset.name}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => applyPreset(preset)}
              className="admin-stat-card !p-3 !rounded-xl text-left group"
            >
              <div className="flex gap-2 mb-2">
                {[preset.primary, preset.secondary, preset.accent].map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full shadow-md" style={{ background: c }} />
                ))}
              </div>
              <p className="text-xs font-semibold transition-colors" style={{ color: 'var(--text-secondary)' }}>{preset.name}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="admin-chart-card p-6 space-y-5">
        <div className="flex items-center gap-2">
          <div className="icon-3d w-7 h-7" style={{ background: 'linear-gradient(135deg, #10b98118, #10b98108)', border: '1px solid #10b98112' }}>
            <Palette size={12} style={{ color: '#10b981' }} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Custom Colors</h2>
        </div>
        <ColorPicker label="Primary Color" value={primaryColor} onChange={updatePrimaryColor} />
        <div className="" style={{ borderTop: '1px solid var(--border-subtle)' }} />
        <ColorPicker label="Secondary Color" value={secondaryColor} onChange={updateSecondaryColor} />
        <div className="" style={{ borderTop: '1px solid var(--border-subtle)' }} />
        <ColorPicker label="Accent Color" value={accentColor} onChange={updateAccentColor} />
      </div>

      {/* Color Preview */}
      <div className="admin-chart-card p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Live Preview</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Primary', color: primaryColor },
            { label: 'Secondary', color: secondaryColor },
            { label: 'Accent', color: accentColor },
          ].map(({ label, color }) => (
            <div key={label} className="glass rounded-xl overflow-hidden">
              <div className="h-16" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
              <div className="p-3">
                <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{color}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button className="btn-primary px-5 py-2 rounded-xl text-sm transition-all" style={{ background: primaryColor }}>
            CTA Button
          </button>
          <span className="px-3 py-2 text-xs font-bold rounded-xl" style={{ background: `${secondaryColor}20`, color: secondaryColor, border: `1px solid ${secondaryColor}40` }}>
            Badge
          </span>
          <span style={{ color: accentColor }} className="text-sm font-bold self-center">Accent Text</span>
        </div>
      </div>

      {/* Dark Mode */}
      <div className="admin-chart-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--overlay-bg)' }}>
              {isDarkMode ? <Moon size={16} style={{ color: 'var(--color-primary)' }} /> : <Sun size={16} style={{ color: 'var(--color-primary)' }} />}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Toggle between dark and light interface</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="relative w-12 h-6 rounded-full transition-colors"
            style={{ backgroundColor: isDarkMode ? 'var(--color-primary)' : 'var(--input-border)' }}
          >
            <motion.div
              animate={{ x: isDarkMode ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </motion.button>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <Monitor size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Currently: {isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px color-mix(in srgb, var(--color-primary) 30%, transparent)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 flex-1 justify-center text-white disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : null}
          {saving ? 'Saving...' : saved ? 'Saved Globally!' : 'Save Changes'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="glass px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2"
          style={{ color: 'var(--text-muted)' }}
        >
          <RotateCcw size={14} />
          Reset
        </motion.button>
      </div>
    </div>
  );
}
