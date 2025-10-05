import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen text-white">
      {/* Wadah untuk background yang menutupi seluruh halaman */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        {/* Overlay gelap untuk membuat teks lebih mudah dibaca */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Navbar akan berada di atas background */}
      <Navbar />

      {/* Konten halaman akan ditampilkan di sini */}
      <main>{children}</main>

      {/* Anda bisa menambahkan Footer di sini jika perlu */}
      {/* <Footer /> */}
    </div>
  );
}