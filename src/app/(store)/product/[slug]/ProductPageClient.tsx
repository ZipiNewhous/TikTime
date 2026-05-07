"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Shield, Truck, RotateCcw } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { toast } from "@/components/ui/Toast";
import { formatPrice, getPlaceholderImage } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import type { ProductSpec } from "@/types";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  description: string | null;
  sku: string;
  stockStatus: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  brand: { id: number; name: string; slug: string };
  productTags: { tag: { id: number; name: string; color: string; slug: string } }[];
  productCategories: { category: { id: number; name: string; slug: string } }[];
}

interface ProductPageClientProps {
  product: Product;
  specs: ProductSpec[];
}

export default function ProductPageClient({ product, specs }: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "shipping">("description");
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const images = [product.image1, product.image2, product.image3].filter(Boolean) as string[];
  const displayImage = images[selectedImage] ?? getPlaceholderImage(600, 600, product.name);

  const isOutOfStock = product.stockStatus === "out_of_stock";
  const hasSale = product.salePrice !== null && product.salePrice < product.price;
  const discountPercent = hasSale
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;
  const tags = product.productTags.map((pt) => pt.tag);
  const categories = product.productCategories.map((pc) => pc.category);

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setAdding(true);
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image1,
      quantity: 1,
      sku: product.sku,
      brandName: product.brand.name,
    });
    toast.success(`${product.name} נוסף לסל`);
    setTimeout(() => setAdding(false), 600);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb — בית > [category] > [product] */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" dir="rtl">
        <Link href="/" className="hover:text-[#222222] transition-colors">בית</Link>
        <span className="text-gray-300">&gt;</span>
        {categories[0] && (
          <>
            <Link href={`/category/${categories[0].slug}`} className="hover:text-[#222222] transition-colors">
              {categories[0].name}
            </Link>
            <span className="text-gray-300">&gt;</span>
          </>
        )}
        <span className="text-[#222222] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <Image
              src={displayImage}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized={images.length === 0}
            />
            {hasSale && (
              <div className="absolute top-4 right-4">
                <Badge variant="red">-{discountPercent}%</Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`
                    relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
                    ${selectedImage === i ? "border-[#c9a96e]" : "border-gray-100 hover:border-gray-300"}
                  `}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Details */}
        <div className="flex flex-col gap-5" dir="rtl">
          {/* Brand */}
          <Link
            href={`/brands/${product.brand.slug}`}
            className="text-[#c9a96e] font-bold text-sm uppercase tracking-widest hover:underline"
          >
            {product.brand.name}
          </Link>

          {/* Name */}
          <h1 className="text-3xl lg:text-4xl font-black text-[#222021] leading-tight">
            {product.name}
          </h1>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag.id} variant="custom" color={tag.color}>
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-4">
            {hasSale ? (
              <>
                <span className="text-4xl font-black text-[#c9a96e]">
                  {formatPrice(product.salePrice!)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-4xl font-black text-[#222021]">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`} />
            <span className={`text-sm font-semibold ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
              {isOutOfStock ? "אזל במלאי" : "במלאי"}
            </span>
          </div>

          {/* SKU */}
          <p className="text-sm text-gray-400">
            <span className="font-semibold">מק&quot;ט:</span> {product.sku}
          </p>

          {/* Description (short) */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed text-base line-clamp-3">
              {product.description}
            </p>
          )}

          {/* Add to Cart */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="gold"
              size="lg"
              fullWidth
              loading={adding}
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "אזל במלאי" : "הוסף לסל"}
            </Button>
            {!isOutOfStock && (
              <Button variant="dark" size="lg" fullWidth onClick={handleBuyNow}>
                קנה עכשיו
              </Button>
            )}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t">
            {[
              { icon: <Shield className="h-5 w-5" />, text: "100% מקורי" },
              { icon: <Truck className="h-5 w-5" />, text: "משלוח חינם" },
              { icon: <RotateCcw className="h-5 w-5" />, text: "החזרה 14 יום" },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-1 text-center">
                <div className="text-[#c9a96e]">{item.icon}</div>
                <span className="text-xs text-gray-500 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Star rating placeholder */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#c9a96e] text-[#c9a96e]" />
            ))}
            <span className="text-sm text-gray-500 mr-2">4.9 (120 ביקורות)</span>
          </div>
        </div>
      </div>

      {/* TABS: Description / Specs / Shipping */}
      <div className="mt-16" dir="rtl">
        <div className="flex border-b border-gray-200 gap-0">
          {(["description", "specs", "shipping"] as const).map((tab) => {
            const labels = {
              description: "תיאור",
              specs: "מפרט טכני",
              shipping: "משלוחים והחזרות",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-3 text-sm font-bold transition-colors border-b-2 -mb-[2px]
                  ${activeTab === tab
                    ? "border-[#c9a96e] text-[#c9a96e]"
                    : "border-transparent text-gray-500 hover:text-[#222021]"
                  }
                `}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        <div className="py-8 max-w-3xl">
          {activeTab === "description" && (
            <div className="prose prose-lg text-gray-700 leading-relaxed">
              {product.description ? (
                <p>{product.description}</p>
              ) : (
                <p className="text-gray-400">אין תיאור זמין למוצר זה.</p>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div>
              {specs.length > 0 ? (
                <table className="w-full border-collapse">
                  <tbody>
                    {specs.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <th className="py-3 px-4 text-right font-bold text-[#222021] w-1/3 border border-gray-100">
                          {spec.label}
                        </th>
                        <td className="py-3 px-4 text-right text-gray-700 border border-gray-100">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">אין מפרט טכני זמין.</p>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="text-gray-700 leading-relaxed space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-[#c9a96e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">משלוח חינם</h4>
                  <p className="text-sm text-gray-500">משלוח חינם לכל הארץ בכל הזמנה. זמן אספקה 3-5 ימי עסקים.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="h-5 w-5 text-[#c9a96e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">מדיניות החזרות</h4>
                  <p className="text-sm text-gray-500">ניתן להחזיר את המוצר תוך 14 יום מרכישה. המוצר חייב להיות במצב מקורי.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-[#c9a96e] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">אחריות</h4>
                  <p className="text-sm text-gray-500">כל השעונים מגיעים עם אחריות יבואן מלאה של שנה.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
