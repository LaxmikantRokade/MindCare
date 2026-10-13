// src/components/navigation/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Gamepad2, Trophy, BarChart2, Star,
  Bell, User, Settings, LogOut, Brain, Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { XPBar } from '../ui/XPBar';
import { getXPProgress } from '../../utils/xp';
import clsx from 'clsx';

interface SidebarProps {
  caregiverMode?: boolean;
}

const userNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/games', icon: Gamepad2, label: 'Games' },
  { to: '/quests', icon: Trophy, label: 'Daily Quests' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
  { to: '/achievements', icon: Star, label: 'Achievements' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const caregiverNavItems = [
  { to: '/caregiver', icon: Shield, label: 'Overview' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ caregiverMode = false }: SidebarProps) {
  const { user, playerStats, logout } = useApp();
  const navigate = useNavigate();
  const xpProgress = getXPProgress(playerStats);
  const navItems = caregiverMode ? caregiverNavItems : userNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-none">MindCare</h1>
          <p className="text-muted text-xs mt-0.5">Cognitive Wellness</p>
        </div>
      </div>

      {/* Player Stats (user mode only) */}
      {!caregiverMode && user && (
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-text font-semibold text-sm truncate">{user.name}</p>
              <p className="text-muted text-xs">Level {playerStats.level} • {playerStats.streak}🔥</p>
            </div>
          </div>
          <XPBar current={xpProgress.current} max={xpProgress.max} level={playerStats.level} />
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Main navigation">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/caregiver'}
                className={({ isActive }) => clsx(
                  'nav-item w-full',
                  isActive && 'active'
                )}
                aria-label={item.label}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="nav-item w-full text-danger hover:text-danger hover:bg-danger/10"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
