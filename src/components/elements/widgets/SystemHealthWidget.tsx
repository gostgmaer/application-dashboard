"use client";

import { Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { SystemMetric } from '@/types/dashboard';

interface SystemHealthWidgetProps {
  metrics: SystemMetric[];
}

export function SystemHealthWidget({ metrics }: SystemHealthWidgetProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
        <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(metric.status)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{metric.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Threshold: {metric.threshold}{metric.unit}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {metric.value}{metric.unit}
              </p>
              <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStatusColor(metric.status)} transition-all duration-300`}
                  style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}