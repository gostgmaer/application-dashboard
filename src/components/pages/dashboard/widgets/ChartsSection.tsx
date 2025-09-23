'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartsSectionProps {
  dateRange: string
}

const lineChartData = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 2000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
]

const barChartData = [
  { name: 'Mon', orders: 20, returns: 5 },
  { name: 'Tue', orders: 35, returns: 8 },
  { name: 'Wed', orders: 45, returns: 12 },
  { name: 'Thu', orders: 28, returns: 6 },
  { name: 'Fri', orders: 52, returns: 15 },
  { name: 'Sat', orders: 38, returns: 9 },
  { name: 'Sun', orders: 25, returns: 4 },
]

const pieChartData = [
  { name: 'Desktop', value: 400, color: '#0088FE' },
  { name: 'Mobile', value: 300, color: '#00C49F' },
  { name: 'Tablet', value: 200, color: '#FFBB28' },
  { name: 'Other', value: 100, color: '#FF8042' },
]

export default function ChartsSection({ dateRange }: ChartsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Revenue & Users Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & User Growth</CardTitle>
          <CardDescription>Monthly revenue and user acquisition trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={{ fill: '#82ca9d', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders & Returns Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Orders</CardTitle>
            <CardDescription>Orders vs Returns comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" />
                <Bar dataKey="returns" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Usage Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>Traffic distribution by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}