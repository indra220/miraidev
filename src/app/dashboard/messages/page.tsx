import { Communication } from "@/components/dashboard/Communication";
import type { Metadata } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Pesan & Komunikasi",
};

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pesan & Komunikasi</h1>
        <p className="text-muted-foreground">
          Lihat dan kelola komunikasi terkait proyek Anda
        </p>
      </div>
      
      <Communication />
    </div>
  );
}