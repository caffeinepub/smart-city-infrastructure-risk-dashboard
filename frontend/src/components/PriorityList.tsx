import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Infrastructure } from '../backend';
import { getRiskLevelKey, getStructureTypeKey, formatStructureType, formatCurrency, getHealthScore } from '../lib/utils';
import RiskBadge from './RiskBadge';
import { ExternalLink, AlertTriangle } from 'lucide-react';

interface PriorityListProps {
  structures: Infrastructure[];
  maxItems?: number;
}

function estimateCost(infra: Infrastructure): number {
  const riskKey = getRiskLevelKey(infra.riskLevel);
  const baseCost = getStructureTypeKey(infra.structureType) === 'bridge' ? 150000 : 50000;
  const riskMultiplier = riskKey === 'high' ? 2.5 : riskKey === 'moderate' ? 1.5 : 1.0;
  return baseCost * riskMultiplier * (Number(infra.age) / 20.0);
}

function getRecommendedAction(riskKey: string): string {
  const map: Record<string, string> = {
    high: 'Immediate Repair',
    moderate: 'Schedule Maintenance',
    low: 'Monitor Only',
  };
  return map[riskKey] || 'Monitor Only';
}

export default function PriorityList({ structures, maxItems = 10 }: PriorityListProps) {
  const navigate = useNavigate();
  const sorted = [...structures]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, maxItems);

  return (
    <div className="space-y-2">
      {sorted.map((infra, idx) => {
        const riskKey = getRiskLevelKey(infra.riskLevel);
        const cost = estimateCost(infra);
        const action = getRecommendedAction(riskKey);
        const typeKey = getStructureTypeKey(infra.structureType);

        return (
          <div
            key={infra.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/30 ${
              riskKey === 'high'
                ? 'border-red-500/20 bg-red-glow'
                : riskKey === 'moderate'
                ? 'border-amber-500/20 bg-amber-glow'
                : 'border-border bg-accent/20'
            }`}
            onClick={() => navigate({ to: '/infrastructure/$id', params: { id: infra.id } })}
          >
            <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-mono font-bold text-muted-foreground shrink-0">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{infra.name}</span>
                <RiskBadge riskKey={riskKey} size="sm" />
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {formatStructureType(typeKey)} · {infra.location.area} · Age: {Number(infra.age)}y
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-mono text-sm font-bold text-amber-accent">{formatCurrency(cost)}</div>
              <div className="text-xs text-muted-foreground">{action}</div>
            </div>
            <ExternalLink size={13} className="text-muted-foreground shrink-0" />
          </div>
        );
      })}
    </div>
  );
}
