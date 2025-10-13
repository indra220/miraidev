"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ProjectConversationChat from "@/components/project-conversation-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useChatAuth } from "@/hooks/use-chat-auth";
import { createClient } from "@/lib/supabase/client";

interface Project {
  id: string;
  title: string;
  user_id: string;
}

export default function AdminProjectChatPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { user, isLoading, isAdmin } = useChatAuth();
  const [isClient, setIsClient] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    
    // Ambil data proyek
    const fetchProject = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, user_id')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        setProject(data as Project);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
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
                <CardTitle className="text-2xl">Chat Proyek: {project?.title || 'Memuat...'}</CardTitle>
                <p className="text-gray-500">Percakapan langsung dengan klien terkait proyek ini</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {project ? (
              <ProjectConversationChat 
                projectId={project.id} 
                isAdmin={true} 
                userId={project.user_id} 
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Proyek tidak ditemukan
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}