import requests from "./httpServices";

const ProductServices = {
  // Create a new product (admin only)
  createProducts: async (body: any, headers: any,token: any) => {
    return requests.post("/products", body, headers,token);
  },

  // Create products in bulk (admin only)
  createProductBulk: async (body: any, headers: any) => {
    return requests.post("/products/bulk", body, headers);
  },

  // Get all products
  getAllProducts: async (query: any, headers: any, token: any) => {
    return requests.get("/products", query, null, headers, 1, token);
  },

  getSingleProducts: async (id: any,token: any) => {
    console.log(id,token);
    
    return requests.get(`/products/${id}`, {}, {}, {}, 1,token);
  },


  // Update a product by ID (partial update)
  updateProductPatch: async (id: any, body: any, headers: any,token: any) => {
    return requests.patch(`/products/${id}`, body,null, headers,token);
  },

  // Update a product by ID (complete update)
  updateProductPut: async (id: any, body: any, headers: any) => {
    return requests.put(`/products/${id}`, body,null, headers);
  },

  // Delete a product by ID (admin only)
  deleteProduct: async (id: any, headers: any) => {
    return requests.delete(`/products/${id}`,null, headers);
  },
};


export default ProductServices;
