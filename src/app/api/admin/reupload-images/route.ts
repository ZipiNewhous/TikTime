export const dynamic = 'force-dynamic';
export const maxDuration = 300;

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { uploadImageFromUrl } from "@/lib/supabase/uploadImage";

// GET /api/admin/reupload-images — stats about current image state
export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await prisma.product.findMany({
    select: { id: true, image1: true },
  });

  const stats = {
    total: all.length,
    noImage: all.filter((p) => !p.image1).length,
    externalUrl: all.filter((p) => p.image1 && !p.image1.includes("supabase.co/storage")).length,
    supabaseStorage: all.filter((p) => p.image1?.includes("supabase.co/storage")).length,
  };

  return NextResponse.json(stats);
}

// POST /api/admin/reupload-images
// Body: { limit?: number; offset?: number; dryRun?: boolean }
export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_SUPABASE_URL not set in environment" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = body?.dryRun === true;
  const limit  = Math.min(50, body?.limit  ?? 50);
  const offset = body?.offset ?? 0;

  // Only pick products whose image1 is an external URL (not already in Supabase Storage)
  const products = await prisma.product.findMany({
    select: { id: true, sku: true, image1: true, brand: { select: { name: true } } },
    where: {
      image1: { not: null },
      NOT: { image1: { contains: "supabase.co/storage" } },
    },
    skip: offset,
    take: limit,
    orderBy: { id: "asc" },
  });

  const totalRemaining = await prisma.product.count({
    where: {
      image1: { not: null },
      NOT: { image1: { contains: "supabase.co/storage" } },
    },
  });

  const results: { id: number; sku: string; original: string; newUrl?: string; status: string }[] = [];

  for (const product of products) {
    if (!product.image1) continue;

    if (dryRun) {
      results.push({ id: product.id, sku: product.sku, original: product.image1, status: "would_upload" });
      continue;
    }

    const safeName = `${product.brand.name}-${product.sku}`
      .toLowerCase()
      .replace(/[^a-z0-9\-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 100);

    const newUrl = await uploadImageFromUrl(product.image1, `${safeName}.jpg`);

    if (newUrl !== product.image1 && newUrl.includes("supabase.co/storage")) {
      await prisma.product.update({ where: { id: product.id }, data: { image1: newUrl } });
      results.push({ id: product.id, sku: product.sku, original: product.image1, newUrl, status: "uploaded" });
    } else {
      results.push({ id: product.id, sku: product.sku, original: product.image1, status: "upload_failed" });
    }
  }

  return NextResponse.json({
    dryRun,
    offset,
    limit,
    processed: results.length,
    totalRemaining: totalRemaining - results.filter((r) => r.status === "uploaded").length,
    uploaded: results.filter((r) => r.status === "uploaded").length,
    failed:   results.filter((r) => r.status === "upload_failed").length,
    results,
  });
}
