import React from 'react';
import { useAllInfrastructure } from '../hooks/useQueries';
import { useFilters } from '../contexts/FilterContext';
import InfrastructureMap from '../components/InfrastructureMap';
import { Skeleton } from '@/components/ui/skeleton';
import { Map, Layers } from 'lucide-react';

export default function MapView() {
  const { data: infrastructure, isLoading } = useAllInfrastructure();
  const { filterInfrastructure } = useFilters();

  const allInfra = infrastructure || [];
  const filtered = filterInfrastructure(allInfra);

  const highCount = filtered.filter(i => {
    const rl = i.riskLevel as unknown as Record<string, null>;
    return Object.keys(rl)[0] === 'high';
  }).length;

  const moderateCount = filtered.filter(i => {
    const rl = i.riskLevel as unknown as Record<string, null>;
    return Object.keys(rl)[0] === 'moderate';
  }).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map size={18} className="text-teal" />
            <h1 className="font-semibold text-foreground">City Infrastructure Map</h1>
            <span className="font-mono text-xs text-teal bg-teal-glow border border-teal-500/20 px-2 py-0.5 rounded">
              {filtered.length} structures
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              High ({highCount})
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Moderate ({moderateCount})
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
              Low ({filtered.length - highCount - moderateCount})
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {/* Map placeholder image while loading */}
        {isLoading ? (
          <div
            className="rounded-lg overflow-hidden border border-border"
            style={{ height: '500px', backgroundImage: 'url(/assets/generated/heatmap-placeholder.dim_600x400.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="w-full h-full bg-background/70 flex items-center justify-center">
              <div className="flex items-center gap-2 text-teal font-mono text-sm">
                <Layers size={16} className="animate-pulse" />
                Loading map data...
              </div>
            </div>
          </div>
        ) : (
          <InfrastructureMap infrastructure={filtered} height="500px" />
        )}

        {/* Legend */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} className="text-teal" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Map Legend</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-red-500 bg-red-500/10 flex items-center justify-center text-sm">🌉</div>
              <span className="text-muted-foreground">High Risk Bridge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-amber-500 bg-amber-500/10 flex items-center justify-center text-sm">🛣️</div>
              <span className="text-muted-foreground">Moderate Risk Road</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-green-500/10 flex items-center justify-center text-sm">🌉</div>
              <span className="text-muted-foreground">Low Risk Bridge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded opacity-70" />
              <span className="text-muted-foreground">Heatmap Intensity</span>
            </div>
          </div>
        </div>

        {/* City illustration */}
        <div className="rounded-lg overflow-hidden border border-border relative h-32 bg-card">
          <img
            src="/assets/generated/city-infrastructure-iso.dim_800x500.png"
            alt="City Infrastructure"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-muted-foreground font-mono">
              Smart City Infrastructure Network · {filtered.length} monitored assets
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
