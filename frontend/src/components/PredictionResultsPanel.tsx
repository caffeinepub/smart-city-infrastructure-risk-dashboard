import React from 'react';
import { PredictionResult } from '../backend';
import { getRiskLevelKey, getUrgencyLevelKey, formatCurrency, formatUrgencyLevel } from '../lib/utils';
import RiskBadge from './RiskBadge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown, Calendar, DollarSign, Wrench, Activity, ShieldCheck } from 'lucide-react';

interface PredictionResultsPanelProps {
  result: PredictionResult | null;
  isLoading?: boolean;
}

export default function PredictionResultsPanel({ result, isLoading }: PredictionResultsPanelProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-teal-500/30 bg-card p-5 space-y-4"
        style={{ boxShadow: '0 0 0 1px oklch(0.72 0.18 195 / 0.2), 0 4px 24px oklch(0.72 0.18 195 / 0.1)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Activity size={14} className="text-teal animate-pulse" />
          <span className="text-xs font-mono text-teal uppercase tracking-wider">Analyzing...</span>
        </div>
        <Skeleton className="h-6 w-32 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 rounded" />
          <Skeleton className="h-16 rounded" />
          <Skeleton className="h-16 rounded" />
          <Skeleton className="h-16 rounded" />
        </div>
      </div>
    );
  }

  if (!result) return null;

  const riskKey = getRiskLevelKey(result.riskLevel);
  const healthScore = Math.max(0, Math.min(100, Math.round((1 - result.riskScore) * 100)));
  const urgencyKey = getUrgencyLevelKey(result.budgetEstimate.urgencyLevel);
  const currentYear = new Date().getFullYear();
  const maintYear = currentYear + Number(result.maintenanceYear);

  return (
    <div
      className="rounded-lg border border-teal-500/30 bg-card p-5 space-y-4"
      style={{ boxShadow: '0 0 0 1px oklch(0.72 0.18 195 / 0.25), 0 4px 28px oklch(0.72 0.18 195 / 0.12)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-teal" />
          <span className="text-xs font-mono text-teal uppercase tracking-wider">Prediction Results</span>
        </div>
        <RiskBadge riskKey={riskKey} />
      </div>

      {/* Risk Score + Health */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-accent/30 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
          <div className={`text-2xl font-mono font-bold ${
            riskKey === 'high' ? 'text-red-400' : riskKey === 'moderate' ? 'text-amber-accent' : 'text-green-400'
          }`}>
            {(result.riskScore * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-accent/30 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Health Score</div>
          <div className="text-2xl font-mono font-bold text-green-400">{healthScore}%</div>
        </div>
      </div>

      {/* Health Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Structure Health</span>
          <span className="font-mono">{healthScore}%</span>
        </div>
        <Progress value={healthScore} className="h-2" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-accent/20 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown size={11} className="text-red-400" />
            <span className="text-xs text-muted-foreground">Deterioration Rate</span>
          </div>
          <div className="font-mono text-sm font-semibold text-red-400">
            {result.deteriorationRate.toFixed(5)}/yr
          </div>
        </div>

        <div className="bg-accent/20 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={11} className="text-amber-accent" />
            <span className="text-xs text-muted-foreground">Maintenance Year</span>
          </div>
          <div className="font-mono text-sm font-semibold text-amber-accent">{maintYear}</div>
        </div>

        <div className="bg-accent/20 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign size={11} className="text-teal" />
            <span className="text-xs text-muted-foreground">Est. Cost</span>
          </div>
          <div className="font-mono text-sm font-semibold text-teal">
            {formatCurrency(result.budgetEstimate.estimatedCost)}
          </div>
        </div>

        <div className="bg-accent/20 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-1.5 mb-1">
            <Wrench size={11} className={
              urgencyKey === 'immediateRepair' ? 'text-red-400' :
              urgencyKey === 'scheduledMaintenance' ? 'text-amber-accent' : 'text-green-400'
            } />
            <span className="text-xs text-muted-foreground">Urgency</span>
          </div>
          <div className={`font-mono text-xs font-semibold ${
            urgencyKey === 'immediateRepair' ? 'text-red-400' :
            urgencyKey === 'scheduledMaintenance' ? 'text-amber-accent' : 'text-green-400'
          }`}>
            {formatUrgencyLevel(urgencyKey)}
          </div>
        </div>
      </div>

      {/* Recommended Action */}
      <div className="bg-teal-500/5 border border-teal-500/20 rounded-lg p-3">
        <div className="text-xs text-muted-foreground mb-1">Recommended Action</div>
        <div className="text-sm font-medium text-teal">{result.budgetEstimate.recommendedAction}</div>
      </div>
    </div>
  );
}
