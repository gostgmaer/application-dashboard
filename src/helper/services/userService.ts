import requests from "./httpServices";

const userServices = {
  // ---------- STATIC ROUTES ----------
  createUser: (body: any, headers: any) =>
    requests.post("/user", body, headers),

  getAllUsers: (query: any, token: any) =>
    requests.get("/users", query, null, {}, 3600,token),
  getProfile: ( token: any) =>
    requests.get("/user/profile", {}, null, {}, 1,token),
  getActiveUsers: (headers: any) =>
    requests.get("/user/active", null, null, headers, 1),

  getVerifiedUsers: (headers: any) =>
    requests.get("/user/verified", null, null, headers, 1),

  getAdmins: (headers: any) =>
    requests.get("/user/admins", null, null, headers, 1),

  getCustomers: (headers: any) =>
    requests.get("/user/customers", null, null, headers, 1),

  searchUsers: (query: any, headers: any) =>
    requests.get("/user/search", query, null, headers, 1),

  dynamicSearch: (query: any, headers: any) =>
    requests.get("/user/dynamic-search", query, null, headers, 1),

  findByEmail: (email: string, headers: any) =>
    requests.get(`/user/email/${email}`, null, null, headers, 1),

  findByUsername: (username: string, headers: any) =>
    requests.get(`/user/username/${username}`, null, null, headers, 1),

  getUsersByStatus: (status: string, headers: any) =>
    requests.get(`/user/status/${status}`, null, null, headers, 1),

  getUsersBySubscriptionType: (subscriptionType: string, headers: any) =>
    requests.get(`/user/subscription/${subscriptionType}`, null, null, headers, 1),

  bulkUpdateRole: (body: any, headers: any) =>
    requests.patch("/user/bulk-update-role", body, headers),

  bulkDeleteUsers: (body: any, headers: any) =>
    requests.delete("/user/bulk", body, headers),

  bulkUpdateStatus: (body: any, headers: any) =>
    requests.patch("/user/bulk-update-status", body, headers),

  bulkAddLoyaltyPoints: (body: any, headers: any) =>
    requests.patch("/user/bulk-loyalty-points", body, headers),

  getTableStatistics: (headers: any) =>
    requests.get("/user/table-statistics", null, null, headers, 1),

  getTableReport: (headers: any) =>
    requests.get("/user/table-report", null, null, headers, 1),

  // ---------- DYNAMIC ROUTES ----------
  getSingleUser: (id: any, headers: any) =>
    requests.get(`/user/${id}`, null, null, headers, 1),

  updateUser: (id: any, body: any, headers: any) =>
    requests.put(`/user/${id}`, body, headers),

   updateUserPatch: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}`, body, headers),

  dynamicUpdate: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}/dynamic-update`, body, headers),

  deleteUser: (id: any, headers: any) =>
    requests.delete(`/user/${id}`, null, headers),

  setUserPassword: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}/password`, body, headers),

  validateUserPassword: (id: any, body: any, headers: any) =>
    requests.post(`/user/${id}/validate-password`, body, headers),

  addToWishlist: (id: any, body: any, headers: any) =>
    requests.post(`/user/${id}/wishlist`, body, headers),

  removeFromWishlist: (id: any, body: any, headers: any) =>
    requests.delete(`/user/${id}/wishlist`, body, headers),

  addFavoriteProduct: (id: any, body: any, headers: any) =>
    requests.post(`/user/${id}/favorites`, body, headers),

  removeFavoriteProduct: (id: any, body: any, headers: any) =>
    requests.delete(`/user/${id}/favorites`, body, headers),

  addToCart: (id: any, body: any, headers: any) =>
    requests.post(`/user/${id}/cart`, body, headers),

  removeFromCart: (id: any, body: any, headers: any) =>
    requests.delete(`/user/${id}/cart`, body, headers),

  clearCart: (id: any, headers: any) =>
    requests.delete(`/user/${id}/cart/clear`, null, headers),

  updatePreferences: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}/preferences`, body, headers),

  addLoyaltyPoints: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}/loyalty-points/add`, body, headers),

  redeemLoyaltyPoints: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}/loyalty-points/redeem`, body, headers),

  verifyUser: (id: any, headers: any) =>
    requests.patch(`/user/${id}/verify`, {}, headers),

  updateLastLogin: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}/last-login`, body, headers),

  getFullName: (id: any, headers: any) =>
    requests.get(`/user/${id}/full-name`, null, null, headers, 1),

  authenticateUser: (id: any, body: any, headers: any) =>
    requests.post(`/user/${id}/authenticate`, body, headers),

  updateStatus: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}/status`, body, headers),

  addPaymentMethod: (id: any, body: any, headers: any) =>
    requests.post(`/user/${id}/payment-methods`, body, headers),

  removePaymentMethod: (id: any, body: any, headers: any) =>
    requests.delete(`/user/${id}/payment-methods`, body, headers),

  setDefaultPaymentMethod: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}/payment-methods/default`, body, headers),

  updateSocialMedia: (id: any, body: any, headers: any) =>
    requests.patch(`/user/${id}/social-media`, body, headers),

  addInterest: (id: any, body: any, headers: any) =>
    requests.post(`/user/${id}/interests`, body, headers),

  removeInterest: (id: any, body: any, headers: any) =>
    requests.delete(`/user/${id}/interests`, body, headers),

  getUserStatistics: (id: any, headers: any) =>
    requests.get(`/user/${id}/statistics`, null, null, headers, 1),

  getUserReport: (id: any, headers: any) =>
    requests.get(`/user/${id}/report`, null, null, headers, 1),
};

export default userServices;