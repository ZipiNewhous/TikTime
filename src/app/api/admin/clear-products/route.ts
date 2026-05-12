export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";

export async function DELETE(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await prisma.product.deleteMany({});
  console.log(`[clear-products] Deleted ${result.count} products by admin ${admin.username}`);

  return NextResponse.json({ deleted: result.count, message: `Deleted ${result.count} products` });
}
