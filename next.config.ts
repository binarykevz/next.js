import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Build as a pure static site
  output: "export",

  // 2. Disable Next.js Image Optimization (Required for static export)
  images: {
    unoptimized: true, 
    // Note: remotePatterns is removed because unoptimized:true bypasses Next's image proxy
  },

  // 3. Prevent build failures from strict lint/type checks on Cloudflare
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
