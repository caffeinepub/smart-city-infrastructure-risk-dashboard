import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RiskLevel, StructureType, MaterialType, UrgencyLevel } from '../backend';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskLevelKey(riskLevel: RiskLevel): 'low' | 'moderate' | 'high' {
  if (typeof riskLevel === 'string') return riskLevel as 'low' | 'moderate' | 'high';
  const rl = riskLevel as unknown as Record<string, null>;
  return (Object.keys(rl)[0] || 'low') as 'low' | 'moderate' | 'high';
}

export function getStructureTypeKey(structureType: StructureType): 'bridge' | 'road' {
  if (typeof structureType === 'string') return structureType as 'bridge' | 'road';
  const st = structureType as unknown as Record<string, null>;
  return (Object.keys(st)[0] || 'road') as 'bridge' | 'road';
}

export function getMaterialTypeKey(materialType: MaterialType): string {
  if (typeof materialType === 'string') return materialType;
  const mt = materialType as unknown as Record<string, null>;
  return Object.keys(mt)[0] || 'concrete';
}

export function getUrgencyLevelKey(urgencyLevel: UrgencyLevel): string {
  if (typeof urgencyLevel === 'string') return urgencyLevel;
  const ul = urgencyLevel as unknown as Record<string, null>;
  return Object.keys(ul)[0] || 'monitorOnly';
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatRiskLevel(key: string): string {
  const map: Record<string, string> = {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
  };
  return map[key] || key;
}

export function formatStructureType(key: string): string {
  const map: Record<string, string> = {
    bridge: 'Bridge',
    road: 'Road',
  };
  return map[key] || key;
}

export function formatMaterialType(key: string): string {
  const map: Record<string, string> = {
    concrete: 'Concrete',
    steel: 'Steel',
    asphalt: 'Asphalt',
    compositeMaterial: 'Composite',
  };
  return map[key] || key;
}

export function formatUrgencyLevel(key: string): string {
  const map: Record<string, string> = {
    immediateRepair: 'Immediate Repair',
    scheduledMaintenance: 'Scheduled Maintenance',
    monitorOnly: 'Monitor Only',
  };
  return map[key] || key;
}

export function getRiskColor(riskKey: string): string {
  const map: Record<string, string> = {
    low: '#22c55e',
    moderate: '#f59e0b',
    high: '#ef4444',
  };
  return map[riskKey] || '#6b7280';
}

export function getHealthScore(riskScore: number): number {
  return Math.max(0, Math.min(100, Math.round((1 - riskScore) * 100)));
}

export function formatMaintenanceYear(year: bigint | number): string {
  const y = typeof year === 'bigint' ? Number(year) : year;
  const currentYear = new Date().getFullYear();
  return String(currentYear + y);
}
