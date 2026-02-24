import React from 'react';
import { Link } from '@tanstack/react-router';
import { Infrastructure } from '../backend';
import { getRiskLevelKey, getHealthScore } from '../lib/utils';
import AnimatedCounter from './AnimatedCounter';
import { AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  infrastructure: Infrastructure[];
  lastRefresh: Date;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function HeroSection({ infrastructure, lastRefresh, onRefresh, isLoading }: HeroSectionProps) {
  const total = infrastructure.length;
  const highRisk = infrastructure.filter(i => getRiskLevelKey(i.riskLevel) === 'high').length;
  const avgHealth = total > 0
    ? infrastructure.reduce((sum, i) => sum + getHealthScore(i.riskScore), 0) / total
    : 0;

  return (
    <div className="relative overflow-hidden">
      {/* Hero Banner */}
      <div
        className="relative h-48 sm:h-56 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1400x400.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-6 sm:px-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-teal uppercase tracking-widest border border-teal-500/30 px-2 py-0.5 rounded bg-teal-glow">
              Smart City Platform
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
            Infrastructure Risk Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Real-time monitoring · ML-powered predictions · Budget intelligence
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-mono font-bold text-teal">
              <AnimatedCounter target={total} />
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              <div>Total</div>
              <div>Structures</div>
            </div>
          </div>

          <div className="w-px h-8 bg-border" />

          <div className="flex items-center gap-3">
            <div className="text-3xl font-mono font-bold text-red-400">
              <AnimatedCounter target={highRisk} />
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              <div>High Risk</div>
              <div>Structures</div>
            </div>
          </div>

          <div className="w-px h-8 bg-border" />

          <div className="flex items-center gap-3">
            <div className="text-3xl font-mono font-bold text-green-400">
              <AnimatedCounter target={avgHealth} decimals={1} suffix="%" />
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              <div>Avg Health</div>
              <div>Score</div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Clock size={11} />
              {lastRefresh.toLocaleTimeString()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="h-7 text-xs gap-1.5 border-border hover:border-primary hover:text-primary"
            >
              <RefreshCw size={11} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Alert Banner */}
        {highRisk > 0 && (
          <div className="mt-3 flex items-center gap-3 bg-red-glow border border-red-500/30 rounded-lg px-4 py-2.5">
            <AlertTriangle size={16} className="text-red-400 shrink-0 live-pulse" />
            <span className="text-sm text-red-400 font-medium">
              {highRisk} structure{highRisk > 1 ? 's' : ''} require immediate attention
            </span>
            <Link
              to="/"
              className="ml-auto text-xs text-red-400 underline hover:text-red-300 shrink-0"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>

      {/* Quick Access Grid */}
      <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/', label: 'Infrastructure List', desc: 'Browse all structures', icon: '📋', color: 'border-teal-500/20 hover:border-teal-500/50' },
          { to: '/map', label: 'City Map', desc: 'GIS heatmap view', icon: '🗺️', color: 'border-blue-500/20 hover:border-blue-500/50' },
          { to: '/budget', label: 'Budget Planning', desc: 'Cost analysis & ROI', icon: '💰', color: 'border-amber-500/20 hover:border-amber-500/50' },
          { to: '/analytics', label: 'Analytics', desc: 'Trends & comparisons', icon: '📊', color: 'border-purple-500/20 hover:border-purple-500/50' },
        ].map(card => (
          <Link
            key={card.to}
            to={card.to}
            className={`rounded-lg border bg-card p-3 transition-all hover:bg-accent/30 hover:shadow-teal-glow group ${card.color}`}
          >
            <div className="text-2xl mb-1">{card.icon}</div>
            <div className="font-medium text-sm group-hover:text-teal transition-colors">{card.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{card.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
