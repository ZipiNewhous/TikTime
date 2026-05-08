export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL ?? "MISSING";
  const safe = url.length > 10
    ? url.substring(0, 20) + "..." + url.substring(url.length - 10)
    : url;
  return NextResponse.json({
    DATABASE_URL_preview: safe,
    DATABASE_URL_length: url.length,
    starts_with_postgresql: url.startsWith("postgresql://"),
    NODE_ENV: process.env.NODE_ENV,
  });
}
