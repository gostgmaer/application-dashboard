"use client";

import { Suspense, useState } from "react";

import {
  mockActivities,
  activityMetrics,
  chartData,
  systemMetrics,
  userSessions,
  securityEvents,
  performanceMetrics,
  realtimeData,
  geographicData,
} from "@/data/mockData";
import { FilterState } from "@/types/dashboard";
import { MetricCard } from "@/components/elements/items/common/MetricCard";
import { ExportButton } from "@/components/elements/items/export/ExportButton";
import { RealtimeChart } from "@/components/elements/widgets/RealtimeChart";
import { FilterPanel } from "@/components/elements/items/filters/FilterPanel";
import { SystemHealthWidget } from "@/components/elements/widgets/SystemHealthWidget";
import { ActiveUsersWidget } from "@/components/elements/widgets/ActiveUsersWidget";
import { SecurityAlertsWidget } from "@/components/elements/widgets/SecurityAlertsWidget";
import { PerformanceWidget } from "@/components/elements/widgets/PerformanceWidget";
import { GeographicWidget } from "@/components/elements/widgets/GeographicWidget";
import { LineChart } from "@/components/elements/items/charts/LineChart";
import { ActivityTable } from "@/components/elements/items/activity/ActivityTable";
import PrivateLayout from "@/components/layout/dashboard";
import Breadcrumbs from "@/components/layout/common/breadcrumb";

export default function ActivityDashboard() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: null, end: null },
    category: "",
    status: "",
    search: "",
  });

  const filteredActivities = mockActivities.filter((activity) => {
    if (
      filters.search &&
      !activity.user.toLowerCase().includes(filters.search.toLowerCase()) &&
      !activity.action.toLowerCase().includes(filters.search.toLowerCase()) &&
      !activity.resource.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    if (filters.status && activity.status !== filters.status) {
      return false;
    }

    if (
      filters.dateRange.start &&
      activity.timestamp < filters.dateRange.start
    ) {
      return false;
    }

    if (filters.dateRange.end && activity.timestamp > filters.dateRange.end) {
      return false;
    }

    return true;
  });

  return (
    <PrivateLayout>
      <div className=" mx-auto py-2">
        <Suspense fallback={<div>Loading...</div>}>
          <Breadcrumbs
            heading={"Activity Dashboard"}
            desc={"Monitor user activities and system events in real-time"}
            btnComp={
              <ExportButton
                data={filteredActivities}
                filename="activity-report"
                title="Export Activity Data"
              />
            }
            btn={{ show: false }}
          ></Breadcrumbs>

          <div className="rounded-md  shadow-sm overflow-auto ">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between"></div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activityMetrics.map((metric, index) => (
                  <MetricCard key={index} metric={metric} />
                ))}
              </div>

              {/* Charts and Filters */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RealtimeChart
                    title="Real-time Activity"
                    data={realtimeData}
                    color="#3B82F6"
                    unit=" req/min"
                  />
                </div>
                <div>
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    statuses={["success", "warning", "error"]}
                    placeholder="Search activities..."
                  />
                </div>
              </div>

              {/* Advanced Widgets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <SystemHealthWidget metrics={systemMetrics} />
                <ActiveUsersWidget sessions={userSessions} />
                <SecurityAlertsWidget events={securityEvents} />
              </div>

              {/* Performance and Geographic Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceWidget metrics={performanceMetrics} />
                <GeographicWidget
                  data={geographicData}
                  title="User Distribution"
                />
              </div>

              {/* Additional Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChart
                  data={chartData}
                  title="Monthly Activity Trends"
                  color="#10B981"
                />
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        99.9%
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Uptime
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        1.2s
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Avg Response
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Table */}
              <ActivityTable activities={filteredActivities} />
            </div>
          </div>
        </Suspense>
      </div>
    </PrivateLayout>
  );
}
