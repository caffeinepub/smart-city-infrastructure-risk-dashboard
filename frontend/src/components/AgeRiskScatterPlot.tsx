import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Infrastructure } from '../backend';
import { getStructureTypeKey } from '../lib/utils';

interface AgeRiskScatterPlotProps {
  infrastructure: Infrastructure[];
}

export default function AgeRiskScatterPlot({ infrastructure }: AgeRiskScatterPlotProps) {
  const bridges = infrastructure
    .filter(i => getStructureTypeKey(i.structureType) === 'bridge')
    .map(i => ({ age: Number(i.age), risk: parseFloat((i.riskScore * 100).toFixed(1)), name: i.name }));

  const roads = infrastructure
    .filter(i => getStructureTypeKey(i.structureType) === 'road')
    .map(i => ({ age: Number(i.age), risk: parseFloat((i.riskScore * 100).toFixed(1)), name: i.name }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; age: number; risk: number } }> }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{
          background: 'oklch(0.16 0.025 240)',
          border: '1px solid oklch(0.72 0.18 195 / 0.3)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontFamily: 'JetBrains Mono',
          fontSize: '11px',
          color: 'oklch(0.92 0.01 200)',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{d.name}</div>
          <div>Age: {d.age}y</div>
          <div>Risk: {d.risk}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.03 240)" />
        <XAxis
          dataKey="age"
          name="Age"
          unit="y"
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={{ stroke: 'oklch(0.28 0.03 240)' }}
          tickLine={false}
          label={{ value: 'Age (years)', position: 'insideBottom', offset: -5, fill: 'oklch(0.58 0.02 220)', fontSize: 11 }}
        />
        <YAxis
          dataKey="risk"
          name="Risk Score"
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={{ stroke: 'oklch(0.28 0.03 240)' }}
          tickLine={false}
          label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', fill: 'oklch(0.58 0.02 220)', fontSize: 11 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ color: 'oklch(0.58 0.02 220)', fontSize: '12px' }}>{value}</span>}
        />
        <Scatter name="Bridges" data={bridges} fill="#00D9FF" fillOpacity={0.8} />
        <Scatter name="Roads" data={roads} fill="#FFB800" fillOpacity={0.8} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
