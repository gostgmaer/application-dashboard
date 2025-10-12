// import { useState, useEffect } from 'react';
// import { Discount } from '@/types/discount';
// // import { fetchDiscounts } from '@/lib/d/api';
// import { toast } from 'sonner';
// import discountServices from '@/lib/http/discountServices';

// export function useDiscounts(searchTerm?: string, typeFilter?: string) {
//   const [discounts, setDiscounts] = useState<Discount[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadDiscounts = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await discountServices;
//       setDiscounts(response.data);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to load discounts';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDiscounts();
//   }, [searchTerm, typeFilter]);

//   return {
//     discounts,
//     loading,
//     error,
//     refetch: loadDiscounts,
//     setDiscounts
//   };
// }