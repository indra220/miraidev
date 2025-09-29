import { Reports } from "@/components/dashboard/Reports";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Laporan & Analitik</h1>
        <p className="text-muted-foreground">
          Analisis dan laporan terkait website dan layanan Anda
        </p>
      </div>
      
      <Reports />
    </div>
  );
}