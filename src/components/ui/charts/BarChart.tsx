'use client';

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface BarData {
  [key: string]: any;
}

interface BarConfig {
  dataKey: string;
  fill: string;
  name?: string;
  radius?: [number, number, number, number];
}

interface BarChartProps {
  data: BarData[];
  bars: BarConfig[];
  xAxisKey: string;
  height?: number;
  layout?: 'horizontal' | 'vertical';
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
  tooltipFormatter?: (value: any, name: string) => [string, string];
  margin?: { top?: number; right?: number; left?: number; bottom?: number };
  colors?: string[];
}

export default function BarChart({
  data,
  bars,
  xAxisKey,
  height = 300,
  layout = 'vertical',
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatter,
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  colors
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart 
        data={data} 
        margin={margin}
        layout={layout}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
        <XAxis 
          type={layout === 'horizontal' ? 'number' : 'category'}
          dataKey={layout === 'vertical' ? xAxisKey : undefined}
          axisLine={false}
          tickLine={false}
          className="text-gray-600 dark:text-gray-400"
          tickFormatter={xAxisFormatter}
          angle={layout === 'vertical' ? -45 : 0}
          textAnchor={layout === 'vertical' ? 'end' : 'middle'}
          height={layout === 'vertical' ? 80 : undefined}
        />
        <YAxis 
          type={layout === 'horizontal' ? 'category' : 'number'}
          dataKey={layout === 'horizontal' ? xAxisKey : undefined}
          axisLine={false}
          tickLine={false}
          className="text-gray-600 dark:text-gray-400"
          tickFormatter={yAxisFormatter}
          width={layout === 'horizontal' ? 70 : undefined}
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
        {bars.map((bar, index) => (
          <Bar
            key={index}
            dataKey={bar.dataKey}
            fill={bar.fill}
            name={bar.name}
            radius={bar.radius || [4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          >
            {colors && data.map((entry, entryIndex) => (
              <Cell key={`cell-${entryIndex}`} fill={colors[entryIndex % colors.length]} />
            ))}
          </Bar>
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}