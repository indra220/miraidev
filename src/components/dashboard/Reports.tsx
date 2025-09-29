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

export function Reports() {
  // Data contoh - nanti akan diganti dengan data dari API
  const trafficData = [
    { date: "2024-07", visitors: 4000, pageviews: 2400 },
    { date: "2024-08", visitors: 3000, pageviews: 1398 },
    { date: "2024-09", visitors: 2780, pageviews: 3800 },
    { date: "2024-10", visitors: 1890, pageviews: 4800 },
    { date: "2024-11", visitors: 2390, pageviews: 3800 },
    { date: "2024-12", visitors: 3490, pageviews: 4300 },
  ];

  const serviceData = [
    { name: "Website", usage: 75 },
    { name: "Hosting", usage: 60 },
    { name: "Email", usage: 45 },
    { name: "SSL", usage: 30 },
  ];

  const reports = [
    { id: 1, title: "Laporan Bulanan September", type: "traffic", date: "2024-10-01" },
    { id: 2, title: "Laporan Penggunaan Layanan", type: "usage", date: "2024-09-28" },
    { id: 3, title: "Laporan Kinerja Website", type: "performance", date: "2024-09-25" },
  ];

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
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <FileTextIcon className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}