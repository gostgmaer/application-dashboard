"use client"
import React, { useState } from 'react'

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
// import { NotificationCenter } from './email/NotificationCenter'
import WeatherWidget from '@/components/elements/widgets/WeatherWidget'
import TeamActivity from '@/components/elements/widgets/TeamActivity'
import InventoryOverview from '@/components/elements/widgets/InventoryOverview'
import CalendarWidget from '@/components/elements/widgets/CalendarWidget'
import NotificationCenter from '@/components/elements/widgets/NotificationCenter'
import AnalyticsOverview from '@/components/elements/widgets/AnalyticsOverview'

export default function DashboardLayout() {
  const [selectedDateRange, setSelectedDateRange] = useState('7d')


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
     <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your business today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Analytics Overview */}
        <AnalyticsOverview dateRange={selectedDateRange} />

        {/* Revenue Analytics */}
        <RevenueAnalytics dateRange={selectedDateRange} />

        {/* Charts and Performance */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ChartsSection dateRange={selectedDateRange} />
          </div>
          <div className="space-y-6">
            <PerformanceMetrics />
            <QuickActions />
          </div>
        </div>

        {/* User Engagement and Social Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <UserEngagement />
          <SocialMediaStats />
        </div>

        {/* Task Management and Goals */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TaskManagement />
          <GoalsProgress />
        </div>

        {/* Activity and Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <DataTables />
          </div>
          <div className="space-y-6">
            <ActivityLogs />
            <NotificationCenter />
            <WeatherWidget />
          </div>
        </div>

        {/* Team and Inventory */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TeamActivity />
          <InventoryOverview />
        </div>

        {/* Calendar */}
        <CalendarWidget />
      </div>
    </div>
  )
}