import Image from "next/image";

const TESTIMONIALS = [
  {
    quote: "הכתובת הכי זמינה ,עם המבחר הכי גדול!!! אחריות ושירות שלא מוצאים בשום מקום נסו ותהנו גם אתם",
    author: "יהודה מירושלים",
    textColor: "#4a7fc1",
  },
  {
    quote: "חנות חדישה עם מבחר ענק שלא ראיתי בשום מקום .והמחירים ממש זולים. שרות נעים וביתי ,היה לי כיף לקנות ממליצה מאד",
    author: "שושי ק.",
    textColor: "#333333",
  },
];

export default function TestimonialsSection() {
  return (
    <section style={{ background: "#ffffff" }}>

      {/* Title — centered, inside 1200px container */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 20px 52px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "34px",
            fontWeight: 700,
            color: "#222222",
            margin: 0,
            marginBottom: "14px",
          }}
        >
          לקוחות ממליצים
        </h2>
        <div
          style={{
            width: "50px",
            height: "2px",
            background: "#c9a96e",
            margin: "0 auto",
          }}
        />
      </div>

      {/*
        Full-width two-column layout.
        dir="rtl" on the flex row means: first DOM child → RIGHT, second DOM child → LEFT.
        So: watch image (RIGHT, flush to screen edge) is first, testimonials (LEFT) are second.
      */}
      <div
        className="flex flex-col md:flex-row"
        style={{ minHeight: "440px" }}
        dir="rtl"
      >

        {/* FIRST in DOM = RIGHT side (RTL) — watch image, flush to right screen edge */}
        <div
          className="hidden md:block"
          style={{
            flex: "0 0 50%",
            position: "relative",
            background: "#f5ede3",
            minHeight: "440px",
            overflow: "hidden",
          }}
        >
          <Image
            src="/images/about-watch.jpg"
            alt="שעון יוקרה"
            fill
            className="object-cover object-center"
            sizes="50vw"
          />
        </div>

        {/* SECOND in DOM = LEFT side (RTL) — testimonials column */}
        <div
          style={{
            flex: "0 0 50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "50px",
            /*
              In RTL the physical-right side of this column faces the CENTER (watch image).
              The physical-left side faces the viewport's left edge.
              paddingRight: gap toward the watch column / center divider
              paddingLeft: aligns content with the 1200px max-width container
            */
            paddingTop: "40px",
            paddingBottom: "80px",
            paddingRight: "60px",
            paddingLeft: "max(20px, calc((100vw - 1200px) / 2))",
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            /*
              Each testimonial is a block with dir="rtl" so text flows right→left naturally.
              textAlign: "right" is explicit on every text node.
              The quote icon is in a div with textAlign: "right" so it sits at the right edge.
            */
            <div key={i} dir="rtl">

              {/* Quote icon — right aligned, above the text */}
              <div style={{ textAlign: "right", marginBottom: "10px", lineHeight: 0 }}>
                <Image
                  src="https://tiktime.co.il/497865_148.png"
                  alt=""
                  width={58}
                  height={40}
                  unoptimized
                  aria-hidden="true"
                  style={{ display: "inline-block" }}
                />
              </div>

              {/* Testimonial text */}
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: t.textColor,
                  textAlign: "right",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                {t.quote}
              </p>

              {/* Customer name */}
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#222222",
                  textAlign: "right",
                  margin: 0,
                }}
              >
                {t.author}
              </p>

            </div>
          ))}
        </div>

      </div>

      {/* Mobile: show watch image below testimonials */}
      <div
        className="block md:hidden"
        style={{
          position: "relative",
          height: "280px",
          background: "#f5ede3",
          overflow: "hidden",
        }}
      >
        <Image
          src="/images/about-watch.jpg"
          alt="שעון יוקרה"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

    </section>
  );
}
