// import { DashboardStats } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, CircleCheck as CheckCircle, Circle as XCircle, Tag, DollarSign, TrendingUp, TriangleAlert as AlertTriangle, Trophy, Calendar, ChartBar as BarChart3, Archive, Percent, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DashboardStats } from '@/types/product';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: '+12.5%',
      trend: 'up' as const,
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      change: '+8.2%',
      trend: 'up' as const,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStockCount,
      change: '-15.3%',
      trend: 'down' as const,
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Products on Sale',
      value: stats.productsOnSale,
      change: '+23.1%',
      trend: 'up' as const,
      icon: Tag,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'Average Price',
      value: `$${stats.avgBasePrice?.toFixed(2)}`,
      change: '+5.7%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
 
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockProductsCount,
      change: '-8.4%',
      trend: 'down' as const,
      icon: AlertTriangle,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },

    {
      title: 'Added This Month',
      value: stats.thisMonthProducts,
      change: '+34.2%',
      trend: 'up' as const,
      icon: Calendar,
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    },

    {
      title: 'Discounted Products',
      value: stats.topDiscountedProductsCount,
      change: '+45.6%',
      trend: 'up' as const,
      icon: Percent,
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    },
 
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 animate-fade-in">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? ArrowUp : stat.trend === 'down' ? ArrowDown : null;
        
        return (
          <Card 
            key={index} 
            className="stat-card group cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                
                  <div className="flex items-center space-x-1">
                    {TrendIcon && (
                      <TrendIcon 
                        className={`h-3 w-3 ${
                          stat.trend === 'up' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`} 
                      />
                    )}
                    <span className={`text-xs font-medium ${
                      stat.trend === 'up' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                
                {/* {stat.trend === 'up' && (
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                )} */}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}