// src/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { MobileNav } from '../components/navigation/MobileNav';
import { TopBar } from '../components/navigation/TopBar';

interface MainLayoutProps {
  caregiverMode?: boolean;
}

export function MainLayout({ caregiverMode = false }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        <Sidebar caregiverMode={caregiverMode} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <TopBar />
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile nav */}
      <MobileNav caregiverMode={caregiverMode} />
    </div>
  );
}
