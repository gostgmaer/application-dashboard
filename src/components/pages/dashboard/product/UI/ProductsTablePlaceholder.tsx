"use client";

import { Card } from "@/components/ui/card";
import { Table } from "lucide-react";

export default function ProductsTablePlaceholder() {
  return (
    <Card className="bg-[#1f1f1f] border-gray-800 p-8">
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="p-4 bg-black rounded-full">
          <Table className="w-8 h-8 text-white" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-white">Products Table</h3>
          <p className="text-gray-400 max-w-md">
            Your existing products table component goes here. This section is reserved for displaying the detailed product list with sorting, filtering, and pagination.
          </p>
        </div>
        <div className="mt-8 w-full max-w-2xl">
          <div className="bg-black rounded-lg p-6 border border-gray-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
              </div>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-900">
                  <div className="h-3 w-32 bg-gray-900 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-900 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-900 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-900 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
