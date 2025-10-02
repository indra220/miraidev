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
  
  // Nonaktifkan React compiler sementara untuk menghindari masalah hydration
  experimental: {
    // Nonaktifkan sementara karena bisa menyebabkan masalah hydration
    reactCompiler: false,
  },
  
  // Optimasi gambar
  images: {
    domains: ["localhost", "www.mirai.dev", "cdn.discordapp.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24, // 24 jam cache
  },
  
  // Optimasi output
  output: "standalone",
  
  // Optimasi kompilasi untuk development
  // Hanya kompilasi halaman yang benar-benar dibutuhkan
  onDemandEntries: {
    // Waktu maksimal halaman tetap di memori (detik)
    maxInactiveAge: 60 * 1000,
    // Jumlah maksimal halaman yang bisa dikeep di memori
    pagesBufferLength: 2,
  },
};

export default nextConfig;