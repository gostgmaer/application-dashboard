"use client";

import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { ChartData } from '@/types/dashboard';

interface RealtimeChartProps {
  title: string;
  data: ChartData[];
  color?: string;
  unit?: string;
}

export function RealtimeChart({ title, data, color = "#3B82F6", unit = "" }: RealtimeChartProps) {
  const [animatedData, setAnimatedData] = useState(data);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setAnimatedData(prevData => {
        const newData = [...prevData.slice(1)];
        const lastValue = prevData[prevData.length - 1]?.value || 0;
        const variation = (Math.random() - 0.5) * 40;
        const newValue = Math.max(0, lastValue + variation);
        
        newData.push({
          name: new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          value: Math.round(newValue)
        });
        
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const maxValue = Math.max(...animatedData.map(d => d.value));
  const minValue = Math.min(...animatedData.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = animatedData.map((item, index) => {
    const x = (index / (animatedData.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isLive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
          </button>
          <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <defs>
            <pattern id={`grid-${title}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-gray-200 dark:text-gray-600" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill={`url(#grid-${title})`} />
          
          {/* Area fill */}
          <path
            d={`M 0,100 L ${points} L 100,100 Z`}
            fill={`url(#gradient-${title})`}
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            className="drop-shadow-sm"
          />
          
          {/* Current value indicator */}
          {animatedData.length > 0 && (
            <circle
              cx="100"
              cy={100 - ((animatedData[animatedData.length - 1].value - minValue) / range) * 100}
              r="1.5"
              fill={color}
              className="drop-shadow-sm animate-pulse"
            />
          )}
        </svg>
        
        {/* Current value display */}
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold" style={{ color }}>
            {animatedData[animatedData.length - 1]?.value || 0}{unit}
          </span>
        </div>
      </div>
    </div>
  );
}