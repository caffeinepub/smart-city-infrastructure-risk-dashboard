import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { useFilters, RiskLevelFilter, StructureTypeFilter, UrgencyFilter } from '../contexts/FilterContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FilterPanelProps {
  areas: string[];
}

export default function FilterPanel({ areas }: FilterPanelProps) {
  const { filters, setRiskLevel, setStructureType, setArea, setUrgency, resetFilters } = useFilters();

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-center gap-2 text-xs font-semibold text-teal uppercase tracking-widest">
        <Filter size={12} />
        <span>Filters</span>
      </div>

      <Separator className="border-border" />

      {/* Risk Level */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Risk Level</label>
        <Select value={filters.riskLevel} onValueChange={v => setRiskLevel(v as RiskLevelFilter)}>
          <SelectTrigger className="h-8 text-xs bg-accent border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="high">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                High Risk
              </span>
            </SelectItem>
            <SelectItem value="moderate">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Moderate Risk
              </span>
            </SelectItem>
            <SelectItem value="low">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Low Risk
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Structure Type */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Structure Type</label>
        <Select value={filters.structureType} onValueChange={v => setStructureType(v as StructureTypeFilter)}>
          <SelectTrigger className="h-8 text-xs bg-accent border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bridge">Bridge</SelectItem>
            <SelectItem value="road">Road</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Area */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">City Area</label>
        <Select value={filters.area} onValueChange={v => setArea(v)}>
          <SelectTrigger className="h-8 text-xs bg-accent border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {areas.map(area => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Maintenance Urgency */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Urgency</label>
        <Select value={filters.urgency} onValueChange={v => setUrgency(v as UrgencyFilter)}>
          <SelectTrigger className="h-8 text-xs bg-accent border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Urgency</SelectItem>
            <SelectItem value="immediateRepair">Immediate Repair</SelectItem>
            <SelectItem value="scheduledMaintenance">Scheduled</SelectItem>
            <SelectItem value="monitorOnly">Monitor Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="border-border" />

      <Button
        variant="outline"
        size="sm"
        onClick={resetFilters}
        className="w-full text-xs gap-1.5 border-border hover:border-primary hover:text-primary"
      >
        <RotateCcw size={12} />
        Reset Filters
      </Button>

      {/* Active filter indicators */}
      <div className="space-y-1">
        {filters.riskLevel !== 'all' && (
          <div className="text-xs text-teal bg-teal-glow px-2 py-1 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
            Risk: {filters.riskLevel}
          </div>
        )}
        {filters.structureType !== 'all' && (
          <div className="text-xs text-teal bg-teal-glow px-2 py-1 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
            Type: {filters.structureType}
          </div>
        )}
        {filters.area !== 'all' && (
          <div className="text-xs text-teal bg-teal-glow px-2 py-1 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
            Area: {filters.area}
          </div>
        )}
        {filters.urgency !== 'all' && (
          <div className="text-xs text-teal bg-teal-glow px-2 py-1 rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
            Urgency: {filters.urgency.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        )}
      </div>
    </div>
  );
}
