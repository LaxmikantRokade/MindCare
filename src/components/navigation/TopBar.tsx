// src/components/navigation/TopBar.tsx
import { Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';

export function TopBar() {
  const { user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b border-border lg:hidden"
        style={{ background: 'rgba(13, 20, 36, 0.95)', backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-xl text-muted-light hover:text-text hover:bg-surface-elevated transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="text-white font-bold">MindCare</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-xl text-muted-light hover:text-text hover:bg-surface-elevated transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          {user && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center text-xs font-bold text-primary">
              {user.avatar}
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden
          />
          <div className="relative w-72 flex flex-col">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-muted-light hover:text-text hover:bg-surface-elevated transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
