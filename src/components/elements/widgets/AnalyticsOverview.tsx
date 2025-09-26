'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react'

interface AnalyticsOverviewProps {
  dateRange: string
}

export default function AnalyticsOverview({ dateRange }: AnalyticsOverviewProps) {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'from last month'
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'from last month'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '-2.4%',
      changeType: 'negative' as const,
      icon: ShoppingCart,
      description: 'from last month'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: Activity,
      description: 'from last month'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {metric.changeType === 'positive' ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={metric.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}>
                {metric.change}
              </span>
              <span className="ml-1">{metric.description}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}