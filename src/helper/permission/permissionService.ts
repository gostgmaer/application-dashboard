
// lib/permissionService.ts - Simplified for your API structure
import { Permission, ApiResponse } from '@/types/permissions';

class PermissionService {
  private cache: Permission[] = [];
  private cacheExpiry: number = 0;
  private readonly CACHE_KEY = 'user-permissions';
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  /**
   * Fetch permissions from your API
   */
  async fetchPermissions(): Promise<Permission[]> {
    // Return cache if valid
    if (this.isCacheValid()) {
      return this.cache;
    }

    try {
      const response = await fetch('/api/permissions', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch permissions');
      }

      // Update cache
      this.cache = result.data;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      // Save to localStorage
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        permissions: this.cache,
        expiresAt: this.cacheExpiry
      }));

      return this.cache;
    } catch (error) {
      console.error('Failed to fetch permissions:', error);

      // Try to use cached data if available
      this.loadFromCache();
      if (this.cache.length > 0) {
        console.warn('Using cached permissions due to API failure');
        return this.cache;
      }

      throw error;
    }
  }

  /**
   * Check if user has permission for resource and action
   */
  hasPermission(resource: string, action: string): boolean {
    const permission = this.cache.find(p => p.resource.toLowerCase() === resource.toLowerCase());

    if (!permission) {
      return false;
    }

    // Check for specific action
    if (permission.actions.includes(action)) {
      return true;
    }

    // Check for 'full' permission (covers all actions)
    if (permission.actions.includes('full')) {
      return true;
    }

    // Check for 'manage' permission (covers most actions except read)
    if (permission.actions.includes('manage') && action !== 'read') {
      return true;
    }

    return false;
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(requiredPermissions: string[]): boolean {
    return requiredPermissions.some(perm => {
      const [resource, action] = perm.split(':');
      return this.hasPermission(resource, action);
    });
  }

  /**
   * Get all permissions for a resource
   */
  getResourcePermissions(resource: string): string[] {
    const permission = this.cache.find(p => p.resource.toLowerCase() === resource.toLowerCase());
    return permission ? permission.actions : [];
  }

  /**
   * Get all user permissions
   */
  getAllPermissions(): Permission[] {
    return [...this.cache];
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = [];
    this.cacheExpiry = 0;
    localStorage.removeItem(this.CACHE_KEY);
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(): boolean {
    if (this.cache.length === 0) {
      this.loadFromCache();
    }
    return this.cache.length > 0 && Date.now() < this.cacheExpiry;
  }

  /**
   * Load from localStorage cache
   */
  private loadFromCache(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() < data.expiresAt) {
          this.cache = data.permissions;
          this.cacheExpiry = data.expiresAt;
        }
      }
    } catch (error) {
      console.error('Failed to load from cache:', error);
    }
  }
}

export const permissionService = new PermissionService();
