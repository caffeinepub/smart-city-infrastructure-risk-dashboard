import React from 'react';
import { Infrastructure } from '../backend';
import { getRiskLevelKey, getStructureTypeKey, formatStructureType, formatCurrency } from '../lib/utils';
import { Zap, TrendingDown } from 'lucide-react';

interface BudgetOptimizationProps {
  structures: Infrastructure[];
}

function estimateCost(infra: Infrastructure): number {
  const riskKey = getRiskLevelKey(infra.riskLevel);
  const baseCost = getStructureTypeKey(infra.structureType) === 'bridge' ? 150000 : 50000;
  const riskMultiplier = riskKey === 'high' ? 2.5 : riskKey === 'moderate' ? 1.5 : 1.0;
  return baseCost * riskMultiplier * (Number(infra.age) / 20.0);
}

export default function BudgetOptimization({ structures }: BudgetOptimizationProps) {
  const withROI = structures
    .map(infra => {
      const cost = estimateCost(infra);
      const roi = cost > 0 ? (infra.riskScore * 100) / (cost / 10000) : 0;
      return { infra, cost, roi };
    })
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-amber-accent uppercase tracking-wider font-semibold">
        <Zap size={12} />
        Top ROI Targets — Highest Risk Reduction per Dollar
      </div>
      {withROI.map(({ infra, cost, roi }, idx) => {
        const riskKey = getRiskLevelKey(infra.riskLevel);
        const typeKey = getStructureTypeKey(infra.structureType);
        return (
          <div
            key={infra.id}
            className="rounded-lg border border-amber-500/30 bg-amber-glow p-4 card-glow-amber"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-amber-accent font-bold">#{idx + 1}</span>
                  <span className="font-semibold text-sm">{infra.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatStructureType(typeKey)} · {infra.location.area} · Risk: {(infra.riskScore * 100).toFixed(1)}
                </div>
                <div className="mt-2 text-xs text-foreground/80">
                  <TrendingDown size={10} className="inline mr-1 text-amber-accent" />
                  Addressing this structure reduces {(infra.riskScore * 100).toFixed(0)} risk points at {formatCurrency(cost)}.
                  Estimated ROI index: <span className="font-mono text-amber-accent">{roi.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-lg font-bold text-amber-accent">{formatCurrency(cost)}</div>
                <div className="text-xs text-muted-foreground">Est. Cost</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
