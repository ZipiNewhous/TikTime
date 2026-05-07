export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      totalOrders,
      totalProducts,
      pendingOrders,
      outOfStock,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.count(),
      prisma.product.count({ where: { active: true } }),
      prisma.order.count({ where: { status: "new" } }),
      prisma.product.count({ where: { stockStatus: "out_of_stock", active: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    // Revenue calculations
    const [revToday, revWeek, revMonth] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay }, paymentStatus: "paid" },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfWeek }, paymentStatus: "paid" },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth }, paymentStatus: "paid" },
        _sum: { totalAmount: true },
      }),
    ]);

    // Sales chart data (last 7 days)
    const revenueChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 86400000);

      const dayOrders = await prisma.order.aggregate({
        where: { createdAt: { gte: dayStart, lt: dayEnd }, paymentStatus: "paid" },
        _sum: { totalAmount: true },
        _count: true,
      });

      revenueChart.push({
        date: dayStart.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" }),
        revenue: dayOrders._sum.totalAmount ?? 0,
        orders: dayOrders._count,
      });
    }

    // Top products by order count
    const topProductsRaw = await prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    const topProducts = topProductsRaw.map((p) => ({
      name: p.productName,
      count: p._sum.quantity ?? 0,
      revenue: p._sum.subtotal ?? 0,
    }));

    // Order status breakdown
    const statusRaw = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
    });

    const statusBreakdown = statusRaw.map((s) => ({
      status: s.status,
      count: s._count,
    }));

    return NextResponse.json({
      ordersToday,
      ordersThisWeek,
      ordersThisMonth,
      totalOrders,
      revenueToday: revToday._sum.totalAmount ?? 0,
      revenueThisWeek: revWeek._sum.totalAmount ?? 0,
      revenueThisMonth: revMonth._sum.totalAmount ?? 0,
      totalProducts,
      pendingOrders,
      outOfStockProducts: outOfStock,
      recentOrders,
      revenueChart,
      topProducts,
      statusBreakdown,
    });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json({ error: "שגיאה בטעינת נתונים" }, { status: 500 });
  }
}

