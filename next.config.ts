import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/beranda',
        permanent: true,
      },
    ];
  },
  
  // Optimasi performa
  experimental: {
    // Aktifkan React compiler untuk performa tambahan
    reactCompiler: true,
  },
  
  // Optimasi gambar
  images: {
    domains: ["localhost", "www.mirai.dev", "cdn.discordapp.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24, // 24 jam cache
  },
  
  // Optimasi output
  output: "standalone",
};

export default nextConfig;