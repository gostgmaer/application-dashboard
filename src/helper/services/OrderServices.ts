import requests from "./httpServices";

const OrderServices = {
  // Create a new order
  addOrder: async (body, headers) => {
    return requests.post("/orders/create", body, headers);
  },
  
  // Verify payment for an order
  verifyOrder: async (body, headers) => {
    return requests.post("/orders/verify-payment", body, headers);
  },

  // Get all orders (admin)
  getOrders: async (query, headers) => {
    return requests.get("/orders", query, null, headers, 1);
  },

  // Get a single order by ID
  getOrderById: async (id, headers) => {
    return requests.get(`/orders/${id}`, null, null, headers, 1);
  },

  // Update an order (replace entirely) by ID
  updateOrderPut: async (id, body, headers) => {
    return requests.put(`/orders/${id}`, body, headers);
  },

  // Update an order (partial update) by ID
  updateOrderPatch: async (id, body, headers) => {
    return requests.patch(`/orders/${id}`, body, headers);
  },

  // Delete an order by ID
  deleteOrder: async (id, headers) => {
    return requests.delete(`/orders/${id}`, headers);
  },

  // Get all orders for a specific user
  getOrdersByUser: async (userId, query, headers) => {
    return requests.get(`/orders/user/${userId}`, query, null, headers, 1);
  },

  // Get all customer orders
  getCustomerOrders: async (query, headers) => {
    return requests.get("/orders/customer/fetch", query, null, headers, 1);
  },

  // Get customer dashboard info
  getCustomerDashboard: async (query, headers) => {
    return requests.get("/orders/customer/dashboard", query, null, headers, 1);
  },

  // Get a specific order for a user
  getOrderByUserAndOrderId: async (userId, orderId, headers) => {
    return requests.get(`/orders/user/${userId}/${orderId}`, null, null, headers, 1);
  },

  // Update a specific order for a user (replace entirely)
  updateOrderByUserAndOrderIdPut: async (userId, orderId, body, headers) => {
    return requests.put(`/orders/user/${userId}/${orderId}`, body, headers);
  },

  // Update a specific order for a user (partial update)
  updateOrderByUserAndOrderIdPatch: async (userId, orderId, body, headers) => {
    return requests.patch(`/orders/user/${userId}/${orderId}`, body, headers);
  },

  // Delete a specific order for a user
  deleteOrderByUserAndOrderId: async (userId, orderId, headers) => {
    return requests.delete(`/orders/user/${userId}/${orderId}`, headers);
  },
};

export default OrderServices;
