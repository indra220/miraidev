import { ThemeProvider } from "@/components/theme-provider";
import { geistSans, geistMono } from "@/lib/font-optimizer";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import RegisterSW from "@/components/RegisterSW";
import SessionProvider from "@/components/SessionProvider";
import { LanguageProvider } from "@/i18n/LanguageContextProvider";

// eslint-disable-next-line react-refresh/only-export-components
export { metadata } from "./metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
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
        </LanguageProvider>
      </body>
    </html>
  );
}