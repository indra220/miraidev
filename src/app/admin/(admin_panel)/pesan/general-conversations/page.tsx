"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConversationChat from "@/components/conversation-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, ArrowLeft, User } from "lucide-react";
import { useChatAuth } from "@/hooks/use-chat-auth";
import { createClient } from "@/lib/supabase/client";

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

export default function GeneralConversationPage() {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useChatAuth();
  const [isClient, setIsClient] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userList, setUserList] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Percakapan Umum | MiraiDev";
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
      } catch (error) {
        console.error("Error fetching user list:", error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Tunggu sampai auth state diketahui
  if (isLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Jika tidak login atau bukan admin, arahkan ke halaman utama
  if (!user || !isAdmin) {
    router.push("/beranda");
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Percakapan Umum</h1>
            <p className="text-gray-300 mt-2">Kelola percakapan dengan pengguna</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="border-gray-600 text-gray-300 hover:bg-gray-700/50 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
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
                      userList.map((conv) => (
                        <div 
                          key={conv.user_id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedUser === conv.user_id 
                              ? "bg-blue-100 border border-blue-300" 
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => setSelectedUser(conv.user_id)}
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium text-sm">{conv.profiles?.full_name || 'Pengguna Tak Dikenal'}</p>
                              <p className="text-xs text-gray-500 truncate">{conv.profiles?.email || 'Email tidak tersedia'}</p>
                            </div>
                          </div>
                        </div>
                      ))
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