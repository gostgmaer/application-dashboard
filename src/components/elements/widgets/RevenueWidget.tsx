"use client";

import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface RevenueData {
  current: number;
  previous: number;
  target: number;
  currency: string;
}

interface RevenueWidgetProps {
  data: RevenueData;
  period: string;
}

export function RevenueWidget({ data, period }: RevenueWidgetProps) {
  const growth = ((data.current - data.previous) / data.previous) * 100;
  const targetProgress = (data.current / data.target) * 100;
  const isPositiveGrowth = growth >= 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue</h3>
        <DollarSign className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(data.current)}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{period}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isPositiveGrowth ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              isPositiveGrowth ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {isPositiveGrowth ? '+' : ''}{growth.toFixed(1)}%
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            vs {formatCurrency(data.previous)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Target Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {targetProgress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(targetProgress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatCurrency(0)}</span>
            <span>{formatCurrency(data.target)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}