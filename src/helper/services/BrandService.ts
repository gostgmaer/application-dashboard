import requests from "./httpServices";

const BrandServices = {
    // Create a new brand
    createBrand: async (body, headers) => {
      return requests.post("/brands", body, headers);
    },
  
    // Get all brands
    getBrands: async (query, headers) => {
      return requests.get("/brands", query, null, headers, 1);
    },
  
    // Get a single brand by ID
    getSingleBrandById: async (id, headers) => {
      return requests.get(`/brands/${id}`, null, null, headers, 1);
    },
  
    // Update a brand by ID (complete update)
    updateBrandPut: async (id, body, headers) => {
      return requests.put(`/brands/${id}`, body, headers);
    },
  
    // Update a brand by ID (partial update)
    updateBrandPatch: async (id, body, headers) => {
      return requests.patch(`/brands/${id}`, body, headers);
    },
  
    // Delete a brand by ID
    deleteBrand: async (id, headers) => {
      return requests.delete(`/brands/${id}`,null, headers);
    },
  };
  
export default BrandServices;
