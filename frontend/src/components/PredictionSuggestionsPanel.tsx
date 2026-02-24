import React from 'react';
import { PredictionResult } from '../backend';
import { getRiskLevelKey, getUrgencyLevelKey, formatCurrency, formatUrgencyLevel } from '../lib/utils';
import RiskBadge from './RiskBadge';
import { CheckCircle, X, Sparkles, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PredictionSuggestionsPanelProps {
  result: PredictionResult;
  onAccept: (values: { structuralConditionRating: number }) => void;
  onDismiss: () => void;
}

export default function PredictionSuggestionsPanel({
  result,
  onAccept,
  onDismiss,
}: PredictionSuggestionsPanelProps) {
  const riskKey = getRiskLevelKey(result.riskLevel);
  const urgencyKey = getUrgencyLevelKey(result.budgetEstimate.urgencyLevel);
  const healthScore = Math.max(0, Math.min(100, Math.round((1 - result.riskScore) * 100)));
  // Derive a suggested condition rating from health score (scale 1-5)
  const suggestedConditionRating = Math.max(1, Math.min(5, (healthScore / 100) * 5));
  const currentYear = new Date().getFullYear();
  const maintYear = currentYear + Number(result.maintenanceYear);

  return (
    <div
      className="rounded-lg border border-amber-500/40 bg-card p-4 space-y-3"
      style={{ boxShadow: '0 0 0 1px oklch(0.78 0.16 85 / 0.3), 0 4px 24px oklch(0.78 0.16 85 / 0.12)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-amber-accent" />
          <span className="text-xs font-mono text-amber-accent uppercase tracking-wider">AI Suggestions</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Based on the uploaded photo and parameters, the system suggests the following values:
      </p>

      {/* Suggestions */}
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between items-center py-1 border-b border-border/50">
          <span className="text-muted-foreground">Risk Score</span>
          <div className="flex items-center gap-2">
            <span className={riskKey === 'high' ? 'text-red-400' : riskKey === 'moderate' ? 'text-amber-accent' : 'text-green-400'}>
              {(result.riskScore * 100).toFixed(1)}%
            </span>
            <RiskBadge riskKey={riskKey} size="sm" />
          </div>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/50">
          <span className="text-muted-foreground">Condition Rating</span>
          <span className="text-teal">{suggestedConditionRating.toFixed(1)} / 5.0</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/50">
          <div className="flex items-center gap-1">
            <TrendingDown size={10} className="text-red-400" />
            <span className="text-muted-foreground">Deterioration</span>
          </div>
          <span className="text-red-400">{result.deteriorationRate.toFixed(5)}/yr</span>
        </div>
        <div className="flex justify-between items-center py-1 border-b border-border/50">
          <div className="flex items-center gap-1">
            <Calendar size={10} className="text-amber-accent" />
            <span className="text-muted-foreground">Maint. Year</span>
          </div>
          <span className="text-amber-accent">{maintYear}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <div className="flex items-center gap-1">
            <DollarSign size={10} className="text-teal" />
            <span className="text-muted-foreground">Est. Cost</span>
          </div>
          <span className="text-teal">{formatCurrency(result.budgetEstimate.estimatedCost)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          size="sm"
          onClick={() => onAccept({ structuralConditionRating: suggestedConditionRating })}
          className="flex-1 gap-1.5 bg-teal-500/20 border border-teal-500/40 text-teal hover:bg-teal-500/30 text-xs h-7"
          variant="ghost"
        >
          <CheckCircle size={11} />
          Accept Suggestions
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onDismiss}
          variant="ghost"
          className="flex-1 gap-1.5 text-muted-foreground hover:text-foreground text-xs h-7 border border-border"
        >
          <X size={11} />
          Dismiss
        </Button>
      </div>
    </div>
  );
}
