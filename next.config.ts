import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Listing photos are already small web JPEGs on SimplyRETS's CloudFront, so
    // the browser loads them directly. Routing them through the optimizer hit
    // its fixed 7s upstream timeout on slow connections and returned 504s.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
