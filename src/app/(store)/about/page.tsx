import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אודות | TikTime",
  description: "TikTime - מומחים לשעונים יוקרתיים מאז 2010",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero */}
      <div className="bg-[#222021] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">אודות TikTime</h1>
          <p className="text-gray-400 text-xl">מומחים לשעונים יוקרתיים מאז 2010</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-14">
        {/* Story */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-[#222021] mb-4">הסיפור שלנו</h2>
          <div className="h-1 w-16 bg-[#c9a96e] mb-6" />
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            TikTime נוסדה מתוך אהבה אמיתית לשעונים יוקרתיים ומתוך הבנה שכל שעון הוא יותר מסתם מכשיר — הוא ביטוי לאישיות, להצלחה ולסגנון חיים.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            מאז 2010 אנו מביאים ללקוחותינו את הקולקציות המובחרות ביותר מבתי האופנה והשעונות המובילים בעולם — Rolex, Omega, TAG Heuer, Longines ועוד.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            הצוות שלנו מורכב ממומחים עם עשרות שנות ניסיון, שיעזרו לכם למצוא את השעון המושלם לכל אירוע ולכל רגע.
          </p>
        </section>

        {/* Values */}
        <section className="mb-14">
          <h2 className="text-2xl font-black text-[#222021] mb-4">הערכים שלנו</h2>
          <div className="h-1 w-16 bg-[#c9a96e] mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "💎",
                title: "אותנטיות",
                desc: "כל מוצר במלאי שלנו מקורי ומלווה בתעודת אחריות יצרן",
              },
              {
                icon: "🤝",
                title: "שירות אישי",
                desc: "הצוות שלנו זמין לכם בכל שאלה, לפני ואחרי הרכישה",
              },
              {
                icon: "✨",
                title: "איכות ללא פשרות",
                desc: "אנו בוחרים רק את המוצרים הטובים ביותר עבור לקוחותינו",
              },
            ].map((v) => (
              <div key={v.title} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-[#222021] text-lg mb-2">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#222021] rounded-2xl p-8 mb-14 text-white">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { num: "14+", label: "שנות ניסיון" },
              { num: "5000+", label: "לקוחות מרוצים" },
              { num: "200+", label: "דגמים במלאי" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-black text-[#c9a96e]">{s.num}</p>
                <p className="text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link href="/" className="btn-gold px-8 py-4 inline-block text-lg font-bold">
            לחנות שלנו
          </Link>
        </div>
      </div>
    </div>
  );
}
