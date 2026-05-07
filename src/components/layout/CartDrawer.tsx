"use client";

import { useCartStore } from "@/lib/store/cartStore";
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, getPlaceholderImage } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useEffect } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();
  const total = getTotalPrice();
  const count = getTotalItems();

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[70] bg-black/50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 h-full w-full max-w-[420px] bg-white z-[80] shadow-2xl flex flex-col animate-slide-in"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-[#222021] text-white">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-[#c9a96e]" />
            <h2 className="font-bold text-lg">עגלת הקניות</h2>
            {count > 0 && (
              <span className="bg-[#c9a96e] text-white text-xs font-bold rounded-full px-2 py-0.5">
                {count}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <ShoppingCart className="h-16 w-16 text-gray-200" />
              <p className="text-gray-500 font-semibold text-lg">העגלה שלך ריקה</p>
              <p className="text-gray-400 text-sm">הוסף מוצרים כדי להתחיל קנייה</p>
              <Button variant="gold" onClick={closeCart} fullWidth>
                המשך לקנות
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-0">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Image */}
                  <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 border border-gray-100">
                    <Image
                      src={item.image ?? getPlaceholderImage(120, 120)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized={!item.image}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="font-semibold text-sm text-[#222021] hover:text-[#c9a96e] line-clamp-2 leading-snug"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{item.brandName}</p>
                    <p className="font-bold text-[#c9a96e] text-sm mt-1">
                      {formatPrice(item.salePrice ?? item.price)}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="הסר"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1 border border-gray-200 rounded">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-sm font-bold min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">סה&quot;כ לתשלום:</span>
              <span className="text-2xl font-bold text-[#222021]">{formatPrice(total)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/checkout" onClick={closeCart}>
                <Button variant="gold" fullWidth size="lg">
                  מעבר לתשלום
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/cart" onClick={closeCart}>
                <Button variant="outline" fullWidth>
                  צפה בעגלה
                </Button>
              </Link>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              משלוח חינם לכל הארץ
            </p>
          </div>
        )}
      </div>
    </>
  );
}
