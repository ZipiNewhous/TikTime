import Image from "next/image";
import Link from "next/link";

export default function BottomBanners() {
  return (
    <>
      {/* Banner 1: dark brown background + NEW ARRIVAL text + SHOP NOW button */}
      <section
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1400/686" }}
      >
        {/* Background */}
        <Image
          src="/images/banner-bg-1.png"
          alt="New Arrival Background"
          fill
          className="object-cover object-center"
        />

        {/* NEW ARRIVAL text — centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: "40%", aspectRatio: "801/299" }}>
            <Image
              src="/images/banner-watch-1.png"
              alt="New Arrival"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* SHOP NOW button — bottom left */}
        <div className="absolute bottom-8 left-8">
          <Link
            href="/category/gevarim"
            className="inline-block bg-white hover:bg-gray-100 text-[#222222] text-xs font-bold px-8 py-3 tracking-widest uppercase transition-colors"
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* Banner 2: full-width watch image */}
      <section
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1244/800" }}
      >
        <Image
          src="/images/banner-2.jpg"
          alt="שעון יוקרה"
          fill
          className="object-cover object-center"
        />
      </section>
    </>
  );
}
