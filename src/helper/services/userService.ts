import requests from "./index";
import { ApiResponse, safeApiCall } from "./apiUtils";

const userServices = {
  create: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/users", body, token, headers));
  },

  register: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/users/register", body, token, headers));
  },

  getAll: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users", token, query, undefined, headers, 1));
  },

  getSingle: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/users/${id}`, token, undefined, undefined, headers, 1));
  },

  updatePut: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}`, body, token, headers));
  },

  updatePatch: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.patch(`/users/${id}`, body, token, headers));
  },

  remove: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}`, token, undefined, headers));
  },

  login: async (
    body: { email: string; password: string },
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/users/authentication/login", body, undefined, headers));
  },

  changePassword: async (
    id: string,
    body: { currentPassword: string; newPassword: string; confirmPassword: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/authentication/change-password`, body, token, headers));
  },

  generateResetToken: async (
    body: { email: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/users/authentication/reset-token", body, token, headers));
  },

  resetPassword: async (
    body: { token: string; newPassword: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/users/authentication/reset-password", body, token, headers));
  },

  confirmEmail: async (
    body: { token: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/users/authentication/confirm-email", body, token, headers));
  },

  verifyUser: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/authentication/verify`, undefined, token, headers));
  },

  getProfile: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/profile", token, undefined, undefined, headers, 1));
  },

  updateProfile: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/profile`, body, token, headers));
  },

  updateProfilePicture: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/profilepicture`, body, token, headers));
  },

  updateEmail: async (
    id: string,
    body: { email: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/profileemail`, body, token, headers));
  },

  updatePhoneNumber: async (
    id: string,
    body: { phone?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/profilephone`, body, token, headers));
  },

  // Wishlist operations
  addToWishlist: async (
    id: string,
    body: { productId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/wishlist`, body, token, headers));
  },

  removeFromWishlist: async (
    id: string,
    body: { productId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/wishlist`, token, body, headers));
  },

  clearWishlist: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/wishlistclear`, token, undefined, headers));
  },

  getWishlistCount: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/users/${id}/wishlistcount`, token, undefined, undefined, headers, 1));
  },

  // Cart operations
  addToCart: async (
    id: string,
    body: { productId: string; quantity?: number },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/cart`, body, token, headers));
  },

  removeFromCart: async (
    id: string,
    body: { productId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/cart`, token, body, headers));
  },

  updateCartItemQuantity: async (
    id: string,
    body: { productId: string; quantity: number },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/cartquantity`, body, token, headers));
  },

  clearCart: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/cartclear`, token, undefined, headers));
  },

  getCartTotal: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/users/${id}/carttotal`, token, undefined, undefined, headers, 1));
  },

  getCartItemCount: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/users/${id}/cartcount`, token, undefined, undefined, headers, 1));
  },

  moveItemCartToWishlist: async (
    id: string,
    body: { productId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/cartmove-to-wishlist`, body, token, headers));
  },

  moveItemWishlistToFavorites: async (
    id: string,
    body: { productId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/favoritesmove-from-wishlist`, body, token, headers));
  },

  // Preferences
  updatePreferences: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/preferences`, body, token, headers));
  },

  toggleNewsletterSubscription: async (
    id: string,
    body: { subscribed: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/preferencesnewsletter`, body, token, headers));
  },

  toggleNotifications: async (
    id: string,
    body: { enabled: boolean },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/preferencesnotifications`, body, token, headers));
  },

  setThemePreference: async (
    id: string,
    body: { theme: "light" | "dark" | "auto" },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/preferencestheme`, body, token, headers));
  },

  updateLanguagePreference: async (
    id: string,
    body: { language: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/preferenceslanguage`, body, token, headers));
  },

  // Loyalty points
  addLoyaltyPoints: async (
    id: string,
    body: { points: number },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/loyaltyadd`, body, token, headers));
  },

  redeemLoyaltyPoints: async (
    id: string,
    body: { points: number },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/loyaltyredeem`, body, token, headers));
  },

  transferLoyaltyPoints: async (
    id: string,
    body: { targetUserId: string; points: number },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/loyaltytransfer`, body, token, headers));
  },

  resetLoyaltyPoints: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/loyaltyreset`, undefined, token, headers));
  },

  // Subscription
  updateSubscription: async (
    id: string,
    body: { subscriptionType?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/subscription`, body, token, headers));
  },

  cancelSubscription: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/subscription`, token, undefined, headers));
  },

  // Account status
  updateStatus: async (
    id: string,
    body: { status: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/status`, body, token, headers));
  },

  deactivateAccount: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/deactivate-account`, undefined, token, headers));
  },

  reactivateAccount: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/reactivate-account`, undefined, token, headers));
  },

  lockAccount: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/lock`, undefined, token, headers));
  },

  unlockAccount: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/unlock`, undefined, token, headers));
  },

  // Addresses
  addAddress: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/addresses`, body, token, headers));
  },

  removeAddress: async (
    id: string,
    body: { addressId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/addresses`, token, body, headers));
  },

  setDefaultAddress: async (
    id: string,
    body: { addressId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/addressesdefault`, body, token, headers));
  },

  // Payment methods
  addPaymentMethod: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/payment-methods`, body, token, headers));
  },

  removePaymentMethod: async (
    id: string,
    body: { paymentMethodId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/payment-methods`, token, body, headers));
  },

  setDefaultPaymentMethod: async (
    id: string,
    body: { paymentMethodId: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/payment-methodsdefault`, body, token, headers));
  },

  // Social media
  updateSocialMedia: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/social-media`, body, token, headers));
  },

  linkSocialAccount: async (
    id: string,
    body: { provider: string; accessToken: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/social-medialink`, body, token, headers));
  },

  unlinkSocialAccount: async (
    id: string,
    body: { provider: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/social-mediaunlink`, token, body, headers));
  },

  clearAllSocialLinks: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/social-mediaclear`, token, undefined, headers));
  },

  // Interests
  addInterest: async (
    id: string,
    body: { interest: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/interests`, body, token, headers));
  },

  removeInterest: async (
    id: string,
    body: { interest: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/interests`, token, body, headers));
  },

  addInterestCategory: async (
    id: string,
    body: { category: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/interestscategory`, body, token, headers));
  },

  clearInterests: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.delete(`/users/${id}/interestsclear`, token, undefined, headers));
  },

  // Sessions
  invalidateAllSessions: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/sessionsinvalidate-all`, {}, token, headers));
  },

  revokeToken: async (
    id: string,
    body: { token: string },
    tokenParam?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/sessionsrevoke-token`, body, tokenParam, headers));
  },

  updateLoginTimestamp: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/login-timestamp`, {}, token, headers));
  },

  incrementFailedLogins: async (
    body: { email: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put("/users/failed-logins/increment", body, token, headers));
  },

  resetFailedLogins: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/failed-logins/reset`, {}, token, headers));
  },

  // Orders
  addOrder: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/orders`, body, token, headers));
  },

  getOrderHistory: async (
    id: string,
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/users/${id}/orders`, token, query, undefined, headers, 1));
  },

  // Statistics and reports
  getUserStatistics: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/users/${id}/statistics`, token, undefined, undefined, headers, 1));
  },

  getUserReport: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/users/${id}/report`, token, undefined, undefined, headers, 1));
  },

  getActivitySummary: async (
    id: string,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get(`/users/${id}/activity-summary`, token, undefined, undefined, headers, 1));
  },

  dynamicUpdate: async (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.put(`/users/${id}/dynamic-update`, body, token, headers));
  },

  // Searches
  findByEmail: async (
    query: { email: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/searchemail", token, query, undefined, headers, 1));
  },

  findByUsername: async (
    query: { username: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/searchusername", token, query, undefined, headers, 1));
  },

  searchUsers: async (
    query?: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/search", token, query, undefined, headers, 1));
  },

  // Filters
  getUsersByStatus: async (
    query: { status: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/filterstatus", token, query, undefined, headers, 1));
  },

  getActiveUsers: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/filteractive", token, undefined, undefined, headers, 1));
  },

  getVerifiedUsers: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/filterverified", token, undefined, undefined, headers, 1));
  },

  getUsersByRole: async (
    query: { role: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/filterrole", token, query, undefined, headers, 1));
  },

  getAdmins: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/filteradmins", token, undefined, undefined, headers, 1));
  },

  getCustomers: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/filtercustomers", token, undefined, undefined, headers, 1));
  },

  // Export & Import
  exportData: async (
    query?: { format?: string; fields?: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/exportdata", token, query, undefined, headers, 1));
  },

  importData: async (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post("/users/importdata", body, token, headers));
  },

  // Notifications
  sendNotification: async (
    id: string,
    body: { message: string },
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.post(`/users/${id}/notify`, body, token, headers));
  },

  // Route docs
  getRouteDocs: async (
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> => {
    return safeApiCall(() => requests.get("/users/docs/routes", token, undefined, undefined, headers, 1));
  },
};

export default userServices;
