// src/components/dashboard/ReminderCard.tsx
import { Bell, Clock, Trash2 } from 'lucide-react';
import type { Reminder } from '../../types';

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ReminderCard({ reminder, onToggle, onDelete }: ReminderCardProps) {
  return (
    <div
      className={`glass-card p-5 flex items-center gap-4 border-2 transition-all duration-200 ${
        reminder.enabled ? 'border-border hover:border-border-bright' : 'border-border opacity-60'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          reminder.enabled ? 'bg-primary/10' : 'bg-surface-elevated'
        }`}
      >
        <Bell className={`w-6 h-6 ${reminder.enabled ? 'text-primary' : 'text-muted'}`} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text font-semibold">{reminder.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="w-3 h-3 text-muted" aria-hidden="true" />
          <p className="text-muted text-xs">{reminder.time} · <span className="capitalize">{reminder.repeat}</span></p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle(reminder.id)}
          className={`w-10 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${
            reminder.enabled ? 'bg-primary' : 'bg-border'
          }`}
          aria-label={`${reminder.enabled ? 'Disable' : 'Enable'} reminder: ${reminder.title}`}
          aria-pressed={reminder.enabled}
        >
          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
              reminder.enabled ? 'left-5' : 'left-1'
            }`}
            aria-hidden="true"
          />
        </button>
        <button
          onClick={() => onDelete(reminder.id)}
          className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          aria-label={`Delete reminder: ${reminder.title}`}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
