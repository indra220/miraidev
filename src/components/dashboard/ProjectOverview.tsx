"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  UserIcon, 
  MessageSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService, DashboardProject } from "@/lib/dashboard-service";

export function ProjectOverview() {
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    const fetchProjects = async () => {
      if (session?.user) {
        try {
          const userProjects = await dashboardService.getDashboardData(session.user.id);
          setProjects(userProjects.projects);
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
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data proyek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {project.client}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progres</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.status === "completed" || project.status === "selesai" ? "bg-green-500" :
                        project.status === "development" || project.status === "aktif" ? "bg-blue-500" :
                        "bg-yellow-500"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      (project.status === 'completed' || project.status === 'selesai') ? 'bg-green-100 text-green-800' :
                      (project.status === 'development' || project.status === 'aktif') ? 'bg-blue-100 text-blue-800' :
                      project.status === 'design' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {(project.status === 'completed' || project.status === 'selesai') ? <CheckCircleIcon className="h-3 w-3 mr-1" /> :
                       (project.status === 'development' || project.status === 'aktif') ? <ClockIcon className="h-3 w-3 mr-1" /> :
                       <AlertCircleIcon className="h-3 w-3 mr-1" />}
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{new Date(project.timeline.start).toLocaleDateString('id-ID')} - {new Date(project.timeline.expected).toLocaleDateString('id-ID')}</span>
                  </div>
                  
                  {project.timeline.actual && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      <span>Selesai: {new Date(project.timeline.actual).toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground">
                    Tim: {project.team}
                  </div>
                  
                  <div className="text-sm mt-2 p-2 bg-muted rounded">
                    <MessageSquareIcon className="h-4 w-4 inline mr-1" />
                    <span className="text-muted-foreground">Update terakhir: </span>
                    <span>{project.latestUpdate}</span>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button size="sm" variant="outline">Detail</Button>
                  <Button size="sm">Komunikasi</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Belum ada proyek yang terdaftar</p>
          </div>
        )}
      </div>
    </div>
  );
}