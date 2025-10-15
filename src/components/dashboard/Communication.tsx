"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserIcon,
  CalendarIcon,
  MessageSquare 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  dashboardService, 
  DashboardMessage, 
  DashboardConversation 
} from "@/lib/dashboard-service";
import { ProjectChat } from "./ProjectChat";

export function Communication() {
  const [messages, setMessages] = useState<DashboardMessage[]>([]);
  const [conversations, setConversations] = useState<DashboardConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    const fetchCommunication = async () => {
      if (user) {
        try {
          const commData = await dashboardService.getDashboardData(user.id);
          setMessages(commData.messages);
          setConversations(commData.conversations);
        } catch (error) {
          console.error("Error fetching communication data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCommunication();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data komunikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Komunikasi & Notifikasi</h2>
        <p className="text-sm text-muted-foreground">Pesan dan notifikasi terkait proyek Anda</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pesan Terbaru</span>
              <Button size="sm" variant="outline">Lihat Semua</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg ${!message.read ? 'bg-blue-50 dark:bg-blue-950' : 'bg-muted'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium">{message.sender}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(message.date).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  <h3 className="font-medium mt-2">{message.subject}</h3>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Tidak ada pesan baru
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Forum Diskusi Proyek</span>
              <Button size="sm" variant="outline">Lihat Semua</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div key={conversation.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{conversation.project}</h3>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      {conversation.participants} peserta
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{conversation.lastMessage}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">{conversation.lastActivity}</span>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Tidak ada forum diskusi aktif
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bagian untuk obrolan proyek spesifik */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Obrolan Proyek
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Pilih proyek untuk memulai percakapan
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div key={`chat-${conversation.id}`} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">{conversation.project}</h3>
                  <ProjectChat projectId={conversation.id} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Tidak ada proyek aktif untuk obrolan
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}