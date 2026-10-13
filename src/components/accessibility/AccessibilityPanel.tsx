// src/components/accessibility/AccessibilityPanel.tsx
import { ZoomIn, Eye, Activity, Volume2, VolumeX, Volume1 } from 'lucide-react';
import type { AccessibilitySettings } from '../../types';
import clsx from 'clsx';

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onUpdate: (settings: Partial<AccessibilitySettings>) => void;
}

export function AccessibilityPanel({ settings, onUpdate }: AccessibilityPanelProps) {
  return (
    <div className="space-y-6" aria-label="Accessibility settings panel">
      {/* Text Size */}
      <div>
        <p className="text-sm text-text font-medium mb-3 flex items-center gap-2">
          <ZoomIn className="w-4 h-4 text-muted" aria-hidden="true" />
          Text Size
        </p>
        <div className="flex gap-3">
          {(['normal', 'large', 'extra-large'] as const).map(size => (
            <button
              key={size}
              onClick={() => onUpdate({ textSize: size })}
              className={clsx(
                'px-4 py-2 rounded-xl border transition-all duration-200 capitalize text-sm font-semibold',
                settings.textSize === size
                  ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                  : 'border-border text-muted hover:border-border-bright hover:text-text'
              )}
              aria-pressed={settings.textSize === size}
            >
              {size === 'extra-large' ? 'Extra Large (XL)' : size === 'large' ? 'Large' : 'Normal'}
            </button>
          ))}
        </div>
      </div>

      {/* Contrast */}
      <div>
        <p className="text-sm text-text font-medium mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted" aria-hidden="true" />
          Contrast
        </p>
        <div className="flex gap-3">
          {(['standard', 'high'] as const).map(c => (
            <button
              key={c}
              onClick={() => onUpdate({ contrast: c })}
              className={clsx(
                'px-4 py-2 rounded-xl border transition-all duration-200 capitalize text-sm font-semibold',
                settings.contrast === c
                  ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                  : 'border-border text-muted hover:border-border-bright hover:text-text'
              )}
              aria-pressed={settings.contrast === c}
            >
              {c === 'high' ? 'High Contrast Mode' : 'Standard Contrast'}
            </button>
          ))}
        </div>
      </div>

      {/* Motion */}
      <div>
        <p className="text-sm text-text font-medium mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted" aria-hidden="true" />
          Motion & Animations
        </p>
        <div className="flex gap-3">
          {(['normal', 'reduced'] as const).map(m => (
            <button
              key={m}
              onClick={() => onUpdate({ motion: m })}
              className={clsx(
                'px-4 py-2 rounded-xl border transition-all duration-200 capitalize text-sm font-semibold',
                settings.motion === m
                  ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                  : 'border-border text-muted hover:border-border-bright hover:text-text'
              )}
              aria-pressed={settings.motion === m}
            >
              {m === 'reduced' ? 'Reduced Motion' : 'Full Animations'}
            </button>
          ))}
        </div>
      </div>

      {/* Sound */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-surface-elevated">
            {settings.soundEffects ? (
              <Volume2 className="w-5 h-5 text-primary" aria-hidden="true" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-sm text-text font-medium">Sound Effects</p>
            <p className="text-xs text-muted">Subtle non-harsh audio cues</p>
          </div>
        </div>
        <button
          onClick={() => onUpdate({ soundEffects: !settings.soundEffects })}
          className={`w-12 h-7 rounded-full transition-all duration-200 relative ${
            settings.soundEffects ? 'bg-primary' : 'bg-border'
          }`}
          aria-label={`${settings.soundEffects ? 'Disable' : 'Enable'} sound effects`}
          aria-pressed={settings.soundEffects}
        >
          <div
            className={`absolute top-1.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
              settings.soundEffects ? 'left-7' : 'left-1.5'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Read Aloud */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-surface-elevated">
            <Volume1 className="w-5 h-5 text-secondary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-text font-medium">Read Instructions Aloud</p>
            <p className="text-xs text-muted">Browser speech synthesis for elderly accessibility</p>
          </div>
        </div>
        <button
          onClick={() => onUpdate({ readAloud: !settings.readAloud })}
          className={`w-12 h-7 rounded-full transition-all duration-200 relative ${
            settings.readAloud ? 'bg-primary' : 'bg-border'
          }`}
          aria-label={`${settings.readAloud ? 'Disable' : 'Enable'} read aloud`}
          aria-pressed={settings.readAloud}
        >
          <div
            className={`absolute top-1.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
              settings.readAloud ? 'left-7' : 'left-1.5'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
