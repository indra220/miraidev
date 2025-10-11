// src/app/dashboard/projects/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService, DashboardProject } from "@/lib/dashboard-service";

export default function ProjectsPage() {
  useEffect(() => {
    document.title = "Manajemen Proyek | MiraiDev";
  }, []);

  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { session, loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (authLoading) return; // Jika auth masih loading, jangan lanjutkan
    
    const fetchProjects = async () => {
      if (session?.user) {
        try {
          const userData = await dashboardService.getDashboardData(session.user.id);
          setProjects(userData.projects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [session, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Proyek</h1>
          <p className="text-muted-foreground">
            Pantau dan kelola semua proyek Anda di sini
          </p>
        </div>
        
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat data proyek...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter proyek berdasarkan status
  const activeProjects = projects.filter(p => 
    p.status === 'aktif' || p.status === 'development' || p.status === 'on-going'
  );
  
  const completedProjects = projects.filter(p => 
    p.status === 'completed' || p.status === 'selesai'
  );
  
  const onHoldProjects = projects.filter(p => 
    p.status === 'on-hold' || p.status === 'ditunda'
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Proyek</h1>
        <p className="text-muted-foreground">
          Pantau dan kelola semua proyek Anda di sini
        </p>
      </div>

      {/* --- PERUBAHAN URUTAN DAN DEFAULT VALUE DIMULAI DI SINI --- */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Semua ({projects.length})</TabsTrigger>
          <TabsTrigger value="active">Aktif ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="on-hold">Ditunda ({onHoldProjects.length})</TabsTrigger>
          <TabsTrigger value="completed">Selesai ({completedProjects.length})</TabsTrigger>
        </TabsList>
      {/* --- AKHIR PERUBAHAN --- */}
        
        <TabsContent value="active" className="space-y-4">
          {activeProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Proyek untuk {project.client}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada proyek aktif</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Proyek untuk {project.client}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada proyek selesai</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="on-hold" className="space-y-4">
          {onHoldProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {onHoldProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Proyek untuk {project.client}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada proyek ditunda</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <ProjectOverview />
        </TabsContent>
      </Tabs>
    </div>
  );
}