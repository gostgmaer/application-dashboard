"use client";

import { Package, PackageCheck, PackageX, PackagePlus, Layers, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const stats = [
  { label: "Total Products", value: "1,234", icon: Package, trend: "+12.3%" },
  { label: "Active Products", value: "987", icon: PackageCheck, trend: "+5.2%" },
  { label: "Out of Stock", value: "23", icon: PackageX, trend: "-3.1%" },
  { label: "New Today", value: "8", icon: PackagePlus, trend: "+100%" },
  { label: "Total Categories", value: "45", icon: Layers, trend: "+2" },
  { label: "Total Brands", value: "78", icon: Tag, trend: "+5" },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-[#1f1f1f] border-gray-800 p-6 hover:bg-[#252525] transition-colors duration-200 group"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                {stat.trend}
              </p>
            </div>
            <div className="p-2 bg-black rounded-lg group-hover:bg-gray-900 transition-colors">
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="bg-[#1f1f1f] border-gray-800 p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24 bg-gray-800" />
              <Skeleton className="h-8 w-16 bg-gray-800" />
              <Skeleton className="h-3 w-12 bg-gray-800" />
            </div>
            <Skeleton className="w-9 h-9 rounded-lg bg-gray-800" />
          </div>
        </Card>
      ))}
    </div>
  );
}
