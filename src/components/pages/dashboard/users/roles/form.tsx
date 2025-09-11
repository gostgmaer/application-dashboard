
"use client";

import { useState } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Save, Eye, Trash2 } from 'lucide-react';

// Predefined roles
const PREDEFINED_ROLES = [
  "super_admin",   // Full system access
  "admin",         // Manage platform settings, users, products
  "manager",       // Oversee operations
  "staff",         // Limited admin tasks
  "vendor",        // Third-party seller
  "customer",      // Regular buyer
  "guest",         // Not logged in
  "support_agent", // Customer service
  "moderator",     // Content/review moderation
  "user"           // Generic authenticated user
];

// Zod schema based on the provided Mongoose schema
const roleSchema = z.object({
  name: z.enum([
  "super_admin",   // Full system access
  "admin",         // Manage platform settings, users, products
  "manager",       // Oversee operations
  "staff",         // Limited admin tasks
  "vendor",        // Third-party seller
  "customer",      // Regular buyer
  "guest",         // Not logged in
  "support_agent", // Customer service
  "moderator",     // Content/review moderation
  "user"           // Generic authenticated user
], { message: "Invalid role name" }),
  description: z.string().trim().optional(),
  permissions: z.array(z.string()).optional(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
}).strict();

interface RoleData {
  name: string;
  description?: string;
//   permissions: string[];
  isDefault: boolean;
  isActive: boolean;
}

export default function RoleForm({data,id}:any) {
  const [role, setRole] = useState<RoleData>({
    name: '',
    description: '',
    // permissions: [],
    isDefault: false,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newPermission, setNewPermission] = useState('');
  const [showJsonOutput, setShowJsonOutput] = useState(false);
  const [jsonOutput, setJsonOutput] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const validateForm = () => {
    try {
      roleSchema.parse(role);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        return false;
      }
      return false;
    }
  };

//   const addPermission = () => {
//     if (newPermission.trim() && !role.permissions.includes(newPermission.trim())) {
//       setRole(prev => ({ ...prev, permissions: [...prev.permissions, newPermission.trim()] }));
//       setNewPermission('');
//       setErrors(prev => ({ ...prev, permissions: '' }));
//     }
//   };

//   const removePermission = (permission: string) => {
//     setRole(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permission) }));
//   };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    const updatedRole = {
      ...role,
    };

    const jsonString = JSON.stringify(updatedRole, null, 2);
    setJsonOutput(jsonString);
    setShowJsonOutput(true);

    console.log('Role JSON:', jsonString);
  };

  const handleChange = (field: keyof RoleData, value: any) => {
    setRole(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className={` ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} py-8 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <Card className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'} shadow-lg`}>
          <CardHeader className={`${theme === 'light' ? 'bg-gray-50 border-b-gray-200' : 'bg-gray-800 border-b-gray-700'}`}>
            <CardTitle className={`flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              <div className="w-2 h-6 bg-blue-400 rounded-full"></div>
              Role Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <Label htmlFor="name" className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Role Name *
              </Label>
              <Select value={role.name} onValueChange={(value) => handleChange('name', value)}>
                <SelectTrigger
                  className={`mt-1 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500' : 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'} ${errors.name ? 'border-red-500' : ''}`}
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className={`${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}`}>
                  {PREDEFINED_ROLES.map(roleName => (
                    <SelectItem key={roleName} value={roleName} className={`${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}>
                      {roleName.replace(/_/g, ' ').charAt(0).toUpperCase() + roleName.replace(/_/g, ' ').slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="description" className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Description
              </Label>
              <Input
                id="description"
                value={role.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`mt-1 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500' : 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'} ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Enter role description"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            {/* <div>
              <Label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Permissions</Label>
              <div className="flex flex-wrap gap-2 mb-3 mt-2">
                {role.permissions.length === 0 ? (
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>No permissions added</p>
                ) : (
                  role.permissions.map(permission => (
                    <Badge
                      key={permission}
                      variant="secondary"
                      className={`${theme === 'light' ? 'bg-gray-200 text-gray-800 border-gray-300' : 'bg-gray-700 text-gray-300 border-gray-600'} flex items-center gap-1`}
                    >
                      {permission}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePermission(permission)}
                        className="h-4 w-4 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newPermission}
                  onChange={(e) => setNewPermission(e.target.value)}
                  placeholder="Enter permission ID"
                  onKeyPress={(e) => e.key === 'Enter' && addPermission()}
                  className={`flex-1 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500' : 'bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500'} ${errors.permissions ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  onClick={addPermission}
                  variant="outline"
                  size="sm"
                  className={`${theme === 'light' ? 'border-gray-300 text-gray-700 hover:bg-gray-100' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {errors.permissions && <p className="text-red-500 text-xs mt-1">{errors.permissions}</p>}
            </div> */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Default Role</Label>
                <Switch
                  checked={role.isDefault}
                  onCheckedChange={(checked) => handleChange('isDefault', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Active Role</Label>
                <Switch
                  checked={role.isActive}
                  onCheckedChange={(checked) => handleChange('isActive', checked)}
                />
              </div>
            </div>
            <Separator className={`${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
         
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                className={`flex-1 ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                // disabled={Object.keys(errors).length > 0 || !role.name}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Role
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
