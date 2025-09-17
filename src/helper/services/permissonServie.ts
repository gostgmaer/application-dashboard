import requests from "./httpServices";

const permissionServices = {
  // 🔍 Basic CRUD
  getPermissions: (query: any, token: any, headers: any) =>
    requests.get("/permission", query, null, headers, 1, token),

  getGropedPermissions: (token: any) =>
    requests.get("/permission/states", {}, null, {}, 3600, token),

  getById: (id: any, headers: any) =>
    requests.get(`/permission/${id}`, null, null, headers, 1),

  create: (body: any, token: any) =>
    requests.post("/permission", body, {}, token),

  updatePut: (id: any, body: any, headers: any) =>
    requests.put(`/permission/${id}`, body, headers),

  updatePatch: (id: any, body: any, token: any) =>
    requests.patch(`/permission/${id}`, body, {}, {}, token),

  delete: (id: any, token: any) =>
    requests.delete(`/permission/${id}`, {},{}, token),

  // 📦 Bulk Operations
  bulkCreate: (body: any, headers: any) =>
    requests.post("/permission/bulk", body, headers),

  bulkEnable: (body: any, headers: any) =>
    requests.patch("/permission/bulk-enable", body, headers),

  bulkDisable: (body: any, headers: any) =>
    requests.patch("/permission/bulk-disable", body, headers),

  bulkDelete: (body: any, headers: any) =>
    requests.delete("/permission/bulk", body, headers),

  // 🔎 Search & Filters
  searchByName: (query: any, headers: any) =>
    requests.get("/permission/search/name", query, null, headers, 1),

  search: (query: any, headers: any) =>
    requests.get("/permission/search", query, null, headers, 1),

  getByCategory: (category: string, headers: any) =>
    requests.get(`/permission/category/${category}`, null, null, headers, 1),

  getActive: (headers: any) =>
    requests.get("/permission/active", null, null, headers, 1),

  getInactive: (headers: any) =>
    requests.get("/permission/inactive", null, null, headers, 1),

  getGrouped: (headers: any) =>
    requests.get("/permission/grouped", null, null, headers, 1),

  // 🧠 Conditional & Existence Checks
  createIfNotExists: (body: any, headers: any) =>
    requests.post("/permission/create-if-not-exists", body, headers),

  checkExists: (name: string, headers: any) =>
    requests.get(`/permission/exists/${name}`, null, null, headers, 1),

  // 🛠️ Field-Specific Updates
  disable: (id: any, headers: any) =>
    requests.patch(`/permission/${id}/disable`, {}, headers),

  enable: (id: any, headers: any) =>
    requests.patch(`/permission/${id}/enable`, {}, headers),

  rename: (id: any, body: any, headers: any) =>
    requests.patch(`/permission/${id}/rename`, body, headers),

  updateDescription: (id: any, body: any, headers: any) =>
    requests.patch(`/permission/${id}/description`, body, headers),

  changeCategory: (id: any, body: any, headers: any) =>
    requests.patch(`/permission/${id}/category`, body, headers),

  toggleActive: (id: any, headers: any) =>
    requests.patch(`/permission/${id}/toggle-active`, {}, headers),

  // 📦 Formatted API Response
  getAPIResponse: (id: any, headers: any) =>
    requests.get(`/permission/${id}/api-response`, null, null, headers, 1),
};

export default permissionServices;