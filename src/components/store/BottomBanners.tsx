import Image from "next/image";
import Link from "next/link";

export default function BottomBanners() {
  return (
    <section className="w-full overflow-hidden" style={{ aspectRatio: "1716/535" }}>
      {/* Single pre-composed NEW ARRIVAL banner (watch left, caption right,
          SHOP NOW) — matches the approved "new arrival.png" exactly instead of
          layering/mirroring the parts at runtime. */}
      <Link
        href="/shop"
        className="relative block w-full h-full"
        aria-label="NEW ARRIVAL — SHOP NOW"
      >
        <Image
          src="/images/new-arrival.png"
          alt="NEW ARRIVAL — שעונים חדשים"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </Link>
    </section>
  );
}
