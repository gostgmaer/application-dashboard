import requests from "./httpServices";

const ReviewServices = {
    // Create a new review for a product (user only)
    createReview: async (productId, body, headers) => {
      return requests.post(`/products/${productId}/reviews`, body, headers);
    },
  
    // Get all reviews for a specific product
    getReviewsForProduct: async (productId, query, headers) => {
      return requests.get(`/products/${productId}/reviews`, query, null, headers, 1);
    },
  
    // Get a single review by product ID and review ID
    getSingleReview: async (productId, reviewId, headers) => {
      return requests.get(`/products/${productId}/reviews/${reviewId}`, null, null, headers, 1);
    },
  
    // Update a review by product ID and review ID (partial update)
    updateReviewPatch: async (productId, reviewId, body, headers) => {
      return requests.patch(`/products/${productId}/reviews/${reviewId}`, body, headers);
    },
  
    // Update a review by product ID and review ID (complete update)
    updateReviewPut: async (productId, reviewId, body, headers) => {
      return requests.put(`/products/${productId}/reviews/${reviewId}`, body, headers);
    },
  
    // Delete a review by product ID and review ID
    deleteReview: async (productId, reviewId, headers) => {
      return requests.delete(`/products/${productId}/reviews/${reviewId}`, headers);
    },
  };
  

export default ReviewServices;
