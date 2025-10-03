import { ProjectSubmission } from "@/components/dashboard/ProjectSubmission";
import type { Metadata } from "next";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Pengajuan Proyek",
};

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengajuan Proyek</h1>
        <p className="text-muted-foreground">
          Ajukan proyek website baru dan pantau prosesnya
        </p>
      </div>
      
      <ProjectSubmission />
    </div>
  );
}