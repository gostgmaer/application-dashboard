// types/product.ts
export interface Product {
  id: string;
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