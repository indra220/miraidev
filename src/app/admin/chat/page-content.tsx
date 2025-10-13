"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ConversationChat from "@/components/conversation-chat";
import ProjectConversationChat from "@/components/project-conversation-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, ArrowLeft, User, FolderOpen } from "lucide-react";
import { useChatAuth } from "@/hooks/use-chat-auth";
import { createClient } from "@/lib/supabase/client";

export default function AdminChatPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, isAdmin } = useChatAuth();
  const [isClient, setIsClient] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userList, setUserList] = useState<{id: string, name: string, email: string}[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<{id: string, title: string, user_id: string} | null>(null);

  // Ambil projectId dari query parameter
  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      setSelectedProjectId(projectId);
      // Ambil data proyek
      fetchProjectData(projectId);
    }
  }, [searchParams]);

  // Ambil data proyek berdasarkan ID
  const fetchProjectData = async (projectId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, user_id')
        .eq('id', projectId)
        .single();
        
      if (error) throw error;
      
      setProject(data as {id: string, title: string, user_id: string});
      // Pilih pengguna terkait proyek
      setSelectedUser(data.user_id);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    
    // Ambil daftar pengguna yang memiliki percakapan
    const fetchUsers = async () => {
      try {
        const supabase = createClient();
        
        // Ambil daftar percakapan unik berdasarkan pengguna
        const { data: conversations, error } = await supabase
          .from('conversations')
          .select(`
            user_id,
            profiles (full_name, email)
          `);
        
        if (error) throw error;
        
        if (conversations) {
          const formattedUsers = conversations.map((conv) => {
            const profile = Array.isArray(conv.profiles) ? conv.profiles[0] : conv.profiles;
            return {
              id: conv.user_id,
              name: profile?.full_name || 'Pengguna Tak Dikenal',
              email: profile?.email || 'Email tidak tersedia'
            };
          });
          setUserList(formattedUsers);
        }
      } catch (error) {
        console.error("Error fetching user list:", error);
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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {selectedProjectId ? `Chat Proyek: ${project?.title || 'Memuat...'}` : 'Admin Chat Dashboard'}
                </CardTitle>
                <p className="text-gray-500">
                  {selectedProjectId 
                    ? 'Percakapan langsung dengan klien terkait proyek ini' 
                    : 'Kelola percakapan umum dengan pengguna'}
                </p>
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
                      {selectedProjectId ? (
                        <>
                          <FolderOpen className="w-5 h-5" />
                          Detail Proyek
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5" />
                          Daftar Pengguna
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedProjectId ? (
                      // Tampilkan detail proyek jika ada projectId
                      project ? (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Nama Proyek</h4>
                            <p className="text-sm">{project.title}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Klien</h4>
                            <p className="text-sm">
                              {userList.find(u => u.id === project.user_id)?.name || 'Memuat...'}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full mt-4"
                            onClick={() => {
                              // Hapus parameter query projectId dan reset tampilan
                              router.push('/admin/chat');
                              setSelectedProjectId(null);
                              setProject(null);
                              setSelectedUser(null);
                            }}
                          >
                            Kembali ke Daftar Umum
                          </Button>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Memuat detail proyek...</p>
                      )
                    ) : (
                      // Tampilkan daftar pengguna jika tidak ada projectId
                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {userList.length === 0 ? (
                          <p className="text-gray-500 text-sm">Belum ada pengguna yang memiliki percakapan</p>
                        ) : (
                          userList.map((user) => (
                            <div 
                              key={user.id}
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedUser === user.id 
                                  ? "bg-blue-100 border border-blue-300" 
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                              onClick={() => setSelectedUser(user.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <User className="w-8 h-8 text-gray-500 rounded-full p-1 bg-gray-200" />
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{user.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Area Chat */}
              <div className="lg:col-span-3">
                {selectedProjectId ? (
                  // Tampilkan chat proyek jika ada projectId
                  project ? (
                    <ProjectConversationChat 
                      projectId={project.id} 
                      isAdmin={true} 
                      userId={project.user_id} 
                    />
                  ) : (
                    <Card className="flex items-center justify-center h-[500px]">
                      <div className="text-center p-6">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Memuat percakapan proyek...</h3>
                        <p className="text-gray-500">Detail proyek dan percakapan akan segera muncul</p>
                      </div>
                    </Card>
                  )
                ) : (
                  // Tampilkan chat umum jika tidak ada projectId
                  selectedUser ? (
                    <ConversationChat isAdmin={true} userId={selectedUser} />
                  ) : (
                    <Card className="flex items-center justify-center h-[500px]">
                      <div className="text-center p-6">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Pilih pengguna untuk memulai chat</h3>
                        <p className="text-gray-500">Pilih salah satu pengguna dari daftar di samping untuk memulai percakapan</p>
                        
                        {/* Tampilkan beberapa contoh pengguna jika daftar kosong */}
                        {userList.length === 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm text-gray-600">Belum ada pengguna yang pernah mengirim pesan.</p>
                            <p className="text-xs text-gray-500">Percakapan akan muncul di sini setelah pengguna mengirim pesan pertama mereka.</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}