import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed `output: 'export'` to allow building dynamic routes without
  // requiring generateStaticParams() for every dynamic page. If you need a
  // full static export, add generateStaticParams() to each dynamic route.
  trailingSlash: true,
  images: {
    domains: ["res.cloudinary.com"],
    unoptimized: true
  }
};

export default nextConfig;

