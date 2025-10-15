"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { dashboardService } from "@/lib/dashboard-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, User, Bot } from "lucide-react";

interface ChatMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderType: "user" | "admin";
  message: string;
  timestamp: string;
  isOwnMessage: boolean;
}

interface ProjectChatProps {
  projectId: string;
}

export function ProjectChat({ projectId }: ProjectChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Ambil pesan dari database
  const fetchMessages = useCallback(async () => {
    if (!user) return;

    try {
      // Ambil pesan terbaru terlebih dahulu (batasi jumlahnya untuk performa)
      const messagesData = await dashboardService.getProjectChatMessages(projectId, user.id, 50);
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId, user]);

  // Kirim pesan baru
  const sendMessage = async () => {
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);

    try {
      const supabase = createClient();
      
      // Tentukan tipe pengirim berdasarkan role pengguna
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error getting user role:", profileError);
        return;
      }

      const senderType = profileData.role === "admin" || profileData.role === "super_admin" 
        ? "admin" 
        : "user";

      const { error } = await supabase
        .from("chat_messages")
        .insert([
          {
            project_id: projectId,
            sender_id: user.id,
            sender_type: senderType,
            message: newMessage.trim(),
          },
        ]);

      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      // Tambahkan pesan baru langsung ke state tanpa perlu mengambil ulang dari database
      const newMessageData: ChatMessage = {
        id: Date.now().toString(), // ID sementara, akan diganti saat diterima dari realtime
        projectId: projectId,
        senderId: user.id,
        senderType: "user", // Karena ini dari user
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isOwnMessage: true
      };
      
      // Tambahkan pesan sementara ke daftar
      setMessages(prev => [...prev, newMessageData]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Ambil pesan saat komponen dimuat
  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel(`chat-messages-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          // Cek apakah pesan sudah ada (untuk mencegah duplikasi)
          const messageExists = messages.some(msg => msg.id === payload.new.id);
          
          if (!messageExists) {
            const newMessageData: ChatMessage = {
              id: payload.new.id,
              projectId: payload.new.project_id,
              senderId: payload.new.sender_id,
              senderType: payload.new.sender_type,
              message: payload.new.message,
              timestamp: payload.new.created_at,
              isOwnMessage: user?.id ? payload.new.sender_id === user.id : false
            };
            setMessages((prev) => [...prev, newMessageData]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, user, fetchMessages, messages]);

  // Scroll ke bawah saat pesan baru masuk
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat pesan...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Chat Proyek</span>
          <Badge variant="outline">
            {messages.length} {messages.length === 1 ? "pesan" : "pesan"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[400px]">
          <ScrollArea className="flex-grow mb-4 p-2" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Belum ada pesan dalam percakapan ini.
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isOwnMessage
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isOwnMessage
                          ? "bg-green-100 dark:bg-green-900 rounded-br-none"
                          : "bg-blue-100 dark:bg-blue-900 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.isOwnMessage ? (
                          <User className="h-4 w-4 mr-2" />
                        ) : (
                          <Bot className="h-4 w-4 mr-2" />
                        )}
                        <span className="text-xs font-medium">
                          {message.isOwnMessage ? "Anda" : "Admin"}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {new Date(message.timestamp).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan Anda..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={sending}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              size="sm"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}