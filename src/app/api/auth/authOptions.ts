// Production-grade authOptions.ts with proper session management

import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    "2fa_required"?: boolean;
    "2fa_verified"?: boolean;
    otp_method?: string;
    tempToken?: string;
    id_token?: string;
    token_type?: string;
    user: {
      role?: string;
      permissions?: Record<string, any>;
      [key: string]: any;
    };
    error?: string;
  }
}

import {
  baseurl,
  githubClient,
  githubSecret,
  googleClient,
  googleSecret,
  linkedinClient,
  linkedinSecret,
  twitterClient,
  twitterSecret,
  secret,
  facebookClient,
  facebookSecret,
} from "@/config/setting";
import authService from "@/lib/http/authService";


interface CustomToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  id_token?: string;
  token_type?: string;
  exp?: number;
  error?: string;
  role?: string;
  [key: string]: any;
  "2fa_required"?: boolean;
  "2fa_verified"?: boolean;
  otp_method?: string;
  tempToken?: string;
}

interface CustomUser extends User {
  accessToken?: string;
  tempToken?: string;
  refreshToken?: string;
  id_token?: string;
  token_type?: string;
  accessTokenExpires?: number;
  role?: string;
  otp_method?: string;
  "2fa_required"?: boolean;
  "2fa_verified"?: boolean;
}

// Custom error for 2FA requirement
export class TwoFactorRequiredError extends Error {
  constructor(
    public tempUserId: string,
    public email: string,
    public requiresMFA: boolean = true,
    public tempToken: string = "",
    public otpType: string = "totp"
  ) {
    super(
      JSON.stringify({ tempUserId, email, requiresMFA, tempToken, otpType })
    );
    this.name = "TwoFactorRequiredError";
  }
}

async function refreshAccessToken(token: CustomToken): Promise<CustomToken> {
  try {
    console.log("🔄 Refreshing access token...");

    if (!token.refreshToken) {
      console.error("❌ No refresh token available");
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    const response = await authService.refreshToken({
      refreshToken: token.refreshToken,
    });

    if (!response.success) {
      console.error("❌ Token refresh failed:", response.message);
      throw new Error(response?.message || "Failed to refresh token");
    }

    const { accessToken, refreshToken, expiresAt } = response.data;

    console.log("✅ Token refreshed successfully");

    return {
      ...token,
      accessToken,
      accessTokenExpires: Date.parse(expiresAt),
      refreshToken: refreshToken ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("❌ Refresh token error:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text", placeholder: "Enter 6-digit OTP" },
        tempUserId: { label: "Temp User ID", type: "hidden" },
      },
      async authorize(credentials) {
        try {
          console.log("🔐 Authorizing credentials...");

          const payload = {
            identifier: credentials?.email,
            password: credentials?.password,
            otp: credentials?.otp,
            tempUserId: credentials?.tempUserId,
          };

          const res = await authService.login(payload);

          if (!res) {
            console.error("❌ No response from login service");
            throw new Error("No response from login service");
          }

          if (!res.success) {
            console.error("❌ Login failed:", res.message);
            throw new Error(res.message || "Invalid credentials");
          }

          const { user, tokens } = res.data;
          const { data } = res;

          console.log("✅ Login successful, returning user data");

          return {
            id: user.id,
            name: user.fullName ?? user.username,
            email: user.email,
            otp_method: data.otp_method,
            tempToken: data.tempToken,
            image: user.image,
            role: user?.role,
            accessToken: tokens?.accessToken,
            refreshToken: tokens?.refreshToken,
            token_type: "access",
            accessTokenExpires: tokens?.accessTokenExpiresAt ? Date.parse(tokens.accessTokenExpiresAt) : undefined,
            "2fa_required": data?.["2fa_required"],
            "2fa_verified": data?.["2fa_verified"],
          };
        } catch (error) {
          console.error("❌ Authorize error:", error);
          throw error;
        }
      },
    }),


    // ... other providers remain the same

    GoogleProvider({
      clientId: googleClient ?? "",
      clientSecret: googleSecret ?? "",
    }),
    LinkedInProvider({
      clientId: linkedinClient ?? "",
      clientSecret: linkedinSecret ?? "",
    }),
    FacebookProvider({
      clientId: facebookClient ?? "",
      clientSecret: facebookSecret ?? "",
    }),
    GitHubProvider({
      clientId: githubClient ?? "",
      clientSecret: githubSecret ?? "",
    }),
    TwitterProvider({
      clientId: twitterClient ?? "",
      clientSecret: twitterSecret ?? "",
      version: "2.0",
    }),

  ],

  secret,
  pages: {
    signIn: "/auth/login",
    signOut: "/",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: CustomUser;
      account: Account | null;
      profile?: Profile;
    }) {
      // Handle social login
      if (
        (account?.provider === "github" ||
          account?.provider === "linkedin" ||
          account?.provider === "twitter" ||
          account?.provider === "google") &&
        profile?.email
      ) {
        try {
          const data = await authService.socialLogin({
            identifier: profile.email,
            profileData: {
              ...profile,
              ...account,
            },
          });

          user.accessToken = data.data.accessToken;
          user.refreshToken = data.data.refreshToken;
          user.token_type = data.data.token_type;
          user.role = data.data.role || "";
          user.accessTokenExpires = Date.parse(data.data.expiresAt);

          return true;
        } catch (error) {
          console.error(`❌ Error during ${account?.provider} sign-in:`, error);
          return false;
        }
      }

      return !!user?.accessToken;
    },

    // ✅ FIXED JWT CALLBACK - Production Ready
    async jwt({ token, user, account, profile, trigger, session }) {
      const customToken = token as CustomToken;

      // Debug logging
      // if (process.env.NODE_ENV === "development") {
      //   console.log("🔧 JWT Callback:", {
      //     trigger,
      //     hasToken: !!token, 
      //     hasUser: !!user,
      //     hasSession: !!session,
      //     sessionKeys: session ? Object.keys(session) : [],
      //   });
      // }

      // Initial sign-in
      if (user) {
        const customUser = user as CustomUser;
        const profile = await authService.getProfile(user.accessToken);



        console.log("👤 Setting initial user data in token");
        customToken.accessToken = customUser.accessToken;
        customToken.refreshToken = customUser.refreshToken;
        customToken.token_type = customUser.token_type;
        customToken.accessTokenExpires = customUser.accessTokenExpires;
        customToken.role = customUser.role;
        customToken.sub = customUser.id;
        customToken["tempToken"] = customUser["tempToken"];
        customToken["2fa_required"] = customUser["2fa_required"];
        customToken["otp_method"] = customUser["otp_method"];
        customToken["2fa_verified"] = customUser["2fa_verified"];
      }

      // ✅ Handle session update trigger (from useSession().update())
      if (trigger === "update" && session) {
        console.log("🔄 Handling session update:", {
          trigger,
          sessionData: session,
          tokenBefore: {
            "2fa_verified": customToken["2fa_verified"],
            accessToken: customToken.accessToken ? "***" : undefined
          }
        });

        // Update 2FA verification status
        if (session["2fa_verified"] !== undefined) {
          customToken["2fa_verified"] = session["2fa_verified"];
          console.log("✅ Updated 2FA verification status:", session["2fa_verified"]);
        }

        // ✅ FIXED: Use correct property names that match what's sent from login form
        if (session.accessToken) {
          customToken.accessToken = session.accessToken;
          console.log("✅ Updated access token");
        }

        if (session.refreshToken) {
          customToken.refreshToken = session.refreshToken;
          console.log("✅ Updated refresh token");
        }

        if (session.accessTokenExpires) {
          // Handle both string and number formats
          const expires = typeof session.accessTokenExpires === 'string'
            ? Date.parse(session.accessTokenExpires)
            : session.accessTokenExpires;
          customToken.accessTokenExpires = expires;
          console.log("✅ Updated token expiration:", new Date(expires));
        }

        // Update other session properties if present
        if (session.role !== undefined) {
          customToken.role = session.role;
        }

        console.log("🔄 Session update completed successfully");
      }

      // Check if token is expired and refresh if necessary
      if (
        customToken.accessTokenExpires &&
        Date.now() > customToken.accessTokenExpires &&
        customToken.refreshToken
      ) {
        console.log("⏰ Token expired, attempting refresh...");
        return await refreshAccessToken(customToken);
      }

      // Clear any temporary error states after successful update
      if (trigger === "update" && customToken.error) {
        customToken.error = undefined;
      }

      return customToken;
    },

    async session({
      session,
      token,
      trigger,
      newSession,
    }: {
      session: Session;
      trigger: string;
      newSession?: Session;
      token: CustomToken;
    }) {
      if (process.env.NODE_ENV === "development") {
        console.log("📋 Session callback:", {
          trigger,
          hasToken: !!token,
          "2fa_verified": token["2fa_verified"]
        });
      }

      // Map token properties to session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.token_type = token.token_type;
      session["2fa_required"] = token["2fa_required"];
      session["2fa_verified"] = token["2fa_verified"];
      session["otp_method"] = token["otp_method"];
      session.tempToken = token.tempToken;
      session.user = {
        ...session.user,
        role: token.role,
      };
      session.error = token.error;

      return session;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Handle redirect logic
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  theme: {
    colorScheme: "auto",
    brandColor: "",
    logo: "/vercel.svg",
  },

  debug: process.env.NODE_ENV === "development",
};