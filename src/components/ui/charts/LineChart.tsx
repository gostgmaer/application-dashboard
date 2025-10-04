'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface LineData {
  [key: string]: any;
}

interface LineConfig {
  dataKey: string;
  stroke: string;
  strokeWidth?: number;
  name?: string;
  dot?: boolean | object;
  activeDot?: boolean | object;
}

interface LineChartProps {
  data: LineData[];
  lines: LineConfig[];
  xAxisKey: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
  tooltipFormatter?: (value: any, name: string) => [string, string];
  margin?: { top?: number; right?: number; left?: number; bottom?: number };
}

export default function LineChart({
  data,
  lines,
  xAxisKey,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  xAxisFormatter,
  yAxisFormatter,
  tooltipFormatter,
  margin = { top: 5, right: 30, left: 20, bottom: 5 }
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={margin}>
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
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            strokeWidth={line.strokeWidth || 2}
            name={line.name}
            dot={line.dot !== undefined ? line.dot : { fill: line.stroke, strokeWidth: 2, r: 4 }}
            activeDot={line.activeDot !== undefined ? line.activeDot : { r: 6, stroke: line.stroke, strokeWidth: 2 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}