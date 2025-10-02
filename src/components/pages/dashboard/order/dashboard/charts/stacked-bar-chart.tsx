'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StackedBarData {
  label: string;
  segments: { value: number; color: string; name: string }[];
}

interface StackedBarChartProps {
  title: string;
  description?: string;
  data: StackedBarData[];
  isLoading?: boolean;
}

export function StackedBarChart({ title, description, data, isLoading }: StackedBarChartProps) {
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

  const legendItems = data[0]?.segments.map(s => ({ name: s.name, color: s.color })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 justify-center">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium">{item.name}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {data.map((item, index) => {
              const total = item.segments.reduce((sum, s) => sum + s.value, 0);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-muted-foreground">{total}</span>
                  </div>
                  <div className="relative h-8 bg-secondary rounded-md overflow-hidden flex">
                    {item.segments.map((segment, segIndex) => {
                      const percentage = (segment.value / total) * 100;
                      return (
                        <div
                          key={segIndex}
                          className="flex items-center justify-center transition-all duration-500 hover:opacity-80"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: segment.color,
                          }}
                        >
                          {percentage > 10 && (
                            <span className="text-xs font-semibold text-white">
                              {segment.value}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
