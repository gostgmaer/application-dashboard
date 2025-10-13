import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { secret } from "./config/setting";

// Centralized route–permission map
// Use :id or * for dynamic segments
const routePermissions: Record<string, string[]> = {
  "/dashboard/ecommerce/products": ["read:product"],
  "/dashboard/ecommerce/products/create": ["write:product"],
  "/dashboard/ecommerce/products/:id": ["read:product"],
  "/dashboard/ecommerce/products/:id/update": ["update:product"],
  "/dashboard/ecommerce/products/categories": ["read:category"],
  "/dashboard/ecommerce/products/brands": ["read:brand"],
  "/dashboard/ecommerce/orders": ["read:order"],
  "/dashboard/ecommerce/orders/:id": ["read:order"],
  "/dashboard/users/create": ["write:user"],
  "/dashboard/users": ["read:user"],
  "/dashboard/users/:id": ["read:user"],
  "/dashboard/users/:id/update": ["update:user"],
  "/dashboard/users/roles": ["read:user"],
  "/dashboard/users/permissions": ["read:user"],
  "/dashboard/settings": ["view:settings"],
};

const ADMIN_RESTRICTED_PATHS = ["/dashboard/settings"];

// Helper to match dynamic routes
function matchDynamicRoute(pathname: string) {
  for (const route of Object.keys(routePermissions)) {
    // Convert dynamic segments to regex
    const regexStr = "^" + route.replace(/:\w+/g, "[^/]+") + "$";
    const regex = new RegExp(regexStr);
    if (regex.test(pathname)) return routePermissions[route];
  }
  return [];
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip static + API paths
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

  // 🔒 Not logged in
  if (!token) {
    if (isProtectedRoute) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2FA handling
  const twoFARequired = token?.["2fa_required"] ?? false;
  const twoFAVerified = token?.["2fa_verified"] ?? false;

  if (isProtectedRoute && twoFARequired && !twoFAVerified) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Auth pages for logged-in users
  if (isAuthRoute) {
    if (!twoFARequired || (twoFARequired && twoFAVerified)) {
      const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
      if (callbackUrl) return NextResponse.redirect(new URL(callbackUrl, req.url));
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 🧠 Permission enforcement
  if (isProtectedRoute) {
    const role = token?.role;
    const permissions: any = token?.permissions ?? [];

    // ✅ Super admin → full access
    if (role === "super_admin") return NextResponse.next();

    // ✅ Admin → full access except restricted
    if (role === "admin") {
      if (ADMIN_RESTRICTED_PATHS.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    }

    // 🧩 Other roles → check route permissions
    const requiredPermissions = matchDynamicRoute(pathname);

    if (requiredPermissions.length > 0) {
      const hasAccess = requiredPermissions.every((perm) =>
        permissions.includes(perm)
      );
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/"], // homepage + auth + dashboard
};
