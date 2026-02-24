import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Infrastructure } from '../backend';
import { getStructureTypeKey, formatCurrency } from '../lib/utils';

interface BudgetByTypeChartProps {
  infrastructure: Infrastructure[];
}

function estimateCost(infra: Infrastructure): number {
  const riskKey = Object.keys(infra.riskLevel as unknown as Record<string, null>)[0] || 'low';
  const baseCost = getStructureTypeKey(infra.structureType) === 'bridge' ? 150000 : 50000;
  const riskMultiplier = riskKey === 'high' ? 2.5 : riskKey === 'moderate' ? 1.5 : 1.0;
  return baseCost * riskMultiplier * (Number(infra.age) / 20.0);
}

export default function BudgetByTypeChart({ infrastructure }: BudgetByTypeChartProps) {
  const bridgeCost = infrastructure
    .filter(i => getStructureTypeKey(i.structureType) === 'bridge')
    .reduce((sum, i) => sum + estimateCost(i), 0);
  const roadCost = infrastructure
    .filter(i => getStructureTypeKey(i.structureType) === 'road')
    .reduce((sum, i) => sum + estimateCost(i), 0);

  const data = [
    { name: 'Bridges', value: bridgeCost, color: '#00D9FF' },
    { name: 'Roads', value: roadCost, color: '#FFB800' },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'oklch(0.16 0.025 240)',
            border: '1px solid oklch(0.72 0.18 195 / 0.3)',
            borderRadius: '6px',
            color: 'oklch(0.92 0.01 200)',
            fontFamily: 'JetBrains Mono',
            fontSize: '12px',
          }}
          formatter={(value: number) => [formatCurrency(value), 'Budget']}
        />
        <Legend
          formatter={(value) => <span style={{ color: 'oklch(0.58 0.02 220)', fontSize: '12px' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
