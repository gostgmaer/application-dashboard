
import requests from "./httpServices";

const CategoryServices = {
  // Create a new category

  


  createCategory: async (body: any, headers: any) => {
    return requests.post("/categories", body, headers);
  },

  // Get all categories
  getCategories: async (query: any, headers: any) => {
    console.log(query, headers);
    
    return requests.get("/categories", query, {}, headers, 1);
  },

  // Get a single category by ID
  getSingleCategoryById: async (id: any, headers: any) => {
    return requests.get(`/categories/${id}`, null, null, headers, 1);
  },

  // Update a category by ID (complete update)
  updateCategoryPut: async (id: any, body: any, headers: any) => {
    return requests.put(`/categories/${id}`, body, headers);
  },

  // Update a category by ID (partial update)
  updateCategoryPatch: async (id: any, body: any, headers: any) => {
    return requests.patch(`/categories/${id}`, body, headers);
  },

  // Delete a category by ID
  deleteCategory: async (id: any, headers: any) => {
    return requests.delete(`/categories/${id}`,null, headers);
  },

  // Get the number of products per category
  getItemsPerCategory: async (query: any, headers: any) => {
    return requests.get("/categories/data/product-count", query, null, headers, 1);
  },

  // Get showing categories
  getShowingCategory: async (query: any, headers: any) => {
    return requests.get("/categories/data/show", query, null, headers, 1);
  },
};


export default CategoryServices;
