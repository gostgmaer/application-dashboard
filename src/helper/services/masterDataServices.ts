import requests from "./httpServices";

const masterServices = {
  
  getAllBrands: async (query: any, headers: any,token: any) => {
    return requests.get("/brands",  query, null, headers, 1,token);
  },

  
  getAllcategories: async (query: any, headers: any,token: any) => {
    return requests.get("/categories",  query, null, headers, 1,token);
  },

 
  getAlltags: async (query: any, headers: any) => {
    return requests.get("/tags", query, null, headers, 1);
  },


  getAllvariants: async (query: any, headers: any) => {
    return requests.get(`/variants`, null, null, headers, 1);
  },

};


export default masterServices;
