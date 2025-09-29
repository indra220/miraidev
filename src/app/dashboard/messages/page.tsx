import { Communication } from "@/components/dashboard/Communication";

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