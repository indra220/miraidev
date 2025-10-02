"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserIcon,
  CalendarIcon 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  dashboardService, 
  DashboardMessage, 
  DashboardConversation 
} from "@/lib/dashboard-service";

export function Communication() {
  const [messages, setMessages] = useState<DashboardMessage[]>([]);
  const [conversations, setConversations] = useState<DashboardConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Jika auth masih loading, jangan lanjutkan
    
    const fetchCommunication = async () => {
      if (session?.user) {
        try {
          const commData = await dashboardService.getDashboardData(session.user.id);
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
  }, [session, authLoading]);

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
            <CardTitle>Forum Diskusi Proyek</CardTitle>
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
                    <Button size="sm">Gabung</Button>
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
    </div>
  );
}