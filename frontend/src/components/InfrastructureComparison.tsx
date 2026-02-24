import React, { useState } from 'react';
import { useAllInfrastructure, useBudgetEstimate, usePredictions } from '../hooks/useQueries';
import { getRiskLevelKey, getStructureTypeKey, formatStructureType, formatMaterialType, getMaterialTypeKey, formatCurrency, getHealthScore, formatMaintenanceYear, getUrgencyLevelKey, formatUrgencyLevel } from '../lib/utils';
import RiskBadge from './RiskBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

function ComparisonColumn({ id }: { id: string }) {
  const { data: infra } = useAllInfrastructure();
  const { data: budget } = useBudgetEstimate(id);
  const { data: predictions } = usePredictions(id);
  const item = infra?.find(i => i.id === id);

  if (!item) return <td className="p-3 text-center text-muted-foreground text-sm">Loading...</td>;

  const riskKey = getRiskLevelKey(item.riskLevel);
  const health = getHealthScore(item.riskScore);
  const currentYear = new Date().getFullYear();
  const maintYear = currentYear + Number(item.age);

  return (
    <td className="p-3 border-l border-border">
      <div className="space-y-2 text-sm">
        <div className="font-semibold text-teal">{item.name}</div>
        <div className="text-xs text-muted-foreground">{item.location.area}</div>
        <div><RiskBadge riskKey={riskKey} size="sm" /></div>
        <div className="font-mono text-xs space-y-1 mt-2">
          <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span>{formatStructureType(getStructureTypeKey(item.structureType))}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Age</span><span>{Number(item.age)}y</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Risk Score</span><span style={{ color: riskKey === 'high' ? '#ef4444' : riskKey === 'moderate' ? '#f59e0b' : '#22c55e' }}>{(item.riskScore * 100).toFixed(1)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Health</span><span className="text-green-400">{health}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Material</span><span>{formatMaterialType(getMaterialTypeKey(item.materialType))}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Condition</span><span>{item.structuralConditionRating.toFixed(1)}/5</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Traffic Load</span><span>{(item.trafficLoadFactor * 100).toFixed(0)}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Env. Exposure</span><span>{(item.environmentalExposureFactor * 100).toFixed(0)}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Maint. Year</span><span className="text-amber-accent">{maintYear}</span></div>
          {predictions && (
            <>
              <div className="flex justify-between"><span className="text-muted-foreground">Rating +5yr</span><span>{predictions.futureConditionRatings.rating5.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rating +10yr</span><span>{predictions.futureConditionRatings.rating10.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Deteri. Rate</span><span>{predictions.deteriorationRate.toFixed(4)}/yr</span></div>
            </>
          )}
          {budget && (
            <>
              <div className="flex justify-between"><span className="text-muted-foreground">Est. Cost</span><span className="text-amber-accent">{formatCurrency(budget.estimatedCost)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Action</span><span className="text-xs">{budget.recommendedAction}</span></div>
            </>
          )}
        </div>
      </div>
    </td>
  );
}

export default function InfrastructureComparison() {
  const { data: infrastructure } = useAllInfrastructure();
  const [selected, setSelected] = useState<string[]>([]);

  const addStructure = (id: string) => {
    if (selected.length < 3 && !selected.includes(id)) {
      setSelected(prev => [...prev, id]);
    }
  };

  const removeStructure = (id: string) => {
    setSelected(prev => prev.filter(s => s !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Select onValueChange={addStructure} value="">
          <SelectTrigger className="w-64 h-8 text-xs bg-accent border-border">
            <SelectValue placeholder="Add structure to compare..." />
          </SelectTrigger>
          <SelectContent>
            {infrastructure?.filter(i => !selected.includes(i.id)).map(i => (
              <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">Select up to 3 structures</span>
        {selected.map(id => {
          const item = infrastructure?.find(i => i.id === id);
          return (
            <div key={id} className="flex items-center gap-1 bg-teal-glow border border-teal-500/30 rounded px-2 py-1 text-xs text-teal">
              {item?.name}
              <button onClick={() => removeStructure(id)} className="ml-1 hover:text-red-400">
                <X size={10} />
              </button>
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="rounded-lg border border-border overflow-x-auto card-glow">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="p-3 text-left text-xs text-muted-foreground uppercase tracking-wider w-32">Metric</th>
                {selected.map(id => {
                  const item = infrastructure?.find(i => i.id === id);
                  return (
                    <th key={id} className="p-3 text-left border-l border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-teal font-semibold">{item?.name}</span>
                        <button onClick={() => removeStructure(id)} className="text-muted-foreground hover:text-red-400">
                          <X size={12} />
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 text-xs text-muted-foreground align-top">Details</td>
                {selected.map(id => <ComparisonColumn key={id} id={id} />)}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selected.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
          Select structures above to compare them side-by-side
        </div>
      )}
    </div>
  );
}
