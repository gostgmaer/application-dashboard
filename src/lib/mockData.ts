// Mock data for dashboard components
// In production, this would be replaced with SWR API calls

export const statsData = {
  totalSales: { value: 2456789, change: 12.5, trend: 'up' },
  totalOrders: { value: 15234, change: 8.2, trend: 'up' },
  totalCustomers: { value: 8945, change: 5.7, trend: 'up' },
  totalRevenue: { value: 1875432, change: 15.3, trend: 'up' },
  totalProducts: { value: 1205, change: -2.1, trend: 'down' },
  totalBrands: { value: 87, change: 3.4, trend: 'up' },
  averageOrderValue: { value: 161.24, change: 7.8, trend: 'up' },
  totalDiscounts: { value: 45620, change: -5.2, trend: 'down' },
  conversionRate: { value: 3.45, change: 0.8, trend: 'up' },
  cartAbandonmentRate: { value: 68.2, change: -2.3, trend: 'down' },
  returnRate: { value: 4.8, change: -1.2, trend: 'down' },
  customerLifetimeValue: { value: 485.67, change: 12.4, trend: 'up' },
  monthlyRecurringRevenue: { value: 125000, change: 18.7, trend: 'up' },
  grossMargin: { value: 42.8, change: 2.1, trend: 'up' },
  inventoryTurnover: { value: 6.2, change: 0.9, trend: 'up' },
  customerAcquisitionCost: { value: 28.45, change: -3.2, trend: 'down' },
};

export const salesChartData = [
  { month: 'Jan', sales: 185000 },
  { month: 'Feb', sales: 195000 },
  { month: 'Mar', sales: 175000 },
  { month: 'Apr', sales: 210000 },
  { month: 'May', sales: 225000 },
  { month: 'Jun', sales: 245000 },
  { month: 'Jul', sales: 235000 },
  { month: 'Aug', sales: 265000 },
  { month: 'Sep', sales: 255000 },
  { month: 'Oct', sales: 275000 },
  { month: 'Nov', sales: 285000 },
  { month: 'Dec', sales: 295000 },
];

export const topCategoriesData = [
  { category: 'Electronics', sales: 450000 },
  { category: 'Clothing', sales: 380000 },
  { category: 'Home & Garden', sales: 285000 },
  { category: 'Sports', sales: 225000 },
  { category: 'Books', sales: 165000 },
  { category: 'Beauty', sales: 145000 },
];

export const revenueDistributionData = [
  { name: 'Electronics', value: 35, fill: '#3b82f6' },
  { name: 'Clothing', value: 28, fill: '#06d6a0' },
  { name: 'Home & Garden', value: 18, fill: '#f59e0b' },
  { name: 'Sports', value: 12, fill: '#ef4444' },
  { name: 'Others', value: 7, fill: '#8b5cf6' },
];

export const ordersTrendData = [
  { month: 'Jan', orders: 1200 },
  { month: 'Feb', orders: 1350 },
  { month: 'Mar', orders: 1180 },
  { month: 'Apr', orders: 1420 },
  { month: 'May', orders: 1580 },
  { month: 'Jun', orders: 1650 },
  { month: 'Jul', orders: 1520 },
  { month: 'Aug', orders: 1720 },
  { month: 'Sep', orders: 1680 },
  { month: 'Oct', orders: 1850 },
  { month: 'Nov', orders: 1920 },
  { month: 'Dec', orders: 2100 },
];

export const customerGrowthData = [
  { month: 'Jan', customers: 150 },
  { month: 'Feb', customers: 185 },
  { month: 'Mar', customers: 142 },
  { month: 'Apr', customers: 198 },
  { month: 'May', customers: 225 },
  { month: 'Jun', customers: 250 },
  { month: 'Jul', customers: 235 },
  { month: 'Aug', customers: 275 },
  { month: 'Sep', customers: 265 },
  { month: 'Oct', customers: 295 },
  { month: 'Nov', customers: 315 },
  { month: 'Dec', customers: 340 },
];

export const discountUsageData = [
  { name: 'With Discount', value: 35, fill: '#06d6a0' },
  { name: 'Without Discount', value: 65, fill: '#e5e7eb' },
];

export const topProductsData = [
  { id: 1, name: 'iPhone 14 Pro', category: 'Electronics', price: 999, status: 'Active' },
  { id: 2, name: 'Nike Air Max', category: 'Sports', price: 129, status: 'Active' },
  { id: 3, name: 'MacBook Pro M2', category: 'Electronics', price: 1999, status: 'Active' },
  { id: 4, name: 'Samsung 4K TV', category: 'Electronics', price: 799, status: 'Low Stock' },
  { id: 5, name: 'Designer Jacket', category: 'Clothing', price: 249, status: 'Active' },
];

export const topBrandsData = [
  { id: 1, brand: 'Apple', productsCount: 45, revenue: 1250000 },
  { id: 2, brand: 'Samsung', productsCount: 38, revenue: 875000 },
  { id: 3, brand: 'Nike', productsCount: 52, revenue: 650000 },
  { id: 4, brand: 'Adidas', productsCount: 41, revenue: 525000 },
  { id: 5, brand: 'Sony', productsCount: 29, revenue: 475000 },
];

export const recentOrdersData = [
  { id: 'ORD-001', customer: 'John Doe', total: 299.99, status: 'Completed' },
  { id: 'ORD-002', customer: 'Jane Smith', total: 149.50, status: 'Processing' },
  { id: 'ORD-003', customer: 'Mike Johnson', total: 89.99, status: 'Shipped' },
  { id: 'ORD-004', customer: 'Sarah Wilson', total: 199.99, status: 'Pending' },
  { id: 'ORD-005', customer: 'David Brown', total: 349.99, status: 'Completed' },
];

export const topDiscountedData = [
  { id: 1, name: 'Wireless Headphones', originalPrice: 199, discountedPrice: 149, discount: 25 },
  { id: 2, name: 'Smart Watch', originalPrice: 299, discountedPrice: 199, discount: 33 },
  { id: 3, name: 'Gaming Mouse', originalPrice: 79, discountedPrice: 59, discount: 25 },
  { id: 4, name: 'Bluetooth Speaker', originalPrice: 129, discountedPrice: 89, discount: 31 },
  { id: 5, name: 'Phone Case', originalPrice: 39, discountedPrice: 24, discount: 38 },
];

export const lowStockData = [
  { id: 1, name: 'iPhone 14 Pro Max', stock: 5, category: 'Electronics' },
  { id: 2, name: 'MacBook Air M2', stock: 3, category: 'Electronics' },
  { id: 3, name: 'Gaming Keyboard', stock: 8, category: 'Electronics' },
  { id: 4, name: 'Designer Jeans', stock: 12, category: 'Clothing' },
  { id: 5, name: 'Running Shoes', stock: 7, category: 'Sports' },
];

export const recentlyAddedData = [
  { id: 1, name: 'AirPods Pro 2', dateAdded: '2024-01-15' },
  { id: 2, name: 'Tesla Model Y Toy', dateAdded: '2024-01-14' },
  { id: 3, name: 'Organic Coffee Beans', dateAdded: '2024-01-13' },
  { id: 4, name: 'Yoga Mat Premium', dateAdded: '2024-01-12' },
  { id: 5, name: 'Wireless Charger', dateAdded: '2024-01-11' },
];

export const conversionFunnelData = [
  { stage: 'Visitors', count: 45000, percentage: 100 },
  { stage: 'Product Views', count: 28000, percentage: 62.2 },
  { stage: 'Add to Cart', count: 12500, percentage: 27.8 },
  { stage: 'Checkout', count: 8200, percentage: 18.2 },
  { stage: 'Purchase', count: 1553, percentage: 3.45 },
];

export const salesByChannelData = [
  { channel: 'Website', sales: 1250000, percentage: 52 },
  { channel: 'Mobile App', sales: 750000, percentage: 31 },
  { channel: 'Social Media', sales: 285000, percentage: 12 },
  { channel: 'Marketplace', sales: 120000, percentage: 5 },
];

export const topCountriesData = [
  { country: 'United States', sales: 850000, orders: 4250 },
  { country: 'United Kingdom', sales: 420000, orders: 2100 },
  { country: 'Germany', sales: 380000, orders: 1900 },
  { country: 'Canada', sales: 285000, orders: 1425 },
  { country: 'Australia', sales: 195000, orders: 975 },
  { country: 'France', sales: 165000, orders: 825 },
];

export const hourlyTrafficData = [
  { hour: '00:00', visitors: 120 },
  { hour: '01:00', visitors: 85 },
  { hour: '02:00', visitors: 65 },
  { hour: '03:00', visitors: 45 },
  { hour: '04:00', visitors: 35 },
  { hour: '05:00', visitors: 55 },
  { hour: '06:00', visitors: 95 },
  { hour: '07:00', visitors: 145 },
  { hour: '08:00', visitors: 185 },
  { hour: '09:00', visitors: 225 },
  { hour: '10:00', visitors: 285 },
  { hour: '11:00', visitors: 320 },
  { hour: '12:00', visitors: 385 },
  { hour: '13:00', visitors: 420 },
  { hour: '14:00', visitors: 465 },
  { hour: '15:00', visitors: 485 },
  { hour: '16:00', visitors: 445 },
  { hour: '17:00', visitors: 395 },
  { hour: '18:00', visitors: 365 },
  { hour: '19:00', visitors: 325 },
  { hour: '20:00', visitors: 285 },
  { hour: '21:00', visitors: 245 },
  { hour: '22:00', visitors: 195 },
  { hour: '23:00', visitors: 155 },
];

export const productPerformanceData = [
  { month: 'Jan', views: 125000, sales: 8500, conversion: 6.8 },
  { month: 'Feb', views: 135000, sales: 9200, conversion: 6.8 },
  { month: 'Mar', views: 118000, sales: 7800, conversion: 6.6 },
  { month: 'Apr', views: 142000, sales: 10200, conversion: 7.2 },
  { month: 'May', views: 158000, sales: 12500, conversion: 7.9 },
  { month: 'Jun', views: 165000, sales: 13800, conversion: 8.4 },
  { month: 'Jul', views: 152000, sales: 12200, conversion: 8.0 },
  { month: 'Aug', views: 175000, sales: 15200, conversion: 8.7 },
  { month: 'Sep', views: 168000, sales: 14500, conversion: 8.6 },
  { month: 'Oct', views: 185000, sales: 16800, conversion: 9.1 },
  { month: 'Nov', views: 195000, sales: 18500, conversion: 9.5 },
  { month: 'Dec', views: 210000, sales: 21200, conversion: 10.1 },
];

export const ageGroupData = [
  { ageGroup: '18-24', customers: 1250, percentage: 18.5 },
  { ageGroup: '25-34', customers: 2850, percentage: 42.2 },
  { ageGroup: '35-44', customers: 1680, percentage: 24.9 },
  { ageGroup: '45-54', customers: 720, percentage: 10.7 },
  { ageGroup: '55+', customers: 250, percentage: 3.7 },
];

export const deviceTypeData = [
  { device: 'Desktop', sessions: 15500, percentage: 45.2, fill: '#3b82f6' },
  { device: 'Mobile', sessions: 12800, percentage: 37.3, fill: '#06d6a0' },
  { device: 'Tablet', sessions: 6000, percentage: 17.5, fill: '#f59e0b' },
];

export const paymentMethodData = [
  { method: 'Credit Card', transactions: 8500, percentage: 55.8, fill: '#3b82f6' },
  { method: 'PayPal', transactions: 3200, percentage: 21.0, fill: '#06d6a0' },
  { method: 'Apple Pay', transactions: 2100, percentage: 13.8, fill: '#f59e0b' },
  { method: 'Google Pay', transactions: 980, percentage: 6.4, fill: '#ef4444' },
  { method: 'Bank Transfer', transactions: 454, percentage: 3.0, fill: '#8b5cf6' },
];
export const filterOptions = {
  timeRange: ['Today', 'Week', 'Month', 'Quarter', 'Year'],
  category: ['All Categories', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty'],
  status: ['All Status', 'Active', 'Low Stock', 'Out of Stock', 'Discontinued'],
};