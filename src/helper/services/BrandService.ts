import requests from "./httpServices";

const BrandServices = {
    // Create a new brand
    createBrand: async (body: any, headers: any) => {
      return requests.post("/brands", body, headers);
    },
  
    // Get all brands
    getBrands: async (query: any, headers: any) => {
      return requests.get("/brands", query, null, headers, 1);
    },
  
    // Get a single brand by ID
    getSingleBrandById: async (id: any, headers: any) => {
      return requests.get(`/brands/${id}`, null, null, headers, 1);
    },
  
    // Update a brand by ID (complete update)
    updateBrandPut: async (id: any, body: any, headers: any) => {
      return requests.put(`/brands/${id}`, body, headers);
    },
  
    // Update a brand by ID (partial update)
    updateBrandPatch: async (id: any, body: any, headers: any) => {
      return requests.patch(`/brands/${id}`, body, headers);
    },
  
    // Delete a brand by ID
    deleteBrand: async (id: any, headers: any) => {
      return requests.delete(`/brands/${id}`,null, headers);
    },
  };
  
export default BrandServices;
