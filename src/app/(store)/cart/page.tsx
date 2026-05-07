"use client";

import { useCartStore } from "@/lib/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";
import { formatPrice, getPlaceholderImage } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center" dir="rtl">
        <ShoppingCart className="h-20 w-20 text-gray-200 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-[#222021] mb-3">העגלה שלך ריקה</h1>
        <p className="text-gray-500 mb-8">הוסף מוצרים כדי להתחיל קנייה</p>
        <Link href="/">
          <Button variant="gold" size="lg">
            המשך לקנות
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-black text-[#222021] mb-8">עגלת הקניות</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Items */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[auto,1fr,auto,auto,auto] gap-4 px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-500">
            <div />
            <div>מוצר</div>
            <div className="text-center">מחיר</div>
            <div className="text-center">כמות</div>
            <div className="text-center">סה&quot;כ</div>
          </div>

          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col md:grid md:grid-cols-[auto,1fr,auto,auto,auto] gap-4 items-center"
            >
              {/* Image */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-50 shrink-0">
                <Image
                  src={item.image ?? getPlaceholderImage(160, 160)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized={!item.image}
                />
              </div>

              {/* Info */}
              <div className="min-w-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-bold text-[#222021] hover:text-[#c9a96e] transition-colors line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">{item.brandName}</p>
                <p className="text-xs text-gray-400">מק&quot;ט: {item.sku}</p>
              </div>

              {/* Price */}
              <div className="text-center font-bold text-[#222021]">
                {formatPrice(item.salePrice ?? item.price)}
              </div>

              {/* Quantity */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="px-4 py-2 font-bold min-w-[40px] text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Subtotal + Remove */}
              <div className="flex items-center gap-3">
                <span className="font-black text-[#c9a96e]">
                  {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                </span>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              ריקון עגלה
            </button>
            <Link href="/" className="text-sm text-[#c9a96e] hover:underline font-semibold">
              המשך בקנייה
            </Link>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:w-80 shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl p-6 sticky top-24" dir="rtl">
            <h2 className="font-black text-xl text-[#222021] mb-6">סיכום הזמנה</h2>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>סכום ביניים ({items.length} פריטים)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-semibold">
                <span>משלוח</span>
                <span>חינם!</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-black text-xl text-[#222021]">
                <span>סה&quot;כ לתשלום</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button variant="gold" size="lg" fullWidth>
                מעבר לתשלום
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              🔒 תשלום מאובטח SSL
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
