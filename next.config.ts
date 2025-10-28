import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost',
      '127.0.0.1',
      'daisyui.com',
      'images.unsplash.com',
      'picsum.photos',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
