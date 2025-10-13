"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Mail,
  Calendar,
  Filter,
  User,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AlertDialog, AlertDialogResult } from "@/components/AlertDialog";
import { useDialog } from "@/hooks/useDialog";

// Interface untuk ticket dukungan
interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string;
    email: string;
  };
}

export default function SupportManagement() {
  useEffect(() => {
    document.title = "Manajemen Dukungan & Bantuan | MiraiDev";
  }, []);

  const { 
    alertDialogState, 
    closeAlertDialog,
    alertResultState,
    showAlertResult,
    closeAlertResult
  } = useDialog();
  
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [priorityFilter, setPriorityFilter] = useState<string>("semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data tiket dukungan dari Supabase saat komponen dimuat
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const supabase = createClient();
        
        // Ambil data tiket dukungan
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('support_tickets')
          .select('*')
          .order('created_at', { ascending: false });

        if (ticketsError) {
          throw new Error(ticketsError.message);
        }

        // Ambil profil pengguna untuk setiap tiket
        const ticketsWithProfiles = await Promise.all(
          ticketsData.map(async (ticket) => {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', ticket.user_id)
              .single();

            return {
              ...ticket,
              profile: profileError ? undefined : profile
            };
          })
        );

        setTickets(ticketsWithProfiles);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching support tickets:', err);
        setError('Gagal mengambil data tiket dukungan. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Fungsi untuk menyegarkan data
  const refreshData = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Ambil data tiket dukungan
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) {
        throw new Error(ticketsError.message);
      }

      // Ambil profil pengguna untuk setiap tiket
      const ticketsWithProfiles = await Promise.all(
        ticketsData.map(async (ticket) => {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('id', ticket.user_id)
            .single();

          return {
            ...ticket,
            profile: profileError ? undefined : profile
          };
        })
      );

      setTickets(ticketsWithProfiles);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      setError('Gagal mengambil data tiket dukungan. Silakan coba lagi nanti.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'open' | 'in_progress' | 'closed' | 'on_hold') => {
    try {
      const supabase = createClient();
      
      const { data: updatedTicket, error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Update item di state
      setTickets(tickets.map(ticket => 
        ticket.id === id ? { ...ticket, ...updatedTicket } : ticket
      ));
      showAlertResult("Berhasil", `Status tiket berhasil diperbarui menjadi ${newStatus}.`);
    } catch (err) {
      console.error('Error updating ticket status:', err);
      showAlertResult("Gagal", "Gagal memperbarui status tiket. Silakan coba lagi.");
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Manajemen Dukungan & Bantuan</h1>
        <div className="mt-6 p-6 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
          <p className="text-red-300">{error}</p>
          <Button 
            className="mt-4 bg-red-700 hover:bg-red-600"
            onClick={refreshData}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "semua" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "semua" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Fungsi untuk mendapatkan ikon status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'on_hold':
        return <AlertCircle className="h-4 w-4 mr-1" />;
      default:
        return <AlertCircle className="h-4 w-4 mr-1" />;
    }
  };

  // Fungsi untuk mendapatkan kelas warna status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return "bg-blue-900/30 text-blue-400 border border-blue-900/50";
      case 'in_progress':
        return "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50";
      case 'closed':
        return "bg-green-900/30 text-green-400 border border-green-900/50";
      case 'on_hold':
        return "bg-red-900/30 text-red-400 border border-red-900/50";
      default:
        return "bg-gray-700/30 text-gray-400 border border-gray-700/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Manajemen Dukungan & Bantuan</h1>
        <p className="text-gray-300 mt-2">Kelola tiket dukungan dari pengguna</p>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              placeholder="Cari subjek, deskripsi, atau nama pengguna..."
              className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 rounded-md px-3 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/90 border-gray-700 text-gray-200">
                <SelectItem value="semua">Semua Status</SelectItem>
                <SelectItem value="open">Terbuka</SelectItem>
                <SelectItem value="in_progress">Dalam Proses</SelectItem>
                <SelectItem value="closed">Selesai</SelectItem>
                <SelectItem value="on_hold">Ditunda</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/90 border-gray-700 text-gray-200">
                <SelectItem value="semua">Semua Prioritas</SelectItem>
                <SelectItem value="low">Rendah</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
                <SelectItem value="critical">Kritis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card className="p-8 text-center bg-white/5 backdrop-blur-sm border border-gray-700/50">
            <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300">Tidak ada tiket dukungan</h3>
            <p className="text-gray-500">Tidak ditemukan tiket dukungan yang sesuai dengan filter Anda.</p>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className={`p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50 hover:bg-white/10 transition-all duration-200 ${
                ticket.status === "open" ? "border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-700/50 p-2 rounded-lg">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{ticket.profile?.full_name || 'Pengguna'}</h3>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        ticket.priority === "critical" 
                          ? "bg-red-900/30 text-red-400 border border-red-900/50" 
                          : ticket.priority === "high" 
                            ? "bg-orange-900/30 text-orange-400 border border-orange-900/50" 
                            : ticket.priority === "medium" 
                              ? "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50" 
                              : "bg-green-900/30 text-green-400 border border-green-900/50"
                      }`}
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center text-gray-400">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{ticket.profile?.email || 'Email tidak ditemukan'}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(ticket.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span>Terakhir diperbarui: {new Date(ticket.updated_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-1">Subjek:</h4>
                    <p className="text-white">{ticket.subject}</p>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-300 mb-1">Deskripsi:</h4>
                    <p className="text-gray-300 bg-gray-800/30 p-3 rounded-lg max-w-full overflow-x-auto">
                      {ticket.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 min-w-[150px]">
                  <Badge 
                    className={getStatusBadgeClass(ticket.status)}
                  >
                    {getStatusIcon(ticket.status)}
                    {ticket.status}
                  </Badge>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                    onClick={() => {
                      window.location.href = `/admin/support/${ticket.id}`;
                    }}
                  >
                    Detail
                  </Button>
                  
                  {ticket.status !== "closed" ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(ticket.id, "closed")}
                      className="border-green-600/50 text-green-400 hover:bg-green-600/20"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Selesaikan
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(ticket.id, "open")}
                      className="border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Buka Kembali
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {/* AlertDialog for confirmations */}
      <AlertDialog
        isOpen={alertDialogState.isOpen}
        title={alertDialogState.title}
        description={alertDialogState.description}
        onConfirm={() => {
          if (alertDialogState.onConfirm) alertDialogState.onConfirm();
          closeAlertDialog();
        }}
        onClose={closeAlertDialog}
        variant={alertDialogState.variant}
      />
      
      {/* AlertDialog for results/notifications */}
      <AlertDialogResult
        isOpen={alertResultState.isOpen}
        title={alertResultState.title}
        description={alertResultState.description}
        onClose={closeAlertResult}
      />
    </div>
  );
}