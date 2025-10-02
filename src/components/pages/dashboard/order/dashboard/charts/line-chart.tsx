'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  title: string;
  description?: string;
  data: LineChartData[];
  color?: string;
  isLoading?: boolean;
}

export function LineChart({ title, description, data, color = '#3b82f6', isLoading }: LineChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { points: '', area: '', max: 0, min: 0 };

    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const width = 100;
    const height = 100;
    const padding = 5;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.value - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    return { points, area: areaPoints, max, min };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Max: {chartData.max}</span>
            <span>Min: {chartData.min}</span>
          </div>
          <svg
            className="w-full h-64 border rounded-lg bg-secondary/10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
              </linearGradient>
            </defs>
            <polygon
              fill={`url(#gradient-${title})`}
              points={chartData.area}
            />
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              points={chartData.points}
            />
            {data.map((d, i) => {
              const x = 5 + (i / (data.length - 1)) * 90;
              const y = 95 - ((d.value - chartData.min) / (chartData.max - chartData.min || 1)) * 90;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="0.8"
                  fill={color}
                  className="hover:r-[1.5] transition-all cursor-pointer"
                />
              );
            })}
          </svg>
          <div className="flex justify-between text-xs text-muted-foreground">
            {data.map((d, i) => (
              i % Math.ceil(data.length / 7) === 0 && (
                <span key={i}>{d.label}</span>
              )
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
