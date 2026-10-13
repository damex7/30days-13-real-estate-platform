import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SimplyRETS serves listing photos from this CloudFront distribution.
    remotePatterns: [new URL("https://d2bd5h5te3s67r.cloudfront.net/**")],
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
