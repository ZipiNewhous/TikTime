import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הצהרת נגישות | TikTime",
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="bg-[#222021] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black">הצהרת נגישות</h1>
          <p className="text-gray-400 mt-2">עודכן: ינואר 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8 text-gray-700">
        <section>
          <h2 className="text-xl font-black text-[#222021] mb-3">מחויבות לנגישות</h2>
          <p className="leading-relaxed">
            טיק טיים מחויבת להנגשת אתר האינטרנט לאנשים עם מוגבלויות. אנו פועלים לעמוד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע״ג–2013.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#222021] mb-3">מה ביצענו לשיפור הנגישות</h2>
          <ul className="list-disc list-inside flex flex-col gap-2 leading-relaxed">
            <li>האתר תומך בניווט באמצעות מקלדת</li>
            <li>כל התמונות כוללות טקסט חלופי (alt text)</li>
            <li>ניגודיות צבעים עומדת בסטנדרטים של WCAG 2.1 רמה AA</li>
            <li>הטקסט ניתן לשינוי גודל ללא פגיעה בפונקציונליות</li>
            <li>הטפסים מלווים בתוויות ברורות</li>
            <li>האתר תומך בקוראי מסך (NVDA, JAWS, VoiceOver)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#222021] mb-3">פניות בנושא נגישות</h2>
          <p className="leading-relaxed mb-2">
            נתקלתם בבעיית נגישות? נשמח לשמוע ולתקן. ניתן לפנות אלינו:
          </p>
          <ul className="flex flex-col gap-1 text-sm">
            <li>אימייל: <a href="mailto:tiktime10@gmail.com" className="text-[#c9a96e] hover:underline">tiktime10@gmail.com</a></li>
            <li>טלפון: <a href="tel:054-8452098" className="text-[#c9a96e] hover:underline">054-8452098</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-[#222021] mb-3">סייג</h2>
          <p className="leading-relaxed">
            אנו ממשיכים לשפר את נגישות האתר. ייתכן כי קיימים חלקים שטרם הונגשו במלואם. אנו פועלים לטפל בכך בהקדם האפשרי.
          </p>
        </section>
      </div>
    </div>
  );
}
