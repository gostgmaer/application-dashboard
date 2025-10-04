'use client';

import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AreaData {
  [key: string]: any;
}

interface AreaConfig {
  dataKey: string;
  stroke: string;
  fill: string;
  strokeWidth?: number;
  name?: string;
  fillOpacity?: number;
}

interface AreaChartProps {
  data: AreaData[];
  areas: AreaConfig[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
  tooltipFormatter?: (value: any, name: string) => [string, string];
  margin?: { top?: number; right?: number; left?: number; bottom?: number };
  gradients?: { id: string; colors: { offset: string; stopColor: string; stopOpacity: number }[] }[];
}

export default function AreaChart({
  data,
  areas,
  xAxisKey,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatter,
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  gradients
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={margin}>
        {gradients && (
          <defs>
            {gradients.map((gradient) => (
              <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                {gradient.colors.map((color, index) => (
                  <stop 
                    key={index}
                    offset={color.offset} 
                    stopColor={color.stopColor} 
                    stopOpacity={color.stopOpacity}
                  />
                ))}
              </linearGradient>
            ))}
          </defs>
        )}
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
        <XAxis 
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          className="text-gray-600 dark:text-gray-400"
          tickFormatter={xAxisFormatter}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          className="text-gray-600 dark:text-gray-400"
          tickFormatter={yAxisFormatter}
        />
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
        {showLegend && <Legend />}
        {areas.map((area, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={area.dataKey}
            stroke={area.stroke}
            fill={area.fill}
            strokeWidth={area.strokeWidth || 2}
            name={area.name}
            fillOpacity={area.fillOpacity}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}