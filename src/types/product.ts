// types/product.ts
export interface Product {
  id: string;
  _id: string;
  title: string;
  images: string[];
  price: {
    original: number;
    discounted?: number;
    currency: string;
  };
  stock: {
    quantity: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
  };
  sku: string;
  brand: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  variants: ProductVariant[];
  averageRating?: number;
  totalReviews: number;
  seoTitle?: string;
  seoDescription?: string;
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
  topDiscountedProductsCount: number;
  productsWithDiscounts:number
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
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  stock: number;
  status: 'active' | 'draft' | 'out-of-stock';
  image: string;
  createdDate: string;
  updatedDate: string;
  sales: number;
  views: number;
  returnRate: number;
  rating: number;
  region: string;
}