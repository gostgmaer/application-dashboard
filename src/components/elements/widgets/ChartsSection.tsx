'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
  { name: 'Desktop', value: 400, color: '#6366f1' },
  { name: 'Mobile', value: 300, color: '#10b981' },
  { name: 'Tablet', value: 200, color: '#f59e0b' },
  { name: 'Other', value: 100, color: '#64748b' },
]

export default function ChartsSection({ dateRange }: ChartsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Revenue & Users Chart */}
      <Card className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-950 dark:text-white">Revenue & User Growth</CardTitle>
          <CardDescription className="text-xs text-slate-500">Monthly revenue and user acquisition trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-slate-50/20 dark:bg-slate-950/10 rounded-2xl p-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600
                  }} 
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  name="Monthly Revenue ($)"
                  dataKey="revenue" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  name="New Users Count"
                  dataKey="users" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders & Returns Chart */}
        <Card className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-950 dark:text-white">Weekly Orders</CardTitle>
            <CardDescription className="text-xs text-slate-500">Orders vs Returns comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-slate-50/20 dark:bg-slate-950/10 rounded-2xl p-2">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95}/>
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.65}/>
                    </linearGradient>
                    <linearGradient id="chartReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.95}/>
                      <stop offset="100%" stopColor="#e11d48" stopOpacity={0.65}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600
                    }} 
                  />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                  <Bar dataKey="orders" name="Orders" fill="url(#chartOrders)" radius={[4, 4, 0, 0]} maxBarSize={25} />
                  <Bar dataKey="returns" name="Returns" fill="url(#chartReturns)" radius={[4, 4, 0, 0]} maxBarSize={25} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Usage Pie Chart */}
        <Card className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-950 dark:text-white">Device Usage</CardTitle>
            <CardDescription className="text-xs text-slate-500">Traffic distribution by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-slate-50/20 dark:bg-slate-950/10 rounded-2xl p-2 flex items-center justify-center min-h-[250px]">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600
                    }} 
                  />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '5px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}