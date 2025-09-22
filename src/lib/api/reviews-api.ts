// lib/api/reviews.ts
import { ReviewsResponse, ReviewSubmission } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getProductReviews(
  productId: string,
  options?: { page?: number; rating?: number | null; limit?: number }
): Promise<ReviewsResponse> {
  const searchParams = new URLSearchParams({
    page: (options?.page || 1).toString(),
    limit: (options?.limit || 10).toString(),
  });

  if (options?.rating) {
    searchParams.append('rating', options.rating.toString());
  }

  const response = await fetch(
    `${API_BASE_URL}/api/reviews/product/${productId}?${searchParams}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // 5 minutes
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch product reviews');
  }

  return response.json();
}

export async function submitReview(data: { productId: string } & ReviewSubmission) {
  const response = await fetch(`${API_BASE_URL}/api/reviews`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit review');
  }

  return response.json();
}

export async function updateReview(reviewId: string, data: ReviewSubmission) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update review');
  }

  return response.json();
}

export async function deleteReview(reviewId: string) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete review');
  }

  return response.json();
}

export async function getUserReviews(userId: string) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/user/${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user reviews');
  }

  return response.json();
}

export async function likeReview(reviewId: string) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/like`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to like review');
  }

  return response.json();
}

export async function reportReview(reviewId: string, reason: string) {
  const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/report`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error('Failed to report review');
  }

  return response.json();
}