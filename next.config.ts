import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "okamune-home.supabase.co",
      },
    ],
  },
};

export default nextConfig;
