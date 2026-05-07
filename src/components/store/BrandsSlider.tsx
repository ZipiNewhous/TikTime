"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const BRANDS: { name: string; slug: string; logo: string; external?: boolean }[] = [
  { name: "Tissot",               slug: "tissot",               logo: "/brands/tissot.png" },
  { name: "BERING",               slug: "bering",               logo: "/brands/bering.png" },
  { name: "Tommy Hilfiger",       slug: "tommy-hilfiger",       logo: "/brands/tommy-hilfiger.png" },
  { name: "GANT",                 slug: "gant",                 logo: "/brands/gant.png" },
  { name: "Cavallo",              slug: "cavallo",              logo: "/brands/cavallo.png" },
  { name: "Frederique Constant",  slug: "frederique-constant",  logo: "/brands/frederique-constant.png" },
  { name: "Claude Bernard",       slug: "claude-bernard",       logo: "/brands/claude-bernard.png" },
  { name: "Michele",              slug: "michele",              logo: "/brands/michele.png" },
  { name: "Mathey-Tissot",        slug: "mathey-tissot",        logo: "/brands/mathey-tissot.png" },
  { name: "Rado",                 slug: "rado",                 logo: "/brands/rado.png" },
  { name: "Rolex",                slug: "rolex",                logo: "", external: true },
  { name: "Omega",                slug: "omega",                logo: "", external: true },
  { name: "Longines",             slug: "longines",             logo: "", external: true },
  { name: "TAG Heuer",            slug: "tag-heuer",            logo: "", external: true },
  { name: "Seiko",                slug: "seiko",                logo: "", external: true },
  { name: "Citizen",              slug: "citizen",              logo: "", external: true },
  { name: "Casio",                slug: "casio",                logo: "", external: true },
  { name: "GUESS",                slug: "guess",                logo: "", external: true },
  { name: "Hugo Boss",            slug: "hugo-boss",            logo: "", external: true },
  { name: "Calvin Klein",         slug: "calvin-klein",         logo: "", external: true },
  { name: "Lacoste",              slug: "lacoste",              logo: "", external: true },
];

const CLEARBIT: Record<string, string> = {
  rolex:          "rolex.com",
  omega:          "omegawatches.com",
  longines:       "longines.com",
  "tag-heuer":    "tagheuer.com",
  seiko:          "seiko.com",
  citizen:        "citizenwatch.com",
  casio:          "casio.com",
  guess:          "guess.com",
  "hugo-boss":    "hugoboss.com",
  "calvin-klein": "calvinklein.com",
  lacoste:        "lacoste.com",
};

function BrandItem({ name, slug, logo }: { name: string; slug: string; logo: string }) {
  const [error, setError] = useState(false);
  const src = logo || (CLEARBIT[slug] ? `https://logo.clearbit.com/${CLEARBIT[slug]}` : "");

  return (
    <Link
      href={`/brands/${slug}`}
      className="flex items-center justify-center shrink-0 px-6 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
      style={{ width: 140, height: 64 }}
    >
      {src && !error ? (
        <div className="relative w-full h-full">
          <Image
            src={src}
            alt={name}
            fill
            className="object-contain"
            unoptimized
            onError={() => setError(true)}
          />
        </div>
      ) : (
        <span className="text-gray-500 font-bold text-sm tracking-widest uppercase whitespace-nowrap">
          {name}
        </span>
      )}
    </Link>
  );
}

export default function BrandsSlider() {
  const items = [...BRANDS, ...BRANDS];

  return (
    <div className="bg-white border-y border-gray-100 overflow-hidden" style={{ height: 88 }}>
      <div
        className="flex items-center h-full"
        style={{
          animation: "scroll-brands 40s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((brand, i) => (
          <BrandItem key={i} name={brand.name} slug={brand.slug} logo={brand.logo} />
        ))}
      </div>

      <style>{`
        @keyframes scroll-brands {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
