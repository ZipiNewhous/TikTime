"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { formatPrice, formatDateTime, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: { id: number }[];
}

const STATUS_VARIANT: Record<string, "gold" | "green" | "red" | "gray" | "dark"> = {
  pending: "gold",
  confirmed: "dark",
  processing: "dark",
  shipped: "dark",
  delivered: "green",
  cancelled: "red",
};

const PAYMENT_VARIANT: Record<string, "green" | "gold" | "red" | "gray"> = {
  paid: "green",
  pending: "gold",
  failed: "red",
  refunded: "gray",
};

const ALL_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), search, status });
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.items ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#222021]">הזמנות</h1>
          <p className="text-gray-500 text-sm mt-1">{total} הזמנות במערכת</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <Search className="h-5 w-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="חיפוש לפי מספר הזמנה, שם, אימייל..."
          className="flex-1 min-w-[200px] outline-none text-base font-[Assistant]"
          dir="rtl"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="form-input w-auto text-sm"
        >
          <option value="">כל הסטטוסים</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABELS[s] ?? s}</option>
          ))}
        </select>
        {(search || status) && (
          <button
            onClick={() => { setSearch(""); setStatus(""); }}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            נקה
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin h-8 w-8 border-4 border-[#c9a96e] border-t-transparent rounded-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">📦</p>
            <p>לא נמצאו הזמנות</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>מס&apos; הזמנה</th>
                  <th>לקוח</th>
                  <th>פריטים</th>
                  <th>סכום</th>
                  <th>סטטוס</th>
                  <th>תשלום</th>
                  <th>תאריך</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="font-mono text-sm font-bold">{o.orderNumber}</td>
                    <td>
                      <p className="font-semibold text-[#222021]">{o.customerName}</p>
                      <p className="text-xs text-gray-400">{o.customerEmail}</p>
                      <p className="text-xs text-gray-400">{o.customerPhone}</p>
                    </td>
                    <td className="text-sm text-gray-600">{o.items.length} פריטים</td>
                    <td className="font-bold">{formatPrice(o.totalAmount)}</td>
                    <td>
                      <Badge variant={STATUS_VARIANT[o.status] ?? "gray"} className="text-xs">
                        {ORDER_STATUS_LABELS[o.status] ?? o.status}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={PAYMENT_VARIANT[o.paymentStatus] ?? "gray"} className="text-xs">
                        {PAYMENT_STATUS_LABELS[o.paymentStatus] ?? o.paymentStatus}
                      </Badge>
                    </td>
                    <td className="text-xs text-gray-400">{formatDateTime(o.createdAt)}</td>
                    <td>
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="p-1.5 text-gray-400 hover:text-[#c9a96e] transition-colors inline-flex"
                        title="צפה בהזמנה"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                  page === i + 1 ? "bg-[#c9a96e] text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
