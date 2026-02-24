import React from 'react';
import { useAllInfrastructure } from '../hooks/useQueries';
import AgeRiskScatterPlot from '../components/AgeRiskScatterPlot';
import AreaHealthChart from '../components/AreaHealthChart';
import HealthDistributionHistogram from '../components/HealthDistributionHistogram';
import InfrastructureComparison from '../components/InfrastructureComparison';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, BarChart2, GitCompare } from 'lucide-react';

export default function Analytics() {
  const { data: infrastructure, isLoading } = useAllInfrastructure();
  const allInfra = infrastructure || [];

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-72 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-card">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-teal" />
          <h1 className="font-semibold text-foreground">Analytics & Comparison</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Deterioration trends, area health analysis, and side-by-side comparisons
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 card-glow">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={14} className="text-teal" />
              <h3 className="text-sm font-semibold">Age vs Risk Score</h3>
              <span className="text-xs text-muted-foreground ml-auto">
                <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-1" />Bridges
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ml-2 mr-1" />Roads
              </span>
            </div>
            <AgeRiskScatterPlot infrastructure={allInfra} />
          </div>

          <div className="rounded-lg border border-border bg-card p-4 card-glow">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={14} className="text-amber-accent" />
              <h3 className="text-sm font-semibold">Average Health Score by Area</h3>
            </div>
            <AreaHealthChart infrastructure={allInfra} />
          </div>
        </div>

        {/* Health Distribution */}
        <div className="rounded-lg border border-border bg-card p-4 card-glow">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={14} className="text-teal" />
            <h3 className="text-sm font-semibold">Health Score Distribution</h3>
            <span className="text-xs text-muted-foreground ml-auto">
              {allInfra.length} structures across 5 health bands
            </span>
          </div>
          <HealthDistributionHistogram infrastructure={allInfra} />
        </div>

        {/* Comparison */}
        <div className="rounded-lg border border-border bg-card p-4 card-glow">
          <div className="flex items-center gap-2 mb-4">
            <GitCompare size={14} className="text-teal" />
            <h3 className="text-sm font-semibold">Infrastructure Comparison</h3>
            <span className="text-xs text-muted-foreground ml-auto">Compare up to 3 structures</span>
          </div>
          <InfrastructureComparison />
        </div>
      </div>
    </div>
  );
}
