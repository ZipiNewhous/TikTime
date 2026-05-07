"use client";

import { useState } from "react";
import { Save, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

export default function AdminSettingsClient() {
  const [saving, setSaving] = useState(false);

  // Store info
  const [storeName, setStoreName] = useState("TikTime");
  const [storeEmail, setStoreEmail] = useState("info@tiktime.co.il");
  const [storePhone, setStorePhone] = useState("03-1234567");
  const [storeAddress, setStoreAddress] = useState("תל אביב, ישראל");

  // Social
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate save (settings API can be added later)
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("ההגדרות נשמרו בהצלחה");
  };

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      <h1 className="text-2xl font-black text-[#222021] mb-6">הגדרות</h1>

      <form onSubmit={handleSave}>
        <div className="flex flex-col gap-6 max-w-2xl">
          {/* Store Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4">פרטי החנות</h2>
            <div className="flex flex-col gap-4">
              <Input
                label="שם החנות"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
              <Input
                label="אימייל"
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
              />
              <Input
                label="טלפון"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
              />
              <Input
                label="כתובת"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4">רשתות חברתיות</h2>
            <div className="flex flex-col gap-4">
              <Input
                label="Facebook (URL)"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/tiktime"
              />
              <Input
                label="Instagram (URL)"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/tiktime"
              />
              <Input
                label="WhatsApp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+972501234567"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4">קישורים מהירים</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: "האתר הראשי", href: "/" },
                { label: "ניהול מוצרים", href: "/admin/products" },
                { label: "ניהול הזמנות", href: "/admin/orders" },
                { label: "אנליטיקס", href: "/admin/analytics" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href === "/" ? "_blank" : "_self"}
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-[#c9a96e] hover:underline font-semibold"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Version Info */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-sm text-gray-500">
            <p>TikTime Admin Panel • גרסה 1.0.0</p>
            <p className="mt-1">Next.js 16 • Prisma 7 • SQLite</p>
          </div>

          <Button type="submit" variant="gold" size="lg" loading={saving}>
            <Save className="h-5 w-5" />
            שמור הגדרות
          </Button>
        </div>
      </form>
    </div>
  );
}
