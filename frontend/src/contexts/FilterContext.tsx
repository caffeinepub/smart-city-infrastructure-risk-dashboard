import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Infrastructure, RiskLevel, StructureType } from '../backend';

export type RiskLevelFilter = 'all' | 'low' | 'moderate' | 'high';
export type StructureTypeFilter = 'all' | 'bridge' | 'road';
export type AreaFilter = string; // 'all' or specific area name
export type UrgencyFilter = 'all' | 'immediateRepair' | 'scheduledMaintenance' | 'monitorOnly';

interface FilterState {
  riskLevel: RiskLevelFilter;
  structureType: StructureTypeFilter;
  area: AreaFilter;
  urgency: UrgencyFilter;
}

interface FilterContextValue {
  filters: FilterState;
  setRiskLevel: (v: RiskLevelFilter) => void;
  setStructureType: (v: StructureTypeFilter) => void;
  setArea: (v: AreaFilter) => void;
  setUrgency: (v: UrgencyFilter) => void;
  resetFilters: () => void;
  filterInfrastructure: (items: Infrastructure[]) => Infrastructure[];
}

const defaultFilters: FilterState = {
  riskLevel: 'all',
  structureType: 'all',
  area: 'all',
  urgency: 'all',
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setRiskLevel = useCallback((v: RiskLevelFilter) => setFilters(f => ({ ...f, riskLevel: v })), []);
  const setStructureType = useCallback((v: StructureTypeFilter) => setFilters(f => ({ ...f, structureType: v })), []);
  const setArea = useCallback((v: AreaFilter) => setFilters(f => ({ ...f, area: v })), []);
  const setUrgency = useCallback((v: UrgencyFilter) => setFilters(f => ({ ...f, urgency: v })), []);
  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const filterInfrastructure = useCallback((items: Infrastructure[]): Infrastructure[] => {
    return items.filter(item => {
      if (filters.riskLevel !== 'all') {
        const rl = item.riskLevel as unknown as { [key: string]: null };
        const rlKey = Object.keys(rl)[0];
        if (rlKey !== filters.riskLevel) return false;
      }
      if (filters.structureType !== 'all') {
        const st = item.structureType as unknown as { [key: string]: null };
        const stKey = Object.keys(st)[0];
        if (stKey !== filters.structureType) return false;
      }
      if (filters.area !== 'all') {
        if (item.location.area !== filters.area) return false;
      }
      if (filters.urgency !== 'all') {
        // Map urgency to risk level
        const urgencyToRisk: Record<string, string> = {
          immediateRepair: 'high',
          scheduledMaintenance: 'moderate',
          monitorOnly: 'low',
        };
        const expectedRisk = urgencyToRisk[filters.urgency];
        const rl = item.riskLevel as unknown as { [key: string]: null };
        const rlKey = Object.keys(rl)[0];
        if (rlKey !== expectedRisk) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <FilterContext.Provider value={{ filters, setRiskLevel, setStructureType, setArea, setUrgency, resetFilters, filterInfrastructure }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}

// Helper to extract enum key from Motoko variant
export function getRiskLevelKey(riskLevel: RiskLevel): string {
  const rl = riskLevel as unknown as { [key: string]: null };
  return Object.keys(rl)[0] || 'low';
}

export function getStructureTypeKey(structureType: StructureType): string {
  const st = structureType as unknown as { [key: string]: null };
  return Object.keys(st)[0] || 'road';
}
