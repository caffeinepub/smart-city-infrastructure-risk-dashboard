import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Infrastructure } from '../backend';
import { getHealthScore } from '../lib/utils';

interface AreaHealthChartProps {
  infrastructure: Infrastructure[];
}

export default function AreaHealthChart({ infrastructure }: AreaHealthChartProps) {
  const areaMap: Record<string, number[]> = {};
  infrastructure.forEach(i => {
    const area = i.location.area;
    if (!areaMap[area]) areaMap[area] = [];
    areaMap[area].push(getHealthScore(i.riskScore));
  });

  const data = Object.entries(areaMap).map(([area, scores]) => ({
    area,
    avgHealth: parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)),
  })).sort((a, b) => b.avgHealth - a.avgHealth);

  const overall = data.length > 0
    ? data.reduce((sum, d) => sum + d.avgHealth, 0) / data.length
    : 0;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.03 240)" vertical={false} />
        <XAxis
          dataKey="area"
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          angle={-20}
          textAnchor="end"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            background: 'oklch(0.16 0.025 240)',
            border: '1px solid oklch(0.72 0.18 195 / 0.3)',
            borderRadius: '6px',
            color: 'oklch(0.92 0.01 200)',
            fontFamily: 'JetBrains Mono',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`${value}%`, 'Avg Health']}
        />
        <ReferenceLine y={overall} stroke="#00D9FF" strokeDasharray="4 4" label={{ value: 'Avg', fill: '#00D9FF', fontSize: 10 }} />
        <Bar dataKey="avgHealth" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.avgHealth < overall ? '#f59e0b' : '#00D9FF'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
