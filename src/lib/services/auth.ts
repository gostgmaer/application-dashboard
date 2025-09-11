import requests from "../http";

const authService = {
    userRegister: async (body: any) => {
        return await requests.post("/user/auth/register", body, {});
    },
    userLogin: async (body: any) => {
        return await requests.post("/user/auth/login", body, {});
    },
    userLogout: async (headers: any) => {
        return await requests.post("/user/auth/logout", {}, headers);
    },
    getUserProfile: async (headers: any) => {
        return await requests.get("/user/auth/profile",{}, {}, headers, 3600); // Cache for 1 hour
    },
    updateUserProfile: async (body: any, params: any, headers: any) => {
        return await requests.patch("/user/auth/profile/update", body, params, headers);
    },
    changePassword: async (body: any, headers: any) => {
        return await requests.post("/user/auth/change-password", body, headers);
    },
    forgetPassword: async (body: any, headers: any) => {
        return await requests.post("/user/auth/forget-password", body, headers);
    },
    resetPassword: async (body: any, headers: any) => {
        return await requests.post("/user/auth/reset-password/:token", body, headers);
    },
    verifyEmailAddress: async (body: any) => {
        return requests.post("/customer/auth/verify-email", body, {});
    },
    verifyToken: async (body: any) => {
        return requests.post("/user/auth/session/refresh/token", body, {});
    },
};

export default authService;
