import requests from "./httpServices";

const roleServices = {
  // 🔍 Basic CRUD
  create: (body: any, token: any) =>
    requests.post("/roles", body, {},token),

  getAll: (query: any, t: any) =>
    requests.get("/roles", query, null, {}, 1,t),
  getStatistics: (query: any, token: any) =>
    requests.get("/roles/statistics", query, null, {}, 1, token),

  getById: (id: any, headers: any) =>
    requests.get(`/roles/${id}`, null, null, headers, 1),

  updatePut: (id: any, body: any, headers: any) =>
    requests.put(`/roles/${id}`, body, headers),

  updatePatch: (id: any, body: any, token: any) =>
    requests.patch(`/roles/${id}`, body, {}, {}, token),

  delete: (id: any, headers: any) =>
    requests.delete(`/roles/${id}`, null, headers),

  // 🔐 Permission Management
  addPermission: (id: any, body: any, headers: any) =>
    requests.post(`/roles/${id}/permission`, body, headers),

  removePermission: (id: any, body: any, headers: any) =>
    requests.delete(`/roles/${id}/permission`, body, headers),

  hasPermission: (id: any, permissionName: string, headers: any) =>
    requests.get(`/roles/${id}/permission/${permissionName}`, null, null, headers, 1),

  getRoleWithPermissions: (id: any, headers: any) =>
    requests.get(`/roles/${id}/permissions`, null, null, headers, 1),

  assignPermissions: (id: any, body: any, token: any) =>
    requests.post(`/roles/${id}/permissions`, body, {},token),

  removePermissions: (id: any, body: any, headers: any) =>
    requests.delete(`/roles/${id}/permissions`, body, headers),

  syncPermissions: (id: any, body: any, headers: any) =>
    requests.put(`/roles/${id}/sync-permissions`, body, headers),

  // ⚙️ Lifecycle & Status
  toggleActive: (id: any, headers: any) =>
    requests.patch(`/roles/${id}/toggle-active`, {}, headers),

  getActiveRoles: (token: any) =>
    requests.get("/roles/active", null, null, {}, 3600,token),

  bulkDeactivate: (body: any, headers: any) =>
    requests.patch("/roles/bulk-deactivate", body, headers),

  bulkActivate: (body: any, headers: any) =>
    requests.patch("/roles/bulk-activate", body, headers),

  // 🧠 Defaults & Predefined
  setDefaultRole: (body: any, headers: any) =>
    requests.post("/roles/default", body, headers),

  getDefaultRole: (headers: any) =>
    requests.get("/roles/default", null, null, headers, 1),

  getDefaultRoleId: (headers: any) =>
    requests.get("/roles/default/id", null, null, headers, 1),

  ensurePredefinedRoles: (body: any, headers: any) =>
    requests.post("/roles/ensure-predefined", body, headers),

  // 🔎 Search & Analytics
  searchRoles: (query: any, headers: any) =>
    requests.get("/roles/search", query, null, headers, 1),

  getAllWithCounts: (headers: any) =>
    requests.get("/roles/all/counts", null, null, headers, 1),

  isRoleInUse: (id: any, headers: any) =>
    requests.get(`/roles/${id}/in-use`, null, null, headers, 1),

  getRoleAuditTrail: (id: any, headers: any) =>
    requests.get(`/roles/${id}/audit-trail`, null, null, headers, 1),

  // 🧬 Bulk & Clone
  bulkAssignPermissions: (body: any, headers: any) =>
    requests.post("/roles/bulk-assign-permissions", body, headers),

  cloneRole: (body: any, headers: any) =>
    requests.post("/roles/clone", body, headers),

  // 📤 Import/Export
  exportRoles: (query: any, headers: any) =>
    requests.get("/roles/export", query, null, headers, 1),

  importRoles: (body: any, headers: any) =>
    requests.post("/roles/import", body, headers),
};

export default roleServices;