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
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  dashboardService, 
  DashboardSupportTicket
} from "@/lib/dashboard-service";

export function SupportTicket() {
  const [tickets, setTickets] = useState<DashboardSupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { session, loading: authLoading } = useAuth();

  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
    priority: "normal"
  });

  useEffect(() => {
    if (authLoading) return;
    
    const fetchTickets = async () => {
      if (session?.user) {
        try {
          const ticketsData = await dashboardService.getDashboardData(session.user.id);
          setTickets(ticketsData.supportTickets);
        } catch (error) {
          console.error("Error fetching support tickets:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [session, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (session?.user) {
      try {
        await dashboardService.createSupportTicket(
          session.user.id, 
          newTicket.subject, 
          newTicket.message, 
          newTicket.priority
        );
        
        const updatedData = await dashboardService.getDashboardData(session.user.id);
        setTickets(updatedData.supportTickets);
        
        setNewTicket({ subject: "", message: "", priority: "normal" });
      } catch (error) {
        console.error("Error creating support ticket:", error);
      }
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data tiket dukungan...</p>
        </div>
      </div>
    );
  }

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
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
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
                          {new Date(ticket.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Lihat Detail</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Tidak ada tiket dukungan yang terdaftar
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}