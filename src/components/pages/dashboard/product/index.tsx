
"use client";

import { useState } from "react";

import { Package } from "lucide-react";
import { StatsCards } from "./dashboard/StatsCards";
import { ProductsTable } from "./dashboard/ProductsTable";
import { useApiSWR } from "@/hooks/useApiSWR";

export default function DashboardPage({token, category}: any) {
  const { data, error, isLoading, mutate } = useApiSWR(
    "/products/database-stats",
    token,
    undefined,
    undefined,
    undefined,
    { refreshInterval: 0 }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <Package className="h-16 w-16 mx-auto mb-6 animate-spin text-primary" />
            <div className="absolute inset-0 h-16 w-16 mx-auto animate-ping">
              <Package className="h-16 w-16 text-primary/20" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gradient">
            Loading Dashboard
          </h2>
          <p className="text-muted-foreground text-lg">
            Preparing your analytics and insights...
          </p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      {/* Main Content */}
    
        {/* Global Filters */}
        {/* <GlobalFilters filters={filters} onFiltersChange={setFilters} /> */}

        {/* Stats Cards */}
        <StatsCards stats={data} />

        {/* Charts Section */}
        {/* <ChartsSection chartData={chartData} /> */}

        {/* Top Lists */}
        {/* <TopLists topLists={topLists} /> */}

        {/* Products Table */}
        <ProductsTable category={category} />
     
    </div>
  );
}
