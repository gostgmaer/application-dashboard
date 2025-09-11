import requests from "./httpServices";

const roleServices = {
  // Get all roles (admin only)
  getroles: async (query: any, headers: any) => {
    return requests.get("/roles", query, null, headers, 1);
  },

  adduser: async (body: any, headers: any) => {
    return requests.post("/roles", body, headers);
  },
  
  // Get a single user by ID
  getUserById: async (id: any, headers: any) => {
    return requests.get(`/roles/${id}`, null, null, headers, 1);
  },

  // Get the profile of the currently logged-in customer
  getUserProfile: async (headers: any) => {
    return requests.get("/roles/customer/profile", null, null, headers, 1);
  },

  // Update user information by ID (partial update)
  updateUserPatch: async (id: any, body: any, headers: any) => {
    return requests.patch(`/roles/${id}`, body, headers);
  },

  // Update user information by ID (complete update)
  updateUserPut: async (id: any, body: any, headers: any) => {
    return requests.put(`/roles/${id}`, body, headers);
  },

  // Delete a user by ID (admin only)
  deleteUser: async (id: any, headers: any) => {
    return requests.delete(`/roles/${id}`,null, headers);
  },
};


export default roleServices;
