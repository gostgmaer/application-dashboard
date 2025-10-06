
// types/permissions.ts - Updated for your API structure
export interface Permission {
  id: string;
  resource: string;
  actions: string[];
}

export interface ApiResponse {
  success: boolean;
  status: number;
  data: Permission[];
  message: string;
}

export interface SessionData {
  userId: string;
  token: string;
  permissions: Permission[];
  expiresAt: number;
}


export interface permissionList {
  _id: string;
  name: string;
  category: string;
  action: string;
  isDefault: string;
  isActive: string;
  description: string;
}

// Common actions in your system
export type ActionType = 'read' | 'write' | 'modify' | 'delete' | 'export' | 'generate' | 'report' | 'full' | 'manage';

// Your resources
export type ResourceType = 'Role' | 'User' | 'Cart' | 'Wishlist' | 'Address' | 'Audit' | 
  'Order' | 'Coupon' | 'Review' | 'Translation' | 'Product' | 'Permission' | 
  'Media' | 'Support' | 'Brand' | 'Category' | 'System';
