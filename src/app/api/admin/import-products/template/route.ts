import { NextResponse } from "next/server";

// Template download removed — the import now accepts your own Excel files directly.
export async function GET() {
  return NextResponse.json({ error: "Not used" }, { status: 404 });
}
