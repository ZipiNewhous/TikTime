import Image from "next/image";
import Link from "next/link";

export default function BottomBanners() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(220px, 28vw, 440px)" }}
    >
      {/* Watch image covers the full banner — watch is on the right, beige on the left */}
      <Image
        src="/images/banner-124.jpg"
        alt="New Arrival Watch"
        fill
        className="object-cover"
        style={{ objectPosition: "center center" }}
      />

      {/* NEW ARRIVAL text + SHOP NOW — float over the left beige area */}
      <div
        className="absolute top-0 left-0 h-full flex flex-col items-center justify-center gap-5"
        style={{ width: "50%", zIndex: 2 }}
      >
        <Image
          src="/images/banner-125.png"
          alt="New Arrival"
          width={500}
          height={185}
          className="w-3/4 h-auto object-contain"
        />
        <Link
          href="/shop"
          className="hover:opacity-75 transition-opacity"
          style={{
            background: "#1a1a1a",
            color: "#fff",
            padding: "11px 32px",
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
