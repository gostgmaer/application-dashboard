// types/product.ts

export interface FileReference {
  id?: string;
  url?: string;
  name?: string;
  size?: number;
  type?: string;
}

export interface Product {
  id: string;
  _id: string;
  title: string;
  slug: string;
  sku: string;
  productType?: 'physical' | 'digital' | 'service';
  category: string | { _id: string; title: string };
  categories?: string[];
  subcategory?: string;
  brand?: string | { _id: string; name: string };
  descriptions?: Record<string, any>;
  shortDescription?: string;
  overview?: string;
  basePrice: number;
  finalPrice?: number;
  comparePrice?: number;
  costPrice?: number;
  salePrice?: number;
  discount?: number;
  discountType?: 'none' | 'percentage' | 'fixed';
  discountValue?: number;
  inventory: number;
  trackInventory?: boolean;
  lowStockThreshold?: number;
  isActive: boolean;
  isDeleted?: boolean;
  status: 'active' | 'inactive' | 'draft' | 'pending' | 'archived' | 'published';
  mainImage?: FileReference;
  images: FileReference[];
  tags?: string[];
  isFeatured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  bestseller?: boolean;
  onSale?: boolean;
  averageRating?: number;
  totalReviews?: number;
  views?: number;
  soldCount?: number;
  metaTitle?: string;
  metaDescription?: string;
  weight?: number;
  dimensions?: { length?: number; width?: number; height?: number };
  created_by?: string;
  updated_by?: string;
  createdAt: string;
  updatedAt: string;
  // Computed fields from controller enrichment
  stockStatus?: string;
  discountPercent?: number;
  isLowStock?: boolean;
}

export interface ProductVariant {
  id: string;
  type: 'size' | 'color' | 'material' | 'storage';
  name: string;
  value: string;
  price?: {
    original: number;
    discounted?: number;
    currency: string;
  };
  stock: {
    quantity: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
  };
  sku?: string;
  images?: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  createdAt: string;
  verified: boolean;
}

export interface RelatedProduct {
  id: string;
  title: string;
  image: string;
  price: {
    original: number;
    discounted?: number;
    currency: string;
  };
  averageRating?: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  variantId?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  hasMore: boolean;
}

export interface ReviewSubmission {
  rating: number;
  text: string;
}

export interface TopListItem {
  id: string;
  name: string;
  value: number | string;
  subValue?: number | string;
  status?: string;
  image?: string;
}

export interface DashboardStats {
  totalProducts?: number;
  activeProducts: number;
  totalCategories?: number;
  totalBrands?: number;
  totalCustomers?: number;
  totalOrders?: number;
  totalSales?: number;
  outOfStockCount: number;
  productsOnSale: number;
  avgBasePrice: number;
  totalRevenue: number;
  lowStockProductsCount: number;
  topSellingCategory: string;
  thisMonthProducts: number;
  revenueGrowth: number;
  averageStockPerProduct: number;
  topDiscountedProductsCount?: number;
  productsWithDiscounts:number;
}

export interface DashboardFilters {
  dateRange: 'today' | 'week' | 'month' | 'custom';
  customDateStart?: string;
  customDateEnd?: string;
  category: string;
  brand: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  search: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  productCount: number;
}
export interface Sale {
  id: string;
  productId: string;
  customerId: string;
  quantity: number;
  amount: number;
  date: string;
  region: string;
}

export interface ProductList {
  id: string;
  _id: string;
  title: string;
  slug: string;
  sku: string;
  category: string | { _id: string; title: string };
  brand: string | { _id: string; name: string };
  basePrice: number;
  finalPrice?: number;
  comparePrice?: number;
  inventory: number;
  status: 'active' | 'inactive' | 'draft' | 'pending' | 'archived' | 'published';
  mainImage?: FileReference;
  images: FileReference[];
  createdAt: string;
  updatedAt: string;
  soldCount?: number;
  views?: number;
  averageRating?: number;
  isActive: boolean;
  stockStatus?: string;
}