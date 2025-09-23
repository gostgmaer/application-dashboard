'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Cpu, 
  HardDrive, 
  Wifi, 
  Activity,
  Server,
  Zap
} from 'lucide-react'

const metrics = [
  {
    name: 'CPU Usage',
    value: 68,
    status: 'good',
    icon: Cpu,
    description: '4 cores active'
  },
  {
    name: 'Memory',
    value: 42,
    status: 'good',
    icon: Activity,
    description: '8.4GB / 16GB'
  },
  {
    name: 'Storage',
    value: 78,
    status: 'warning',
    icon: HardDrive,
    description: '156GB / 200GB'
  },
  {
    name: 'Network',
    value: 25,
    status: 'good',
    icon: Wifi,
    description: '2.5MB/s avg'
  },
  {
    name: 'Database',
    value: 91,
    status: 'critical',
    icon: Server,
    description: '45ms avg response'
  },
  {
    name: 'API Response',
    value: 15,
    status: 'excellent',
    icon: Zap,
    description: '120ms avg'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent':
      return 'text-green-600 bg-green-100'
    case 'good':
      return 'text-green-600 bg-green-100'
    case 'warning':
      return 'text-yellow-600 bg-yellow-100'
    case 'critical':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

const getProgressColor = (status: string) => {
  switch (status) {
    case 'excellent':
      return 'bg-green-500'
    case 'good':
      return 'bg-green-500'
    case 'warning':
      return 'bg-yellow-500'
    case 'critical':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

export default function PerformanceMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
        <CardDescription>Real-time performance monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <metric.icon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{metric.value}%</span>
                  <Badge variant="secondary" className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1">
                <Progress 
                  value={metric.value} 
                  className="h-2"
                />
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-xs text-gray-500">Uptime</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">2.3k</div>
              <div className="text-xs text-gray-500">Requests/min</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}