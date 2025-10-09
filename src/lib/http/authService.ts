import requests from "./index";
import { safeApiCall } from "./apiUtils";
import { ApiResponse } from "@/types/global";

const authService = {
  registerUser: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/register", body, token, headers)),

  login: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/login", body, token, headers)),

  verifyOTPAndLogin: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/mfa/verify-login-otp", body, token, headers)
    ),

  resendOTP: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/mfa/resend", body, token, headers)),

  socialLogin: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/social-auth", body, token, headers)),

  forgotPassword: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/forgot-password", body, token, headers)
    ),

  resetPassword: (
    resetToken: string,
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post(`/auth/reset-password/${resetToken}`, body, token, headers)
    ),

  verifyUser: (
    id: string,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post(`/auth/verify-user/${id}`, null, token, headers)
    ),

  logout: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/logout", null, token, headers)),

  getUserPermissions: (
    token?: string,
    query?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/permissions", token, query, undefined, headers)
    ),

  logoutAll: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/logout-all", body, token, headers)),

  refreshToken: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/refresh-token", body, token, headers)
    ),

  changePassword: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/change-password", body, token, headers)
    ),

  sendEmailVerification: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/send-email-verification", null, token, headers)
    ),

  verifyEmail: (
    verifyToken: string,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post(`/auth/verify-email/${verifyToken}`, null, token, headers)
    ),

  confirmEmail: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/confirm-email", body, token, headers)
    ),

  setupTOTP: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/totp/setup", body, token, headers)),

  verifyTOTPSetup: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/totp/verify-setup", body, token, headers)
    ),

  disableTOTP: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/totp/disable", body, token, headers)
    ),

  generateBackupCodes: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/totp/backup-codes", body, token, headers)
    ),
  setupMFA: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/mfa/setup", body, token, headers)),

  verifyMFASetup: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/mfa/setup/verify", body, token, headers)
    ),

  enableMFA: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/mfa/enable", body, token, headers)),

  disableMFA: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/mfa/disable", body, token, headers)),

  confirmMFA: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/mfa/confirm", body, token, headers)),

  verifyMFA: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.post("/auth/mfa/verify", body, token, headers)),

  getAccountSetting: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/account-settng", token, undefined, undefined, headers)
    ),

  findFullyPopulatedProfile: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/profile-data", token, undefined, undefined, headers)
    ),

  getProfile: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/profile", token, undefined, undefined, headers)
    ),

  getDevices: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/devices", token, undefined, undefined, headers)
    ),

  trustDevice: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/devices/trust", body, token, headers)
    ),

  removeDevice: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.delete("/auth/devices/remove", body, token, undefined, headers)
    ),

  getActiveSessions: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/sessions", token, undefined, undefined, headers)
    ),

  revokeSession: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/sessions/revoke", body, token, headers)
    ),

  invalidateAllSessions: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/sessions/invalidate-all", body, token, headers)
    ),

  revokeToken: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post("/auth/sessions/revoke-token", body, token, headers)
    ),

  getSecurityEvents: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get(
        "/auth/security/events",
        token,
        undefined,
        undefined,
        headers
      )
    ),

  getLoginHistory: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get(
        "/auth/security/login-history",
        token,
        undefined,
        undefined,
        headers
      )
    ),

  getSecuritySummary: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get(
        "/auth/security/summary",
        token,
        undefined,
        undefined,
        headers
      )
    ),

  getOTPSettings: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/otp/settings", token, undefined, undefined, headers)
    ),

  updateOTPSettings: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.put("/auth/otp/settings", body, token, headers)),

  updateProfile: (
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.patch(`/auth/profile`, body, token, headers)),

  updateProfilePicture: (
    body: any,
    token?: string,
    headers?: Record<string, any>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.patch(`/auth/profile-picture`, body, token, headers)
    ),

  updateEmail: (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.patch(`/auth/email/${id}`, body, token, headers)
    ),

  updatePhoneNumber: (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.patch(`/auth/phone/${id}`, body, token, headers)
    ),
  getLinkedAccounts: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() => requests.get(`/auth/social/accounts`, token, headers)),
  linkSocialAccount: (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post(`/auth/social/link/${id}`, body, token, headers)
    ),

  unlinkSocialAccount: (
    id: string,
    body: any,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.post(`/auth/social/unlink/${id}`, body, token, headers)
    ),

  clearAllSocialLinks: (
    id: string,
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.delete(
        `/auth/social/clear/${id}`,
        undefined,
        token,
        undefined,
        headers
      )
    ),

  getOTPAnalytics: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get(
        "/auth/admin/otp/analytics",
        token,
        undefined,
        undefined,
        headers
      )
    ),

  getSecurityReport: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get(
        "/auth/admin/security/report",
        token,
        undefined,
        undefined,
        headers
      )
    ),

  getTrustedDevices: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get(
        "/auth/trusted-devices",
        token,
        undefined,
        undefined,
        headers
      )
    ),

  getSecurityLogs: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/security-logs", token, undefined, undefined, headers)
    ),

  getAllLoginHistory: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/login-history", token, undefined, undefined, headers)
    ),

  getAllActiveSessions: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get(
        "/auth/active-sessions",
        token,
        undefined,
        undefined,
        headers
      )
    ),

  getKnownDevices: (
    token?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> =>
    safeApiCall(() =>
      requests.get("/auth/known-devices", token, undefined, undefined, headers)
    ),

  getRoutesDocumentation: (headers?: Record<string, any>) =>
    safeApiCall(() =>
      requests.get(`/auth/docs/routes`, undefined, undefined, headers)
    ),
};

export default authService;
