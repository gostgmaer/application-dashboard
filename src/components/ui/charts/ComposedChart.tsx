'use client';

import { ComposedChart as RechartsComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ComposedData {
  [key: string]: any;
}

interface BarConfig {
  dataKey: string;
  fill: string;
  name?: string;
  yAxisId?: string;
  radius?: [number, number, number, number];
}

interface LineConfig {
  dataKey: string;
  stroke: string;
  strokeWidth?: number;
  name?: string;
  yAxisId?: string;
  dot?: boolean | object;
}

interface ComposedChartProps {
  data: ComposedData[];
  bars?: BarConfig[];
  lines?: LineConfig[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
  rightYAxisFormatter?: (value: any) => string;
  tooltipFormatter?: (value: any, name: string) => [string, string];
  margin?: { top?: number; right?: number; left?: number; bottom?: number };
  showRightYAxis?: boolean;
}

export default function ComposedChart({
  data,
  bars = [],
  lines = [],
  xAxisKey,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  xAxisFormatter,
  yAxisFormatter,
  rightYAxisFormatter,
  tooltipFormatter,
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  showRightYAxis = false
}: ComposedChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsComposedChart data={data} margin={margin}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
        <XAxis 
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          className="text-gray-600 dark:text-gray-400"
          tickFormatter={xAxisFormatter}
        />
        <YAxis 
          yAxisId="left"
          axisLine={false}
          tickLine={false}
          className="text-gray-600 dark:text-gray-400"
          tickFormatter={yAxisFormatter}
        />
        {showRightYAxis && (
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            className="text-gray-600 dark:text-gray-400"
            tickFormatter={rightYAxisFormatter}
          />
        )}
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
            key={`bar-${index}`}
            yAxisId={bar.yAxisId || 'left'}
            dataKey={bar.dataKey}
            fill={bar.fill}
            name={bar.name}
            radius={bar.radius || [2, 2, 0, 0]}
          />
        ))}
        {lines.map((line, index) => (
          <Line
            key={`line-${index}`}
            yAxisId={line.yAxisId || 'right'}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth || 3}
            name={line.name}
            dot={line.dot !== undefined ? line.dot : { fill: line.stroke, strokeWidth: 2, r: 4 }}
          />
        ))}
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
}