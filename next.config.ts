import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
    // webp only — avif encoding is much slower per-image and was the main
    // cause of the "extra second" on every watch image.
    formats: ["image/webp"],
    // Cache each optimized image for 31 days so it is encoded only once.
    minimumCacheTTL: 2678400,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
