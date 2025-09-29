import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Proyek</h1>
        <p className="text-muted-foreground">
          Pantau dan kelola semua proyek Anda di sini
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Aktif</TabsTrigger>
          <TabsTrigger value="completed">Selesai</TabsTrigger>
          <TabsTrigger value="on-hold">Ditunda</TabsTrigger>
          <TabsTrigger value="all">Semua</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Website E-commerce</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Proyek website toko online untuk PT. Maju Jaya</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Aplikasi Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Sistem manajemen inventaris untuk retail chain</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Landing Page Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Landing page untuk kampanye digital</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="on-hold" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sistem ERP</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Enterprise Resource Planning (ditunda sementara)</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <ProjectOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
}