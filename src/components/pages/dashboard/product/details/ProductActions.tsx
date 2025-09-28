// // components/product/ProductActions.tsx
// 'use client';

// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
// import * as Toast from '@radix-ui/react-toast';
// import { Product, CartItem, WishlistItem } from '@/types/product';
// import { addToCart, addToWishlist } from '@/lib/api/cart-api';

// interface ProductActionsProps {
//   product: Product;
//   selectedVariants: Record<string, string>;
// }

// export function ProductActions({ product, selectedVariants }: ProductActionsProps) {
//   const [quantity, setQuantity] = useState(1);
//   const [toastState, setToastState] = useState<{
//     open: boolean;
//     title: string;
//     description: string;
//     type: 'success' | 'error';
//   }>({
//     open: false,
//     title: '',
//     description: '',
//     type: 'success'
//   });

//   const queryClient = useQueryClient();

//   const addToCartMutation = useMutation({
//     mutationFn: (item: CartItem) => addToCart(item),
//     onMutate: async () => {
//       // Optimistic update
//       await queryClient.cancelQueries({ queryKey: ['cart'] });
//       const previousCart = queryClient.getQueryData(['cart']);
      
//       // Update cart count optimistically
//       queryClient.setQueryData(['cart'], (old: any) => ({
//         ...old,
//         items: [...(old?.items || []), {
//           productId: product.id,
//           variantId: Object.values(selectedVariants)[0],
//           quantity,
//         }]
//       }));

//       return { previousCart };
//     },
//     onSuccess: () => {
//       setToastState({
//         open: true,
//         title: 'Added to Cart',
//         description: `${product.title} has been added to your cart.`,
//         type: 'success'
//       });
//     },
//     onError: (error, variables, context) => {
//       // Rollback optimistic update
//       if (context?.previousCart) {
//         queryClient.setQueryData(['cart'], context.previousCart);
//       }
      
//       setToastState({
//         open: true,
//         title: 'Error',
//         description: 'Failed to add item to cart. Please try again.',
//         type: 'error'
//       });
//     }
//   });

//   const addToWishlistMutation = useMutation({
//     mutationFn: (item: WishlistItem) => addToWishlist(item),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['wishlist'] });
//       setToastState({
//         open: true,
//         title: 'Added to Wishlist',
//         description: `${product.title} has been added to your wishlist.`,
//         type: 'success'
//       });
//     },
//     onError: () => {
//       setToastState({
//         open: true,
//         title: 'Error',
//         description: 'Failed to add item to wishlist. Please try again.',
//         type: 'error'
//       });
//     }
//   });

//   const handleAddToCart = () => {
//     if (product.stock.status === 'out_of_stock') {
//       setToastState({
//         open: true,
//         title: 'Out of Stock',
//         description: 'This product is currently out of stock.',
//         type: 'error'
//       });
//       return;
//     }

//     // Check if all required variants are selected
//     const requiredVariants = product.variants.filter(v => v.type === 'size' || v.type === 'storage');
//     const missingVariants = requiredVariants.filter(v => !selectedVariants[v.type]);
    
//     if (missingVariants.length > 0) {
//       setToastState({
//         open: true,
//         title: 'Selection Required',
//         description: `Please select ${missingVariants.map(v => v.type).join(', ')}.`,
//         type: 'error'
//       });
//       return;
//     }

//     addToCartMutation.mutate({
//       productId: product.id,
//       variantId: Object.values(selectedVariants)[0], // Use first selected variant
//       quantity,
//     });
//   };

//   const handleAddToWishlist = () => {
//     addToWishlistMutation.mutate({
//       productId: product.id,
//       variantId: Object.values(selectedVariants)[0],
//     });
//   };

//   const isOutOfStock = product.stock.status === 'out_of_stock';
//   const maxQuantity = Math.min(product.stock.quantity, 10); // Limit to 10

//   return (
//     <>
//       <div className="space-y-4">
//         {/* Quantity Selector */}
//         <div className="flex items-center gap-4">
//           <label className="text-sm font-medium text-gray-900">
//             Quantity:
//           </label>
//           <div className="flex items-center border border-gray-300 rounded-lg">
//             <button
//               onClick={() => setQuantity(Math.max(1, quantity - 1))}
//               disabled={quantity <= 1}
//               className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               aria-label="Decrease quantity"
//             >
//               <Minus className="w-4 h-4" />
//             </button>
//             <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
//               {quantity}
//             </span>
//             <button
//               onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
//               disabled={quantity >= maxQuantity}
//               className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               aria-label="Increase quantity"
//             >
//               <Plus className="w-4 h-4" />
//             </button>
//           </div>
//           {product.stock.status === 'low_stock' && (
//             <span className="text-sm text-orange-600">
//               Only {product.stock.quantity} left!
//             </span>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <button
//             onClick={handleAddToCart}
//             disabled={isOutOfStock || addToCartMutation.isPending}
//             className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//           >
//             <ShoppingCart className="w-5 h-5" />
//             {addToCartMutation.isPending ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
//           </button>

//           <button
//             onClick={handleAddToWishlist}
//             disabled={addToWishlistMutation.isPending}
//             className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//             aria-label="Add to wishlist"
//           >
//             <Heart className="w-5 h-5" />
//             {addToWishlistMutation.isPending ? 'Adding...' : 'Wishlist'}
//           </button>
//         </div>
//       </div>

//       {/* Toast Notifications */}
//       <Toast.Provider duration={3000}>
//         <Toast.Root
//           open={toastState.open}
//           onOpenChange={(open) => setToastState(prev => ({ ...prev, open }))}
//           className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-sm z-50 ${
//             toastState.type === 'success' 
//               ? 'bg-green-600 text-white' 
//               : 'bg-red-600 text-white'
//           }`}
//         >
//           <Toast.Title className="font-medium">
//             {toastState.title}
//           </Toast.Title>
//           <Toast.Description className="text-sm mt-1">
//             {toastState.description}
//           </Toast.Description>
//         </Toast.Root>
//         <Toast.Viewport />
//       </Toast.Provider>
//     </>
//   );
// }