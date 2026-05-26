'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

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
      description: 'from last month',
      gradient: 'from-indigo-500/20 to-purple-500/20',
      iconColor: 'text-indigo-500 dark:text-indigo-400',
      iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      glow: 'shadow-indigo-500/5 dark:shadow-indigo-500/10'
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'from last month',
      gradient: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-500 dark:text-pink-400',
      iconBg: 'bg-pink-500/10 dark:bg-pink-500/20',
      glow: 'shadow-pink-500/5 dark:shadow-pink-500/10'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '-2.4%',
      changeType: 'negative' as const,
      icon: ShoppingCart,
      description: 'from last month',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      glow: 'shadow-emerald-500/5 dark:shadow-emerald-500/10'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: Activity,
      description: 'from last month',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-500 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      glow: 'shadow-blue-500/5 dark:shadow-blue-500/10'
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 80 } }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {metrics.map((metric) => (
        <motion.div
          key={metric.title}
          variants={item}
          whileHover={{ y: -5, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="h-full"
        >
          <Card className={`relative overflow-hidden h-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-md ${metric.glow} hover:shadow-xl dark:hover:border-slate-700/80 transition-all duration-300`}>
            {/* Subtle Gradient Backglow */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${metric.gradient} blur-2xl opacity-70`} />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400">{metric.title}</CardTitle>
              <div className={`p-2.5 rounded-xl ${metric.iconBg} ${metric.iconColor} transition-colors duration-300`}>
                <metric.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{metric.value}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center mt-2.5">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-lg text-xs font-bold mr-2 ${
                  metric.changeType === 'positive' 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                    : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </span>
                <span>{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}