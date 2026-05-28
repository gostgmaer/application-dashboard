
// types/permissions.ts - Updated for your API structure
export interface Permission {
  id: string;
  resource: string;
  actions: string[];
}

// ApiResponse: use canonical definition from @/types/global


export interface permissionList {
  _id: string;
  name: string;
  category: string;
  action: string;
  isDefault: string;
  isActive: string;
  description: string;
}
