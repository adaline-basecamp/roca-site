import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Dev-only floating badge. It never ships in the static export, but it sits
  // over the bottom-left of the page during review, so it's off here too.
  devIndicators: false,
};

export default nextConfig;
