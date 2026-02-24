import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart
} from 'recharts';

interface ConditionChartProps {
  currentRating: number;
  rating5: number;
  rating10: number;
  rating20: number;
  currentYear: number;
}

export default function ConditionChart({ currentRating, rating5, rating10, rating20, currentYear }: ConditionChartProps) {
  const data = [
    { year: currentYear, rating: parseFloat(currentRating.toFixed(2)), label: 'Now' },
    { year: currentYear + 5, rating: parseFloat(Math.max(0, rating5).toFixed(2)), label: '+5yr' },
    { year: currentYear + 10, rating: parseFloat(Math.max(0, rating10).toFixed(2)), label: '+10yr' },
    { year: currentYear + 20, rating: parseFloat(Math.max(0, rating20).toFixed(2)), label: '+20yr' },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="conditionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.03 240)" />
        <XAxis
          dataKey="year"
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={{ stroke: 'oklch(0.28 0.03 240)' }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 5]}
          tick={{ fill: 'oklch(0.58 0.02 220)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={{ stroke: 'oklch(0.28 0.03 240)' }}
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
          formatter={(value: number) => [value.toFixed(2), 'Condition Rating']}
        />
        <ReferenceLine y={3.0} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Critical', fill: '#ef4444', fontSize: 10 }} />
        <Area
          type="monotone"
          dataKey="rating"
          stroke="#00D9FF"
          strokeWidth={2}
          fill="url(#conditionGradient)"
          dot={{ fill: '#00D9FF', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#00D9FF' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
