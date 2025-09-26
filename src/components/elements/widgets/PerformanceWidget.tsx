"use client";

import { Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PerformanceMetric } from '@/types/dashboard';

interface PerformanceWidgetProps {
  metrics: PerformanceMetric[];
}

export function PerformanceWidget({ metrics }: PerformanceWidgetProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <Minus className="h-4 w-4 text-yellow-500" />;
      case 'poor':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getProgressPercentage = (value: number, target: number, isLowerBetter: boolean = false) => {
    if (isLowerBetter) {
      return Math.max(0, Math.min(100, ((target - value) / target) * 100));
    }
    return Math.min(100, (value / target) * 100);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
        <Zap className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {metrics.map((metric) => {
          const isLowerBetter = metric.metric.toLowerCase().includes('error') || 
                               metric.metric.toLowerCase().includes('time');
          const progress = getProgressPercentage(metric.value, metric.target, isLowerBetter);
          
          return (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(metric.status)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {metric.metric}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}{metric.unit}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Target: {metric.target}{metric.unit}
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metric.status === 'good' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}