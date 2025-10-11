import { User, Address, Device, ActivityLog, SocialConnection, TOTPSetup, UserPreferences } from '@/types/user';

// API response wrapper
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Mock API functions - replace with actual API calls
export const userApi = {
  // User data
  getUser: async (): Promise<ApiResponse<User>> => {
    // Mock data
    return {
      success: true,
      data: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '+1234567890',
        gender: 'male',
        dateOfBirth: '1990-05-15',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        emailVerified: true,
        phoneVerified: true,
        profileVerified: true,
        identityVerified: false,
        totpEnabled: false,
        smsEnabled: false,
        emailAuthEnabled: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    };
  },

  updateUser: async (data: Partial<User>): Promise<ApiResponse> => {
    console.log('Updating user:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  // OTP operations
  sendOTP: async (type: 'email' | 'phone'): Promise<ApiResponse> => {
    console.log('Sending OTP to:', type);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  verifyOTP: async (code: string, type: 'email' | 'phone'): Promise<ApiResponse> => {
    console.log('Verifying OTP:', code, type);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  // Security
  changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse> => {
    console.log('Changing password');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  // TOTP
  setupTOTP: async (): Promise<ApiResponse<TOTPSetup>> => {
    console.log('Setting up TOTP');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: {
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        backupCodes: ['123456', '789012', '345678']
      }
    };
  },

  confirmTOTP: async (code: string): Promise<ApiResponse> => {
    console.log('Confirming TOTP:', code);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  disableTOTP: async (password: string): Promise<ApiResponse> => {
    console.log('Disabling TOTP');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  // Request 2FA disable (sends verification code)
  request2FADisable: async (): Promise<ApiResponse> => {
    console.log('Requesting 2FA disable verification');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  // Verify and disable 2FA
  verifyAndDisable2FA: async (code: string, password: string, method: string): Promise<ApiResponse> => {
    console.log('Verifying and disabling 2FA:', code, method);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  // Activity logs
  getActivityLogs: async (page: number = 1): Promise<ApiResponse<{ logs: ActivityLog[], total: number }>> => {
    console.log('Fetching activity logs, page:', page);
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        logs: [
          { id: '1', action: 'Login', device: 'Chrome on Windows', ip: '192.168.1.1', timestamp: '2024-01-01T10:00:00Z', status: 'success' },
          { id: '2', action: 'Profile Updated', device: 'Safari on macOS', ip: '192.168.1.2', timestamp: '2024-01-01T09:00:00Z', status: 'success' },
          { id: '3', action: 'Failed Login', device: 'Firefox on Linux', ip: '192.168.1.3', timestamp: '2024-01-01T08:00:00Z', status: 'failed' }
        ],
        total: 25
      }
    };
  },

  getSecurityLogs: async (page: number = 1): Promise<ApiResponse<{ logs: ActivityLog[], total: number }>> => {
    console.log('Fetching security logs, page:', page);
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        logs: [
          { id: '1', action: 'Password Changed', device: 'Chrome on Windows', ip: '192.168.1.1', timestamp: '2024-01-01T10:00:00Z', status: 'success' },
          { id: '2', action: '2FA Enabled', device: 'Safari on macOS', ip: '192.168.1.2', timestamp: '2024-01-01T09:00:00Z', status: 'success' }
        ],
        total: 10
      }
    };
  },

  // Devices
  getDevices: async (): Promise<ApiResponse<Device[]>> => {
    console.log('Fetching devices');
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: [
        { id: '1', name: 'Chrome on Windows', ip: '192.168.1.1', os: 'Windows 10', browser: 'Chrome', location: 'New York, USA', lastLogin: '2024-01-01T10:00:00Z', trusted: true, current: true },
        { id: '2', name: 'Safari on iPhone', ip: '192.168.1.2', os: 'iOS 17', browser: 'Safari', location: 'New York, USA', lastLogin: '2024-01-01T08:00:00Z', trusted: false, current: false }
      ]
    };
  },

  logoutDevice: async (deviceId: string): Promise<ApiResponse> => {
    console.log('Logging out device:', deviceId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  logoutAllDevices: async (): Promise<ApiResponse> => {
    console.log('Logging out all devices');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  updateDeviceTrust: async (deviceId: string, trusted: boolean): Promise<ApiResponse> => {
    console.log('Updating device trust:', deviceId, trusted);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  // Addresses
  getAddresses: async (): Promise<ApiResponse<Address[]>> => {
    console.log('Fetching addresses');
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: [
        { id: '1', label: 'Home', line1: '123 Main St', city: 'New York', postalCode: '10001', country: 'USA', phone: '+1234567890', isDefault: true },
        { id: '2', label: 'Work', line1: '456 Business Ave', city: 'New York', postalCode: '10002', country: 'USA', isDefault: false }
      ]
    };
  },

  createAddress: async (address: Omit<Address, 'id'>): Promise<ApiResponse> => {
    console.log('Creating address:', address);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  updateAddress: async (id: string, address: Partial<Address>): Promise<ApiResponse> => {
    console.log('Updating address:', id, address);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  deleteAddress: async (id: string): Promise<ApiResponse> => {
    console.log('Deleting address:', id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  // Social connections
  getSocialConnections: async (): Promise<ApiResponse<SocialConnection[]>> => {
    console.log('Fetching social connections');
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: [
        { provider: 'google', connected: true, email: 'john@gmail.com', connectedAt: '2024-01-01T00:00:00Z' },
        { provider: 'github', connected: false },
        { provider: 'facebook', connected: false },
        { provider: 'twitter', connected: true, email: 'john@twitter.com', connectedAt: '2024-01-01T00:00:00Z' }
      ]
    };
  },

  connectSocial: async (provider: string): Promise<ApiResponse> => {
    console.log('Connecting social:', provider);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  disconnectSocial: async (provider: string): Promise<ApiResponse> => {
    console.log('Disconnecting social:', provider);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  // Preferences
  getPreferences: async (): Promise<ApiResponse<UserPreferences>> => {
    console.log('Fetching preferences');
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        notifications: true,
        newsletter: false,
        privacyMode: false,
        securityAlerts: true,
        theme: 'system'
      }
    };
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<ApiResponse> => {
    console.log('Updating preferences:', preferences);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  // Account actions
  deactivateAccount: async (password: string): Promise<ApiResponse> => {
    console.log('Deactivating account');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  deleteAccount: async (password: string): Promise<ApiResponse> => {
    console.log('Deleting account');
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },

  logout: async (): Promise<ApiResponse> => {
    console.log('Logging out');
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};