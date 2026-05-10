"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

const SLIDES = [
  { id: 1, image: "https://tiktime.co.il/GalleryFlash_182.jpg" },
  { id: 2, image: "https://tiktime.co.il/GalleryFlash_177.jpg" },
  { id: 3, image: "https://tiktime.co.il/GalleryFlash_178.jpg" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, 3000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-100"
      style={{ aspectRatio: "1920/750" }}
    >
      {!imgError[current] ? (
        <Image
          key={current}
          src={SLIDES[current].image}
          alt="TikTime Collection"
          fill
          className="object-cover object-center"
          priority={current === 0}
          unoptimized
          onError={() => setImgError((e) => ({ ...e, [current]: true }))}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}

      <button
        onClick={prev}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2.5 rounded-full transition-colors z-10"
        aria-label="הקודם"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2.5 rounded-full transition-colors z-10"
        aria-label="הבא"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`שקופית ${i + 1}`}
            className="w-3 h-3 rounded-full border-2 border-white transition-all duration-300"
            style={{
              backgroundColor: i === current ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
