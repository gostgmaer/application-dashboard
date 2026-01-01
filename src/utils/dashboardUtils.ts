// import { Product, Sale, Customer, DashboardFilters, DashboardStats, ChartData, TopListItem } from '@/types/dashboard';
import { DashboardFilters, DashboardStats, ProductList, TopListItem } from '@/types/product';
import { mockProducts, mockSales, mockCategories, mockBrands } from './mockData';
import { ChartData } from '@/types/dashboard';

export function filterProducts(products: ProductList[], filters: DashboardFilters): ProductList[] {
  return products.filter(product => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (!product.name.toLowerCase().includes(searchTerm) && 
          !product.sku.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      if (product.category !== filters.category) return false;
    }

    // Brand filter
    if (filters.brand && filters.brand !== 'all') {
      if (product.brand !== filters.brand) return false;
    }

    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Stock status filter
    if (filters.stockStatus !== 'all') {
      switch (filters.stockStatus) {
        case 'in-stock':
          if (product.stock <= 0) return false;
          break;
        case 'low-stock':
          if (product.stock > 10 || product.stock <= 0) return false;
          break;
        case 'out-of-stock':
          if (product.stock > 0) return false;
          break;
      }
    }

    // Date range filter
    const productDate = new Date(product.createdDate);
    const now = new Date();
    
    switch (filters.dateRange) {
      case 'today':
        if (productDate.toDateString() !== now.toDateString()) return false;
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (productDate < weekAgo) return false;
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (productDate < monthAgo) return false;
        break;
      case 'custom':
        if (filters.customDateStart && productDate < new Date(filters.customDateStart)) return false;
        if (filters.customDateEnd && productDate > new Date(filters.customDateEnd)) return false;
        break;
    }

    return true;
  });
}

export function calculateStats(filteredProducts: ProductList[]): DashboardStats {
  const totalProducts = filteredProducts.length;
  const activeProducts = filteredProducts.filter(p => p.status === 'active').length;
  const outOfStockCount = filteredProducts.filter(p => p.stock === 0).length;
  const productsOnSale = filteredProducts.filter(p => p.price < p.originalPrice).length;
  const avgBasePrice = filteredProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts || 0;
  const totalRevenue = mockSales.reduce((sum, s) => sum + s.amount, 0);
  const lowStockProductsCount = filteredProducts.filter(p => p.stock > 0 && p.stock <= 10).length;

  const categorySales = mockCategories.map(cat => ({
    name: cat.name,
    count: filteredProducts.filter(p => p.category === cat.name).length
  }));
  const topSellingCategory = categorySales.sort((a, b) => b.count - a.count)[0]?.name || 'N/A';
  
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const thisMonthProducts = filteredProducts.filter(p => 
    new Date(p.createdDate) >= thisMonth
  ).length;
  
  const averageStockPerProduct = filteredProducts.reduce((sum, p) => sum + p.stock, 0) / totalProducts || 0;

  return {
    totalProducts,
    activeProducts,
    outOfStockCount,
    productsOnSale,
    avgBasePrice,
    totalRevenue,
    lowStockProductsCount,
    topSellingCategory,
    thisMonthProducts,
    revenueGrowth: 12.5, // Mock data
    averageStockPerProduct,
    topDiscountedProductsCount: productsOnSale,
    productsWithDiscounts: 10
 
  };
}

export function getChartData(filteredProducts: ProductList[]): {
  productsByCategory: ChartData[];
  salesTrend: ChartData[];
  stockDistribution: ChartData[];
  topSellingProducts: ChartData[];
  revenueByCategory: ChartData[];
  cumulativeRevenue: ChartData[];
  topBrands: ChartData[];
  salesByRegion: ChartData[];
} {
  // Products by category
  const productsByCategory = mockCategories.map(cat => ({
    name: cat.name,
    value: filteredProducts.filter(p => p.category === cat.name).length,
    fill: `hsl(${Math.random() * 360}, 70%, 60%)`
  }));

  // Sales trend (mock monthly data)
  const salesTrend = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4000 },
    { name: 'Sep', value: 3200 },
    { name: 'Oct', value: 4200 },
    { name: 'Nov', value: 3800 },
    { name: 'Dec', value: 4500 },
  ];

  // Stock distribution
  const inStock = filteredProducts.filter(p => p.stock > 10).length;
  const lowStock = filteredProducts.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = filteredProducts.filter(p => p.stock === 0).length;
  
  const stockDistribution = [
    { name: 'In Stock', value: inStock, fill: '#10B981' },
    { name: 'Low Stock', value: lowStock, fill: '#F59E0B' },
    { name: 'Out of Stock', value: outOfStock, fill: '#EF4444' },
  ];

  // Top selling products
  const topSellingProducts = filteredProducts
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map(p => ({ name: p.name, value: p.sales }));

  // Revenue by category (mock data)
  const revenueByCategory = mockCategories.map(cat => ({
    name: cat.name,
    value: Math.random() * 10000 + 5000,
  }));

  // Cumulative revenue (mock data)
  const cumulativeRevenue = salesTrend.map((item, index) => ({
    name: item.name,
    value: salesTrend.slice(0, index + 1).reduce((sum, s) => sum + s.value, 0),
  }));

  // Top brands
  const topBrands = mockBrands.map(brand => ({
    name: brand.name,
    value: filteredProducts.filter(p => p.brand === brand.name).length,
  }));

  // Sales by region (mock data)
  const salesByRegion = [
    { name: 'North America', value: 35000 },
    { name: 'Europe', value: 28000 },
    { name: 'Asia', value: 22000 },
    { name: 'South America', value: 12000 },
    { name: 'Africa', value: 8000 },
    { name: 'Oceania', value: 5000 },
  ];

  return {
    productsByCategory,
    salesTrend,
    stockDistribution,
    topSellingProducts,
    revenueByCategory,
    cumulativeRevenue,
    topBrands,
    salesByRegion,
  };
}

export function getTopLists(filteredProducts: ProductList[]): {
  recentlyAdded: TopListItem[];
  topDiscounted: TopListItem[];
  lowStock: TopListItem[];
  bestSelling: TopListItem[];
  mostViewed: TopListItem[];
  topRegions: TopListItem[];
  highestReturnRate: TopListItem[];
  recentlyUpdated: TopListItem[];
  topRated: TopListItem[];
} {
  const recentlyAdded = filteredProducts
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.name,
      value: p.createdDate,
      subValue: `$${p.price}`,
      image: p.image,
    }));

  const topDiscounted = filteredProducts
    .filter(p => p.price < p.originalPrice)
    .sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.name,
      value: `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%`,
      subValue: `$${p.price}`,
      image: p.image,
    }));

  const lowStock = filteredProducts
    .filter(p => p.stock > 0 && p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8)
    .map(p => ({
      id: p.id,
      name: p.name,
      value: `${p.stock} units`,
      subValue: p.status,
      status: 'warning',
    }));

  const bestSelling = filteredProducts
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10)
    .map(p => ({
      id: p.id,
      name: p.name,
      value: `${p.sales} sold`,
      subValue: `$${p.price}`,
      image: p.image,
    }));

  const mostViewed = filteredProducts
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.name,
      value: `${p.views} views`,
      subValue: `${p.sales} sales`,
      image: p.image,
    }));



  const topRegions = [
    { id: '1', name: 'North America', value: '$35,000', subValue: '125 orders' },
    { id: '2', name: 'Europe', value: '$28,000', subValue: '98 orders' },
    { id: '3', name: 'Asia', value: '$22,000', subValue: '87 orders' },
    { id: '4', name: 'South America', value: '$12,000', subValue: '45 orders' },
    { id: '5', name: 'Africa', value: '$8,000', subValue: '32 orders' },
    { id: '6', name: 'Oceania', value: '$5,000', subValue: '18 orders' },
  ];

  const highestReturnRate = filteredProducts
    .sort((a, b) => b.returnRate - a.returnRate)
    .slice(0, 10)
    .map(p => ({
      id: p.id,
      name: p.name,
      value: `${p.returnRate}%`,
      subValue: `${p.sales} sold`,
      status: 'error',
    }));

  const recentlyUpdated = filteredProducts
    .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
    .slice(0, 11)
    .map(p => ({
      id: p.id,
      name: p.name,
      value: p.updatedDate,
      subValue: p.status,
      status: p.status === 'active' ? 'success' : p.status === 'draft' ? 'warning' : 'error',
    }));

  const topRated = filteredProducts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12)
    .map(p => ({
      id: p.id,
      name: p.name,
      value: `${p.rating} ⭐`,
      subValue: `${p.sales} sales`,
      image: p.image,
    }));

  return {
    recentlyAdded,
    topDiscounted,
    lowStock,
    bestSelling,
    mostViewed,
    topRegions,
    highestReturnRate,
    recentlyUpdated,
    topRated,
  };
}