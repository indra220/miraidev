import { SupportTicket } from "@/components/dashboard/SupportTicket";
import type { Metadata } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Dukungan & Bantuan",
};

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dukungan & Bantuan</h1>
        <p className="text-muted-foreground">
          Kirim tiket dukungan dan lihat status permintaan Anda
        </p>
      </div>
      
      <SupportTicket />
    </div>
  );
}