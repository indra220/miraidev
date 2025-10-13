"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User } from "lucide-react";
import { useChatAuth } from "@/hooks/use-chat-auth";
import { createBrowserClient } from "@supabase/ssr";

interface Message {
  id: string;
  sender_id: string;
  sender_type: "user" | "admin";
  message: string;
  created_at: string;
  read_status: boolean;
  project_id?: string | null;
  sender_name?: string;
}

interface AdminRealtimeChatProps {
  projectId?: string; // Optional project ID for project-specific chats
  userId?: string; // Optional user ID to filter messages from specific user
}

export default function AdminRealtimeChat({ projectId, userId }: AdminRealtimeChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const selectedUser = userId || null;
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useChatAuth();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      let query = supabase
        .from("chat_messages")
        .select(`
          id,
          sender_id,
          sender_type,
          message,
          created_at,
          read_status,
          project_id,
          profiles!sender_id (full_name)
        `)
        .order("created_at", { ascending: true });

      // Filter by project if provided
      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      // Filter by specific user if provided
      if (userId) {
        query = query.or(`sender_id.eq.${userId},sender_id.eq.${user.id}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching messages:", error);
      } else if (data) {
        // Transform data to include sender_name
        const messagesWithNames = data.map((msg) => {
          const profile = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles;
          return {
            ...msg,
            sender_name: profile?.full_name || 'Pengguna'
          };
        });
        setMessages(messagesWithNames);
      }
    };

    fetchMessages();
  }, [user, projectId, userId, supabase]);

  // Set up realtime listener
  useEffect(() => {
    if (!user) return;

    // Subscribe to changes in chat_messages table
    const channel = supabase
      .channel("realtime-chat-admin")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_messages",
          filter: projectId ? `project_id=eq.${projectId}` : undefined,
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // Get sender name for new message
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.sender_id)
              .single();
            
            const messageWithSenderName: Message = {
              id: payload.new.id,
              sender_id: payload.new.sender_id,
              sender_type: payload.new.sender_type,
              message: payload.new.message,
              created_at: payload.new.created_at,
              read_status: payload.new.read_status,
              project_id: payload.new.project_id,
              sender_name: profileData?.full_name || 'Pengguna'
            };
            
            setMessages((prev) => [...prev, messageWithSenderName]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.new.id ? payload.new as Message : msg))
            );
          }
        }
      )
      .subscribe();

    // Update connection status
    setIsConnected(true);

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [user, projectId, userId, supabase]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !userId) return;

    // Prepare the new message
    const messageData = {
      project_id: projectId || null,
      sender_id: user.id,
      sender_type: "admin" as const,
      message: newMessage.trim(),
      read_status: false,
    };

    // Insert message to database
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
    } else if (data) {
      setMessages((prev) => [...prev, data as Message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            {projectId ? `Chat Proyek: ${projectId}` : "Chat Admin Umum"}
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          </div>
          {selectedUser && (
            <span className="text-sm text-gray-500">Pengguna: {selectedUser.substring(0, 8)}...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full p-4">
          <div ref={scrollAreaRef} className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-500">
                <Bot className="w-12 h-12 mb-3 text-gray-400" />
                <p>Belum ada pesan. Tunggu pesan dari pengguna atau mulai percakapan.</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_type === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_type === "admin"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {message.sender_type === "admin" ? (
                            <Bot className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">
                        {message.sender_type === "admin" 
                          ? "Admin" 
                          : (message.sender_name || "Pengguna")}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {new Date(message.created_at).toLocaleTimeString([], {
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
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Balas pesan..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}