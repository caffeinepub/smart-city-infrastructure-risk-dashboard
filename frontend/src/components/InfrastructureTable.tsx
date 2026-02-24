import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Infrastructure } from '../backend';
import { getRiskLevelKey, getStructureTypeKey, formatStructureType, formatMaintenanceYear, getHealthScore } from '../lib/utils';
import RiskBadge from './RiskBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';

type SortKey = 'name' | 'structureType' | 'area' | 'age' | 'riskScore' | 'healthScore' | 'maintenanceYear';
type SortDir = 'asc' | 'desc';

interface InfrastructureTableProps {
  infrastructure: Infrastructure[];
}

export default function InfrastructureTable({ infrastructure }: InfrastructureTableProps) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>('riskScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...infrastructure].sort((a, b) => {
    let aVal: string | number = 0;
    let bVal: string | number = 0;
    switch (sortKey) {
      case 'name': aVal = a.name; bVal = b.name; break;
      case 'structureType': aVal = getStructureTypeKey(a.structureType); bVal = getStructureTypeKey(b.structureType); break;
      case 'area': aVal = a.location.area; bVal = b.location.area; break;
      case 'age': aVal = Number(a.age); bVal = Number(b.age); break;
      case 'riskScore': aVal = a.riskScore; bVal = b.riskScore; break;
      case 'healthScore': aVal = getHealthScore(a.riskScore); bVal = getHealthScore(b.riskScore); break;
      case 'maintenanceYear': aVal = Number(a.age); bVal = Number(b.age); break;
    }
    if (typeof aVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
    }
    return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-teal" /> : <ChevronDown size={12} className="text-teal" />;
  };

  const SortableHead = ({ col, label }: { col: SortKey; label: string }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground text-muted-foreground text-xs uppercase tracking-wider"
      onClick={() => handleSort(col)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon col={col} />
      </div>
    </TableHead>
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden card-glow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-accent/50 hover:bg-accent/50">
              <SortableHead col="name" label="Name" />
              <SortableHead col="structureType" label="Type" />
              <SortableHead col="area" label="Area" />
              <SortableHead col="age" label="Age" />
              <SortableHead col="riskScore" label="Risk Score" />
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Risk Level</TableHead>
              <SortableHead col="healthScore" label="Health" />
              <SortableHead col="maintenanceYear" label="Maint. Year" />
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(infra => {
              const riskKey = getRiskLevelKey(infra.riskLevel);
              const typeKey = getStructureTypeKey(infra.structureType);
              const health = getHealthScore(infra.riskScore);
              const currentYear = new Date().getFullYear();
              const maintYear = currentYear + Number(infra.age);

              return (
                <TableRow
                  key={infra.id}
                  className="border-border hover:bg-accent/30 cursor-pointer transition-colors"
                  onClick={() => navigate({ to: '/infrastructure/$id', params: { id: infra.id } })}
                >
                  <TableCell className="font-medium text-sm">{infra.name}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                      typeKey === 'bridge' ? 'text-teal bg-teal-glow' : 'text-amber-accent bg-amber-glow'
                    }`}>
                      {formatStructureType(typeKey)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{infra.location.area}</TableCell>
                  <TableCell className="font-mono text-sm">{Number(infra.age)}y</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-semibold" style={{
                      color: riskKey === 'high' ? '#ef4444' : riskKey === 'moderate' ? '#f59e0b' : '#22c55e'
                    }}>
                      {(infra.riskScore * 100).toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <RiskBadge riskKey={riskKey} size="sm" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <Progress
                        value={health}
                        className="h-1.5 flex-1"
                      />
                      <span className="font-mono text-xs text-muted-foreground w-8">{health}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-teal">{maintYear}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:text-teal hover:bg-teal-glow"
                      onClick={e => {
                        e.stopPropagation();
                        navigate({ to: '/infrastructure/$id', params: { id: infra.id } });
                      }}
                    >
                      <ExternalLink size={13} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {sorted.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No infrastructure records match the current filters.
        </div>
      )}
    </div>
  );
}
