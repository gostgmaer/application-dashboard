"use client";

import { DivideIcon as LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { MetricCard as MetricCardType } from '@/types/dashboard';

interface MetricCardProps {
  metric: MetricCardType;
}

export function MetricCard({ metric }: MetricCardProps) {
  const IconComponent = Icons[metric.icon as keyof typeof Icons] as typeof LucideIcon;
  const isPositiveTrend = metric.trend === 'up';
  const changeColor = metric.title.toLowerCase().includes('failed') || metric.title.toLowerCase().includes('error')
    ? (isPositiveTrend ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400')
    : (isPositiveTrend ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${changeColor}`}>
          {isPositiveTrend ? (
            <Icons.TrendingUp className="h-4 w-4" />
          ) : (
            <Icons.TrendingDown className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{Math.abs(metric.change)}%</span>
        </div>
      </div>
    </div>
  );
}