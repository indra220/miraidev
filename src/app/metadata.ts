import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "MiraiDev - Solusi Pengembangan Website Modern",
    template: "%s | MiraiDev" // <-- Template ini akan digunakan di semua halaman
  },
  description: "MiraiDev menyediakan solusi pengembangan website modern, desain UI/UX, dan layanan pemeliharaan untuk bisnis Anda",
  keywords: ["website", "development", "UMKM", "digital", "solution", "Indonesia"],
  authors: [{ name: "MiraiDev", url: "https://www.mirai.dev" }],
  creator: "MiraiDev",
  publisher: "MiraiDev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.mirai.dev"),
  icons: {
    icon: '/codeguide-logo.png', // Gunakan logo yang sudah ada di public
  },
  openGraph: {
    type: "website",
    title: "MiraiDev - Solusi Pengembangan Website Modern",
    description: "MiraiDev menyediakan solusi pengembangan website modern, desain UI/UX, dan layanan pemeliharaan untuk bisnis Anda",
    url: "https://www.mirai.dev",
    siteName: "MiraiDev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MiraiDev - Solusi Pengembangan Website Modern",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MiraiDev - Solusi Pengembangan Website Modern",
    description: "MiraiDev menyediakan solusi pengembangan website modern, desain UI/UX, dan layanan pemeliharaan untuk bisnis Anda",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  }
};