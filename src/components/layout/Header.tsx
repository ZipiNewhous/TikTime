"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, Heart, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";

/* ------------------------------------------------------------------ */
/* NAV — per design spec (RTL: right → left)                          */
/* ------------------------------------------------------------------ */
const NAV_ITEMS: { label: string; href: string; children: { label: string; href: string }[]; sale?: boolean }[] = [
  { label: "בית", href: "/", children: [] },
  {
    label: "שעוני גברים",
    href: "/category/gevarim",
    children: [
      { label: "כל שעוני הגברים", href: "/category/gevarim" },
      { label: "שעון לחתן", href: "/category/chatan" },
    ],
  },
  {
    label: "שעוני נשים",
    href: "/category/nashim",
    children: [
      { label: "כל שעוני הנשים", href: "/category/nashim" },
      { label: "שעוני כלות", href: "/category/kala" },
    ],
  },
  { label: "שעון לחתן", href: "/category/chatan", children: [] },
  { label: "שעוני כלות", href: "/category/kala", children: [] },
  { label: "SALE", href: "/mivtzaim", children: [], sale: true },
  {
    label: "מותגים",
    href: "/brands",
    children: [
      { label: "Rolex", href: "/brands/rolex" },
      { label: "Omega", href: "/brands/omega" },
      { label: "Tissot", href: "/brands/tissot" },
      { label: "Longines", href: "/brands/longines" },
      { label: "TAG Heuer", href: "/brands/tag-heuer" },
      { label: "Seiko", href: "/brands/seiko" },
      { label: "Citizen", href: "/brands/citizen" },
      { label: "Casio", href: "/brands/casio" },
    ],
  },
  { label: "אודות", href: "/about", children: [] },
  { label: "צור קשר", href: "/contact", children: [] },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* ── ROW 1: Announcement bar ─────────────────────────────── */}
      <div className="bg-[#222021] text-white text-center py-2 text-xs tracking-wide">
        משלוחים עד בית הלקוח
      </div>

      {/* ── ROW 2: Logo | Nav | Icons — all in one bar ──────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center h-[70px] gap-4" dir="rtl">

            {/* RIGHT (RTL start): Logo */}
            <Link href="/" className="shrink-0">
              <Image
                src="https://tiktime.co.il/497865_110.png"
                alt="TikTime"
                width={130}
                height={50}
                className="h-[50px] w-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* CENTER: Nav items */}
            <nav className="hidden lg:flex flex-1 items-center justify-center">
              <ul className="flex items-center" dir="rtl">
                {NAV_ITEMS.map((item) => (
                  <li
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => item.children.length > 0 && setOpenDropdown(item.href)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 px-3 py-5 text-[13px] font-semibold",
                        "border-b-2 border-transparent transition-all duration-150 whitespace-nowrap",
                        item.sale
                          ? "text-red-500 hover:text-red-600 hover:border-red-500"
                          : "text-[#222021] hover:text-[#c9a96e] hover:border-[#c9a96e]"
                      )}
                    >
                      {item.label}
                      {item.children.length > 0 && (
                        <ChevronDown className="h-3 w-3 opacity-60" />
                      )}
                    </Link>

                    {/* Dropdown */}
                    {item.children.length > 0 && openDropdown === item.href && (
                      <div className="absolute top-full right-0 bg-white border border-gray-100 shadow-xl min-w-[200px] py-1 z-50">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-5 py-3 text-sm text-gray-600 hover:text-[#c9a96e] hover:bg-gray-50 transition-colors"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* LEFT (RTL end): Icons */}
            <div className="flex items-center gap-3 mr-auto lg:mr-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-600 hover:text-[#222021] transition-colors"
                aria-label="חיפוש"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                className="relative text-gray-600 hover:text-[#222021] transition-colors"
                aria-label="מועדפים"
              >
                <Heart className="h-5 w-5" />
              </button>

              <button
                onClick={toggleCart}
                className="relative text-gray-600 hover:text-[#222021] transition-colors"
                aria-label="עגלת קניות"
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#c9a96e] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-gray-600 hover:text-[#222021] transition-colors"
                aria-label="תפריט"
              >
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-white w-[300px] h-full overflow-y-auto shadow-2xl ml-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Image
                src="https://tiktime.co.il/497865_110.png"
                alt="TikTime"
                width={100}
                height={38}
                className="h-9 w-auto"
                unoptimized
              />
              <button onClick={() => setMobileOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col" dir="rtl">
              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex-1 px-5 py-4 font-semibold transition-colors text-sm",
                        item.sale ? "text-red-500" : "text-[#222021] hover:text-[#c9a96e]"
                      )}
                      onClick={() => !item.children.length && setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children.length > 0 && (
                      <button
                        className="px-4 py-4 text-gray-400"
                        onClick={() => setMobileDropdown(mobileDropdown === item.href ? null : item.href)}
                      >
                        <ChevronDown className={cn("h-4 w-4 transition-transform", mobileDropdown === item.href && "rotate-180")} />
                      </button>
                    )}
                  </div>
                  {item.children.length > 0 && mobileDropdown === item.href && (
                    <div className="bg-gray-50 pb-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-8 py-3 text-sm text-gray-500 hover:text-[#c9a96e] transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}
