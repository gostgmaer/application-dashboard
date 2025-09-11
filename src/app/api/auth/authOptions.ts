import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import  { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Account, Profile } from "next-auth";

// Extend the Session type to include custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    id_token?: string;
    token_type?: string;
  }
}
import {
  baseurl,
  githubClient,
  githubSecret,
  googleClient,
  googleSecret,
  secret,
} from "@/config/setting";
import authService from "@/lib/services/auth";
import { log } from "console";

interface CustomToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  id_token?: string;
  token_type?: string;
  exp?: number;
  error?: string;
}

interface CustomUser extends User {
  accessToken?: string;
  refreshToken?: string;
  id_token?: string;
  token_type?: string;
}

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
          email: credentials?.email,
          password: credentials?.password,
        };

        const res = await authService.userLogin(payload);
        console.log(res);
        
        // console.log("Response from authService:", res);

        if (res && res.status=="OK" && res.accessToken) return res;
        return null;
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
  ],

  secret,
  pages: {
    signIn: "/auth/login",
    signOut: "/",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account, profile }: {


      user: CustomUser;
      account: Account | null;
      profile?: Profile;
    }) {

      // log("SignIn Callback:", { user, account, profile });
      if (account?.provider === "github" && profile?.email) {
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
            const createUserResponse = await fetch(
              `${baseurl}/user/auth/social-register`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  socialID: user.id,
                  email: profile.email,
                  profilePicture: user.image,
                  username: profile.email,
                  // firstName: profile["login"] || profile.name,
                }),
              }
            );

            userData = await createUserResponse.json();
          }

          user.accessToken = userData.accessToken;
          user.refreshToken = userData.refreshToken;
          user.id_token = userData.id_token;
          user.token_type = userData.token_type;

          return true;
        } catch (error) {
          console.error("Error during GitHub sign-in:", error);
          return false;
        }
      }

      return !!user?.accessToken;
    },

    async jwt({ token, user, account, profile, trigger, isNewUser, session }: {
      token: JWT;
      user?: User | null;
      account?: Account | null;
      profile?: Profile;
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
      session?: any;
    }) {
      // Cast token to CustomToken for type safety
      const customToken = token as CustomToken;

      if (user) {
        const customUser = user as CustomUser;
        return {
          ...customToken,
          accessToken: customUser.accessToken,
          refreshToken: customUser.refreshToken,
          id_token: customUser.id_token,
          token_type: customUser.token_type,
        };
      }

      return customToken;
    },

    async session({ session, token }: {
      session: Session;
      token: CustomToken;
    }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.id_token = token.id_token;
      session.token_type = token.token_type;
      return session;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return url.startsWith("/") || new URL(url).origin === baseUrl
        ? baseUrl
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

