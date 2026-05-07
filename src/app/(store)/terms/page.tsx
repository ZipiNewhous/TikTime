import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "תנאי שימוש | TikTime",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="bg-[#222021] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black">תנאי שימוש</h1>
          <p className="text-gray-400 mt-2">עודכן לאחרונה: ינואר 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 prose prose-lg max-w-none">
        <div className="flex flex-col gap-8 text-gray-700">
          {[
            {
              title: "1. כללי",
              text: "ברוכים הבאים לאתר TikTime. השימוש באתר זה מהווה הסכמה לתנאי השימוש המפורטים להלן. אנא קראו אותם בעיון לפני שתשתמשו באתר.",
            },
            {
              title: "2. שימוש באתר",
              text: "האתר מיועד לשימוש אישי בלבד. אין להשתמש באתר לכל מטרה בלתי חוקית או שאינה מורשית. TikTime שומרת לעצמה את הזכות לשנות, להשעות או להפסיק את האתר בכל עת.",
            },
            {
              title: "3. הזמנות ורכישות",
              text: "כל ההזמנות כפופות לזמינות מלאי. TikTime שומרת לעצמה את הזכות לבטל הזמנה בכל מקרה של טעות במחיר או מידע. אישור ההזמנה יישלח לדואר האלקטרוני שסיפקתם.",
            },
            {
              title: "4. משלוחים",
              text: "המשלוחים מבוצעים בתוך 3-5 ימי עסקים בישראל. TikTime אינה אחראית לעיכובים בשל גורמים חיצוניים. כתובת המשלוח חייבת להיות מדויקת.",
            },
            {
              title: "5. החזרות",
              text: "ניתן להחזיר מוצרים תוך 14 יום מיום הקבלה, בתנאי שהמוצר לא נעשה בו שימוש ונמצא באריזתו המקורית. החזרות טעונות אישור מראש.",
            },
            {
              title: "6. אחריות",
              text: "כל המוצרים מגיעים עם אחריות יצרן. TikTime אינה אחראית לנזקים ישירים, עקיפים, מקריים או תוצאתיים הנובעים משימוש במוצר.",
            },
            {
              title: "7. פרטיות",
              text: "אנו מכבדים את פרטיותכם. המידע האישי שתמסרו ישמש אך ורק לצורך ביצוע ההזמנה ושיפור השירות. לפרטים נוספים ראו מדיניות הפרטיות.",
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
