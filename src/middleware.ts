import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_COOKIE = "tiktime-admin-token";
const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "tiktime-admin-secret-change-in-production"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.delete(TOKEN_COOKIE);
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
