import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import TwitterProvider from "next-auth/providers/twitter";
import { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    id_token?: string;
    token_type?: string;
    role?: string;
    user: {
      role?: string;
      permissions?: Record<string, string[]>;
      twoFactorEnabled?: boolean;
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
} from "@/config/setting";
import authService from "@/helper/services/authService";

interface CustomToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  id_token?: string;
  token_type?: string;
  exp?: number;
  error?: string;
  role?: string;
  permissions?: Record<string, string[]>;
  twoFactorEnabled?: boolean;
}

interface CustomUser extends User {
  accessToken?: string;
  refreshToken?: string;
  id_token?: string;
  token_type?: string;
  accessTokenExpires?: number;
  role?: string;
  twoFactorEnabled?: boolean;
}

// Custom error for 2FA requirement
export class TwoFactorRequiredError extends Error {
  constructor(public tempUserId: string, public email: string, public requiresMFA: boolean = true, public tempToken: string = "", public otpType: string = "totp") {
    super(JSON.stringify({ tempUserId, email, requiresMFA,tempToken, otpType }));
    this.name = "TwoFactorRequiredError";
  }
}

async function refreshAccessToken(token: CustomToken): Promise<CustomToken> {
  try {
    const response = await authService.refreshToken({
      refreshToken: token.refreshToken,
    });
    if (!response.success) {
      throw new Error(response?.message || "Failed to refresh token");
    }

    const { accessToken, refreshToken, expiresAt } = response.data;
    return {
      ...token,
      accessToken,
      accessTokenExpires: Date.parse(expiresAt),
      refreshToken: refreshToken ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    console.error("Refresh token error:", error);
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
        const payload = {
          identifier: credentials?.email,
          password: credentials?.password,
          otp: credentials?.otp,
          tempUserId: credentials?.tempUserId,
        };

        const res = await authService.login(payload);
        if (!res) {
          throw new Error("No response from login service");
        }
        if (!res.success) {
          throw new Error(res.message || "Invalid credentials");
        }
        if (res.data?.requiresMFA === true) {
          throw new TwoFactorRequiredError(
            res.data.tempUserId || res.data.userId,
            credentials?.email || "", res.data?.requiresMFA, res.data.tempToken, res.data?.otpType
          );
        }
        const { user, tokens } = res.data;
        return {
          id: user.id,
          name: user.fullName ?? user.username,
          email: user.email,
          image: user.image,
          role: user.role,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          token_type: "access",
          accessTokenExpires: Date.parse(tokens.accessTokenExpiresAt),
          twoFactorEnabled: user.twoFactorEnabled || false,
        };
      },
    }),
    GitHubProvider({
      clientId: githubClient || "",
      clientSecret: githubSecret || "",
    }),
    GoogleProvider({
      clientId: googleClient || "",
      clientSecret: googleSecret || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    LinkedInProvider({
      clientId: linkedinClient || "",
      clientSecret: linkedinSecret || "",
      authorization: {
        params: {
          scope: "r_liteprofile r_emailaddress",
        },
      },
    }),
    TwitterProvider({
      clientId: twitterClient || "",
      clientSecret: twitterSecret || "",
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
    maxAge: 7 * 24 * 60 * 60,
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
          user.id_token = data.data.id_token;
          user.token_type = data.data.token_type;
          user.role = data.data.role || "";
          user.accessTokenExpires = Date.parse(data.data.expiresAt);
          user.twoFactorEnabled = data.data.twoFactorEnabled || false;

          return true;
        } catch (error) {
          console.error(`Error during ${account?.provider} sign-in:`, error);
          return false;
        }
      }

      return !!user?.accessToken;
    },

    async jwt({ token, user, account, profile, trigger }) {
      const customToken = token as CustomToken;
      if (user) {
        const customUser = user as CustomUser;
        customToken.accessToken = customUser.accessToken;
        customToken.refreshToken = customUser.refreshToken;
        customToken.id_token = customUser.id_token;
        customToken.token_type = customUser.token_type;
        customToken.accessTokenExpires = customUser.accessTokenExpires;
        customToken.role = customUser.role;
        customToken.sub = customUser.id;
        customToken.twoFactorEnabled = customUser.twoFactorEnabled;

        try {
          const response = await authService.getUserPermissions(
            customToken.accessToken
          );
          console.log(response);

          if (response.data) {
            customToken.permissions = response.data.permissions;
          } else {
            customToken.permissions = {};
          }
        } catch {
          customToken.permissions = {};
        }
      }

      // Check if token is expired and refresh if necessary
      if (
        customToken.accessTokenExpires &&
        Date.now() > customToken.accessTokenExpires
      ) {
        return await refreshAccessToken(customToken);
      }

      return customToken;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: CustomToken;
    }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.id_token = token.id_token;
      session.token_type = token.token_type;
      session.role = token.role;
      session.user = {
        ...session.user,
        role: token.role,
        permissions: token.permissions,
        twoFactorEnabled: token.twoFactorEnabled,
      };
      session.error = token.error;

      return session;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith("/") || new URL(url).origin === baseUrl
        ? url
        : baseUrl;
    },
  },

  theme: {
    colorScheme: "auto",
    brandColor: "",
    logo: "/vercel.svg",
  },

  debug: process.env.NODE_ENV === "development",
};
