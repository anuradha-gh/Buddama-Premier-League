import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/bpl-web-9a688.firebasestorage.app/**',
      },
    ],
  },
};

export default nextConfig;
