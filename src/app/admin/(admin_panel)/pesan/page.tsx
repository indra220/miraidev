// src/app/admin/(admin_panel)/pesan/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminConversationChat from "@/components/admin-conversation-chat";
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
  useEffect(() => {
    document.title = "Manajemen Pesan";
  }, []);

  const router = useRouter();
  const { user, isLoading, isAdmin } = useChatAuth();
  const [isClient, setIsClient] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userList, setUserList] = useState<Conversation[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  const currentUserId = user?.id;

  const refreshData = useCallback(async () => {
    if (!currentUserId || !isAdmin) return;
    
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
      
      const newUnreadCounts: Record<string, number> = {};
      const supabaseClient = createClient();
      
      for (const conv of data) {
        try {
          const { count, error: countError } = await supabaseClient
            .from('conversation_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('read_status', false)
            .neq('sender_id', currentUserId);

          if (countError && countError.code !== 'PGRST116') {
             console.error(`Error fetching unread count for user ${conv.user_id}:`, countError);
             newUnreadCounts[conv.user_id] = 0;
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
  }, [currentUserId, isAdmin]);

  useEffect(() => {
    setIsClient(true);
    if(currentUserId && isAdmin) {
      refreshData();
    }
  }, [currentUserId, isAdmin, refreshData]);

  useEffect(() => {
    if (isClient && !isLoading && (!user || !isAdmin)) {
      router.push("/beranda");
    }
  }, [user, isAdmin, isClient, isLoading, router]);

  const updateUnreadCount = async (userId: string) => {
    if (!currentUserId) return;
    const supabase = createClient();
    
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (convError) {
      console.error('Error fetching conversation ID:', convError);
    } else {
      const { error: updateError } = await supabase
        .from('conversation_messages')
        .update({ read_status: true })
        .eq('conversation_id', conversation.id)
        .eq('read_status', false)
        .neq('sender_id', currentUserId);
      
      if (updateError) {
        console.error('Error updating read status:', updateError);
      }
    }
    
    setUnreadCounts(prev => ({ ...prev, [userId]: 0 }));
  };

  if (isLoading || !isClient || !user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus percakapan pengguna ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    try {
      const supabase = createClient();
      
      const { data: convData } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (convData) {
        await supabase
          .from('conversation_messages')
          .delete()
          .eq('conversation_id', convData.id);
      }
      
      await supabase
        .from('conversations')
        .delete()
        .eq('user_id', userId);
      
      await refreshData();
      
      if (selectedUser === userId) {
        setSelectedUser(null);
      }
      
      alert("Percakapan pengguna berhasil dihapus.");
    } catch (error) {
      console.error("Error in handleDeleteUser:", error);
      alert("Gagal menghapus percakapan pengguna. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Manajemen Pesan</h1>
          <p className="text-gray-300 mt-2">Kelola percakapan dengan pengguna</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Daftar Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2">
            {loading ? (
              <p className="text-gray-500 text-sm">Memuat daftar pengguna...</p>
            ) : userList.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada pengguna yang memiliki percakapan</p>
            ) : (
              <div className="space-y-2">
                {userList.map((conv) => {
                  const unreadCount = unreadCounts[conv.user_id] || 0;
                  return (
                    <div 
                      key={conv.user_id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors group relative ${
                        selectedUser === conv.user_id 
                          ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex-1 min-w-0"
                          onClick={async () => {
                            setSelectedUser(conv.user_id);
                            if (unreadCount > 0) {
                              await updateUnreadCount(conv.user_id);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">{conv.profiles?.full_name || 'Pengguna Tak Dikenal'}</p>
                                {unreadCount > 0 && (
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
                              className="text-red-600 focus:text-red-600 focus:bg-red-500/10"
                            >
                              Hapus Percakapan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3 min-h-0">
          {selectedUser ? (
            <AdminConversationChat isAdmin={true} userId={selectedUser} />
          ) : (
            <Card className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-1">Pilih pengguna untuk memulai chat</h3>
                <p className="text-gray-500 dark:text-gray-400">Pilih salah satu pengguna dari daftar di samping untuk memulai percakapan</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}