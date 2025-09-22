// components/product/ProductInfo.tsx
'use client';

import { Product } from '@/types/product';
import { Badge } from './Badge';
import { StarRating } from './StarRating';


interface ProductInfoProps {
  product: Product;
  selectedVariants: Record<string, string>;
}

export function ProductInfo({ product, selectedVariants }: ProductInfoProps) {
  const discountPercentage = product.price.discounted 
    ? Math.round(((product.price.original - product.price.discounted) / product.price.original) * 100)
    : 0;

  const getStockBadge = () => {
    switch (product.stock.status) {
      case 'in_stock':
        return <Badge variant="success">In Stock</Badge>;
      case 'low_stock':
        return <Badge variant="warning">Low Stock ({product.stock.quantity} left)</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">
        {product.title}
      </h1>

      {/* Rating */}
      {product.averageRating && (
        <div className="flex items-center gap-2">
          <StarRating rating={product.averageRating} />
          <span className="text-sm text-gray-600">
            ({product.totalReviews} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">
            {product.price.currency} {product.price.discounted || product.price.original}
          </span>
          {product.price.discounted && (
            <>
              <span className="text-xl text-gray-500 line-through">
                {product.price.currency} {product.price.original}
              </span>
              <Badge variant="destructive">
                {discountPercentage}% OFF
              </Badge>
            </>
          )}
        </div>
        {product.price.discounted && (
          <p className="text-sm text-green-600">
            You save {product.price.currency} {product.price.original - product.price.discounted}
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {getStockBadge()}
      </div>

      {/* Product Details */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">SKU:</span> {product.sku}
          </div>
          <div>
            <span className="font-medium">Brand:</span> {product.brand}
          </div>
          <div>
            <span className="font-medium">Category:</span> {product.category}
          </div>
        </div>
      </div>

      {/* Short Description */}
      <div className="prose prose-sm max-w-none">
        <p>{product.shortDescription}</p>
      </div>

      {/* Long Description */}
      <details className="group">
        <summary className="cursor-pointer font-medium text-gray-900 group-open:text-blue-600 transition-colors">
          Full Description
        </summary>
        <div className="mt-4 prose prose-sm max-w-none text-gray-600">
          <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
        </div>
      </details>
    </div>
  );
}