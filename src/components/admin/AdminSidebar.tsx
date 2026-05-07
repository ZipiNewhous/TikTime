"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Layers,
  BarChart3,
  Settings,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "לוח בקרה", href: "/admin" },
  { icon: Package, label: "מוצרים", href: "/admin/products" },
  { icon: ShoppingBag, label: "הזמנות", href: "/admin/orders" },
  { icon: Layers, label: "קטגוריות", href: "/admin/categories" },
  { icon: Tag, label: "מותגים", href: "/admin/brands" },
  { icon: Tag, label: "תגיות", href: "/admin/tags" },
  { icon: BarChart3, label: "דוחות", href: "/admin/analytics" },
  { icon: Settings, label: "הגדרות", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="https://tiktime.co.il/497865_110.png"
            alt="טיק טיים"
            width={80}
            height={30}
            className="h-7 w-auto object-contain brightness-0 invert"
            unoptimized
          />
          <span className="text-white font-bold text-sm opacity-60">Admin</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto" dir="rtl">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn("admin-nav-item", isActive && "active")}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="admin-nav-item w-full text-red-400 hover:bg-red-500/20"
        >
          <LogOut className="h-5 w-5" />
          יציאה
        </button>
        <div className="mt-3 px-3">
          <Link
            href="/"
            target="_blank"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            צפה באתר →
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#1a1a2e] text-white rounded-lg"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 right-0 w-64 bg-[#1a1a2e] z-[60] lg:hidden flex flex-col animate-slide-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 text-white/60 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
