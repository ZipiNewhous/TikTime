export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    // Get first 10 products with their image URLs
    const products = await prisma.product.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        sku: true,
        image1: true,
        brand: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalProducts = await prisma.product.count();

    // Test each image URL
    const results = await Promise.all(
      products.map(async (p) => {
        if (!p.image1) return { id: p.id, name: p.name, sku: p.sku, brand: p.brand.name, image1: null, status: "null_url" };
        try {
          const res = await fetch(p.image1, { method: "HEAD", signal: AbortSignal.timeout(5000) });
          return {
            id: p.id,
            name: p.name,
            sku: p.sku,
            brand: p.brand.name,
            image1: p.image1,
            status: res.ok ? "ok" : `http_${res.status}`,
            contentType: res.headers.get("content-type"),
          };
        } catch (err) {
          return {
            id: p.id,
            name: p.name,
            sku: p.sku,
            brand: p.brand.name,
            image1: p.image1,
            status: `fetch_error: ${err instanceof Error ? err.message : String(err)}`,
          };
        }
      })
    );

    return NextResponse.json({
      totalProducts,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "MISSING",
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "configured" : "MISSING",
      databaseUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":***@") : "MISSING",
      results,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
