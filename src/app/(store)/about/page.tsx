import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "אודות | TikTime",
  description: "TikTime - הבית הירושלמי לשעוני יוקרה ומותגים",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero */}
      <div className="bg-[#222021] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-4">קצת עלינו</h1>
          <p className="text-gray-400 text-xl">הבית הירושלמי לשעוני יוקרה ומותגים</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="h-1 w-16 bg-[#c9a96e] mb-10" />

        <div className="flex flex-col gap-6 text-gray-700 text-lg leading-relaxed">
          <p>
            ברוכים הבאים ל־<strong>TIK-TIME – שעוני יוקרה ומותגים</strong>, הבית הירושלמי לאוהבי שעוני יד שמבינים שזמן הוא הרבה יותר ממספרים – הוא אמירה, הוא סגנון, הוא זהות.
          </p>

          <p>
            אנו מתמחים באיתור והתאמה אישית של שעונים יוקרתיים לגברים ולנשים, תוך שילוב של עיצוב, אופנה וטכנולוגיה. אנו רואים בשעון איכותי לא רק מכשיר למדידת זמן, אלא תכשיט שמלווה את הרגעים המשמעותיים בחיים.
          </p>

          <p>
            ב־TIK-TIME תמצאו קולקציה רחבה ומגוונת ממותגים בינלאומיים מובילים: שעונים קלאסיים, ספורטיביים, אוטומטיים ודיגיטליים, לצד פריטים ייחודיים לאירועים מיוחדים, שעוני חתן ומתנות יוקרה.
          </p>

          <p>
            חנות התצוגה שלנו ממוקמת בשכונת רומֵמה בירושלים – מרחב מזמין, אישי ואקסקלוסיבי. הצוות המקצועי שלנו ילווה אתכם בתהליך בחירה מותאם אישית, עד שתמצאו את השעון שמדבר אליכם.
          </p>

          <p>
            נוסדנו מתוך אהבה אמיתית לשעונים, ומתוך רצון לעשות מותגים בינלאומיים נגישים לכולם – עם מחירים הוגנים, שירות ישראלי חם ומקצועיות שאין שני לה. כבר כ־10 שנים אנו פועלים עם משלוחים לכל הארץ ומחירים תחרותיים.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="btn-gold px-8 py-4 inline-block text-lg font-bold">
            לחנות שלנו
          </Link>
        </div>
      </div>
    </div>
  );
}
