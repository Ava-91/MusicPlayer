import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/songs/artwork",
      },
      {
        pathname: "/covers/**",
      },
    ],
  },
};

export default nextConfig;