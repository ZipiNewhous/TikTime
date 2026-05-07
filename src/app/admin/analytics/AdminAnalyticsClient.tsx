"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { formatPrice } from "@/lib/utils";

interface StatsData {
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalProducts: number;
  totalOrders: number;
  revenueChart: { date: string; revenue: number; orders: number }[];
  topProducts: { name: string; count: number; revenue: number }[];
  statusBreakdown: { status: string; count: number }[];
}

const COLORS = ["#c9a96e", "#222021", "#6b7280", "#ef4444", "#22c55e", "#3b82f6"];

const STATUS_LABELS: Record<string, string> = {
  pending: "ממתין", confirmed: "אושר", processing: "בטיפול",
  shipped: "נשלח", delivered: "נמסר", cancelled: "בוטל",
};

export default function AdminAnalyticsClient() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-[#c9a96e] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "הזמנות היום", value: stats.ordersToday, sub: formatPrice(stats.revenueToday) },
    { label: "הזמנות השבוע", value: stats.ordersThisWeek, sub: formatPrice(stats.revenueThisWeek) },
    { label: "הזמנות החודש", value: stats.ordersThisMonth, sub: formatPrice(stats.revenueThisMonth) },
    { label: "סה\"כ הזמנות", value: stats.totalOrders, sub: `${stats.totalProducts} מוצרים` },
  ];

  const pieData = stats.statusBreakdown.map((s) => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: s.count,
  }));

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      <h1 className="text-2xl font-black text-[#222021] mb-6">אנליטיקס</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-gray-500 text-sm mb-1">{card.label}</p>
            <p className="text-3xl font-black text-[#222021]">{card.value}</p>
            <p className="text-[#c9a96e] font-semibold text-sm mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">הכנסות ב-7 ימים האחרונים</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={stats.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fontFamily: "Assistant" }} />
            <YAxis tick={{ fontSize: 12, fontFamily: "Assistant" }} />
            <Tooltip
              formatter={(v) => formatPrice(Number(v))}
              contentStyle={{ fontFamily: "Assistant", direction: "rtl" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#c9a96e"
              strokeWidth={2.5}
              dot={{ fill: "#c9a96e", r: 4 }}
              name="הכנסות"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        {stats.topProducts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4">מוצרים מובילים</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" tick={{ fontSize: 11, fontFamily: "Assistant" }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fontFamily: "Assistant" }}
                  width={120}
                />
                <Tooltip contentStyle={{ fontFamily: "Assistant" }} />
                <Bar dataKey="count" fill="#c9a96e" name="כמות" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Order Status Pie */}
        {pieData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4">פילוח סטטוס הזמנות</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span style={{ fontFamily: "Assistant" }}>{v}</span>} />
                <Tooltip contentStyle={{ fontFamily: "Assistant" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
