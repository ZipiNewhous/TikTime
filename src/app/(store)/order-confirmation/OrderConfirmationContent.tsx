"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function OrderConfirmationContent() {
  const sp = useSearchParams();
  const orderNumber = sp.get("orderNumber") ?? "N/A";
  const total = parseFloat(sp.get("total") ?? "0");

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center" dir="rtl">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
      </div>

      <h1 className="text-4xl font-black text-[#222021] mb-3">
        תודה על הזמנתך!
      </h1>
      <p className="text-gray-500 text-lg mb-8">
        ההזמנה שלך התקבלה בהצלחה. נשלח אליך אישור במייל בקרוב.
      </p>

      {/* Order Number */}
      <div className="bg-[#c9a96e]/10 border border-[#c9a96e]/30 rounded-xl p-6 mb-8">
        <p className="text-sm text-gray-500 mb-1">מספר הזמנה</p>
        <p className="text-3xl font-black text-[#c9a96e]">{orderNumber}</p>
        {total > 0 && (
          <>
            <p className="text-sm text-gray-500 mt-3 mb-1">סכום ששולם</p>
            <p className="text-xl font-bold text-[#222021]">{formatPrice(total)}</p>
          </>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-right">
        <h3 className="font-bold text-[#222021] mb-3">מה הלאה?</h3>
        <ul className="flex flex-col gap-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
            שלחנו לך אימייל אישור עם פרטי ההזמנה
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
            ההזמנה תישלח תוך 3-5 ימי עסקים
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
            תקבל/י עדכון כשההזמנה בדרך אליך
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button variant="gold" size="lg">
            <Home className="h-5 w-5" />
            חזרה לחנות
          </Button>
        </Link>
        <Link href="/category/gevarim">
          <Button variant="outline" size="lg">
            <ShoppingBag className="h-5 w-5" />
            המשך קנייה
          </Button>
        </Link>
      </div>
    </div>
  );
}
