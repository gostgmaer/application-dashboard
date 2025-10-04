'use client';

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieData {
  name: string;
  value: number;
  fill?: string;
  [key: string]: any;
}

interface PieChartProps {
  data: PieData[];
  dataKey: string;
  nameKey?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  colors?: string[];
  tooltipFormatter?: (value: any, name: string, props: any) => [string, string];
  cx?: string | number;
  cy?: string | number;
}

export default function PieChart({
  data,
  dataKey,
  nameKey = 'name',
  height = 300,
  innerRadius = 0,
  outerRadius = 120,
  paddingAngle = 2,
  showTooltip = true,
  showLegend = true,
  colors,
  tooltipFormatter,
  cx = '50%',
  cy = '50%'
}: PieChartProps) {
  const defaultColors = ['#3b82f6', '#06d6a0', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#10b981', '#f97316'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.fill || (colors ? colors[index % colors.length] : defaultColors[index % defaultColors.length])} 
            />
          ))}
        </Pie>
        {showTooltip && (
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--color-background)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-foreground)'
            }}
            formatter={tooltipFormatter}
          />
        )}
        {showLegend && (
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ color: 'var(--color-foreground)' }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}