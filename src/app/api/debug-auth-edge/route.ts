export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-test-token") ?? "";
  const rawSecret = process.env.NEXTAUTH_SECRET ?? "";

  const key = new TextEncoder().encode(rawSecret || "tiktime-admin-secret-change-in-production");

  const result: Record<string, unknown> = {
    secret_length: rawSecret.length,
    secret_first_codes: Array.from(rawSecret.substring(0, 5)).map(c => c.charCodeAt(0)),
    secret_defined: rawSecret.length > 0,
  };

  if (token) {
    try {
      const { payload } = await jwtVerify(token, key);
      result.verify = `VALID exp=${payload.exp}`;
    } catch (e: unknown) {
      result.verify = `INVALID: ${(e as Error).message}`;
    }
  }

  return NextResponse.json(result);
}
