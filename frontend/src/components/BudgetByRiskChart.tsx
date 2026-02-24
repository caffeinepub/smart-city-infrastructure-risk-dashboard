import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '../lib/utils';

interface BudgetByRiskChartProps {
  low: number;
  moderate: number;
  high: number;
}

export default function BudgetByRiskChart({ low, moderate, high }: BudgetByRiskChartProps) {
  const data = [
    { name: 'Low Risk', value: low, color: '#22c55e' },
    { name: 'Moderate', value: moderate, color: '#f59e0b' },
    { name: 'High Risk', value: high, color: '#ef4444' },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.03 240)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={v => formatCurrency(v)}
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
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
          formatter={(value: number) => [formatCurrency(value), 'Budget']}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
