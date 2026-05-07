"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="bg-[#111111] py-12" dir="rtl">
      <div className="max-w-[600px] mx-auto px-6 text-center">
        <h2 className="text-white text-[22px] font-bold mb-2">
          הצטרפו לניוזלטר שלנו
        </h2>
        <p className="text-white/60 text-sm mb-6">
          קבלו עדכונים על מבצעים ומוצרים חדשים
        </p>

        {submitted ? (
          <p className="text-[#c9a96e] font-semibold text-sm">תודה! נרשמת בהצלחה.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-0" dir="rtl">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="כתובת האימייל שלך"
              required
              className="flex-1 px-4 py-3 text-sm text-[#222222] bg-white outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="bg-[#c9a96e] hover:bg-[#b8933a] text-white text-xs font-bold px-6 py-3 tracking-widest uppercase transition-colors shrink-0"
            >
              הרשמה
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
