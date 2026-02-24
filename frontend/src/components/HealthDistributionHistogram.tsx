import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Infrastructure } from '../backend';
import { getHealthScore } from '../lib/utils';

interface HealthDistributionHistogramProps {
  infrastructure: Infrastructure[];
}

export default function HealthDistributionHistogram({ infrastructure }: HealthDistributionHistogramProps) {
  const bins = [
    { label: '0–20', min: 0, max: 20, color: '#ef4444' },
    { label: '21–40', min: 21, max: 40, color: '#f97316' },
    { label: '41–60', min: 41, max: 60, color: '#f59e0b' },
    { label: '61–80', min: 61, max: 80, color: '#84cc16' },
    { label: '81–100', min: 81, max: 100, color: '#22c55e' },
  ];

  const data = bins.map(bin => ({
    ...bin,
    count: infrastructure.filter(i => {
      const h = getHealthScore(i.riskScore);
      return h >= bin.min && h <= bin.max;
    }).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.03 240)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
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
          formatter={(value: number) => [value, 'Structures']}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
