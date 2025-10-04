'use client';

import Link from 'next/link';
import { ArrowUp as ArrowUpIcon, ArrowDown as ArrowDownIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down';
  icon?: ReactNode;
  isLoading?: boolean;
  desc?: string;
  link?: string; // 👈 Added link prop
}

export default function StatsCard({
  title,
  value,
  change,
  trend,
  icon,
  desc,
  link,
  isLoading = false,
}: StatsCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return val.toLocaleString();
      }
      return val.toString();
    }
    return val;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    );
  }

  const CardContent = (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 
        ${link ? 'hover:shadow-md hover:border-blue-400 cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatValue(value)}
          </p>
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-blue-600 dark:text-blue-400">{icon}</div>
          </div>
        )}
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center">
          <div
            className={`flex items-center text-sm ${
              trend === 'up'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            )}
            {Math.abs(change)}%
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            {desc}
          </span>
        </div>
      )}
    </div>
  );

  // ✅ Wrap with <Link> if link prop exists
  return link ? (
    <Link href={link} className="block">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
}
