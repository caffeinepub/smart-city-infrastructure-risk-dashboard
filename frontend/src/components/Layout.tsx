import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X, BarChart3, Map, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { FilterProvider } from '../contexts/FilterContext';
import FilterPanel from './FilterPanel';
import { useAllInfrastructure } from '../hooks/useQueries';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/map', label: 'City Map', icon: Map },
  { to: '/budget', label: 'Budget', icon: DollarSign },
  { to: '/analytics', label: 'Analytics', icon: TrendingUp },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { data: infrastructure } = useAllInfrastructure();

  const areas = React.useMemo(() => {
    if (!infrastructure) return [];
    const areaSet = new Set(infrastructure.map(i => i.location.area));
    return Array.from(areaSet).sort();
  }, [infrastructure]);

  return (
    <FilterProvider>
      <div className="min-h-screen bg-background flex flex-col dark">
        {/* Top Navigation */}
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 z-50 sticky top-0">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/generated/app-logo-icon.dim_128x128.png"
              alt="Logo"
              className="w-7 h-7 rounded"
            />
            <span className="font-semibold text-sm text-teal hidden sm:block tracking-wide">
              SMART CITY
            </span>
            <span className="font-semibold text-sm text-foreground hidden md:block">
              Infrastructure Risk Dashboard
            </span>
          </Link>

          <div className="flex items-center gap-1 ml-4">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${
                    isActive
                      ? 'text-teal-500 bg-teal-glow font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon size={14} />
                  <span className="hidden sm:block">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Activity size={12} className="text-teal-500" />
              <span className="hidden sm:block">SYSTEM ONLINE</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'w-64' : 'w-0'
            } transition-all duration-300 overflow-hidden shrink-0 border-r border-border bg-sidebar`}
          >
            <div className="w-64 h-full overflow-y-auto">
              <FilterPanel areas={areas} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </FilterProvider>
  );
}
