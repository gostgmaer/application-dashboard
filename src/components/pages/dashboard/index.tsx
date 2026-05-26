"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ChevronDown } from 'lucide-react'

import RevenueAnalytics from '@/components/elements/widgets/RevenueAnalytics'
import ChartsSection from '@/components/elements/widgets/ChartsSection'
import PerformanceMetrics from '@/components/elements/widgets/PerformanceMetrics'
import QuickActions from '@/components/elements/widgets/QuickActions'
import UserEngagement from '@/components/elements/widgets/UserEngagement'
import SocialMediaStats from '@/components/elements/widgets/SocialMediaStats'
import TaskManagement from '@/components/elements/widgets/TaskManagement'
import GoalsProgress from '@/components/elements/widgets/GoalsProgress'
import DataTables from '@/components/elements/widgets/DataTables'
import ActivityLogs from '@/components/elements/widgets/ActivityLogs'
import WeatherWidget from '@/components/elements/widgets/WeatherWidget'
import TeamActivity from '@/components/elements/widgets/TeamActivity'
import InventoryOverview from '@/components/elements/widgets/InventoryOverview'
import CalendarWidget from '@/components/elements/widgets/CalendarWidget'
import NotificationCenter from '@/components/elements/widgets/NotificationCenter'
import AnalyticsOverview from '@/components/elements/widgets/AnalyticsOverview'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
} as const

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 75,
      damping: 15,
    },
  },
} as const

export default function DashboardLayout() {
  const [selectedDateRange, setSelectedDateRange] = useState('7d')

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50/50 dark:bg-slate-950/40 p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Glowing Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-[100px]" />
        <div className="absolute top-3/4 right-1/10 w-[450px] h-[450px] rounded-full bg-purple-500/10 dark:bg-purple-600/5 blur-[120px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 space-y-8"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-white dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
              Welcome back! Here&apos;s a premium glance of what&apos;s happening with your business today.
            </p>
          </div>
          <div className="flex items-center space-x-3 self-start sm:self-center">
            <div className="relative inline-flex items-center">
              <span className="absolute left-3 text-slate-450 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
              </span>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="pl-9 pr-8 py-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 text-sm font-semibold rounded-xl focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 focus:outline-none transition-all duration-200 appearance-none shadow-sm cursor-pointer"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <span className="absolute right-3 pointer-events-none text-slate-450">
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Analytics Cards Row */}
        <motion.div variants={itemVariants}>
          <AnalyticsOverview dateRange={selectedDateRange} />
        </motion.div>

        {/* Revenue Analytics Widget */}
        <motion.div variants={itemVariants}>
          <RevenueAnalytics dateRange={selectedDateRange} />
        </motion.div>

        {/* Charts & Actions Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <ChartsSection dateRange={selectedDateRange} />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-6">
            <PerformanceMetrics />
            <QuickActions />
          </motion.div>
        </div>

        {/* Engagement and Stats Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <UserEngagement />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SocialMediaStats />
          </motion.div>
        </div>

        {/* Tasks and Goals Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <TaskManagement />
          </motion.div>
          <motion.div variants={itemVariants}>
            <GoalsProgress />
          </motion.div>
        </div>

        {/* Tables & Dynamic Feed Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="xl:col-span-2">
            <DataTables />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-6">
            <ActivityLogs />
            <NotificationCenter />
            <WeatherWidget />
          </motion.div>
        </div>

        {/* Operational Performance & Inventory */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <TeamActivity />
          </motion.div>
          <motion.div variants={itemVariants}>
            <InventoryOverview />
          </motion.div>
        </div>

        {/* Calendar Row */}
        <motion.div variants={itemVariants}>
          <CalendarWidget />
        </motion.div>
      </motion.div>
    </div>
  )
}