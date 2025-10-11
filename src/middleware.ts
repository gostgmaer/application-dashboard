import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { secret } from "./config/setting";

// Centralized route–permission map
// Use :id or * for dynamic segments
const routePermissions: Record<string, string[]> = {
  "/dashboard/products": ["view:product"],
  "/dashboard/products/create": ["create:product"],
  "/dashboard/products/:id": ["view:product"],
  "/dashboard/products/:id/edit": ["update:product"],
  "/dashboard/products/:id/delete": ["delete:product"],

  "/dashboard/categories": ["view:category"],
  "/dashboard/categories/create": ["create:category"],
  "/dashboard/categories/:id": ["view:category"],
  "/dashboard/categories/:id/edit": ["update:category"],
  "/dashboard/categories/:id/delete": ["delete:category"],

  "/dashboard/brands": ["view:brand"],
  "/dashboard/brands/create": ["create:brand"],
  "/dashboard/brands/:id": ["view:brand"],
  "/dashboard/brands/:id/edit": ["update:brand"],
  "/dashboard/brands/:id/delete": ["delete:brand"],

  "/dashboard/orders": ["view:order"],
  "/dashboard/orders/:id": ["view:order"],
  "/dashboard/orders/:id/update": ["update:order"],

  "/dashboard/users": ["view:user"],
  "/dashboard/users/:id": ["view:user"],
  "/dashboard/users/:id/edit": ["update:user"],
  "/dashboard/users/:id/delete": ["delete:user"],

  "/dashboard/roles": ["manage:role"],
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
