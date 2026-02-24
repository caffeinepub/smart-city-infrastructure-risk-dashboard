import React from 'react';
import { Infrastructure } from '../backend';
import { getRiskLevelKey, getHealthScore } from '../lib/utils';
import AnimatedCounter from './AnimatedCounter';
import { AlertTriangle, CheckCircle, Activity, Building2 } from 'lucide-react';

interface SummaryStatsProps {
  infrastructure: Infrastructure[];
}

export default function SummaryStats({ infrastructure }: SummaryStatsProps) {
  const total = infrastructure.length;
  const highCount = infrastructure.filter(i => getRiskLevelKey(i.riskLevel) === 'high').length;
  const moderateCount = infrastructure.filter(i => getRiskLevelKey(i.riskLevel) === 'moderate').length;
  const lowCount = infrastructure.filter(i => getRiskLevelKey(i.riskLevel) === 'low').length;
  const avgHealth = total > 0
    ? infrastructure.reduce((sum, i) => sum + getHealthScore(i.riskScore), 0) / total
    : 0;

  const stats = [
    {
      label: 'Total Structures',
      value: total,
      icon: Building2,
      color: 'text-teal',
      bg: 'bg-teal-glow',
      border: 'border-teal-500/20',
    },
    {
      label: 'High Risk',
      value: highCount,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-glow',
      border: 'border-red-500/20',
    },
    {
      label: 'Moderate Risk',
      value: moderateCount,
      icon: Activity,
      color: 'text-amber-accent',
      bg: 'bg-amber-glow',
      border: 'border-amber-500/20',
    },
    {
      label: 'Low Risk',
      value: lowCount,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      border: 'border-green-500/20',
    },
    {
      label: 'Avg Health Score',
      value: avgHealth,
      suffix: '%',
      decimals: 1,
      icon: Activity,
      color: 'text-teal',
      bg: 'bg-teal-glow',
      border: 'border-teal-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`rounded-lg border ${stat.border} ${stat.bg} p-3 card-glow`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <Icon size={14} className={stat.color} />
            </div>
            <div className={`text-2xl font-mono font-bold ${stat.color}`}>
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals || 0}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
