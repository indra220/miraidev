import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "MiraiDev - Modern Website Development Solutions",
    template: "%s | MiraiDev" // <-- Template ini akan digunakan di semua halaman
  },
  description: "MiraiDev provides modern website development solutions, UI/UX design, and maintenance services for your business",
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
    icon: '/images/logo-rebg.png', // Gunakan logo yang diminta oleh pengguna
  },
  openGraph: {
    type: "website",
    title: "MiraiDev - Modern Website Development Solutions",
    description: "MiraiDev provides modern website development solutions, UI/UX design, and maintenance services for your business",
    url: "https://www.mirai.dev",
    siteName: "MiraiDev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MiraiDev - Modern Website Development Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MiraiDev - Modern Website Development Solutions",
    description: "MiraiDev provides modern website development solutions, UI/UX design, and maintenance services for your business",
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