import Link from "next/link";
import Image from "next/image";

export default function ProductBanner() {
  return (
    <section className="relative w-full overflow-hidden" style={{ aspectRatio: "1065/430" }}>
      <Image
        src="/images/about-watch.jpg"
        alt="שעוני יוקרה"
        fill
        className="object-cover object-center"
      />
      {/* SHOP NOW button — bottom left like original */}
      <div className="absolute bottom-8 left-8">
        <Link
          href="/category/gevarim"
          className="inline-block bg-[#222222] hover:bg-black text-white text-xs font-bold px-8 py-3 tracking-widest uppercase transition-colors"
        >
          SHOP NOW
        </Link>
      </div>
    </section>
  );
}
