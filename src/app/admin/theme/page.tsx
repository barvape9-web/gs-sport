'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Monitor, Moon, Sun, RotateCcw, Check } from 'lucide-react';
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
        <p className="text-sm font-semibold text-white/80">{label}</p>
        <p className="text-xs text-white/30 font-mono mt-0.5">{value}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg border border-white/10 shadow-inner" style={{ background: value }} />
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
  const { theme, updatePrimaryColor, updateSecondaryColor, updateAccentColor, toggleDarkMode } = useThemeStore();
  const { primaryColor, secondaryColor, accentColor, isDarkMode } = theme;
  const [saved, setSaved] = useState(false);

  const applyPreset = (preset: (typeof PRESET_THEMES)[0]) => {
    updatePrimaryColor(preset.primary);
    updateSecondaryColor(preset.secondary);
    updateAccentColor(preset.accent);
    toast.success(`Applied "${preset.name}" theme`);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Theme settings saved!');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    updatePrimaryColor('#f97316');
    updateSecondaryColor('#10b981');
    updateAccentColor('#8b5cf6');
    toast.success('Theme reset to defaults');
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
          <h1 className="text-2xl font-black text-white">Theme Customization</h1>
          <p className="text-white/35 text-sm">Customize the visual appearance of GS • Sport store</p>
        </div>
      </div>

      {/* Preset Themes */}
      <div className="admin-chart-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="icon-3d w-7 h-7" style={{ background: 'linear-gradient(135deg, #f9731618, #f9731608)', border: '1px solid #f9731612' }}>
            <Palette size={12} style={{ color: '#f97316' }} />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Preset Themes</h2>
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
              <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{preset.name}</p>
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
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Custom Colors</h2>
        </div>
        <ColorPicker label="Primary Color" value={primaryColor} onChange={updatePrimaryColor} />
        <div className="border-t border-white/5" />
        <ColorPicker label="Secondary Color" value={secondaryColor} onChange={updateSecondaryColor} />
        <div className="border-t border-white/5" />
        <ColorPicker label="Accent Color" value={accentColor} onChange={updateAccentColor} />
      </div>

      {/* Color Preview */}
      <div className="admin-chart-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Preview</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Primary', color: primaryColor },
            { label: 'Secondary', color: secondaryColor },
            { label: 'Accent', color: accentColor },
          ].map(({ label, color }) => (
            <div key={label} className="glass rounded-xl overflow-hidden">
              <div className="h-16" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
              <div className="p-3">
                <p className="text-xs font-bold text-white/70">{label}</p>
                <p className="text-[10px] font-mono text-white/30 mt-0.5">{color}</p>
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
            <div className="p-2 rounded-lg bg-white/5">
              {isDarkMode ? <Moon size={16} className="text-[#f97316]" /> : <Sun size={16} className="text-[#f97316]" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Dark Mode</p>
              <p className="text-xs text-white/30">Toggle between dark and light interface</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-[#f97316]' : 'bg-white/10'}`}
          >
            <motion.div
              animate={{ x: isDarkMode ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </motion.button>
        </div>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
          <Monitor size={14} className="text-white/30" />
          <span className="text-xs text-white/40">Currently: {isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(249,115,22,0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="btn-primary px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 flex-1 justify-center"
        >
          {saved ? <Check size={16} /> : null}
          {saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="glass px-6 py-3 rounded-2xl text-sm font-bold text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
        >
          <RotateCcw size={14} />
          Reset
        </motion.button>
      </div>
    </div>
  );
}
