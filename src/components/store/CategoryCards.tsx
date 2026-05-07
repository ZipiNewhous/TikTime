import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    title: "שעוני נשים",
    href: "/category/nashim",
    image: "/images/category-1.jpg",
  },
  {
    title: "שעוני גברים",
    href: "/category/gevarim",
    image: "/images/category-2.jpg",
  },
  {
    title: "מבצעים",
    href: "/mivtzaim",
    image: "/images/category-3.jpg",
  },
];

export default function CategoryCards() {
  return (
    <section className="bg-white py-10" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* Section title */}
        <div className="text-center mb-8">
          <h2 className="text-[24px] font-bold text-[#222222]">קטגוריות ראשיות</h2>
          <div className="w-10 h-0.5 bg-[#c9a96e] mx-auto mt-3" />
        </div>

        {/* 3 cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative block overflow-hidden"
              style={{ aspectRatio: "1 / 1" }}
            >
              {/* Image fills the entire square — watch on left, clear space on right */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />

              {/* Text + button — right side, over the clear beige area */}
              <div
                className="absolute top-0 bottom-0 right-0 flex flex-col items-end justify-center gap-3 pr-6"
                style={{ width: "50%" }}
                dir="rtl"
              >
                <h3
                  className="text-[#222222] font-bold text-right leading-tight"
                  style={{ fontSize: "clamp(1.3rem, 2vw, 2rem)" }}
                >
                  {cat.title}
                </h3>
                <span className="bg-[#111111] group-hover:bg-black text-white text-xs tracking-widest transition-colors px-5 py-2">
                  shop now
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
