"use client";

import { Suspense, useState } from "react";

import {
  mockReports,
  reportMetrics,
  chartData,
  pieChartData,
  deviceData,
} from "@/data/mockData";
import { FilterState, ReportItem } from "@/types/dashboard";
import { GeographicWidget } from "@/components/elements/widgets/GeographicWidget";
import { ExportButton } from "@/components/elements/items/export/ExportButton";
import { MetricCard } from "@/components/elements/items/common/MetricCard";
import { RevenueWidget } from "@/components/elements/widgets/RevenueWidget";
import { PieChart } from "@/components/elements/items/charts/PieChart";
import { FilterPanel } from "@/components/elements/items/filters/FilterPanel";
import { LineChart } from "@/components/elements/items/charts/LineChart";
import { ReportTable } from "@/components/elements/items/reports/ReportTable";
import PrivateLayout from "@/components/layout/dashboard";
import Breadcrumbs from "@/components/layout/common/breadcrumb";

export default function ReportsDashboard() {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: null, end: null },
    category: "",
    status: "",
    search: "",
  });

  const categories = Array.from(
    new Set(mockReports.map((report) => report.category))
  );

  const filteredReports = mockReports.filter((report) => {
    if (
      filters.search &&
      !report.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !report.createdBy.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    if (filters.category && report.category !== filters.category) {
      return false;
    }

    if (filters.status && report.status !== filters.status) {
      return false;
    }

    if (filters.dateRange.start && report.createdAt < filters.dateRange.start) {
      return false;
    }

    if (filters.dateRange.end && report.createdAt > filters.dateRange.end) {
      return false;
    }

    return true;
  });

  const handleViewReport = (report: ReportItem) => {
    alert(
      `Viewing report: ${report.title}\n\nThis would open a detailed view or modal with the full report content.`
    );
  };

  const handleDownloadReport = (report: ReportItem) => {
    alert(
      `Downloading ${
        report.title
      } (${report.type.toUpperCase()})\n\nIn a production app, this would trigger the actual file download.`
    );
  };

  const revenueData = {
    current: 125000,
    previous: 98000,
    target: 150000,
    currency: "USD",
  };

  return (
    <>
      <PrivateLayout>
        <div className=" mx-auto py-2">
          <Suspense fallback={<div>Loading...</div>}>
            <Breadcrumbs
              heading={"Report Dashboard"}
              desc={"Generate, manage, and analyze comprehensive reports"}
              btn={{ show: false} }
              btnComp={
                <ExportButton
                  data={mockReports}
                  filename="report-data"
                  title="Export Report Data"
                />}
            
            
            ></Breadcrumbs>

            <div className="rounded-md  shadow-sm overflow-auto ">
              <div className="space-y-6">
                {/* Header */}
              

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {reportMetrics.map((metric, index) => (
                    <MetricCard key={index} metric={metric} />
                  ))}
                </div>

                {/* Charts and Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <RevenueWidget data={revenueData} period="This Month" />
                  </div>
                  <div>
                    <PieChart data={pieChartData} title="Reports by Category" />
                    <GeographicWidget data={[]} title={""}></GeographicWidget>
                  </div>

                  <div>
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={setFilters}
                      categories={categories}
                      statuses={["completed", "pending", "failed"]}
                      placeholder="Search reports..."
                    />
                  </div>
                </div>

                {/* Additional Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <LineChart
                      data={chartData}
                      title="Report Generation Trends"
                      color="#10B981"
                    />
                  </div>
                  <div>
                    <PieChart data={deviceData} title="Access by Device Type" />
                  </div>
                </div>

                {/* Report Analytics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Report Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Completed
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {
                            mockReports.filter((r) => r.status === "completed")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Pending
                        </span>
                        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                          {
                            mockReports.filter((r) => r.status === "pending")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Failed
                        </span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {
                            mockReports.filter((r) => r.status === "failed")
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      File Types
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          PDF Reports
                        </span>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          {mockReports.filter((r) => r.type === "pdf").length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Excel Files
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {mockReports.filter((r) => r.type === "excel").length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          CSV Files
                        </span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {mockReports.filter((r) => r.type === "csv").length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Performance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Avg Generation Time
                        </span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          2.3s
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Success Rate
                        </span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          94.2%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total Size
                        </span>
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          1.2 GB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reports Table */}
                <ReportTable
                  reports={filteredReports}
                  onViewReport={handleViewReport}
                  onDownloadReport={handleDownloadReport}
                />
              </div>
            </div>
          </Suspense>
        </div>
      </PrivateLayout>
    </>
  );
}
