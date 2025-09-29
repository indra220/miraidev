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
import { useState } from "react";

export function ProjectOverview() {
  // Data contoh - nanti akan diganti dengan data dari API
  const [projects] = useState([
    { 
      id: 1, 
      name: "Website E-commerce", 
      client: "PT. Maju Jaya", 
      status: "development", 
      progress: 65,
      timeline: { start: "2024-09-01", expected: "2024-12-15" },
      team: "Tim Frontend & Backend",
      latestUpdate: "Implementasi sistem pembayaran"
    },
    { 
      id: 2, 
      name: "Landing Page Marketing", 
      client: "CV. Cepat Sukses", 
      status: "design", 
      progress: 30,
      timeline: { start: "2024-10-01", expected: "2024-11-15" },
      team: "Tim Desain UI/UX",
      latestUpdate: "Review desain halaman"
    },
    { 
      id: 3, 
      name: "Aplikasi Inventory", 
      client: "Toko Modern Chain", 
      status: "completed", 
      progress: 100,
      timeline: { start: "2024-07-01", expected: "2024-09-30", actual: "2024-09-25" },
      team: "Tim Pengembangan",
      latestUpdate: "Deployment produksi"
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
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
                      project.status === "completed" ? "bg-green-500" :
                      project.status === "development" ? "bg-blue-500" :
                      "bg-yellow-500"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'development' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'design' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'completed' ? <CheckCircleIcon className="h-3 w-3 mr-1" /> :
                     project.status === 'development' ? <ClockIcon className="h-3 w-3 mr-1" /> :
                     <AlertCircleIcon className="h-3 w-3 mr-1" />}
                    {project.status}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{project.timeline.start} - {project.timeline.expected}</span>
                </div>
                
                {project.timeline.actual && (
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    <span>Selesai: {project.timeline.actual}</span>
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
        ))}
      </div>
    </div>
  );
}