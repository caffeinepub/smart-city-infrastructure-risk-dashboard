import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useInfrastructureById, usePredictions, useBudgetEstimate } from '../hooks/useQueries';
import { useSensorSimulation } from '../hooks/useSensorSimulation';
import RiskGauge from '../components/RiskGauge';
import ConditionChart from '../components/ConditionChart';
import InfrastructureEditForm from '../components/InfrastructureEditForm';
import SensorSimulation from '../components/SensorSimulation';
import RiskBadge from '../components/RiskBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  getRiskLevelKey, getStructureTypeKey, getMaterialTypeKey,
  formatStructureType, formatMaterialType, formatCurrency,
  getHealthScore, formatUrgencyLevel, getUrgencyLevelKey
} from '../lib/utils';
import {
  ArrowLeft, ChevronDown, ChevronUp, MapPin, Calendar,
  Activity, Wrench, TrendingDown, DollarSign, Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InfrastructureDetail() {
  const { id } = useParams({ from: '/infrastructure/$id' });
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  const { data: infra, isLoading: infraLoading } = useInfrastructureById(id);
  const { data: predictions, isLoading: predLoading } = usePredictions(id);
  const { data: budget, isLoading: budgetLoading } = useBudgetEstimate(id);

  const simulation = useSensorSimulation({
    initialConditionRating: infra?.structuralConditionRating || 3.0,
    initialTrafficLoad: infra?.trafficLoadFactor || 0.5,
    age: Number(infra?.age || 0),
    environmentalExposureFactor: infra?.environmentalExposureFactor || 0.5,
  });

  if (infraLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48 rounded" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!infra) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Infrastructure record not found.
        <Button variant="link" onClick={() => navigate({ to: '/' })}>Go back</Button>
      </div>
    );
  }

  const riskKey = getRiskLevelKey(infra.riskLevel);
  const typeKey = getStructureTypeKey(infra.structureType);
  const materialKey = getMaterialTypeKey(infra.materialType);
  const health = getHealthScore(infra.riskScore);
  const currentYear = new Date().getFullYear();
  const maintYear = currentYear + Number(infra.age);

  // Use simulated values when active
  const displayRiskScore = simulation.isActive ? simulation.simValues.riskScore : infra.riskScore;
  const displayHealth = simulation.isActive ? simulation.simValues.healthScore : health;
  const displayCondition = simulation.isActive ? simulation.simValues.conditionRating : infra.structuralConditionRating;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8"
          >
            <ArrowLeft size={14} />
            Back
          </Button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <span className={`text-lg ${typeKey === 'bridge' ? 'text-teal' : 'text-amber-accent'}`}>
              {typeKey === 'bridge' ? '🌉' : '🛣️'}
            </span>
            <h1 className="font-semibold text-foreground">{infra.name}</h1>
            <RiskBadge riskKey={riskKey} />
            {simulation.isActive && (
              <span className="text-xs font-mono text-teal bg-teal-glow border border-teal-500/30 px-2 py-0.5 rounded live-pulse">
                SIMULATED
              </span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin size={12} />
            {infra.location.area}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Risk Gauge */}
          <div className="rounded-lg border border-border bg-card p-4 card-glow flex flex-col items-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Risk Assessment</div>
            <RiskGauge riskScore={displayRiskScore} size={180} />
            <RiskBadge riskKey={riskKey} />
          </div>

          {/* Health Score */}
          <div className="rounded-lg border border-border bg-card p-4 card-glow">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Health Score</div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-mono font-bold text-green-400">
                {Math.round(displayHealth)}
              </span>
              <span className="text-lg text-muted-foreground mb-1">%</span>
            </div>
            <Progress value={displayHealth} className="h-3 mb-4" />
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Condition Rating</span>
                <span className="text-teal">{displayCondition.toFixed(2)} / 5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Structure Type</span>
                <span>{formatStructureType(typeKey)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Material</span>
                <span>{formatMaterialType(materialKey)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age</span>
                <span>{Number(infra.age)} years</span>
              </div>
            </div>
          </div>

          {/* Budget Estimate */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-glow p-4 card-glow-amber">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Budget Estimate</div>
            {budgetLoading ? (
              <Skeleton className="h-20 rounded" />
            ) : budget ? (
              <>
                <div className="text-3xl font-mono font-bold text-amber-accent mb-1">
                  {formatCurrency(budget.estimatedCost)}
                </div>
                <div className="text-xs text-muted-foreground mb-3">Estimated maintenance cost</div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Urgency</span>
                    <span className={
                      getUrgencyLevelKey(budget.urgencyLevel) === 'immediateRepair'
                        ? 'text-red-400'
                        : getUrgencyLevelKey(budget.urgencyLevel) === 'scheduledMaintenance'
                        ? 'text-amber-accent'
                        : 'text-green-400'
                    }>
                      {formatUrgencyLevel(getUrgencyLevelKey(budget.urgencyLevel))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Action</span>
                    <span className="text-right max-w-[120px]">{budget.recommendedAction}</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Engineering Parameters */}
        <div className="rounded-lg border border-border bg-card p-4 card-glow">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-teal" />
            <h3 className="text-sm font-semibold">Engineering Parameters</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Age', value: `${Number(infra.age)}y`, color: 'text-foreground' },
              { label: 'Traffic Load', value: `${(infra.trafficLoadFactor * 100).toFixed(0)}%`, color: 'text-amber-accent' },
              { label: 'Env. Exposure', value: `${(infra.environmentalExposureFactor * 100).toFixed(0)}%`, color: 'text-orange-400' },
              { label: 'Condition', value: `${infra.structuralConditionRating.toFixed(1)}/5`, color: 'text-teal' },
              { label: 'Latitude', value: infra.location.latitude.toFixed(4), color: 'text-muted-foreground' },
              { label: 'Longitude', value: infra.location.longitude.toFixed(4), color: 'text-muted-foreground' },
            ].map(param => (
              <div key={param.label} className="bg-accent/30 rounded p-3">
                <div className="text-xs text-muted-foreground mb-1">{param.label}</div>
                <div className={`font-mono font-semibold text-sm ${param.color}`}>{param.value}</div>
              </div>
            ))}
          </div>
          {infra.notes && (
            <div className="mt-3 text-xs text-muted-foreground bg-accent/20 rounded p-2">
              <span className="font-semibold text-foreground">Notes: </span>{infra.notes}
            </div>
          )}
        </div>

        {/* Predictions & Deterioration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 card-glow">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={14} className="text-teal" />
              <h3 className="text-sm font-semibold">Condition Deterioration Forecast</h3>
            </div>
            {predLoading ? (
              <Skeleton className="h-48 rounded" />
            ) : predictions ? (
              <ConditionChart
                currentRating={infra.structuralConditionRating}
                rating5={predictions.futureConditionRatings.rating5}
                rating10={predictions.futureConditionRatings.rating10}
                rating20={predictions.futureConditionRatings.rating20}
                currentYear={currentYear}
              />
            ) : null}
          </div>

          <div className="rounded-lg border border-border bg-card p-4 card-glow">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-amber-accent" />
              <h3 className="text-sm font-semibold">Maintenance Forecast</h3>
            </div>
            {predLoading ? (
              <Skeleton className="h-48 rounded" />
            ) : predictions ? (
              <div className="space-y-4">
                <div className="bg-amber-glow border border-amber-500/20 rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-1">Predicted Maintenance Year</div>
                  <div className="text-3xl font-mono font-bold text-amber-accent">{maintYear}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    In ~{Number(infra.age)} years from now
                  </div>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Deterioration Rate</span>
                    <span className="text-red-400 font-semibold">{predictions.deteriorationRate.toFixed(5)}/yr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rating in 5 years</span>
                    <span className={predictions.futureConditionRatings.rating5 < 3 ? 'text-red-400' : 'text-teal'}>
                      {Math.max(0, predictions.futureConditionRatings.rating5).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rating in 10 years</span>
                    <span className={predictions.futureConditionRatings.rating10 < 3 ? 'text-red-400' : 'text-teal'}>
                      {Math.max(0, predictions.futureConditionRatings.rating10).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rating in 20 years</span>
                    <span className={predictions.futureConditionRatings.rating20 < 3 ? 'text-red-400' : 'text-teal'}>
                      {Math.max(0, predictions.futureConditionRatings.rating20).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Sensor Simulation */}
        <SensorSimulation
          isActive={simulation.isActive}
          onToggle={simulation.toggle}
          onStop={simulation.stop}
          conditionRating={simulation.simValues.conditionRating}
          trafficLoad={simulation.simValues.trafficLoad}
          riskScore={simulation.simValues.riskScore}
          healthScore={simulation.simValues.healthScore}
          lastUpdated={simulation.simValues.lastUpdated}
        />

        {/* Edit Form */}
        <Collapsible open={editOpen} onOpenChange={setEditOpen}>
          <div className="rounded-lg border border-border bg-card overflow-hidden card-glow">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-2">
                  <Edit3 size={14} className="text-teal" />
                  <span className="text-sm font-semibold">Edit Parameters</span>
                  <span className="text-xs text-muted-foreground">Update engineering data & recalculate risk</span>
                </div>
                {editOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-4 border-t border-border">
                <InfrastructureEditForm
                  infrastructure={infra}
                  onSuccess={() => setEditOpen(false)}
                />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
