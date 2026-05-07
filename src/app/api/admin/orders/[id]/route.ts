export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";

// GET /api/admin/orders/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      items: {
        include: { product: { select: { name: true, slug: true, image1: true, sku: true } } },
      },
    },
  });

  if (!order) return NextResponse.json({ error: "׳”׳–׳׳ ׳” ׳׳ ׳ ׳׳¦׳׳”" }, { status: 404 });
  return NextResponse.json(order);
}

// PATCH /api/admin/orders/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { status, paymentStatus, notes } = body;

  try {
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        ...(status !== undefined && { status }),
        ...(paymentStatus !== undefined && { paymentStatus }),
        ...(notes !== undefined && { notes }),
      },
    });
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[PATCH /api/admin/orders/[id]]", err);
    return NextResponse.json({ error: "׳©׳’׳™׳׳” ׳‘׳¢׳“׳›׳•׳ ׳”׳”׳–׳׳ ׳”" }, { status: 500 });
  }
}
