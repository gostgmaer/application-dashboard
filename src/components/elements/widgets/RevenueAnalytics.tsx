'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, CreditCard, Banknote, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

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
  { quarter: 'Q1 2023', revenue: 145000, profit: 40500 },
  { quarter: 'Q2 2023', revenue: 183000, profit: 51200 },
  { quarter: 'Q3 2023', revenue: 201000, profit: 56800 },
  { quarter: 'Q4 2023', revenue: 234000, profit: 65500 },
]

const revenueStreams = [
  { name: 'Subscriptions', value: 156000, percentage: 45, color: '#6366f1', glow: 'shadow-indigo-500/10' },
  { name: 'One-time Sales', value: 104000, percentage: 30, color: '#10b981', glow: 'shadow-emerald-500/10' },
  { name: 'Services', value: 52000, percentage: 15, color: '#f59e0b', glow: 'shadow-amber-500/10' },
  { name: 'Partnerships', value: 35000, percentage: 10, color: '#ec4899', glow: 'shadow-pink-500/10' },
]

export default function RevenueAnalytics({ dateRange }: RevenueAnalyticsProps) {
  return (
    <Card className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-slate-100 dark:border-slate-850">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight text-slate-950 dark:text-white flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <DollarSign className="h-5 w-5" />
            </div>
            Revenue Analytics
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-xs">
            Comprehensive revenue breakdown and performance metrics
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="monthly" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-[400px] p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200/40 dark:border-slate-800/40 rounded-xl">
            <TabsTrigger value="monthly" className="rounded-lg text-xs font-semibold py-2">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly" className="rounded-lg text-xs font-semibold py-2">Quarterly</TabsTrigger>
            <TabsTrigger value="streams" className="rounded-lg text-xs font-semibold py-2">Revenue Streams</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-6 outline-none focus-visible:ring-0">
            {/* Analytics Sub-Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-5 shadow-sm">
                <div className="absolute right-3 -bottom-3 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">$347,000</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold flex items-center">
                      <TrendingUp className="h-3.5 w-3.5 mr-1" />
                      +18.2% vs last month
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5 shadow-sm">
                <div className="absolute right-3 -bottom-3 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">Net Profit</p>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">$95,000</p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-500 font-semibold flex items-center">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                      +14.5% vs last month
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Banknote className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-2xl p-5 shadow-sm">
                <div className="absolute right-3 -bottom-3 w-16 h-16 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-pink-700 dark:text-pink-400 text-xs font-bold uppercase tracking-wider">Profit Margin</p>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">27.4%</p>
                    <p className="text-[10px] text-pink-600 dark:text-pink-500 font-semibold flex items-center">
                      <TrendingUp className="h-3.5 w-3.5 mr-1" />
                      +3.1% index change
                    </p>
                  </div>
                  <div className="p-3 bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-xl">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Area Chart Container */}
            <div className="w-full bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/40 rounded-2xl p-4">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
                  <XAxis 
                    dataKey="month" 
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
                    formatter={(value) => [`$${value.toLocaleString()}`, '']} 
                  />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                  <Area type="monotone" name="Total Revenue" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
                  <Area type="monotone" name="Net Profit" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="quarterly" className="space-y-4 outline-none focus-visible:ring-0">
            <div className="w-full bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/40 rounded-2xl p-4">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={quarterlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95}/>
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="barProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.95}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.12)" />
                  <XAxis 
                    dataKey="quarter" 
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
                    formatter={(value) => [`$${value.toLocaleString()}`, '']} 
                  />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} />
                  <Bar dataKey="revenue" name="Total Revenue" fill="url(#barRevenue)" radius={[6, 6, 0, 0]} maxBarSize={45} />
                  <Bar dataKey="profit" name="Net Profit" fill="url(#barProfit)" radius={[6, 6, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="streams" className="space-y-4 outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                {revenueStreams.map((stream, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-800/45 rounded-xl">
                    <div className="flex items-center space-x-3.5">
                      <div 
                        className="w-3.5 h-3.5 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: stream.color }}
                      />
                      <div>
                        <p className="font-semibold text-slate-850 dark:text-slate-200 text-sm">{stream.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{stream.percentage}% of total stream</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">${stream.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10 min-h-[250px]">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-3 rounded-full bg-indigo-500/10 text-indigo-500">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">$347,000</div>
                    <div className="text-xs font-semibold text-slate-400">Total Stream Revenue</div>
                  </div>
                  <div className="inline-flex px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    +18.5% vs last period
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}