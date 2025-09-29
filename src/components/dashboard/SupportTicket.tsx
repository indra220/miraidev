"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquareIcon, 
  TicketIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  SearchIcon,
  CalendarIcon
} from "lucide-react";
import { useState } from "react";

export function SupportTicket() {
  // Data contoh - nanti akan diganti dengan data dari API
  const [tickets] = useState([
    { id: 1, subject: "Kesulitan saat login", status: "dalam proses", priority: "tinggi", date: "2024-10-25" },
    { id: 2, subject: "Permintaan fitur baru", status: "terbuka", priority: "rendah", date: "2024-10-22" },
    { id: 3, subject: "Bug pada halaman checkout", status: "selesai", priority: "tinggi", date: "2024-10-20" },
  ]);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
    priority: "normal"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi pengiriman tiket dukungan
    // console.log("Tiket baru:", newTicket);
    setNewTicket({ subject: "", message: "", priority: "normal" });
  };

  

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Permintaan Dukungan</h2>
        <p className="text-sm text-muted-foreground">Kirimkan pertanyaan atau masalah Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            Kirimkan Tiket Dukungan Baru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Subjek permintaan dukungan"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Jelaskan masalah atau permintaan Anda..."
                value={newTicket.message}
                onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                required
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Prioritas:</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="rendah">Rendah</option>
                  <option value="normal">Normal</option>
                  <option value="tinggi">Tinggi</option>
                </select>
              </div>
              <Button type="submit">
                <MessageSquareIcon className="h-4 w-4 mr-2" />
                Kirim Tiket
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tiket Dukungan Saya</span>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari tiket..." className="pl-8" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <TicketIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                      <h3 className="font-medium">{ticket.subject}</h3>
                    </div>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        ticket.status === 'selesai' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'dalam proses' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.status === 'selesai' ? <CheckCircleIcon className="h-3 w-3 mr-1" /> :
                         ticket.status === 'dalam proses' ? <ClockIcon className="h-3 w-3 mr-1" /> :
                         <AlertCircleIcon className="h-3 w-3 mr-1" />}
                        {ticket.status}
                      </span>
                      <span className={`text-xs ${
                        ticket.priority === 'tinggi' ? 'text-red-600' :
                        ticket.priority === 'rendah' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {ticket.date}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Lihat Detail</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}