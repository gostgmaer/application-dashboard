'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, CreditCard, Banknote } from 'lucide-react'

interface RevenueAnalyticsProps {
  dateRange: string
}

const monthlyRevenue = [
  { month: 'Jan', revenue: 45000, profit: 12000, expenses: 33000 },
  { month: 'Feb', revenue: 52000, profit: 15000, expenses: 37000 },
  { month: 'Mar', revenue: 48000, profit: 13500, expenses: 34500 },
  { month: 'Apr', revenue: 61000, profit: 18000, expenses: 43000 },
  { month: 'May', revenue: 55000, profit: 16500, expenses: 38500 },
  { month: 'Jun', revenue: 67000, profit: 20000, expenses: 47000 },
]

const quarterlyData = [
  { quarter: 'Q1 2023', revenue: 145000, growth: 12 },
  { quarter: 'Q2 2023', revenue: 183000, growth: 26 },
  { quarter: 'Q3 2023', revenue: 201000, growth: 10 },
  { quarter: 'Q4 2023', revenue: 234000, growth: 16 },
]

const revenueStreams = [
  { name: 'Subscriptions', value: 156000, percentage: 45, color: '#8884d8' },
  { name: 'One-time Sales', value: 104000, percentage: 30, color: '#82ca9d' },
  { name: 'Services', value: 52000, percentage: 15, color: '#ffc658' },
  { name: 'Partnerships', value: 35000, percentage: 10, color: '#ff7300' },
]

export default function RevenueAnalytics({ dateRange }: RevenueAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue Analytics
        </CardTitle>
        <CardDescription>Comprehensive revenue breakdown and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="streams">Revenue Streams</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold">$347K</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Net Profit</p>
                    <p className="text-2xl font-bold">$95K</p>
                  </div>
                  <Banknote className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Profit Margin</p>
                    <p className="text-2xl font-bold">27.4%</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="profit" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="quarterly" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="streams" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {revenueStreams.map((stream, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: stream.color }}
                      ></div>
                      <div>
                        <p className="font-medium">{stream.name}</p>
                        <p className="text-sm text-gray-500">{stream.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${stream.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">$347K</div>
                  <div className="text-gray-500">Total Revenue</div>
                  <div className="text-green-600 font-medium mt-2">+18.5% vs last period</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}