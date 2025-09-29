"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "@/components/dashboard/ProjectOverview";
import { ServiceHistory } from "@/components/dashboard/ServiceHistory";
import { Communication } from "@/components/dashboard/Communication";
import { Reports } from "@/components/dashboard/Reports";
import { SupportTicket } from "@/components/dashboard/SupportTicket";
import { UserProfile } from "@/components/dashboard/UserProfile";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Klien</h1>
        <p className="text-muted-foreground">
          Selamat datang di dashboard Anda. Pantau proyek dan layanan Anda di sini.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="projects">Proyek</TabsTrigger>
          <TabsTrigger value="services">Layanan</TabsTrigger>
          <TabsTrigger value="messages">Pesan</TabsTrigger>
          <TabsTrigger value="reports">Laporan</TabsTrigger>
          <TabsTrigger value="support">Dukungan</TabsTrigger>
          <TabsTrigger value="account">Akun</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <ProjectOverview />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Proyek Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Daftar proyek yang sedang dalam pengembangan</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Proyek Selesai</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Proyek yang telah selesai dikerjakan</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Proyek Ditunda</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Proyek yang sedang ditunda</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <ServiceHistory />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Communication />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Reports />
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <SupportTicket />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <UserProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}