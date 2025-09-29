import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  FileTextIcon
} from "lucide-react";

export function ServiceHistory() {
  // Data contoh - nanti akan diganti dengan data dari API
  const services = [
    { id: 1, name: "Paket Website Basic", status: "aktif", price: 1500000, expiry: "2025-03-15", type: "berlangganan" },
    { id: 2, name: "Layanan Hosting", status: "aktif", price: 300000, expiry: "2024-12-31", type: "berlangganan" },
    { id: 3, name: "Desain UI/UX", status: "selesai", price: 2500000, expiry: "2024-08-20", type: "proyek" },
    { id: 4, name: "Pemeliharaan Bulanan", status: "aktif", price: 500000, expiry: "2025-01-31", type: "berlangganan" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Riwayat Layanan</h2>
        <p className="text-sm text-muted-foreground">Daftar layanan yang pernah Anda pesan</p>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
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
                <div className="text-lg font-semibold">Rp {service.price.toLocaleString()}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Exp: {service.expiry}
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
        ))}
      </div>
    </div>
  );
}