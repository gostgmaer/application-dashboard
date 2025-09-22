// lib/api/products.ts
import { Product, RelatedProduct } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 300, // 5 minutes
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error('Failed to fetch product');
  }

  return response.json();
}

export async function getRelatedProducts(id: string): Promise<RelatedProduct[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}/related`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 600, // 10 minutes
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch related products');
  }

  return response.json();
}

export async function searchProducts(query: string, filters?: Record<string, any>) {
  const searchParams = new URLSearchParams({ q: query });
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}/api/products/search?${searchParams}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search products');
  }

  return response.json();
}