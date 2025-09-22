// components/product/ProductReviews.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Review } from "@/types/product";

import { getProductReviews, submitReview } from "@/lib/api/reviews-api";
// import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { StarRating } from "./StarRating";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const queryClient = useQueryClient();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["reviews", productId, page, selectedRating],
    queryFn: () =>
      getProductReviews(productId, { page, rating: selectedRating }),
  });

  const submitReviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setShowReviewForm(false);
    },
  });

  const reviews = reviewsData?.reviews || [];
  const totalReviews = reviewsData?.total || 0;
  const averageRating = reviewsData?.averageRating || 0;
  const ratingDistribution = reviewsData?.ratingDistribution || {};

  const ratingFilters = [
    { rating: null, label: "All Reviews", count: totalReviews },
    { rating: 5, label: "5 Stars", count: ratingDistribution[5] || 0 },
    { rating: 4, label: "4 Stars", count: ratingDistribution[4] || 0 },
    { rating: 3, label: "3 Stars", count: ratingDistribution[3] || 0 },
    { rating: 2, label: "2 Stars", count: ratingDistribution[2] || 0 },
    { rating: 1, label: "1 Star", count: ratingDistribution[1] || 0 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border border-gray-200 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews ({totalReviews})
        </h2>
        {session && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write Review
          </button>
        )}
      </div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <StarRating rating={averageRating} />
              <p className="text-sm text-gray-600 mt-1">
                Based on {totalReviews} reviews
              </p>
            </div>
          </div>

          {/* Rating Filters */}
          <div className="flex flex-wrap gap-2">
            {ratingFilters.map((filter) => (
              <button
                key={filter.rating || "all"}
                onClick={() => {
                  setSelectedRating(filter.rating);
                  setPage(1);
                }}
                className={`px-3 py-1 text-sm border rounded-full transition-colors ${
                  selectedRating === filter.rating
                    ? "bg-blue-100 border-blue-300 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      {/* {showReviewForm && (
        <ReviewForm
          productId={productId}
          onSubmit={(reviewData) => {
            submitReviewMutation.mutate({
              productId,
              ...reviewData,
            });
          }}
          onCancel={() => setShowReviewForm(false)}
          isLoading={submitReviewMutation.isPending}
        />
      )} */}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first one to share your experience!
          </p>
          {session && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Write First Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review: Review) => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {review.userAvatar && (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {review.userName}
                      {review.verified && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-600">
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{review.text}</p>
            </div>
          ))}

          {/* Load More Button */}
          {reviewsData?.hasMore && (
            <div className="text-center">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Load More Reviews
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
