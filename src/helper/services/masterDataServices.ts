import requests from "./httpServices";

const masterServices = {
  
  getAllBrands: async (query, headers,token) => {
    return requests.get("/brands",  query, null, headers, 1,token);
  },

  
  getAllcategories: async (query, headers,token) => {
    return requests.get("/categories",  query, null, headers, 1,token);
  },

 
  getAlltags: async (query, headers) => {
    return requests.get("/tags", query, null, headers, 1);
  },


  getAllvariants: async (query, headers) => {
    return requests.get(`/variants`, null, null, headers, 1);
  },

};


export default masterServices;
