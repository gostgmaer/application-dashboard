import requests from "./httpServices";

const LogServices = {
    // Get all logs
    getAllLogs: async (query, headers) => {
      return requests.get("/logs", query, null, headers, 1);
    },
  
    // Get a single log by ID
    getSingleLogById: async (id, headers) => {
      return requests.get(`/logs/${id}`, null, null, headers, 1);
    },
  
    // Update a log by ID (partial update)
    updateLogPatch: async (id, body, headers) => {
      return requests.patch(`/logs/${id}`, body,null, headers);
    },
  
    // Update a log by ID (complete update)
    updateLogPut: async (id, body, headers) => {
      return requests.put(`/logs/${id}`, body,null, headers);
    },
  
    // Delete a log by ID
    deleteLog: async (id, headers) => {
      return requests.delete(`/logs/${id}`,null, headers);
    },
  };
  

export default LogServices;
