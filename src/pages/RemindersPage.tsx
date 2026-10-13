// src/pages/RemindersPage.tsx
import { useState, useCallback } from 'react';
import { Bell, Plus } from 'lucide-react';
import type { Reminder } from '../types';
import { storage } from '../services/storage';
import { ReminderCard } from '../components/dashboard/ReminderCard';
import { EmptyState } from '../components/ui/EmptyState';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(() => storage.getReminders() as Reminder[]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', time: '09:00', repeat: 'daily' as Reminder['repeat'] });

  const addReminder = useCallback((r: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newR: Reminder = { ...r, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setReminders(prev => {
      const next = [...prev, newR];
      storage.setReminders(next);
      return next;
    });
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders(prev => {
      const next = prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
      storage.setReminders(next);
      return next;
    });
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => {
      const next = prev.filter(r => r.id !== id);
      storage.setReminders(next);
      return next;
    });
  }, []);

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addReminder({ ...form, enabled: true });
    setForm({ title: '', time: '09:00', repeat: 'daily' });
    setShowForm(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Reminders</h1>
          <p className="text-muted">Set reminders for your daily cognitive wellness activities.</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-primary gap-2">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Add Reminder
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="glass-card p-6 animate-slide-up">
          <h2 className="text-lg font-bold text-white mb-4">New Reminder</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(v => ({ ...v, title: e.target.value }))}
              placeholder="Reminder title (e.g. Morning Brain Training)..."
              className="px-4 py-3 rounded-xl bg-surface-elevated border border-border text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
              aria-label="Reminder title"
            />
            <input
              type="time"
              value={form.time}
              onChange={e => setForm(v => ({ ...v, time: e.target.value }))}
              className="px-4 py-3 rounded-xl bg-surface-elevated border border-border text-text focus:outline-none focus:border-primary transition-colors"
              aria-label="Reminder time"
            />
            <select
              value={form.repeat}
              onChange={e => setForm(v => ({ ...v, repeat: e.target.value as Reminder['repeat'] }))}
              className="px-4 py-3 rounded-xl bg-surface-elevated border border-border text-text focus:outline-none focus:border-primary transition-colors"
              aria-label="Repeat frequency"
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="once">Once</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-primary">Save Reminder</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Reminders List */}
      {reminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map(r => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onToggle={toggleReminder}
              onDelete={deleteReminder}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No Reminders Yet"
          description="Add your first reminder to stay on track with your daily cognitive activities."
          actionLabel="Add Reminder"
          onAction={() => setShowForm(true)}
        />
      )}
    </div>
  );
}
