import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { secret } from "./config/setting";

/**
 * Middleware to protect routes and redirect based on authentication + 2FA status
 */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/auth") || pathname === "/";

  const token = await getToken({ req, secret });
console.log(token);

  // 🔒 Not logged in
  if (!token) {
    if (isProtectedRoute) {
      const loginUrl = new URL("/auth/login", req.url);
      // Preserve full path + query
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const twoFARequired = token?.["2fa_required"] ?? false;
  const twoFAVerified = token?.["2fa_verified"] ?? false;


  // 🔐 Protected route requires 2FA
  if (isProtectedRoute) {
    if (twoFARequired && !twoFAVerified) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 🚫 Prevent logged-in users from visiting auth pages unnecessarily
  if (isAuthRoute) {
    if (!twoFARequired || (twoFARequired && twoFAVerified)) {
      // ✅ If callbackUrl exists, go there instead of dashboard
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
      if (callbackUrl) {
        return NextResponse.redirect(new URL(callbackUrl, req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/"], // homepage + auth + dashboard
};
