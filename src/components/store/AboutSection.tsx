export default function AboutSection() {
  return (
    <section className="bg-white py-14 border-t border-gray-100" dir="rtl">
      <div className="max-w-[760px] mx-auto px-6 text-center">

        {/* Section title */}
        <h2 className="text-[28px] font-bold text-[#222222] mb-2">קצת עלינו</h2>
        <div className="w-10 h-0.5 bg-[#c9a96e] mx-auto mt-3 mb-10" />

        {/* Paragraphs — exact text from original site */}
        <div className="flex flex-col gap-6 text-[#333333] text-[15px] leading-8">
          <p>
            &quot;טיק-טיים&quot; הינו אתר לשיווק אינטרנטי בסיטונאות וליחידים לשעוני אופנה מהמותגים המובילים
            ובמחירים מוזלים ונוחים לכל כיס, השעונים מקוריים וחדשים ובמחיר הזול בישראל.
          </p>
          <p>
            ל&quot;טיק-טיים&quot; קשרים ענפים עם ספקים מובילים ממיטב המותגים ברחבי העולם.
            אנו משווקים שעונים מקוריים בלבד ישירות מהספקים בחו&quot;ל, ובמשלוח ישיר עד לבית הלקוח חינם
            וללא תוספת תשלום, ובזמני משלוח קצרים ביותר.
          </p>
          <p>
            &quot;טיק-טיים&quot; נותנת את מלא השירות לכל קנייה ולכל פניה ומענה לכל בעיה,
            ההזדמנות של קניה במחירי חו&quot;ל ושירות מלא בישראל.
          </p>
        </div>

      </div>
    </section>
  );
}
