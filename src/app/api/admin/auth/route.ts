export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { adminLogin, TOKEN_COOKIE } from "@/lib/auth/admin";

// POST /api/admin/auth — login
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "אימייל וסיסמה נדרשים" }, { status: 400 });
    }

    const result = await adminLogin(email, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, admin: result.admin });
    res.cookies.set(TOKEN_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("[POST /api/admin/auth]", err);
    return NextResponse.json({ error: "שגיאה בהתחברות" }, { status: 500 });
  }
}

// DELETE /api/admin/auth — logout
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(TOKEN_COOKIE);
  return res;
}

