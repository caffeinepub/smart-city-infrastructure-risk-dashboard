import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface RiskGaugeProps {
  riskScore: number; // 0-1
  size?: number;
}

export default function RiskGauge({ riskScore, size = 200 }: RiskGaugeProps) {
  const score = Math.round(riskScore * 100);
  const color = score >= 67 ? '#ef4444' : score >= 34 ? '#f59e0b' : '#22c55e';

  const data = [{ value: score, fill: color }];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="90%"
          data={data}
          startAngle={225}
          endAngle={-45}
          barSize={12}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'oklch(0.22 0.03 240)' }}
            dataKey="value"
            angleAxisId={0}
            cornerRadius={6}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-bold text-3xl" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground mt-0.5">Risk Score</span>
      </div>
    </div>
  );
}
