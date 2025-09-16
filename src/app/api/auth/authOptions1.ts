import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import TwitterProvider from "next-auth/providers/twitter";
import { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";

// Extend the Session type to include custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    id_token?: string;
    token_type?: string;
    user: {
      role?: string;
      permissions?: Record<string, string[]>; // page -> actions[]
      [key: string]: any;
    };
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

import authService from "@/lib/services/auth";

interface CustomToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  id_token?: string;
  token_type?: string;
  exp?: number;
  error?: string;
  role?: string;
  permissions?: Record<string, string[]>; // page -> [actions]
}

interface CustomUser extends User {
  accessToken?: string;
  refreshToken?: string;
  id_token?: string;
  token_type?: string;
  expiresIn?: number;
  role?: string;
}

// Helper to refresh access token
async function refreshAccessToken(token: CustomToken): Promise<CustomToken> {
  try {
    const response = await fetch(`${baseurl}/user/auth/session/refresh/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });
    const refreshedTokens = await response.json();

    if (!response.ok) throw new Error("Failed to refresh token");

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000,
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken,
    };
  } catch (error) {
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
      },
      async authorize(credentials) {
        const payload = {
          identifier: credentials?.email,
          password: credentials?.password,
        };
        const res = await authService.userLogin(payload);
        if (!res || !res.success) {
          // Throw an error with message from your backend
          throw new Error(res?.message || "Invalid credentials");
        }
        const { user, tokens } = res.data;
        return {
          sub: user.id,
          name: user.fullName ?? user.username,
          email: user.email,
          image:user.image,
          role: user.role,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          id_token: tokens.idToken,
          expiresIn: tokens.accessTokenExpiresAt, // or parse expiry if available
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
      version: "2.0", // use OAuth 2.0 if supported
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
    async signIn({ user, account, profile }: { user: CustomUser; account: Account | null; profile?: Profile }) {
   

      if ((account?.provider === "github" || account?.provider === "linkedin" || account?.provider === "twitter") && profile?.email) {

       console.log(user, account, profile);
        
        try {
          const response = await fetch(`${baseurl}/user/auth/checkUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: profile.email,
              email: profile.email,
            }),
          });
          let userData = await response.json();

          if (userData["statusCode"] === "404") {
            const createUserResponse = await fetch(`${baseurl}/user/auth/social-register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                socialID: user.id,
                email: profile.email,
                profilePicture: user.image,
                username: profile.email,
              }),
            });
            userData = await createUserResponse.json();
          }

          user.accessToken = userData.accessToken;
          user.refreshToken = userData.refreshToken;
          user.id_token = userData.id_token;
          user.token_type = userData.token_type;
          user.role = userData.role || "";

          return true;
        } catch (error) {
          console.error(`Error during ${account.provider} sign-in:`, error);
          return false;
        }
      }

      return !!user?.accessToken;
    },

    async jwt({ token, user, account }) {
      const customToken = token as CustomToken;

      if (user) {
        const customUser = user as CustomUser;
        customToken.accessToken = customUser.accessToken;
        customToken.refreshToken = customUser.refreshToken;
        customToken.id_token = customUser.id_token;
        customToken.token_type = customUser.token_type;
        customToken.accessTokenExpires = Date.now() + ((customUser.expiresIn ?? 0) * 1000);
        customToken.role = customUser.role;

        if (customToken.role !== "super_admin") {
          try {
            const response = await fetch(`${baseurl}/user/auth/permissions`, {
              headers: {
                Authorization: `Bearer ${customToken.accessToken}`,
              },
            });
            if (response.ok) {
              customToken.permissions = await response.json();
            } else {
              customToken.permissions = {};
            }
          } catch {
            customToken.permissions = {};
          }
        } else {
          customToken.permissions = { "*": ["read", "write", "view", "delete"] };
        }

        return customToken;
      }

      if (Date.now() < (customToken.accessTokenExpires ?? 0)) {
        return customToken;
      }

      return refreshAccessToken(customToken);
    },

    async session({ session, token }) {
      session.accessToken = (token as CustomToken).accessToken;
      session.refreshToken = (token as CustomToken).refreshToken;
      session.id_token = (token as CustomToken).id_token;
      session.token_type = (token as CustomToken).token_type;
      session.user.role = (token as any).role;
      session.user.permissions = (token as any).permissions;
      return session;
    },

    async redirect({ url, baseUrl }) {
      // If url is relative, safe to redirect to it
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();

      // If url is absolute and safe (same origin), allow
      if (new URL(url).origin === baseUrl) return url;

      // Otherwise fallback to baseUrl
      return baseUrl;
    }
  },
  theme: {
    colorScheme: "auto",
    brandColor: "",
    logo: "/vercel.svg",
  },
  debug: process.env.NODE_ENV === "development",
};
