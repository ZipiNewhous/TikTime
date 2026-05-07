import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות משלוחים | TikTime",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="bg-[#222021] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black">מדיניות משלוחים</h1>
          <p className="text-gray-400 mt-2">עודכן: ינואר 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8 text-gray-700">
        <section>
          <h2 className="text-xl font-black text-[#222021] mb-3">משלוח חינם</h2>
          <p className="leading-relaxed">
            אנו מציעים משלוח חינם לכל הארץ בכל הזמנה, ללא מינימום קנייה. המשלוח מתבצע עד 3-5 ימי עסקים מרגע אישור ההזמנה.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#222021] mb-3">זמני אספקה</h2>
          <ul className="list-disc list-inside flex flex-col gap-2 leading-relaxed">
            <li>משלוח רגיל: 3-5 ימי עסקים</li>
            <li>משלוח מהיר: 1-2 ימי עסקים (בתשלום נוסף)</li>
            <li>איסוף עצמי: זמין בתיאום מראש</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#222021] mb-3">מדיניות החזרות</h2>
          <p className="leading-relaxed">
            ניתן להחזיר מוצרים תוך 14 יום מיום קבלת ההזמנה. המוצר חייב להיות במצב מקורי, ללא שימוש, ועם כל האביזרים המקוריים.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#222021] mb-3">יצירת קשר</h2>
          <ul className="flex flex-col gap-1 text-sm">
            <li>אימייל: <a href="mailto:tiktime10@gmail.com" className="text-[#c9a96e] hover:underline">tiktime10@gmail.com</a></li>
            <li>טלפון: <a href="tel:054-8452098" className="text-[#c9a96e] hover:underline">054-8452098</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
