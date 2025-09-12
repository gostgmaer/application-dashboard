import requests from "./httpServices";

const roleServices = {
  // 🔍 Basic CRUD
  create: (body: any, headers: any) =>
    requests.post("/role", body, headers),

  getAll: (query: any, headers: any) =>
    requests.get("/role", query, null, headers, 1),

  getById: (id: any, headers: any) =>
    requests.get(`/role/${id}`, null, null, headers, 1),

  updatePut: (id: any, body: any, headers: any) =>
    requests.put(`/role/${id}`, body, headers),

  updatePatch: (id: any, body: any, headers: any) =>
    requests.patch(`/role/${id}`, body, headers),

  delete: (id: any, headers: any) =>
    requests.delete(`/role/${id}`, null, headers),

  // 🔐 Permission Management
  addPermission: (id: any, body: any, headers: any) =>
    requests.post(`/role/${id}/permission`, body, headers),

  removePermission: (id: any, body: any, headers: any) =>
    requests.delete(`/role/${id}/permission`, body, headers),

  hasPermission: (id: any, permissionName: string, headers: any) =>
    requests.get(`/role/${id}/permission/${permissionName}`, null, null, headers, 1),

  getRoleWithPermissions: (id: any, headers: any) =>
    requests.get(`/role/${id}/permissions`, null, null, headers, 1),

  assignPermissions: (id: any, body: any, headers: any) =>
    requests.post(`/role/${id}/permissions`, body, headers),

  removePermissions: (id: any, body: any, headers: any) =>
    requests.delete(`/role/${id}/permissions`, body, headers),

  syncPermissions: (id: any, body: any, headers: any) =>
    requests.put(`/role/${id}/sync-permissions`, body, headers),

  // ⚙️ Lifecycle & Status
  toggleActive: (id: any, headers: any) =>
    requests.patch(`/role/${id}/toggle-active`, {}, headers),

  getActiveRoles: (headers: any) =>
    requests.get("/role/active", null, null, headers, 1),

  bulkDeactivate: (body: any, headers: any) =>
    requests.patch("/role/bulk-deactivate", body, headers),

  bulkActivate: (body: any, headers: any) =>
    requests.patch("/role/bulk-activate", body, headers),

  // 🧠 Defaults & Predefined
  setDefaultRole: (body: any, headers: any) =>
    requests.post("/role/default", body, headers),

  getDefaultRole: (headers: any) =>
    requests.get("/role/default", null, null, headers, 1),

  getDefaultRoleId: (headers: any) =>
    requests.get("/role/default/id", null, null, headers, 1),

  ensurePredefinedRoles: (body: any, headers: any) =>
    requests.post("/role/ensure-predefined", body, headers),

  // 🔎 Search & Analytics
  searchRoles: (query: any, headers: any) =>
    requests.get("/role/search", query, null, headers, 1),

  getAllWithCounts: (headers: any) =>
    requests.get("/role/all/counts", null, null, headers, 1),

  isRoleInUse: (id: any, headers: any) =>
    requests.get(`/role/${id}/in-use`, null, null, headers, 1),

  getRoleAuditTrail: (id: any, headers: any) =>
    requests.get(`/role/${id}/audit-trail`, null, null, headers, 1),

  // 🧬 Bulk & Clone
  bulkAssignPermissions: (body: any, headers: any) =>
    requests.post("/role/bulk-assign-permissions", body, headers),

  cloneRole: (body: any, headers: any) =>
    requests.post("/role/clone", body, headers),

  // 📤 Import/Export
  exportRoles: (query: any, headers: any) =>
    requests.get("/role/export", query, null, headers, 1),

  importRoles: (body: any, headers: any) =>
    requests.post("/role/import", body, headers),
};

export default roleServices;