"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

const SLIDES = [
  { id: 1, image: "https://tiktime.co.il/GalleryFlash_182.jpg" },
  { id: 2, image: "https://tiktime.co.il/GalleryFlash_177.jpg" },
  { id: 3, image: "https://tiktime.co.il/GalleryFlash_178.jpg" },
];

const TRANSITION_MS = 900;
const AUTO_MS = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [sliding, setSliding] = useState(false);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});
  const busy = useRef(false);

  const goTo = useCallback(
    (idx: number) => {
      if (busy.current || idx === current) return;
      busy.current = true;

      setIncoming(idx);
      setSliding(false); // mount the incoming slide off-screen (translateX 100%)

      // Two rAF frames: first lets React commit the mount, second lets the
      // browser paint the initial off-screen position before we start the transition
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setSliding(true))
      );

      setTimeout(() => {
        setCurrent(idx);
        setIncoming(null);
        setSliding(false);
        busy.current = false;
      }, TRANSITION_MS);
    },
    [current]
  );

  const nextSlide = useCallback(
    () => goTo((current + 1) % SLIDES.length),
    [goTo, current]
  );
  const prevSlide = useCallback(
    () => goTo((current - 1 + SLIDES.length) % SLIDES.length),
    [goTo, current]
  );

  useEffect(() => {
    const t = setInterval(nextSlide, AUTO_MS);
    return () => clearInterval(t);
  }, [nextSlide]);

  // Dots reflect the destination immediately, not after the transition ends
  const dotActive = incoming ?? current;

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-100"
      style={{ aspectRatio: "1920/750" }}
    >
      {/* Base layer — current slide, always visible underneath */}
      {!imgError[current] ? (
        <Image
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

      {/* Curtain layer — incoming slide slides in from the right */}
      {incoming !== null && (
        <div
          className="absolute inset-0"
          style={{
            transform: sliding ? "translateX(0)" : "translateX(100%)",
            transition: sliding
              ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
              : "none",
          }}
        >
          {!imgError[incoming] ? (
            <Image
              src={SLIDES[incoming].image}
              alt="TikTime Collection"
              fill
              className="object-cover object-center"
              unoptimized
              onError={() =>
                setImgError((e) => ({ ...e, [incoming as number]: true }))
              }
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}
        </div>
      )}

      <button
        onClick={prevSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2.5 rounded-full transition-colors z-10"
        aria-label="הקודם"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-2.5 rounded-full transition-colors z-10"
        aria-label="הבא"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`שקופית ${i + 1}`}
            className="w-3 h-3 rounded-full border-2 border-white transition-all duration-300"
            style={{
              backgroundColor:
                i === dotActive
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
