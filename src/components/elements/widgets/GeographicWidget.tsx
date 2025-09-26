"use client";

import { Globe, MapPin } from 'lucide-react';
import { ChartData } from '@/types/dashboard';

interface GeographicWidgetProps {
  data: ChartData[];
  title: string;
}

export function GeographicWidget({ data, title }: GeographicWidgetProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...data.map(d => d.value));

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'Japan': '🇯🇵',
      'Others': '🌍'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const barWidth = (item.value / maxValue) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCountryFlag(item.name)}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {percentage.toFixed(1)}%
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.value} users
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">Total Locations</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{data.length}</span>
        </div>
      </div>
    </div>
  );
}