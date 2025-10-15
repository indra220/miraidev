"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ConversationChat from "@/components/conversation-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, User, MoreVertical } from "lucide-react";
import { useChatAuth } from "@/hooks/use-chat-auth";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  };
}

export default function MessageManagement() {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useChatAuth();
  const [isClient, setIsClient] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userList, setUserList] = useState<Conversation[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memperbarui data percakapan
  const refreshData = useCallback(async () => {
    if (!user || !isAdmin) return; // hanya refresh jika user adalah admin
    
    setLoading(true);
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user_id,
          created_at,
          updated_at,
          profiles (full_name, email)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      setUserList(data as Conversation[]);
      
      // Ambil jumlah pesan unread untuk setiap pengguna
      const newUnreadCounts: Record<string, number> = {};
      const supabaseClient = createClient();
      
      for (const conv of data) {
        try {
          const { count, error, status } = await supabaseClient
            .from('conversation_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read_status', false)
            .neq('sender_id', user?.id); // Hanya pesan dari pengguna, bukan dari admin

          if (error) {
            // Jika error kosong, tampilkan informasi tambahan
            if (!error) {
              console.warn(`Received undefined/null error for user ${conv.user_id}, status: ${status}, count: ${count}`);
              newUnreadCounts[conv.user_id] = 0;
            } else {
              // Dalam kasus ini, mungkin tidak adanya pesan unread adalah kondisi normal
              // Kita hanya perlu mengatur jumlah unread ke 0 tanpa mencatat error
              newUnreadCounts[conv.user_id] = 0;
            }
          } else {
            newUnreadCounts[conv.user_id] = count || 0;
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error(`Exception fetching unread count for user ${conv.user_id}:`, errorMessage);
          newUnreadCounts[conv.user_id] = 0;
        }
      }
      
      setUnreadCounts(newUnreadCounts);
    } catch (error) {
      console.error("Error refreshing user list:", error);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]); // Tambahkan dependensi yang diperlukan

  // useEffect untuk memperbarui data saat komponen menerima fokus kembali
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshData]);

  useEffect(() => {
    document.title = "Manajemen Pesan | MiraiDev";
    setIsClient(true);
    
    // Ambil daftar pengguna yang memiliki percakapan
    const fetchUsers = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            id,
            user_id,
            created_at,
            updated_at,
            profiles (full_name, email)
          `)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        
        setUserList(data as Conversation[]);
        setLoading(false);
        
        // Ambil jumlah pesan unread untuk setiap pengguna
        fetchUnreadCounts(data as Conversation[]);
      } catch (error) {
        console.error("Error fetching user list:", error);
        setLoading(false);
      }
    };
    
    // Ambil jumlah pesan unread untuk setiap pengguna
    const fetchUnreadCounts = async (conversations: Conversation[]) => {
      const newUnreadCounts: Record<string, number> = {};
      const supabaseClient = createClient();
      
      for (const conv of conversations) {
        try {
          const { count, error, status } = await supabaseClient
            .from('conversation_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read_status', false)
            .neq('sender_id', user?.id); // Hanya pesan dari pengguna, bukan dari admin

          if (error) {
            // Jika error kosong, tampilkan informasi tambahan
            if (!error) {
              console.warn(`Received undefined/null error for user ${conv.user_id}, status: ${status}, count: ${count}`);
              newUnreadCounts[conv.user_id] = 0;
            } else {
              // Dalam kasus ini, mungkin tidak adanya pesan unread adalah kondisi normal
              // Kita hanya perlu mengatur jumlah unread ke 0 tanpa mencatat error
              newUnreadCounts[conv.user_id] = 0;
            }
          } else {
            newUnreadCounts[conv.user_id] = count || 0;
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          console.error(`Exception fetching unread count for user ${conv.user_id}:`, errorMessage);
          newUnreadCounts[conv.user_id] = 0;
        }
      }
      
      setUnreadCounts(newUnreadCounts);
    };
    
    fetchUsers();
  }, [user?.id, selectedUser, refreshData]); // Tambahkan refreshData sebagai dependensi agar data di-refresh saat pengguna dipilih

  // Jika tidak login atau bukan admin, arahkan ke halaman utama
  useEffect(() => {
    if (isClient && !isLoading && (!user || !isAdmin)) {
      router.push("/beranda");
    }
  }, [user, isAdmin, isClient, isLoading, router]);

  // Tunggu sampai auth state diketahui
  if (isLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus percakapan pengguna ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    try {
      const supabase = createClient();
      
      // Hapus percakapan pengguna
      const { error: convError } = await supabase
        .from('conversations')
        .delete()
        .eq('user_id', userId);
      
      if (convError) {
        console.error("Error deleting conversation:", convError);
        alert("Gagal menghapus percakapan pengguna. Silakan coba lagi.");
        return;
      }
      
      // Ambil ID percakapan untuk pengguna ini
      const { data: convData, error: convFetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      let msgError = null;
      if (convFetchError) {
        console.error("Error fetching conversation ID:", convFetchError);
        // Jika tidak bisa mendapatkan ID percakapan, lanjutkan saja
      } else if (convData?.id) {
        // Hapus pesan-pesan terkait percakapan ini
        const { error } = await supabase
          .from('conversation_messages')
          .delete()
          .eq('conversation_id', convData.id);
          
        msgError = error;
        if (msgError) {
          console.error("Error deleting messages:", msgError);
          // Jika penghapusan pesan gagal, itu tidak fatal, kita tetap lanjutkan
        }
      }
      
      // Perbarui daftar pengguna
      setUserList(prev => prev.filter(conv => conv.user_id !== userId));
      
      // Juga hapus jumlah pesan unread untuk pengguna ini
      setUnreadCounts(prev => {
        const newUnreadCounts = { ...prev };
        delete newUnreadCounts[userId];
        return newUnreadCounts;
      });
      
      // Jika pengguna yang dihapus adalah pengguna yang sedang dipilih, hapus pilihan
      if (selectedUser === userId) {
        setSelectedUser(null);
      }
      
      alert("Percakapan pengguna berhasil dihapus.");
    } catch (error) {
      console.error("Error in handleDeleteUser:", error);
      alert("Gagal menghapus percakapan pengguna. Silakan coba lagi.");
    }
  };

  // Fungsi untuk memperbarui jumlah pesan unread ketika percakapan dibuka
  const updateUnreadCount = (userId: string) => {
    setUnreadCounts(prev => {
      const newUnreadCounts = { ...prev };
      newUnreadCounts[userId] = 0; // Setel jumlah unread menjadi 0 ketika membuka percakapan
      return newUnreadCounts;
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-white">Manajemen Pesan</h1>
          <p className="text-gray-300 mt-2">Kelola percakapan dengan pengguna</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Percakapan Umum</CardTitle>
              <p className="text-gray-500">Kelola percakapan umum dengan pengguna</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Daftar Pengguna */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Daftar Pengguna
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {loading ? (
                      <p className="text-gray-500 text-sm">Memuat daftar pengguna...</p>
                    ) : userList.length === 0 ? (
                      <p className="text-gray-500 text-sm">Belum ada pengguna yang memiliki percakapan</p>
                    ) : (
                      userList.map((conv) => {
                        const unreadCount = unreadCounts[conv.user_id] || 0;
                        const displayCount = unreadCount > 99 ? '+99' : unreadCount > 0 ? unreadCount.toString() : '';
                        
                        return (
                          <div 
                            key={conv.user_id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors group relative ${
                              selectedUser === conv.user_id 
                                ? "bg-blue-100 border border-blue-300" 
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div 
                                className="flex-1 min-w-0"
                                onClick={() => {
                                  setSelectedUser(conv.user_id);
                                  updateUnreadCount(conv.user_id);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-sm truncate">{conv.profiles?.full_name || 'Pengguna Tak Dikenal'}</p>
                                      {displayCount && (
                                        <Badge variant="destructive" className="h-5 w-5 p-0 rounded-full flex items-center justify-center text-xs">
                                          {unreadCount > 99 ? '+99' : unreadCount}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{conv.profiles?.email || 'Email tidak tersedia'}</p>
                                  </div>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteUser(conv.user_id);
                                    }}
                                    className="text-red-600"
                                  >
                                    Hapus Percakapan
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Area Chat */}
            <div className="lg:col-span-3">
              {selectedUser ? (
                <ConversationChat isAdmin={true} userId={selectedUser} />
              ) : (
                <Card className="flex items-center justify-center h-[500px]">
                  <div className="text-center p-6">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Pilih pengguna untuk memulai chat</h3>
                    <p className="text-gray-500">Pilih salah satu pengguna dari daftar di samping untuk memulai percakapan</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}