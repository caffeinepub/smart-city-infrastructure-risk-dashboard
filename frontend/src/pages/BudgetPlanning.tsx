import React from 'react';
import { useCityBudgetSummary, useAllInfrastructure } from '../hooks/useQueries';
import BudgetByRiskChart from '../components/BudgetByRiskChart';
import BudgetByTypeChart from '../components/BudgetByTypeChart';
import PriorityList from '../components/PriorityList';
import BudgetOptimization from '../components/BudgetOptimization';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '../lib/utils';
import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export default function BudgetPlanning() {
  const { data: budgetSummary, isLoading: budgetLoading } = useCityBudgetSummary();
  const { data: infrastructure, isLoading: infraLoading } = useAllInfrastructure();

  const isLoading = budgetLoading || infraLoading;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  const allInfra = infrastructure || [];
  const total = budgetSummary?.totalEstimatedBudget || 0;
  const breakdown = budgetSummary?.breakdownByRiskLevel || { low: 0, moderate: 0, high: 0 };
  const topStructures = budgetSummary?.topPriorityStructures || [];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-card">
        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-amber-accent" />
          <h1 className="font-semibold text-foreground">Budget Planning</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          City-wide infrastructure maintenance cost analysis and optimization
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Total Budget Hero */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-glow p-6 card-glow-amber">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Total Estimated Maintenance Budget
              </div>
              <div className="text-4xl font-mono font-bold text-amber-accent">
                {formatCurrency(total)}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Across {allInfra.length} infrastructure assets
              </div>
            </div>
            <div className="text-6xl opacity-20">💰</div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-background/30 rounded p-3">
              <div className="text-xs text-muted-foreground mb-1">High Risk Budget</div>
              <div className="font-mono font-bold text-red-400 text-lg">
                {formatCurrency(breakdown.high * 50000)}
              </div>
            </div>
            <div className="bg-background/30 rounded p-3">
              <div className="text-xs text-muted-foreground mb-1">Moderate Risk Budget</div>
              <div className="font-mono font-bold text-amber-accent text-lg">
                {formatCurrency(breakdown.moderate * 30000)}
              </div>
            </div>
            <div className="bg-background/30 rounded p-3">
              <div className="text-xs text-muted-foreground mb-1">Low Risk Budget</div>
              <div className="font-mono font-bold text-green-400 text-lg">
                {formatCurrency(breakdown.low * 10000)}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 card-glow">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-teal" />
              <h3 className="text-sm font-semibold">Budget by Risk Level</h3>
            </div>
            <BudgetByRiskChart
              low={breakdown.low * 10000}
              moderate={breakdown.moderate * 30000}
              high={breakdown.high * 50000}
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-4 card-glow">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={14} className="text-amber-accent" />
              <h3 className="text-sm font-semibold">Budget by Structure Type</h3>
            </div>
            <BudgetByTypeChart infrastructure={allInfra} />
          </div>
        </div>

        {/* Priority List */}
        <div className="rounded-lg border border-border bg-card p-4 card-glow">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={14} className="text-red-400" />
            <h3 className="text-sm font-semibold">Top Priority Structures</h3>
            <span className="text-xs text-muted-foreground ml-auto">Sorted by risk score</span>
          </div>
          <PriorityList structures={topStructures.length > 0 ? topStructures : allInfra} maxItems={10} />
        </div>

        {/* Budget Optimization */}
        <div className="rounded-lg border border-border bg-card p-4 card-glow">
          <BudgetOptimization structures={topStructures.length > 0 ? topStructures : allInfra} />
        </div>
      </div>
    </div>
  );
}
