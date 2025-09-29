import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { geistSans, geistMono } from "@/lib/font-optimizer";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import RegisterSW from "@/components/RegisterSW";

export const metadata: Metadata = {
  title: {
    default: "MiraiDev - Solusi Pengembangan Website Modern",
    template: "%s | MiraiDev"
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
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "MiraiDev - Solusi Pengembangan Website Modern",
    description: "MiraiDev menyediakan solusi pengembangan website modern, desain UI/UX, dan layanan pemeliharaan untuk bisnis Anda",
    images: ["/og-image.png"],
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
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RegisterSW />
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}