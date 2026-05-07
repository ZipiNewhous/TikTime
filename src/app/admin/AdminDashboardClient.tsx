"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS } from "@/lib/utils";

interface Stats {
  ordersToday: number;
  ordersWeek: number;
  ordersMonth: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  totalProducts: number;
  pendingOrders: number;
  outOfStockProducts: number;
  recentOrders: {
    id: number;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
  salesChart: { date: string; revenue: number; orders: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[#c9a96e] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#222021]">לוח בקרה</h1>
          <p className="text-gray-500 mt-1">ברוך הבא לפאנל הניהול</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="btn-gold flex items-center gap-2 text-sm px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            מוצר חדש
          </Link>
          <Link
            href="/admin/orders"
            className="btn-dark flex items-center gap-2 text-sm px-4 py-2"
          >
            <Eye className="h-4 w-4" />
            הזמנות
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "הזמנות היום",
            value: stats?.ordersToday ?? 0,
            sub: `${stats?.ordersWeek ?? 0} השבוע`,
            icon: <ShoppingBag className="h-6 w-6" />,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "הכנסות החודש",
            value: formatPrice(stats?.revenueMonth ?? 0),
            sub: `היום: ${formatPrice(stats?.revenueToday ?? 0)}`,
            icon: <TrendingUp className="h-6 w-6" />,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "מוצרים פעילים",
            value: stats?.totalProducts ?? 0,
            sub: `${stats?.outOfStockProducts ?? 0} אזלו`,
            icon: <Package className="h-6 w-6" />,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            label: "הזמנות ממתינות",
            value: stats?.pendingOrders ?? 0,
            sub: "לטיפול מיידי",
            icon: <AlertTriangle className="h-6 w-6" />,
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4"
          >
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-black text-[#222021] mt-0.5">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-bold text-lg text-[#222021] mb-4">מכירות - 7 ימים אחרונים</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats?.salesChart ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₪${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => formatPrice(Number(value))}
                labelStyle={{ direction: "rtl" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#c9a96e"
                strokeWidth={2.5}
                dot={{ fill: "#c9a96e" }}
                name="הכנסות"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-[#222021]">הזמנות אחרונות</h2>
            <Link href="/admin/orders" className="text-sm text-[#c9a96e] hover:underline">
              כל ההזמנות
            </Link>
          </div>

          {stats?.recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">אין הזמנות עדיין</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats?.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-50"
                >
                  <div>
                    <p className="font-bold text-sm text-[#222021]">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#c9a96e] text-sm">{formatPrice(order.totalAmount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "הוסף מוצר", href: "/admin/products/new", icon: "📦" },
          { label: "ניהול הזמנות", href: "/admin/orders", icon: "🛒" },
          { label: "ניהול קטגוריות", href: "/admin/categories", icon: "🗂️" },
          { label: "ניהול מותגים", href: "/admin/brands", icon: "🏷️" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-[#c9a96e] hover:shadow-md transition-all"
          >
            <span className="text-3xl block mb-2">{action.icon}</span>
            <span className="font-semibold text-sm text-[#222021]">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
