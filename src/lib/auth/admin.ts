/**
 * Admin Authentication
 * Simple JWT-based auth for admin panel
 */

import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "tiktime-admin-secret-change-in-production"
);

const TOKEN_COOKIE = "tiktime-admin-token";

export interface AdminPayload {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Sign a JWT
export async function signToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

// Verify a JWT
export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

// Get admin from request (checks cookie)
export async function getAdminFromRequest(req: NextRequest): Promise<AdminPayload | null> {
  const token =
    req.cookies.get(TOKEN_COOKIE)?.value ??
    req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) return null;
  return verifyToken(token);
}

// Login with email + password
export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: true; token: string; admin: AdminPayload } | { success: false; error: string }> {
  const admin = await prisma.adminUser.findUnique({ where: { email } });

  if (!admin) {
    return { success: false, error: "פרטים שגויים" };
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return { success: false, error: "פרטים שגויים" };
  }

  const payload: AdminPayload = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
  };

  const token = await signToken(payload);
  return { success: true, token, admin: payload };
}

export { TOKEN_COOKIE };
