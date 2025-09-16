import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next.js internals, api routes, public files, auth pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });

    // Not authenticated → redirect to login
    if (!session) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = (session as any).role as string | undefined;
    const permissions = (session as any).permissions as Record<string, string[]> | undefined;

    // Block public, customer, guest
    if (!role || role === "customer" || role === "guest" || role === "public") {
      const forbiddenUrl = new URL("/auth/forbidden", req.url);
      return NextResponse.rewrite(forbiddenUrl);
    }

    // Allow super_admin full access
    if (role === "super_admin") {
      return NextResponse.next();
    }

    // For other authenticated roles, check page-level permission
    const pageName = "dashboard"; // You can improve this by dynamic mapping from pathname
    const allowedActions = permissions?.[pageName] ?? [];

    // Require at least "view" permission for access
    if (!allowedActions.includes("view")) {
      const forbiddenUrl = new URL("/auth/forbidden", req.url);
      return NextResponse.rewrite(forbiddenUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect dashboard and nested routes
};
