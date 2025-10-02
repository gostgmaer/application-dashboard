export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissionCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Permission {
  id: string;
  module: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface RoleDetails {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  users: User[];
  permissions: Permission[];
}

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    userCount: 3,
    permissionCount: 45,
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:45:00Z',
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Manage team members and view reports',
    userCount: 12,
    permissionCount: 28,
    status: 'active',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-03-18T11:20:00Z',
  },
  {
    id: '3',
    name: 'Editor',
    description: 'Create and edit content across the platform',
    userCount: 24,
    permissionCount: 18,
    status: 'active',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-03-15T16:30:00Z',
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access to platform resources',
    userCount: 87,
    permissionCount: 8,
    status: 'active',
    createdAt: '2024-02-10T13:45:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
  },
  {
    id: '5',
    name: 'Guest',
    description: 'Limited access for external collaborators',
    userCount: 5,
    permissionCount: 4,
    status: 'inactive',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-05T15:20:00Z',
  },
];

export const mockRoleDetails: Record<string, RoleDetails> = {
  '1': {
    id: '1',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    status: 'active',
    users: [
      {
        id: 'u1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      {
        id: 'u2',
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      {
        id: 'u3',
        name: 'Emily Davis',
        email: 'emily.davis@company.com',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
    ],
    permissions: [
      { id: 'p1', module: 'User Management', name: 'Create Users', description: 'Ability to create new user accounts', enabled: true },
      { id: 'p2', module: 'User Management', name: 'Edit Users', description: 'Ability to modify user information', enabled: true },
      { id: 'p3', module: 'User Management', name: 'Delete Users', description: 'Ability to remove user accounts', enabled: true },
      { id: 'p4', module: 'Content', name: 'Create Content', description: 'Ability to create new content', enabled: true },
      { id: 'p5', module: 'Content', name: 'Edit Content', description: 'Ability to modify existing content', enabled: true },
      { id: 'p6', module: 'Content', name: 'Delete Content', description: 'Ability to remove content', enabled: true },
      { id: 'p7', module: 'Settings', name: 'Manage Settings', description: 'Ability to configure system settings', enabled: true },
      { id: 'p8', module: 'Settings', name: 'View Audit Logs', description: 'Ability to view system audit logs', enabled: true },
      { id: 'p9', module: 'Reports', name: 'Generate Reports', description: 'Ability to create and export reports', enabled: true },
      { id: 'p10', module: 'Reports', name: 'View Analytics', description: 'Ability to view analytics dashboard', enabled: true },
    ],
  },
  '2': {
    id: '2',
    name: 'Manager',
    description: 'Manage team members and view reports',
    status: 'active',
    users: [
      {
        id: 'u4',
        name: 'David Wilson',
        email: 'david.wilson@company.com',
        avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
      {
        id: 'u5',
        name: 'Lisa Anderson',
        email: 'lisa.anderson@company.com',
        avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
    ],
    permissions: [
      { id: 'p2', module: 'User Management', name: 'Edit Users', description: 'Ability to modify user information', enabled: true },
      { id: 'p4', module: 'Content', name: 'Create Content', description: 'Ability to create new content', enabled: true },
      { id: 'p5', module: 'Content', name: 'Edit Content', description: 'Ability to modify existing content', enabled: true },
      { id: 'p9', module: 'Reports', name: 'Generate Reports', description: 'Ability to create and export reports', enabled: true },
      { id: 'p10', module: 'Reports', name: 'View Analytics', description: 'Ability to view analytics dashboard', enabled: true },
    ],
  },
  '3': {
    id: '3',
    name: 'Editor',
    description: 'Create and edit content across the platform',
    status: 'active',
    users: [
      {
        id: 'u6',
        name: 'James Taylor',
        email: 'james.taylor@company.com',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
      },
    ],
    permissions: [
      { id: 'p4', module: 'Content', name: 'Create Content', description: 'Ability to create new content', enabled: true },
      { id: 'p5', module: 'Content', name: 'Edit Content', description: 'Ability to modify existing content', enabled: true },
    ],
  },
  '4': {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access to platform resources',
    status: 'active',
    users: [],
    permissions: [
      { id: 'p10', module: 'Reports', name: 'View Analytics', description: 'Ability to view analytics dashboard', enabled: true },
    ],
  },
  '5': {
    id: '5',
    name: 'Guest',
    description: 'Limited access for external collaborators',
    status: 'inactive',
    users: [],
    permissions: [],
  },
};

export async function fetchRoles(): Promise<Role[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockRoles;
}

export async function fetchRoleDetails(id: string): Promise<RoleDetails | null> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockRoleDetails[id] || null;
}
