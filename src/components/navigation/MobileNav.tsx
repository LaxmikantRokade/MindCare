// src/components/navigation/MobileNav.tsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, Trophy, BarChart2, User, Shield } from 'lucide-react';
import clsx from 'clsx';

interface MobileNavProps {
  caregiverMode?: boolean;
}

const userTabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/games', icon: Gamepad2, label: 'Games' },
  { to: '/quests', icon: Trophy, label: 'Quests' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const caregiverTabs = [
  { to: '/caregiver', icon: Shield, label: 'Overview' },
  { to: '/settings', icon: User, label: 'Settings' },
];

export function MobileNav({ caregiverMode = false }: MobileNavProps) {
  const tabs = caregiverMode ? caregiverTabs : userTabs;

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border"
      style={{ background: 'rgba(13, 20, 36, 0.95)', backdropFilter: 'blur(12px)' }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/caregiver'}
            className={({ isActive }) => clsx(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[56px]',
              isActive
                ? 'text-primary'
                : 'text-muted-light hover:text-text'
            )}
            aria-label={tab.label}
          >
            {({ isActive }) => (
              <>
                <div className={clsx(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200',
                  isActive && 'bg-primary/10'
                )}>
                  <tab.icon className="w-5 h-5" aria-hidden />
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
