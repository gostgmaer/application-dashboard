// "use client";

// import { Package, PackageCheck, PackageX, PackagePlus, Layers, Tag } from "lucide-react";
// import StatsCards from "./UI/StatsCards";
// import DashboardToolbar from "./UI/DashboardToolbar";
// import ChartsSection from "./UI/ChartsSection";
// import AnalyticsWidgets from "./UI/AnalyticsWidgets";
// import ProductsTablePlaceholder from "./UI/ProductsTablePlaceholder";

// export default function ProductDashboard() {
//   return (
//     <div className="min-h-screen bg-black text-white">
//       <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
//         <div className="flex flex-col gap-2 mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Product Dashboard</h1>
//           <p className="text-gray-400">Monitor and manage your product inventory</p>
//         </div>

//         <StatsCards />

//         <DashboardToolbar />

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <ChartsSection />
//           </div>
//           <div className="lg:col-span-1">
//             <AnalyticsWidgets />
//           </div>
//         </div>

//         <ProductsTablePlaceholder />
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo } from "react";

import { Package } from "lucide-react";
import { DashboardFilters } from "@/types/product";
import {
  calculateStats,
  filterProducts,
  getChartData,
  getTopLists,
} from "@/utils/dashboardUtils";
import { mockProducts } from "@/utils/mockData";
import { GlobalFilters } from "./dashboard/GlobalFilters";
import { StatsCards } from "./dashboard/StatsCards";
import { ChartsSection } from "./dashboard/ChartsSection";
import { TopLists } from "./dashboard/TopLists";
import { ProductsTable } from "./dashboard/ProductsTable";
import { useApiSWR } from "@/hooks/useApiSWR";

export default function DashboardPage(token: any) {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: "month",
    category: "all",
    brand: "all",
    priceRange: [0, 500],
    stockStatus: "all",
    search: "",
  });

  // const [isLoading, setIsLoading] = useState(true);

  const { data, error, isLoading, mutate } = useApiSWR(
    "/products/database-stats",
    token,
    undefined,
    undefined,
    undefined,
    { refreshInterval: 0 }
  );
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      // setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Memoize filtered data and calculations
  const filteredProducts = useMemo(
    () => filterProducts(mockProducts, filters),
    [filters]
  );

  const dashboardStats = useMemo(
    () => calculateStats(filteredProducts),
    [filteredProducts]
  );

  const chartData = useMemo(
    () => getChartData(filteredProducts),
    [filteredProducts]
  );

  const topLists = useMemo(
    () => getTopLists(filteredProducts),
    [filteredProducts]
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
      <div className="">
        {/* Global Filters */}
        <GlobalFilters filters={filters} onFiltersChange={setFilters} />

        {/* Stats Cards */}
        <StatsCards stats={data} />

        {/* Charts Section */}
        <ChartsSection chartData={chartData} />

        {/* Top Lists */}
        <TopLists topLists={topLists} />

        {/* Products Table */}
        <ProductsTable />
      </div>
    </div>
  );
}
