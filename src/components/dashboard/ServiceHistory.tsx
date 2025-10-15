"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  FileTextIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService, DashboardService } from "@/lib/dashboard-service";

export function ServiceHistory() {
  const [services, setServices] = useState<DashboardService[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    const fetchServices = async () => {
      if (user) {
        try {
          const userServices = await dashboardService.getDashboardData(user.id);
          setServices(userServices.services);
        } catch (error) {
          console.error("Error fetching services:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data layanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Riwayat Layanan</h2>
        <p className="text-sm text-muted-foreground">Daftar layanan yang pernah Anda pesan</p>
      </div>

      <div className="space-y-4">
        {services.length > 0 ? (
          services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{service.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={service.status === "aktif" ? "default" : service.status === "selesai" ? "secondary" : "outline"}>
                      {service.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground capitalize">{service.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">Rp {service.price.toLocaleString('id-ID')}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Exp: {new Date(service.expiry).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileTextIcon className="h-4 w-4 mr-1" />
                      ID: {service.id}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Lihat Detail</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Belum ada layanan yang terdaftar</p>
          </div>
        )}
      </div>
    </div>
  );
}