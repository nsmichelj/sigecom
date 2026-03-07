import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login"];
const PROTECTED_ROUTE_PREFIX = "/dashboard";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = pathname.startsWith(PROTECTED_ROUTE_PREFIX);

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
