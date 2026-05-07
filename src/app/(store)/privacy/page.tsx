import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | TikTime",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="bg-[#222021] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black">מדיניות פרטיות</h1>
          <p className="text-gray-400 mt-2">עודכן לאחרונה: ינואר 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col gap-8 text-gray-700">
          {[
            {
              title: "1. איסוף מידע",
              text: "אנו אוספים מידע שאתם מוסרים לנו באופן ישיר בעת הרשמה, ביצוע הזמנה או יצירת קשר: שם מלא, כתובת אימייל, מספר טלפון, כתובת למשלוח.",
            },
            {
              title: "2. שימוש במידע",
              text: "המידע שאנו אוספים משמש לעיבוד הזמנות ותשלומים, שליחת עדכונים על הזמנה, שיפור חווית השימוש באתר ומשלוח הודעות שיווקיות (בהסכמתכם בלבד).",
            },
            {
              title: "3. שיתוף מידע",
              text: "אנו לא מוכרים, משכירים או מעבירים את המידע האישי שלכם לצדדים שלישיים, למעט ספקי שירות הנדרשים לביצוע ההזמנה (כגון חברות שילוח ועיבוד תשלומים).",
            },
            {
              title: "4. אבטחת מידע",
              text: "אנו נוקטים באמצעי אבטחה מתקדמים להגנה על המידע שלכם, כולל הצפנת SSL לכל העברות הנתונים.",
            },
            {
              title: "5. עוגיות (Cookies)",
              text: "האתר משתמש בעוגיות לשיפור חווית הגלישה, שמירת תוכן העגלה ואנליזה. ניתן לנהל העדפות עוגיות בהגדרות הדפדפן.",
            },
            {
              title: "6. זכויות המשתמש",
              text: "יש לכם הזכות לגשת למידע שאנו מחזיקים עליכם, לתקנו, למחקו או להגביל את עיבודו. לפניות בנושא פרטיות צרו קשר: privacy@tiktime.co.il",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-[#222021] mb-3">{section.title}</h2>
              <p className="leading-relaxed">{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
