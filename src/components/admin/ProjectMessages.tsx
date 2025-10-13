"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, User, Bot } from "lucide-react";
import { contactAdminService } from "@/lib/admin-service";
import { LoadingSpinner } from "@/components/loading-spinner";

interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id: string;
  sender_type: "user" | "admin";
  message: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
}

interface ProjectMessagesProps {
  projectId: string;
  projectName: string;
  userId: string;
  userEmail: string;
}

export function ProjectMessages({ projectId, projectName, userId, userEmail }: ProjectMessagesProps) {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Ambil pesan proyek
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contactAdminService.getProjectMessages(projectId);
      // Struktur data dari API adalah { project, user, messages }
      setMessages(data?.messages || []);
    } catch (error) {
      console.error("Error fetching project messages:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Kirim pesan baru
  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      const result = await contactAdminService.sendProjectMessage(
        projectId,
        newMessage.trim(),
        userId
      );
      
      // Tambahkan pesan baru ke daftar
      setMessages(prev => [
        ...prev,
        {
          ...result.data,
          profiles: {
            full_name: result.data.profiles?.full_name || null,
            email: result.data.profiles?.email || null
          }
        }
      ]);
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending project message:", error);
    } finally {
      setSending(false);
    }
  };

  // Ambil pesan saat komponen dimuat
  useEffect(() => {
    fetchMessages();
  }, [projectId, fetchMessages]);

  // Scroll ke bawah saat pesan baru masuk
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pesan Proyek: {projectName}</span>
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
                  Belum ada pesan untuk proyek ini.
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_type === "user"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender_type === "user"
                          ? "bg-blue-100 dark:bg-blue-900 rounded-bl-none"
                          : "bg-green-100 dark:bg-green-900 rounded-br-none"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender_type === "user" ? (
                          <User className="h-4 w-4 mr-2" />
                        ) : (
                          <Bot className="h-4 w-4 mr-2" />
                        )}
                        <span className="text-xs font-medium">
                          {message.sender_type === "user" 
                            ? (message.profiles?.full_name || userEmail.split('@')[0] || 'Pengguna') 
                            : "Admin"}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {new Date(message.created_at).toLocaleTimeString("id-ID", {
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