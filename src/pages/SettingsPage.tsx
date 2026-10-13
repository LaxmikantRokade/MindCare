// src/pages/SettingsPage.tsx
import { useApp } from '../context/AppContext';
import { Sun, Moon, Monitor, Eye } from 'lucide-react';
import { AccessibilityPanel } from '../components/accessibility/AccessibilityPanel';
import type { ThemeMode } from '../types';
import clsx from 'clsx';

export default function SettingsPage() {
  const { accessibility, theme, updateAccessibility, updateTheme } = useApp();

  const themeOptions: Array<{ value: ThemeMode; label: string; icon: typeof Sun }> = [
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Settings</h1>
        <p className="text-muted">Customize your MindCare accessibility and experience.</p>
      </div>

      {/* Theme */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5 text-primary" aria-hidden="true" />
          Appearance
        </h2>
        <div>
          <p className="text-sm text-muted mb-3">Theme Mode</p>
          <div className="flex gap-3">
            {themeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateTheme({ mode: opt.value })}
                className={clsx(
                  'flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200',
                  theme.mode === opt.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted hover:border-border-bright hover:text-text'
                )}
                aria-pressed={theme.mode === opt.value}
                aria-label={`${opt.label} theme`}
              >
                <opt.icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Eye className="w-5 h-5 text-secondary" aria-hidden="true" />
          Accessibility Center
        </h2>
        <AccessibilityPanel
          settings={accessibility}
          onUpdate={updateAccessibility}
        />
      </div>

      {/* About */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-white mb-4">About MindCare</h2>
        <div className="space-y-2 text-sm text-muted">
          <p><span className="text-text font-medium">Version:</span> 1.0.0 Production</p>
          <p><span className="text-text font-medium">Platform:</span> Gamified Cognitive Wellness</p>
          <p className="mt-3 p-4 rounded-xl bg-surface-elevated border border-border text-xs leading-relaxed text-muted-light">
            ⚠️ <strong>MindCare Wellness Notice:</strong> MindCare is an assistive cognitive wellness platform and is NOT a medical diagnostic system.
            It does not diagnose, treat, prevent, or cure any neurological disorder or medical condition.
            Always consult a qualified physician or healthcare professional for medical inquiries.
          </p>
        </div>
      </div>
    </div>
  );
}
