"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  formatPrice, formatDateTime, getPlaceholderImage,
  ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS,
} from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

interface OrderItem {
  id: number;
  quantity: number;
  productPrice: number;
  subtotal: number;
  productName: string;
  product: { name: string; slug: string; image1: string | null; sku: string } | null;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  notes: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  createdAt: string;
  items: OrderItem[];
}

const ALL_STATUSES = ["new", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const ALL_PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const STATUS_VARIANT: Record<string, "gold" | "green" | "red" | "gray" | "dark"> = {
  new: "gold", confirmed: "dark", processing: "dark",
  shipped: "dark", delivered: "green", cancelled: "red",
};

const PAYMENT_VARIANT: Record<string, "green" | "gold" | "red" | "gray"> = {
  paid: "green", pending: "gold", failed: "red", refunded: "gray",
};

export default function OrderDetailClient({ order: initialOrder }: { order: Order }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState(initialOrder.status);
  const [paymentStatus, setPaymentStatus] = useState(initialOrder.paymentStatus);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (res.ok) {
        setOrder((prev) => ({ ...prev, status, paymentStatus }));
        toast.success("ההזמנה עודכנה בהצלחה");
      } else {
        toast.error("שגיאה בעדכון");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#222021]">הזמנה #{order.orderNumber}</h1>
          <p className="text-gray-500 text-sm">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex gap-2 mr-auto">
          <Badge variant={STATUS_VARIANT[order.status] ?? "gray"}>
            {ORDER_STATUS_LABELS[order.status] ?? order.status}
          </Badge>
          <Badge variant={PAYMENT_VARIANT[order.paymentStatus] ?? "gray"}>
            {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4">פריטים בהזמנה</h2>
            <div className="flex flex-col divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    <Image
                      src={item.product?.image1 ?? getPlaceholderImage(64, 64)}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      unoptimized={!item.product?.image1}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#222021] truncate">{item.productName}</p>
                    {item.product && (
                      <p className="text-xs text-gray-400">מק&quot;ט: {item.product.sku}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {item.quantity} × {formatPrice(item.productPrice)}
                    </p>
                  </div>
                  <p className="font-bold text-[#222021] shrink-0">
                    {formatPrice(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>סה&quot;כ</span>
              <span className="text-[#c9a96e]">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4">פרטי לקוח</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">שם מלא</p>
                <p className="font-semibold">{order.customerName}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">טלפון</p>
                <p className="font-semibold">{order.customerPhone}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">אימייל</p>
                <p className="font-semibold">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">אמצעי תשלום</p>
                <p className="font-semibold">{order.paymentMethod ?? "—"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 mb-1">כתובת</p>
                <p className="font-semibold">{order.customerAddress}</p>
              </div>
              {order.notes && (
                <div className="col-span-2">
                  <p className="text-gray-400 mb-1">הערות</p>
                  <p className="font-semibold">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Update Status */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-bold text-lg mb-4">עדכון סטטוס</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">סטטוס הזמנה</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-input"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{ORDER_STATUS_LABELS[s] ?? s}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">סטטוס תשלום</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="form-input"
                >
                  {ALL_PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>{PAYMENT_STATUS_LABELS[s] ?? s}</option>
                  ))}
                </select>
              </div>
              <Button variant="gold" fullWidth loading={saving} onClick={handleSave}>
                <Save className="h-4 w-4" />
                שמור שינויים
              </Button>
            </div>
          </div>

          <Button variant="outline" fullWidth onClick={() => router.push("/admin/orders")}>
            חזרה לרשימה
          </Button>
        </div>
      </div>
    </div>
  );
}
