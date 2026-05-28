import Image from "next/image";
import Link from "next/link";

export default function BottomBanners() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(200px, 26vw, 400px)" }}
    >
      {/* Layer 1 — beige gradient background */}
      <Image
        src="/images/banner-bg-1.png"
        alt=""
        fill
        className="object-cover object-center"
        style={{ zIndex: 1 }}
      />

      {/* Layer 2 — watch image on the LEFT side, mirrored so watch face appears away from caption */}
      <div
        className="absolute top-0 left-0 h-full"
        style={{ width: "55%", zIndex: 2, transform: "scaleX(-1)" }}
      >
        <Image
          src="/images/banner-124.jpg"
          alt="New Arrival Watch"
          fill
          className="object-cover"
          style={{ objectPosition: "right center" }}
        />
      </div>

      {/* Layer 3 — NEW ARRIVAL text + SHOP NOW on the RIGHT side */}
      <div
        className="absolute flex flex-col items-center gap-4"
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
        <Link
          href="/shop"
          className="hover:opacity-80 transition-opacity"
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: "10px 28px",
            fontSize: "13px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            display: "inline-block",
            textDecoration: "none",
          }}
        >
          SHOP NOW
        </Link>
      </div>
    </section>
  );
}
