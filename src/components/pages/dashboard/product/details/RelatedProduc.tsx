// components/product/RelatedProducts.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { RelatedProduct } from '@/types/product';

import { getRelatedProducts } from '@/lib/api/products-api';
import { StarRating } from './StarRating';

interface RelatedProductsProps {
  productId: string;
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['related-products', productId],
    queryFn: () => getRelatedProducts(productId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-16 py-8 text-center text-red-600">
        Failed to load related products.
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="mt-16 py-8 text-center text-gray-500">
        No related products found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: RelatedProduct) => (
          <div key={product.id} className="group relative">
            <Link href={`/products/${product.id}`}>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 group-hover:opacity-90 transition-opacity">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>
                {product.averageRating && (
                  <StarRating rating={product.averageRating} size="sm" />
                )}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">
                    {product.price.currency} {product.price.discounted || product.price.original}
                  </span>
                  {product.price.discounted && (
                    <span className="text-sm text-gray-500 line-through">
                      {product.price.currency} {product.price.original}
                    </span>
                  )}
                </div>
              </div>
            </Link>
            {/* Quick Add Button -- Handler is a stub for now */}
            <button
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full shadow-sm opacity-0 group-hover:opacity-100 hover:bg-white transition-all duration-200"
              aria-label={`Add ${product.title} to cart`}
              onClick={e => {
                e.preventDefault();
                // TODO: Add quick add to cart logic as needed
              }}
            >
              <ShoppingCart className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
