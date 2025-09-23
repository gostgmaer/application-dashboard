'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Eye, MousePointer, Clock } from 'lucide-react'

const engagementData = [
  { day: 'Mon', sessions: 1200, pageViews: 3400, avgTime: 245 },
  { day: 'Tue', sessions: 1100, pageViews: 3100, avgTime: 267 },
  { day: 'Wed', sessions: 1350, pageViews: 3800, avgTime: 289 },
  { day: 'Thu', sessions: 1280, pageViews: 3600, avgTime: 234 },
  { day: 'Fri', sessions: 1450, pageViews: 4100, avgTime: 312 },
  { day: 'Sat', sessions: 980, pageViews: 2800, avgTime: 198 },
  { day: 'Sun', sessions: 850, pageViews: 2400, avgTime: 176 },
]

const userSegments = [
  { name: 'New Users', count: 1234, percentage: 35, color: 'bg-blue-500' },
  { name: 'Returning Users', count: 2156, percentage: 45, color: 'bg-green-500' },
  { name: 'Premium Users', count: 567, percentage: 15, color: 'bg-purple-500' },
  { name: 'Inactive Users', count: 234, percentage: 5, color: 'bg-gray-400' },
]

const engagementMetrics = [
  { label: 'Bounce Rate', value: 32, target: 25, status: 'warning' },
  { label: 'Session Duration', value: 78, target: 80, status: 'good' },
  { label: 'Pages per Session', value: 85, target: 75, status: 'excellent' },
  { label: 'Return Visitor Rate', value: 45, target: 50, status: 'good' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-600'
    case 'good': return 'text-blue-600'
    case 'warning': return 'text-yellow-600'
    default: return 'text-gray-600'
  }
}

export default function UserEngagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Engagement
        </CardTitle>
        <CardDescription>User behavior and engagement analytics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">24.5K</div>
            <div className="text-xs text-gray-600">Page Views</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">8.2K</div>
            <div className="text-xs text-gray-600">Sessions</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <MousePointer className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">3.4%</div>
            <div className="text-xs text-gray-600">CTR</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">4:32</div>
            <div className="text-xs text-gray-600">Avg. Time</div>
          </div>
        </div>

        {/* Engagement Chart */}
        <div>
          <h4 className="font-medium mb-3">Weekly Engagement Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="pageViews" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Segments */}
        <div>
          <h4 className="font-medium mb-3">User Segments</h4>
          <div className="space-y-3">
            {userSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                  <span className="text-sm font-medium">{segment.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{segment.count.toLocaleString()}</span>
                  <Badge variant="secondary">{segment.percentage}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div>
          <h4 className="font-medium mb-3">Performance Metrics</h4>
          <div className="space-y-3">
            {engagementMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                    {metric.value}%
                  </span>
                </div>
                <Progress value={metric.value} className="h-2" />
                <div className="text-xs text-gray-500">
                  Target: {metric.target}% • Status: {metric.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}