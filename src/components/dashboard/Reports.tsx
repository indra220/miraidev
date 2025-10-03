"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChartIcon, 
  DownloadIcon, 
  EyeIcon, 
  FileTextIcon,
  TrendingUpIcon
} from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from "recharts";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  dashboardService, 
  DashboardReport,
  DashboardAnalytics
} from "@/lib/dashboard-service";

export function Reports() {
  const [reports, setReports] = useState<DashboardReport[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    const fetchReports = async () => {
      if (session?.user) {
        try {
          const reportsData = await dashboardService.getDashboardData(session.user.id);
          setReports(reportsData.reports);
          setAnalytics(reportsData.analytics);
        } catch (error) {
          console.error("Error fetching reports:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchReports();
  }, [session, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  const trafficData = analytics?.trafficData || [];
  const serviceData = analytics?.serviceData || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Laporan & Analitik</h2>
        <p className="text-sm text-muted-foreground">Statistik dan analisis untuk layanan Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Traffic Website</span>
              <BarChartIcon className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={trafficData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="pageviews" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Penggunaan Layanan</span>
              <TrendingUpIcon className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={serviceData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="usage" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Dokumen Laporan</span>
            <Button size="sm" variant="outline">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Unduh Semua
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <FileTextIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(report.generated_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Lihat
                    </Button>
                    <Button size="sm" variant="outline">
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Tidak ada laporan yang tersedia
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}