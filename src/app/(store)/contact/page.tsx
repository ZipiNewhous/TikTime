"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("יש למלא את כל שדות החובה");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    toast.success("ההודעה נשלחה! נחזור אליך בהקדם");
    setName(""); setEmail(""); setPhone(""); setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <div className="bg-[#222021] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-3">צור קשר</h1>
          <p className="text-gray-400 text-lg">נשמח לשמוע ממך ולסייע בכל שאלה</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-black text-[#222021] mb-6">שלח הודעה</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="שם מלא"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ישראל ישראלי"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="אימייל"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
                <Input
                  label="טלפון"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="050-1234567"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#222021]">
                  הודעה <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="כיצד נוכל לסייע לך?"
                  rows={5}
                  required
                  className="form-input resize-none"
                  dir="rtl"
                />
              </div>
              <Button type="submit" variant="gold" size="lg" fullWidth loading={sending}>
                שלח הודעה
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-2xl font-black text-[#222021] mb-6">פרטי התקשרות</h2>
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: <MapPin className="h-5 w-5" />,
                    title: "כתובת",
                    content: "רחוב דיזנגוף 100, תל אביב",
                  },
                  {
                    icon: <Phone className="h-5 w-5" />,
                    title: "טלפון",
                    content: "03-1234567",
                  },
                  {
                    icon: <Mail className="h-5 w-5" />,
                    title: "אימייל",
                    content: "info@tiktime.co.il",
                  },
                  {
                    icon: <Clock className="h-5 w-5" />,
                    title: "שעות פעילות",
                    content: "א׳–ה׳ 10:00–19:00 | ו׳ 10:00–14:00",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#c9a96e]/10 flex items-center justify-center text-[#c9a96e] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-bold text-[#222021] text-sm">{item.title}</p>
                      <p className="text-gray-600 mt-0.5">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/9721234567"
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-6 flex items-center gap-4 transition-colors"
            >
              <span className="text-4xl">💬</span>
              <div>
                <p className="font-black text-lg">שוחח איתנו בוואטסאפ</p>
                <p className="text-green-100 text-sm">זמינים לשיחה עכשיו</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
