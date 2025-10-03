import { ThemeProvider } from "@/components/theme-provider";
import { geistSans, geistMono } from "@/lib/font-optimizer";
import { metadata } from "./metadata";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import RegisterSW from "@/components/RegisterSW";
import SessionProvider from "@/components/SessionProvider";

// eslint-disable-next-line react-refresh/only-export-components
export { metadata };

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