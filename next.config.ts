import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nmbnkalwdfpfyzaahccu.supabase.co",
      },
    ],
  },
};

export default nextConfig;