import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TOKEN_COOKIE } from "@/lib/auth/admin";

const ADMIN_ROUTES = ["/admin"];
const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only apply to /admin routes
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (!isAdminRoute) return NextResponse.next();

  // Allow login page
  if (PUBLIC_ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Check JWT
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const admin = await verifyToken(token);
  if (!admin) {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
