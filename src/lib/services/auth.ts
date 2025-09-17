import requests from "../http";

const authService = {
    // ========================================
    // 🔑 PUBLIC ENDPOINTS
    // ========================================
    userRegister: async (body: any) => {
        return await requests.post("/auth/register", body, {});
    },

    userLogin: async (body: any) => {
        return await requests.post("/auth/login", body, {});
    },

    verifyOTP: async (body: any) => {
        return await requests.post("/auth/verify-otp", body, {});
    },

    resendOTP: async (body: any) => {
        return await requests.post("/auth/resend-otp", body, {});
    },

    socialAuth: async (body: any) => {
        return await requests.post("/auth/social-auth", body, {});
    },


    forgotPassword: async (body: any) => {
        return await requests.post("/auth/forgot-password", body, {});
    },

    resetPassword: async (token: string, body: any) => {
        return await requests.post(`/auth/reset-password/${token}`, body, {});
    },

    verifyUser: async (userId: string, headers: any) => {
        return await requests.post(`/auth/verify-user/${userId}`, {}, headers);
    },

    // ========================================
    // 🔐 AUTHENTICATED ENDPOINTS
    // ========================================
    userLogout: async (headers: any) => {
        return await requests.post("/auth/logout", {}, headers);
    },

    logoutAll: async (headers: any) => {
        return await requests.post("/auth/logout-all", {}, headers);
    },

    refreshToken: async (body: any) => {
        return await requests.post("/auth/refresh-token", body, {});
    },

    changePassword: async (body: any, headers: any) => {
        return await requests.post("/auth/change-password", body, headers);
    },

    // ========================================
    // 📧 EMAIL VERIFICATION
    // ========================================
    sendEmailVerification: async (headers: any) => {
        return await requests.post("/auth/send-email-verification", {}, headers);
    },

    verifyEmail: async (token: string, body: any) => {
        return await requests.post(`/auth/verify-email/${token}`, body, {});
    },

    confirmEmail: async (body: any) => {
        return await requests.post("/auth/confirm-email", body, {});
    },

    // ========================================
    // 🔐 MFA / TOTP
    // ========================================
    setupTOTP: async (headers: any) => {
        return await requests.post("/auth/totp/setup", {}, headers);
    },

    verifyTOTPSetup: async (body: any, headers: any) => {
        return await requests.post("/auth/totp/verify-setup", body, headers);
    },

    disableTOTP: async (body: any, headers: any) => {
        return await requests.post("/auth/totp/disable", body, headers);
    },

    generateBackupCodes: async (headers: any) => {
        return await requests.post("/auth/totp/backup-codes", {}, headers);
    },

    enableMFA: async (body: any, headers: any) => {
        return await requests.post("/auth/mfa/enable", body, headers);
    },

    confirmMFA: async (body: any, headers: any) => {
        return await requests.post("/auth/mfa/confirm", body, headers);
    },

    verifyMFA: async (body: any, headers: any) => {
        return await requests.post("/auth/mfa/verify", body, headers);
    },

    // ========================================
    // 📱 DEVICE & SESSION MANAGEMENT
    // ========================================
    getProfile: async (headers: any) => {
        return await requests.get("/auth/profile", {}, {}, headers, 3600); // Cache for 1 hour
    },

    getProfileById: async (headers: any) => {
        return await requests.get("/auth/profile-data", {}, {}, headers, 3600); // Cache for 1 hour
    },

    getDevices: async (headers: any) => {
        return await requests.get("/auth/devices", {}, {}, headers);
    },

    trustDevice: async (body: any, headers: any) => {
        return await requests.post("/auth/devices/trust", body, headers);
    },

    removeDevice: async (body: any, headers: any) => {
        return await requests.delete("/auth/devices/remove", body, headers);
    },

    getActiveSessions: async (headers: any) => {
        return await requests.get("/auth/sessions", {}, {}, headers);
    },

    revokeSession: async (body: any, headers: any) => {
        return await requests.post("/auth/sessions/revoke", body, headers);
    },

    invalidateAllSessions: async (body: any, headers: any) => {
        return await requests.post("/auth/sessions/invalidate-all", body, headers);
    },

    revokeToken: async (body: any, headers: any) => {
        return await requests.post("/auth/sessions/revoke-token", body, headers);
    },

    // ========================================
    // 🔍 SECURITY & MONITORING
    // ========================================
    getSecurityEvents: async (headers: any) => {
        return await requests.get("/auth/security/events", {}, {}, headers);
    },

    getLoginHistory: async (headers: any) => {
        return await requests.get("/auth/security/login-history", {}, {}, headers);
    },

    getSecuritySummary: async (headers: any) => {
        return await requests.get("/auth/security/summary", {}, {}, headers);
    },

    // ========================================
    // ⚙️ OTP SETTINGS
    // ========================================
    getOTPSettings: async (headers: any) => {
        return await requests.get("/auth/otp/settings", {}, {}, headers);
    },

    updateOTPSettings: async (body: any, headers: any) => {
        return await requests.put("/auth/otp/settings", body, {}, headers);
    },

    // ========================================
    // 👤 PROFILE & SOCIAL ACCOUNTS
    // ========================================
    updateProfile: async (userId: string, body: any, headers: any) => {
        return await requests.put(`/auth/profile/${userId}`, body, {}, headers);
    },

    updateProfilePicture: async (userId: string, body: any, headers: any) => {
        return await requests.put(`/auth/profile-picture/${userId}`, body, {}, headers);
    },

    updateEmail: async (userId: string, body: any, headers: any) => {
        return await requests.put(`/auth/email/${userId}`, body, {}, headers);
    },

    updatePhoneNumber: async (userId: string, body: any, headers: any) => {
        return await requests.put(`/auth/phone/${userId}`, body, {}, headers);
    },

    linkSocialAccount: async (userId: string, body: any, headers: any) => {
        return await requests.post(`/auth/social/link/${userId}`, body, headers);
    },

    unlinkSocialAccount: async (userId: string, body: any, headers: any) => {
        return await requests.post(`/auth/social/unlink/${userId}`, body, headers);
    },

    clearAllSocialLinks: async (userId: string, headers: any) => {
        return await requests.delete(`/auth/social/clear/${userId}`, {}, headers);
    },

    // ========================================
    // 📊 ADMIN ANALYTICS & REPORTS
    // ========================================
    getOTPAnalytics: async (headers: any) => {
        return await requests.get("/auth/admin/otp/analytics", {}, {}, headers);
    },

    getSecurityReport: async (headers: any) => {
        return await requests.get("/auth/admin/security/report", {}, {}, headers);
    },

    // ========================================
    // 📝 ROUTE DOCUMENTATION
    // ========================================
    getRoutesDocumentation: async (headers: any) => {
        return await requests.get("/auth/docs/routes", {}, {}, headers);
    }
};

export default authService;