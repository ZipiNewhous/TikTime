export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL ?? "MISSING";
  const trimmed = url.trim();
  const safe = url.length > 10
    ? url.substring(0, 20) + "..." + url.substring(url.length - 10)
    : url;
  const firstChars = Array.from(url.substring(0, 5)).map(c => c.charCodeAt(0));
  return NextResponse.json({
    DATABASE_URL_preview: safe,
    DATABASE_URL_length: url.length,
    DATABASE_URL_trimmed_length: trimmed.length,
    starts_with_postgresql: url.startsWith("postgresql://"),
    trimmed_starts_with_postgresql: trimmed.startsWith("postgresql://"),
    first_char_codes: firstChars,
    NODE_ENV: process.env.NODE_ENV,
  });
}
