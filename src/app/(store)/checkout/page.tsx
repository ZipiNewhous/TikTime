"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { formatPrice, getPlaceholderImage, isValidIsraeliPhone } from "@/lib/utils";
import { Shield, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  customerPhone: z
    .string()
    .refine(isValidIsraeliPhone, "מספר טלפון לא תקין"),
  customerEmail: z.string().email("כתובת אימייל לא תקינה"),
  customerAddress: z.string().min(5, "כתובת חייבת להכיל לפחות 5 תווים"),
  notes: z.string().optional(),
  agreeTerms: z.boolean().refine((v) => v, "יש לאשר את תנאי השימוש"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const total = getTotalPrice();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Redirect to cart if empty (use useEffect to avoid SSR issues)
  // Items check happens client-side only

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error ?? "שגיאה בשמירת ההזמנה");
        return;
      }

      // For now — mock payment flow (will be replaced with real provider)
      clearCart();
      router.push(
        `/order-confirmation?orderNumber=${result.orderNumber}&total=${result.totalAmount}`
      );
    } catch (err) {
      console.error(err);
      alert("שגיאה בעיבוד ההזמנה. נסה שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-black text-[#222021] mb-8">תשלום</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Form */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Contact */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="font-bold text-xl text-[#222021] mb-5">פרטי התקשרות</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="שם מלא"
                  required
                  placeholder="ישראל ישראלי"
                  error={errors.customerName?.message}
                  {...register("customerName")}
                />
                <Input
                  label="טלפון"
                  required
                  placeholder="050-0000000"
                  type="tel"
                  error={errors.customerPhone?.message}
                  {...register("customerPhone")}
                />
                <div className="md:col-span-2">
                  <Input
                    label="אימייל"
                    required
                    placeholder="israel@example.com"
                    type="email"
                    error={errors.customerEmail?.message}
                    {...register("customerEmail")}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="כתובת משלוח"
                    required
                    placeholder="רחוב, מספר, עיר"
                    error={errors.customerAddress?.message}
                    {...register("customerAddress")}
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="הערות להזמנה"
                    placeholder="הוראות מיוחדות, זמן מועדף למשלוח..."
                    {...register("notes")}
                  />
                </div>
              </div>
            </div>

            {/* Payment (placeholder) */}
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="font-bold text-xl text-[#222021] mb-5">אמצעי תשלום</h2>
              <div className="border-2 border-dashed border-[#c9a96e]/30 rounded-xl p-8 text-center bg-[#c9a96e]/5">
                <Lock className="h-8 w-8 text-[#c9a96e] mx-auto mb-3" />
                <p className="font-semibold text-[#222021] mb-1">תשלום מאובטח</p>
                <p className="text-sm text-gray-500">
                  ממשק התשלום יוגדר לאחר בחירת ספק (Tranzila / Meshulam / PayPlus)
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  לצורך בדיקות — לחיצה על &quot;שלם עכשיו&quot; תיצור הזמנה במצב בדיקה
                </p>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3" dir="rtl">
              <input
                type="checkbox"
                id="terms"
                className="w-5 h-5 mt-0.5 accent-[#c9a96e]"
                {...register("agreeTerms")}
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                אני מאשר/ת את{" "}
                <Link href="/terms" className="text-[#c9a96e] underline">
                  תנאי השימוש
                </Link>{" "}
                ו
                <Link href="/privacy" className="text-[#c9a96e] underline">
                  מדיניות הפרטיות
                </Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="text-red-500 text-sm -mt-4">{errors.agreeTerms.message}</p>
            )}
          </div>

          {/* RIGHT: Order Summary */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white border border-gray-100 rounded-xl p-6 sticky top-24" dir="rtl">
              <h2 className="font-black text-xl text-[#222021] mb-5">סיכום הזמנה</h2>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-5">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                      <Image
                        src={item.image ?? getPlaceholderImage(100, 100)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized={!item.image}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">כמות: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#c9a96e] shrink-0">
                      {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex flex-col gap-2 mb-5">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>משלוח</span>
                  <span className="text-green-600 font-semibold">חינם</span>
                </div>
                <div className="flex justify-between font-black text-xl text-[#222021]">
                  <span>סה&quot;כ</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                fullWidth
                loading={submitting}
              >
                <Shield className="h-5 w-5" />
                שלם עכשיו {formatPrice(total)}
              </Button>

              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 תשלום מאובטח 256-bit SSL
              </p>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
