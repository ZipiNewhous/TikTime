export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-test-token") ?? "";
  const rawSecret = process.env.NEXTAUTH_SECRET ?? "";

  const secretVariants: [string, string][] = [
    ["raw", rawSecret],
    ["trimmed", rawSecret.trim()],
    ["bom-stripped", rawSecret.replace(/^﻿/, "").trim()],
    ["fallback", "tiktime-admin-secret-change-in-production"],
  ];

  const results: Record<string, string> = {
    secret_length: String(rawSecret.length),
    secret_first_codes: Array.from(rawSecret.substring(0, 5)).map(c => c.charCodeAt(0)).join(","),
    token_length: String(token.length),
  };

  for (const [label, s] of secretVariants) {
    const key = new TextEncoder().encode(s);
    try {
      const { payload } = await jwtVerify(token, key);
      results[label] = `VALID exp=${payload.exp}`;
    } catch (e: unknown) {
      results[label] = `INVALID: ${(e as Error).message}`;
    }
  }

  return NextResponse.json(results);
}
