// // components/product/ProductView.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { Product, ProductVariant } from '@/types/product';
// import { ProductGallery } from './ProductGallery';
// import { ProductInfo } from './ProductInfo';
// import { ProductVariants } from './ProductVariants';
// // import { ProductActions } from './ProductActions';
// // import { ProductReviews } from './ProductReviews';
// import { RelatedProducts } from './RelatedProduc';
// import { LoadingSkeleton } from './LoadingSkeleton';

// // import { getProduct } from '@/lib/api/products-api';
// import { ErrorBoundary } from './ErrorBoundary';
// import productService from '@/lib/http/ProductServices';

// interface ProductViewProps {
//   productId: string;
//   initialProduct?: Product;
// }

// export function ProductView({ productId, initialProduct }: ProductViewProps) {
//   const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
//   const [currentProduct, setCurrentProduct] = useState<Product | null>(initialProduct || null);

//   const { data: product, isLoading, error } = useQuery({
//     queryKey: ['product', productId],
//     queryFn: () => productService.get(productId),
//     initialData: initialProduct,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });

//   // Update current product when variants change
//   useEffect(() => {
//     if (product && Object.keys(selectedVariants).length > 0) {
//       // Calculate updated price, stock, images based on selected variants
//       const updatedProduct = calculateVariantProduct(product, selectedVariants);
//       setCurrentProduct(updatedProduct);
//     } else if (product) {
//       setCurrentProduct(product);
//     }
//   }, [product, selectedVariants]);

//   if (isLoading) return <LoadingSkeleton />;
//   if (error || !product) return <ProductNotFound />;

//   return (
//     <ErrorBoundary>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//           {/* Product Gallery */}
//           <ProductGallery 
//             images={currentProduct?.images || product.images}
//             title={product.title}
//           />

//           {/* Product Details */}
//           <div className="space-y-6">
//             <ProductInfo 
//               product={currentProduct || product}
//               selectedVariants={selectedVariants}
//             />

//             <ProductVariants
//               variants={product.variants}
//               selectedVariants={selectedVariants}
//               onVariantChange={setSelectedVariants}
//             />

//             {/* <ProductActions
//               product={currentProduct || product}
//               selectedVariants={selectedVariants}
//             /> */}
//           </div>
//         </div>

//         {/* Reviews Section */}
//         <div className="mt-16">
//           {/* <ProductReviews productId={productId} /> */}
//         </div>

//         {/* Related Products */}
//         <div className="mt-16">
//           <RelatedProducts productId={productId} />
//         </div>
//       </div>
//     </ErrorBoundary>
//   );
// }

// function calculateVariantProduct(product: Product, selectedVariants: Record<string, string>): Product {
//   // Calculate updated product based on selected variants
//   const selectedVariantObjects = Object.values(selectedVariants)
//     .map(variantId => product.variants.find(v => v.id === variantId))
//     .filter(Boolean) as ProductVariant[];

//   let updatedPrice = product.price;
//   let updatedStock = product.stock;
//   let updatedImages = product.images;
//   let updatedSku = product.sku;

//   selectedVariantObjects.forEach(variant => {
//     if (variant.price) {
//       updatedPrice = variant.price;
//     }
//     if (variant.stock) {
//       updatedStock = variant.stock;
//     }
//     if (variant.images && variant.images.length > 0) {
//       updatedImages = variant.images;
//     }
//     if (variant.sku) {
//       updatedSku = variant.sku;
//     }
//   });

//   return {
//     ...product,
//     price: updatedPrice,
//     stock: updatedStock,
//     images: updatedImages,
//     sku: updatedSku,
//   };
// }

// function ProductNotFound() {
//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold text-gray-900 mb-4">
//           Product Not Available
//         </h1>
//         <p className="text-gray-600 mb-8">
//           Sorry, the product you&apos;re looking for is currently unavailable.
//         </p>
//         <button
//           onClick={() => window.history.back()}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Go Back
//         </button>
//       </div>
//     </div>
//   );
// }