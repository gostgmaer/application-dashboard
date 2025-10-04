'use client';

import { useRecentlyAdded } from '@/hooks/useDashboardData';

export default function RecentlyAddedList() {
  const { recentlyAdded, isLoading } = useRecentlyAdded();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Recently Added Products
      </h3>
      <div className="space-y-4">
        {recentlyAdded?.map((product) => (
          <div key={product.id} className="flex items-center justify-between py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2 transition-colors duration-150">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {product.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(product.dateAdded).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}