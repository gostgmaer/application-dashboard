import { User, Address, UserPreferences } from '@/types/user';
import { ApiResponse } from '@/types/global';
import userServices from '@/lib/http/userService';
import authService from '@/lib/http/authService';
import addressService from '@/lib/http/address';

/**
 * User API - delegates to real HTTP services.
 * Each method accepts a token and optional headers for auth.
 * Components should retrieve the token from session/context and pass it in.
 */
export const userApi = {
  updateUser: async (data: Partial<User>, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    return userServices.updatePatch(id, data, token, headers);
  },

  sendOTP: async (type: 'email' | 'phone', token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return authService.resendOTP({ method: type }, token, headers);
  },

  verifyOTP: async (code: string, type: 'email' | 'phone', token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return authService.verifyOTPAndLogin({ otp: code, method: type }, token, headers);
  },

  changePassword: async (oldPassword: string, newPassword: string, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    return userServices.changePassword(id, { currentPassword: oldPassword, newPassword, confirmPassword: newPassword }, token, headers);
  },

  setupTOTP: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return authService.setupTOTP({}, token, headers);
  },

  confirmTOTP: async (code: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return authService.verifyTOTPSetup({ token: code }, token, headers);
  },

  disableTOTP: async (password: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return authService.disableTOTP({ password }, token, headers);
  },

  request2FADisable: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    // TODO: Implement when backend endpoint exists
    return { success: false, error: 'Not implemented' };
  },

  verifyAndDisable2FA: async (code: string, password: string, method: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return authService.disableTOTP({ password, code, method }, token, headers);
  },

  getSecurityLogs: async (page: number = 1, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    return authService.getSecurityLogs(token, headers);
  },

  logoutDevice: async (deviceId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return authService.logoutAll({ deviceId }, token, headers);
  },

  logoutAllDevices: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return authService.logoutAll({}, token, headers);
  },

  updateDeviceTrust: async (deviceId: string, trusted: boolean, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    // TODO: Implement when backend endpoint exists
    return { success: false, error: 'Not implemented' };
  },

  createAddress: async (address: Omit<Address, 'id'>, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return addressService.create(address, token, headers);
  },

  updateAddress: async (addressId: string, address: Partial<Address>, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!addressId || !token) return { success: false, error: 'Missing address id or token' };
    return addressService.updatePatch(addressId, address, token, headers);
  },

  deleteAddress: async (addressId: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!addressId || !token) return { success: false, error: 'Missing address id or token' };
    return addressService.remove(addressId, token, headers);
  },

  getSocialConnections: async (id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    const result = await userServices.getProfile(token, headers);
    return { ...result, data: result.data?.socialMedia };
  },

  connectSocial: async (provider: string, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    return userServices.updateSocialMedia(id, { provider, action: 'connect' }, token, headers);
  },

  disconnectSocial: async (provider: string, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    return userServices.updateSocialMedia(id, { provider, action: 'disconnect' }, token, headers);
  },

  getPreferences: async (id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse<UserPreferences>> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    const result = await userServices.getProfile(token, headers);
    return { ...result, data: result.data?.preferences };
  },

  updatePreferences: async (preferences: Partial<UserPreferences>, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    return userServices.updatePreferences(id, preferences, token, headers);
  },

  deactivateAccount: async (password: string, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    return userServices.deactivateAccount(id, token, headers);
  },

  deleteAccount: async (password: string, id?: string, token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!id || !token) return { success: false, error: 'Missing user id or token' };
    return userServices.remove(id, token, headers);
  },

  logout: async (token?: string, headers?: Record<string, any>): Promise<ApiResponse> => {
    if (!token) return { success: false, error: 'Missing token' };
    return authService.logout(token, headers);
  }
};