"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "שגיאה בהתחברות");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("שגיאה בהתחברות. נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#222021] px-8 py-8 text-center">
          <Image
            src="https://tiktime.co.il/497865_110.png"
            alt="טיק טיים"
            width={120}
            height={46}
            className="h-10 w-auto object-contain mx-auto brightness-0 invert mb-3"
            unoptimized
          />
          <p className="text-[#c9a96e] font-semibold text-sm">מערכת ניהול</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h1 className="text-2xl font-black text-[#222021] mb-6 text-center">
            כניסה למערכת
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute top-3.5 right-3.5 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="אימייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3.5 right-3.5 h-5 w-5 text-gray-400" />
              <Input
                type={showPass ? "text" : "password"}
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 pl-10"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute top-3.5 left-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              loading={loading}
            >
              <Lock className="h-5 w-5" />
              כניסה
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            לפיתוח: admin@tiktime.co.il / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
