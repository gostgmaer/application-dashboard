import { CookiesOptions } from "next-auth";

declare module "next-auth" {
  interface CookiesOptions {
    accessToken?: CookieOption;
    refreshToken?: CookieOption;
    userId?: CookieOption;
    username?: CookieOption;
    fullName?: CookieOption;
    image?: CookieOption;
  }
}