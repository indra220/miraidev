import { ThemeProvider } from "@/components/theme-provider";
import { geistSans, geistMono } from "@/lib/font-optimizer";
import { metadata } from "./metadata";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import RegisterSW from "@/components/RegisterSW";
import SessionProvider from "@/components/SessionProvider";

export async function generateMetadata() {
  return {
    ...metadata,
    icons: {
      icon: '/codeguide-logo.png', // Gunakan logo yang sudah ada di public
    },
  };
}

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
          <SessionProvider />
          <RegisterSW />
          {children}
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}