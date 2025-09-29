import { ProjectSubmission } from "@/components/dashboard/ProjectSubmission";

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