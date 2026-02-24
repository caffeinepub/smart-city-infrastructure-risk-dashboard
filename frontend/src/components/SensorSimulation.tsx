import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Activity, Wifi } from 'lucide-react';

interface SensorSimulationProps {
  isActive: boolean;
  onToggle: () => void;
  onStop: () => void;
  conditionRating: number;
  trafficLoad: number;
  riskScore: number;
  healthScore: number;
  lastUpdated: Date;
}

export default function SensorSimulation({
  isActive,
  onToggle,
  conditionRating,
  trafficLoad,
  riskScore,
  healthScore,
  lastUpdated,
}: SensorSimulationProps) {
  const riskColor = riskScore * 100 >= 67 ? '#ef4444' : riskScore * 100 >= 34 ? '#f59e0b' : '#22c55e';

  return (
    <div className={`rounded-lg border p-4 space-y-4 transition-all ${
      isActive
        ? 'border-teal-500/40 bg-teal-glow card-glow'
        : 'border-border bg-accent/30'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi size={16} className={isActive ? 'text-teal' : 'text-muted-foreground'} />
          <span className="text-sm font-medium">Sensor Simulation</span>
          {isActive && (
            <span className="flex items-center gap-1 text-xs font-mono font-bold text-teal live-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="sensor-toggle" className="text-xs text-muted-foreground">
            {isActive ? 'Active' : 'Inactive'}
          </Label>
          <Switch
            id="sensor-toggle"
            checked={isActive}
            onCheckedChange={onToggle}
          />
        </div>
      </div>

      {isActive && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-background/50 rounded p-2 border border-teal-500/20">
            <div className="text-xs text-muted-foreground mb-1">Condition Rating</div>
            <div className="font-mono font-bold text-teal text-lg">{conditionRating.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">/ 5.0</div>
          </div>
          <div className="bg-background/50 rounded p-2 border border-teal-500/20">
            <div className="text-xs text-muted-foreground mb-1">Traffic Load</div>
            <div className="font-mono font-bold text-amber-accent text-lg">{(trafficLoad * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-background/50 rounded p-2 border border-teal-500/20">
            <div className="text-xs text-muted-foreground mb-1">Risk Score</div>
            <div className="font-mono font-bold text-lg" style={{ color: riskColor }}>
              {(riskScore * 100).toFixed(1)}
            </div>
          </div>
          <div className="bg-background/50 rounded p-2 border border-teal-500/20">
            <div className="text-xs text-muted-foreground mb-1">Health Score</div>
            <div className="font-mono font-bold text-green-400 text-lg">{healthScore.toFixed(1)}%</div>
          </div>
        </div>
      )}

      {isActive && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <Activity size={10} className="text-teal" />
          Last update: {lastUpdated.toLocaleTimeString()}
          <span className="ml-2 text-teal/60">· Updates every 3s</span>
        </div>
      )}
    </div>
  );
}
