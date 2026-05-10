import Image from "next/image";
import Link from "next/link";

export default function BottomBanners() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(260px, 35vw, 500px)" }}
    >
      {/* Layer 1 — dark brown gradient background */}
      <Image
        src="/images/banner-bg-1.png"
        alt=""
        fill
        className="object-cover object-center"
        style={{ zIndex: 1 }}
      />

      {/* Layer 2 — watch on beige background (left 55%) */}
      <div
        className="absolute top-0 left-0 h-full"
        style={{ width: "55%", zIndex: 2 }}
      >
        <Image
          src="/images/banner-124.jpg"
          alt="New Arrival Watch"
          fill
          className="object-cover"
          style={{ objectPosition: "right center" }}
        />
      </div>

      {/* Layer 3 — NEW ARRIVAL text */}
      <div
        className="absolute"
        style={{
          right: "8%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "35%",
          zIndex: 3,
        }}
      >
        <Image
          src="/images/banner-125.png"
          alt="New Arrival"
          width={700}
          height={260}
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Layer 4 — SHOP NOW button */}
      <Link
        href="/shop"
        className="absolute hover:opacity-80 transition-opacity"
        style={{
          right: "10%",
          bottom: "22%",
          zIndex: 4,
          background: "#1a1a1a",
          color: "#fff",
          padding: "12px 32px",
          fontSize: "14px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          display: "inline-block",
          textDecoration: "none",
        }}
      >
        SHOP NOW
      </Link>
    </section>
  );
}
