import React, { useState } from 'react';
import { useAllInfrastructure } from '../hooks/useQueries';
import { useFilters } from '../contexts/FilterContext';
import SummaryStats from '../components/SummaryStats';
import InfrastructureTable from '../components/InfrastructureTable';
import HeroSection from '../components/HeroSection';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { data: infrastructure, isLoading, refetch, dataUpdatedAt } = useAllInfrastructure();
  const { filterInfrastructure } = useFilters();
  const [lastRefresh] = useState(new Date());

  const allInfra = infrastructure || [];
  const filtered = filterInfrastructure(allInfra);

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <HeroSection
        infrastructure={allInfra}
        lastRefresh={dataUpdatedAt ? new Date(dataUpdatedAt) : lastRefresh}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="p-6 space-y-4">
        <SummaryStats infrastructure={filtered} />

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Infrastructure Records
            <span className="ml-2 font-mono text-teal">[{filtered.length}]</span>
          </h2>
        </div>

        <InfrastructureTable infrastructure={filtered} />
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Smart City Infrastructure Risk Dashboard · Built with{' '}
        <span className="text-red-400">♥</span> using{' '}
        <a
          href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'smart-city-risk-dashboard')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
