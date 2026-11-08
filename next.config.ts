import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app is commonly opened through 127.0.0.1 in local development.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
