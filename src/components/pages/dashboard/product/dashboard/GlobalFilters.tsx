'use client';

import { useState } from 'react';
import { Calendar, Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { DashboardFilters } from '@/types/product';
import { mockBrands, mockCategories } from '@/utils/mockData';


interface GlobalFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
}

export function GlobalFilters({ filters, onFiltersChange }: GlobalFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof DashboardFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: 'month',
      category: 'all',
      brand: 'all',
      priceRange: [0, 500],
      stockStatus: 'all',
      search: '',
    });
  };

  const activeFiltersCount = [
    filters.search,
    filters.category !== 'all' ? filters.category : null,
    filters.brand !== 'all' ? filters.brand : null,
    filters.stockStatus !== 'all' ? filters.stockStatus : null,
    filters.dateRange !== 'month' ? filters.dateRange : null,
  ].filter(Boolean).length;

  return (
    <Card className="glass-effect border-0 shadow-premium animate-fade-in">
      <CardContent className="p-0 py-5">
        <div className="flex flex-col space-y-4">
          {/* Search and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search products by name or SKU..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-12 h-12 text-base input-premium"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 h-12 px-6 button-premium"
              >
                <Filter className="h-5 w-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="h-12 px-4 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 pt-6 border-t border-border/50 animate-slide-up">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Date Range</label>
                <Select value={filters.dateRange} onValueChange={(value: any) => updateFilter('dateRange', value)}>
                  <SelectTrigger className="h-11 input-premium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Category</label>
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger className="h-11 input-premium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {mockCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Brand</label>
                <Select value={filters.brand} onValueChange={(value) => updateFilter('brand', value)}>
                  <SelectTrigger className="h-11 input-premium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {mockBrands.map(brand => (
                      <SelectItem key={brand.id} value={brand.name}>{brand.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stock Status */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Stock Status</label>
                <Select value={filters.stockStatus} onValueChange={(value: any) => updateFilter('stockStatus', value)}>
                  <SelectTrigger className="h-11 input-premium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold text-foreground">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value: [number, number]) => updateFilter('priceRange', value)}
                  min={0}
                  max={500}
                  step={10}
                  className="w-full mt-4"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}