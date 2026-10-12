import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Isolate production verification from an already running development server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  devIndicators: false,
};

export default nextConfig;
