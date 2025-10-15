"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  User, 
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  Reply,
  Edit,
  Save,
  X,
  Bot
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AlertDialog, AlertDialogResult } from "@/components/AlertDialog";
import { useDialog } from "@/hooks/useDialog";
import { useAuth } from "@/hooks/useAuth";

// Interface untuk ticket dukungan
interface SupportTicket {
  id: string;
  user_id: string;
  project_id: string | null;
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
  project?: {
    title: string;
  };
}

// Interface untuk balasan tiket dukungan
interface SupportReply {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
  sender_name?: string;
}

export default function SupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { 
    alertDialogState, 
    closeAlertDialog,
    alertResultState,
    showAlertResult,
    closeAlertResult
  } = useDialog();
  
  const { user } = useAuth();
  
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [replies, setReplies] = useState<SupportReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<SupportTicket> | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    document.title = "Detail Tiket Dukungan | MiraiDev";
  }, []);

  useEffect(() => {
    const fetchTicketAndReplies = async () => {
      try {
        const resolvedParams = await params;
        const supabase = createClient();
        
        // Ambil data tiket dukungan
        const { data: ticketData, error: ticketError } = await supabase
          .from('support_tickets')
          .select(`
            *,
            profiles (full_name, email),
            projects (title)
          `)
          .eq('id', resolvedParams.id)
          .single();

        if (ticketError) {
          throw new Error(ticketError.message);
        }

        // Format data dengan informasi profil dan proyek
        const formattedTicket: SupportTicket = {
          ...ticketData,
          profile: ticketData.profiles,
          project: ticketData.projects
        };

        setTicket(formattedTicket);
        setEditData({
          subject: formattedTicket.subject,
          description: formattedTicket.description,
          status: formattedTicket.status,
          priority: formattedTicket.priority
        });
        
        // Ambil data balasan dari tabel support_ticket_replies
        const { data: repliesData, error: repliesError } = await supabase
          .from('support_ticket_replies')
          .select(`
            *,
            profiles (full_name)
          `)
          .eq('ticket_id', ticketData.id)
          .order('created_at', { ascending: true });

        if (repliesError) {
          console.error('Error fetching replies:', repliesError);
          // Tetap lanjutkan meskipun ada error pada replies
        } else {
          const formattedReplies: SupportReply[] = repliesData.map(reply => ({
            ...reply,
            sender_name: reply.profiles?.full_name || (reply.sender_type === 'user' ? 'Pengguna' : 'Admin')
          }));
          setReplies(formattedReplies);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching support ticket:', err);
        setError('Gagal mengambil data tiket dukungan. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchTicketAndReplies();
  }, [params]);

  // Subscription realtime untuk balasan tiket dukungan
  useEffect(() => {
    if (!ticket?.id) return;

    const supabase = createClient();
    
    // Subscribe ke perubahan tabel support_ticket_replies
    const channel = supabase
      .channel(`support-ticket-replies:${ticket.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_ticket_replies',
          filter: `ticket_id=eq.${ticket.id}`
        },
        (payload) => {
          // Tambahkan balasan baru ke daftar
          const newReply: SupportReply = {
            id: payload.new.id,
            ticket_id: payload.new.ticket_id,
            sender_id: payload.new.sender_id,
            sender_type: payload.new.sender_type,
            message: payload.new.message,
            created_at: payload.new.created_at,
            sender_name: payload.new.sender_type === 'user' ? 'Pengguna' : 'Admin'
          };
          
          setReplies(prev => [...prev, newReply]);
        }
      )
      .subscribe();

    // Cleanup subscription saat komponen unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [ticket?.id]);

  const handleStatusChange = async (newStatus: 'open' | 'in_progress' | 'closed' | 'on_hold') => {
    if (!ticket) return;
    
    try {
      const supabase = createClient();
      
      const { data: updatedTicket, error } = await supabase
        .from('support_tickets')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', ticket.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setTicket({ ...ticket, ...updatedTicket });
      showAlertResult("Berhasil", `Status tiket berhasil diperbarui menjadi ${newStatus}.`);
    } catch (err) {
      console.error('Error updating ticket status:', err);
      showAlertResult("Gagal", "Gagal memperbarui status tiket. Silakan coba lagi.");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Kembali ke data asli jika batal edit
      if (ticket) {
        setEditData({
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editData) {
      setEditData({
        ...editData,
        [name]: value
      });
    }
  };

  const handleSave = async () => {
    if (!ticket || !editData) return;
    
    try {
      const supabase = createClient();
      
      const { data: updatedTicket, error } = await supabase
        .from('support_tickets')
        .update({ 
          subject: editData.subject,
          description: editData.description,
          status: editData.status,
          priority: editData.priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticket.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setTicket({ ...ticket, ...updatedTicket });
      setIsEditing(false);
      showAlertResult("Berhasil", "Tiket dukungan berhasil diperbarui.");
    } catch (err) {
      console.error('Error updating ticket:', err);
      showAlertResult("Gagal", "Gagal memperbarui tiket dukungan. Silakan coba lagi.");
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      showAlertResult("Gagal", "Pesan balasan tidak boleh kosong.");
      return;
    }

    if (!ticket || !user) {
      showAlertResult("Gagal", "Tidak dapat mengirim balasan. Silakan coba lagi.");
      return;
    }

    setReplyLoading(true);
    
    try {
      const supabase = createClient();

      // Kirim balasan ke tabel support_ticket_replies
      const { error: replyError } = await supabase
        .from('support_ticket_replies')
        .insert([{
          ticket_id: ticket.id,
          sender_id: user?.id || '',
          sender_type: 'admin',
          message: replyMessage,
        }]);

      if (replyError) {
        throw new Error(replyError.message);
      }

      // Balasan baru akan muncul secara otomatis melalui subscription realtime
      setReplyMessage("");
      showAlertResult("Berhasil", "Balasan telah dikirim ke pengguna.");
    } catch (err) {
      console.error('Error sending reply:', err);
      showAlertResult("Gagal", "Gagal mengirim balasan. Silakan coba lagi.");
    } finally {
      setReplyLoading(false);
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
        <h1 className="text-3xl font-bold text-white">Detail Tiket Dukungan</h1>
        <div className="mt-6 p-6 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
          <p className="text-red-300">{error}</p>
          <Button 
            className="mt-4 bg-red-700 hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Detail Tiket Dukungan</h1>
        <div className="mt-6 p-6 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
          <p className="text-red-300">Tiket dukungan tidak ditemukan.</p>
        </div>
      </div>
    );
  }

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Detail Tiket Dukungan</h1>
            <p className="text-gray-300 mt-2">ID: {ticket.id}</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
            onClick={handleEditToggle}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informasi Pengguna */}
        <Card className="lg:col-span-1 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <User className="mr-2 h-5 w-5 text-blue-400" />
              Informasi Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-500 mb-2" />
              <h3 className="text-lg font-bold text-white">{ticket.profile?.full_name || 'Pengguna'}</h3>
              <p className="text-gray-400">{ticket.profile?.email || 'Email tidak ditemukan'}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-300">ID: {ticket.user_id}</span>
              </div>
              
              {ticket.project && (
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-300">Proyek: {ticket.project.title}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detail Tiket */}
        <Card className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-blue-400" />
                Detail Tiket
              </div>
              <Badge className={getStatusBadgeClass(ticket.status)}>
                {getStatusIcon(ticket.status)}
                {ticket.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="subject" className="text-gray-300">Subjek</Label>
                {isEditing ? (
                  <Input
                    id="subject"
                    name="subject"
                    value={editData?.subject || ""}
                    onChange={handleInputChange}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 mt-1"
                  />
                ) : (
                  <p className="text-gray-300 mt-1">{ticket.subject}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="priority" className="text-gray-300">Prioritas</Label>
                {isEditing ? (
                  <select
                    id="priority"
                    name="priority"
                    value={editData?.priority || "medium"}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 rounded-md px-3 py-2 mt-1"
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                    <option value="critical">Kritis</option>
                  </select>
                ) : (
                  <div className="mt-1">
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
                )}
              </div>
              
              <div>
                <Label className="text-gray-300">Tanggal Dibuat</Label>
                <p className="text-gray-300 mt-1">{new Date(ticket.created_at).toLocaleString('id-ID')}</p>
              </div>
              
              <div>
                <Label className="text-gray-300">Tanggal Diperbarui</Label>
                <p className="text-gray-300 mt-1">{ticket.updated_at ? new Date(ticket.updated_at).toLocaleString('id-ID') : '-'}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="description" className="text-gray-300">Deskripsi</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  name="description"
                  value={editData?.description || ""}
                  onChange={handleInputChange}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 mt-1"
                  rows={6}
                />
              ) : (
                <div className="mt-1 p-3 bg-gray-800/30 rounded-lg text-gray-300">
                  {ticket.description}
                </div>
              )}
            </div>
            
            {isEditing && (
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleEditToggle}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Batal
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={handleSave}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Perubahan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bagian Chat/Balasan */}
      <Card className="bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <MessageCircle className="mr-2 h-5 w-5 text-blue-400" />
            Percakapan Tiket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {replies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Belum ada percakapan. Kirim pesan pertama Anda!
              </div>
            ) : (
              replies.map((reply) => (
                <div 
                  key={reply.id} 
                  className={`p-4 rounded-lg ${
                    reply.sender_type === 'admin' 
                      ? 'bg-blue-900/20 border border-blue-700/50 ml-10' 
                      : 'bg-gray-700/20 border border-gray-600/50 mr-10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        {reply.sender_type === 'admin' ? (
                          <Bot className="h-4 w-4 text-blue-400 mr-2" />
                        ) : (
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                        )}
                        <span className="font-medium text-white">
                          {reply.sender_type === 'admin' ? 'Anda (Admin)' : reply.sender_name || 'Pengguna'}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-2">{reply.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.created_at).toLocaleString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reply" className="text-gray-300">Balas Tiket</Label>
              <Textarea
                id="reply"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Tulis balasan untuk pengguna..."
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 mt-1"
                rows={4}
              />
            </div>
            <div className="flex justify-end">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={handleReply}
                disabled={replyLoading}
              >
                {replyLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Reply className="mr-2 h-4 w-4" />
                    Kirim Balasan
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tombol Aksi Status */}
      <Card className="bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Ubah Status Tiket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ticket.status !== 'open' && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange('open')}
                className="border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Buka Kembali
              </Button>
            )}
            {ticket.status !== 'in_progress' && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange('in_progress')}
                className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
              >
                <Clock className="mr-2 h-4 w-4" />
                Dalam Proses
              </Button>
            )}
            {ticket.status !== 'closed' && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange('closed')}
                className="border-green-600/50 text-green-400 hover:bg-green-600/20"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Selesaikan
              </Button>
            )}
            {ticket.status !== 'on_hold' && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange('on_hold')}
                className="border-red-600/50 text-red-400 hover:bg-red-600/20"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Tunda
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
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