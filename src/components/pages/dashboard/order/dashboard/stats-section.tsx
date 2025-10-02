'use client';

import { Package, Clock, CircleCheck as CheckCircle2, Circle as XCircle, TrendingUp, DollarSign, Timer } from 'lucide-react';
import { StatCard } from './stat-card';

interface StatsSectionProps {
  isLoading?: boolean;
}

export function StatsSection({ isLoading }: StatsSectionProps) {
  const stats = [
    {
      title: 'Total Orders',
      value: '1,234',
      icon: Package,
      trend: { value: 12.5, isPositive: true },
      sparklineData: [
        { value: 20 },
        { value: 35 },
        { value: 25 },
        { value: 45 },
        { value: 40 },
        { value: 55 },
        { value: 60 },
      ],
    },
    {
      title: 'Pending Orders',
      value: '87',
      icon: Clock,
      trend: { value: 5.2, isPositive: false },
      sparklineData: [
        { value: 30 },
        { value: 40 },
        { value: 35 },
        { value: 50 },
        { value: 45 },
        { value: 40 },
        { value: 35 },
      ],
    },
    {
      title: 'Completed Orders',
      value: '1,089',
      icon: CheckCircle2,
      trend: { value: 18.3, isPositive: true },
      sparklineData: [
        { value: 15 },
        { value: 25 },
        { value: 35 },
        { value: 30 },
        { value: 45 },
        { value: 50 },
        { value: 55 },
      ],
    },
    {
      title: 'Cancelled Orders',
      value: '58',
      icon: XCircle,
      trend: { value: 2.1, isPositive: false },
      sparklineData: [
        { value: 10 },
        { value: 15 },
        { value: 12 },
        { value: 18 },
        { value: 15 },
        { value: 20 },
        { value: 22 },
      ],
    },
    {
      title: 'Orders Today',
      value: '45',
      icon: TrendingUp,
      trend: { value: 8.7, isPositive: true },
      sparklineData: [
        { value: 5 },
        { value: 10 },
        { value: 8 },
        { value: 15 },
        { value: 20 },
        { value: 25 },
        { value: 30 },
      ],
    },
    {
      title: 'Revenue Today',
      value: '$12,450',
      icon: DollarSign,
      trend: { value: 15.4, isPositive: true },
      sparklineData: [
        { value: 100 },
        { value: 150 },
        { value: 180 },
        { value: 220 },
        { value: 200 },
        { value: 250 },
        { value: 280 },
      ],
    },
    {
      title: 'Avg Delivery Time',
      value: '2.4 days',
      icon: Timer,
      trend: { value: 3.2, isPositive: true },
      sparklineData: [
        { value: 3.5 },
        { value: 3.2 },
        { value: 2.9 },
        { value: 2.7 },
        { value: 2.5 },
        { value: 2.3 },
        { value: 2.4 },
      ],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
}
