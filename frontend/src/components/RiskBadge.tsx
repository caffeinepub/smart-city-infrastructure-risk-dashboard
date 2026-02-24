import React from 'react';
import { cn } from '../lib/utils';

interface RiskBadgeProps {
  riskKey: string;
  size?: 'sm' | 'md';
}

export default function RiskBadge({ riskKey, size = 'md' }: RiskBadgeProps) {
  const config = {
    high: { label: 'HIGH', className: 'bg-red-glow text-red-400 border border-red-500/30' },
    moderate: { label: 'MOD', className: 'bg-amber-glow text-amber-accent border border-amber-500/30' },
    low: { label: 'LOW', className: 'bg-green-900/20 text-green-400 border border-green-500/30' },
  };

  const c = config[riskKey as keyof typeof config] || config.low;

  return (
    <span
      className={cn(
        'font-mono font-semibold rounded tracking-wider uppercase',
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5',
        c.className
      )}
    >
      {c.label}
    </span>
  );
}
