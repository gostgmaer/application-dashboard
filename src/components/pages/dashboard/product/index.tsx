"use client";

import { Package, PackageCheck, PackageX, PackagePlus, Layers, Tag } from "lucide-react";
import StatsCards from "./UI/StatsCards";
import DashboardToolbar from "./UI/DashboardToolbar";
import ChartsSection from "./UI/ChartsSection";
import AnalyticsWidgets from "./UI/AnalyticsWidgets";
import ProductsTablePlaceholder from "./UI/ProductsTablePlaceholder";

export default function ProductDashboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Product Dashboard</h1>
          <p className="text-gray-400">Monitor and manage your product inventory</p>
        </div>

        <StatsCards />

        <DashboardToolbar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartsSection />
          </div>
          <div className="lg:col-span-1">
            <AnalyticsWidgets />
          </div>
        </div>

        <ProductsTablePlaceholder />
      </div>
    </div>
  );
}
