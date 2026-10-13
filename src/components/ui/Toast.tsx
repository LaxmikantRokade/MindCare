// src/components/ui/Toast.tsx
import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const icons = { success: CheckCircle, error: AlertCircle, info: Info };
const colors = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-danger/30 bg-danger/10 text-danger',
  info: 'border-primary/30 bg-primary/10 text-primary',
};

export function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const Icon = icons[type];

  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-card backdrop-blur-md animate-slide-up',
        colors[type]
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
      <p className="text-sm font-medium text-text flex-1">{message}</p>
      <button onClick={onClose} className="flex-shrink-0 hover:opacity-70 transition-opacity" aria-label="Dismiss">
        <X className="w-4 h-4 text-muted" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onRemove }: {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-full">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => onRemove(t.id)} />
      ))}
    </div>
  );
}
