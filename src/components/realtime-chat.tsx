"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, Users, MoreVertical, FolderOpen, X } from "lucide-react";
import { useChatAuth } from "@/hooks/use-chat-auth";
import { createBrowserClient } from "@supabase/ssr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender_id: string;
  sender_type: "user" | "admin";
  message: string;
  created_at: string;
  read_status: boolean;
  sender_name?: string;
  linked_project_id?: string | null; // Added for linking messages to projects
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

interface RealtimeChatProps {
  projectId?: string; // Optional project ID for project-specific chats
}

export default function RealtimeChat({ projectId }: RealtimeChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; message: Message | null; x: number; y: number }>({
    visible: false,
    message: null,
    x: 0,
    y: 0,
  });
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [mobileContextMenu, setMobileContextMenu] = useState<{ visible: boolean; message: Message | null }>({
    visible: false,
    message: null,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [stagedProjectId, setStagedProjectId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin } = useChatAuth();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      let query;
      
      // Determine if we're dealing with project-specific chat or general chat
      if (projectId) {
        // Project-specific chat
        query = supabase
          .from("chat_messages")
          .select(`
            id,
            sender_id,
            sender_type,
            message,
            created_at,
            read_status,
            profiles!sender_id (full_name, role)
          `)
          .eq("project_id", projectId)
          .order("created_at", { ascending: true })
          .limit(100); // Batasi jumlah pesan yang diambil
      } else {
        // General conversation chat - using conversation_messages table
        const { data: convData } = await supabase
          .from('conversations')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (convData?.id) {
          query = supabase
            .from("conversation_messages")
            .select(`
              id,
              sender_id,
              message,
              linked_project_id,
              created_at,
              read_status,
              profiles!sender_id (full_name, role)
            `)
            .eq("conversation_id", convData.id)
            .order("created_at", { ascending: true })
            .limit(100); // Batasi jumlah pesan yang diambil
        }
      }

      if (query) {
        const { data, error } = await query;

        if (error) {
          console.error("Error fetching messages:", error);
        } else if (data) {
          // Transform data to include sender_name and normalize structure
          const messagesWithNames = data.map((msg) => {
            const profile = Array.isArray(msg.profiles) ? msg.profiles[0] : msg.profiles;
            
            // Determine sender_type based on available fields and user role
            let determinedSenderType: "user" | "admin";
            
            if ('sender_type' in msg) {
              // For project-specific chat, use sender_type from database
              determinedSenderType = msg.sender_type;
            } else {
              // For general conversation, determine based on user's role in profiles table
              determinedSenderType = profile?.role === 'admin' ? 'admin' : 'user';
            }
            
            return {
              id: msg.id,
              sender_id: msg.sender_id,
              sender_type: determinedSenderType,
              message: msg.message,
              linked_project_id: 'linked_project_id' in msg ? msg.linked_project_id : undefined,
              created_at: msg.created_at,
              read_status: msg.read_status,
              sender_name: profile?.full_name || 'Pengguna'
            };
          });
          setMessages(messagesWithNames);
        }
      }
    };

    fetchMessages();
  }, [user, projectId, supabase]);

  // Fetch user's projects
  useEffect(() => {
    if (!user || projectId) return; // Only fetch projects for general conversation, not project-specific chat

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else if (data) {
        setProjects(data as Project[]);
      }
    };

    fetchProjects();
  }, [user, projectId, supabase]);

  // Set up realtime listener
  useEffect(() => {
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any;
    
    if (projectId) {
      // Subscribe to changes in chat_messages table for project-specific chat
      channel = supabase
        .channel("realtime-chat-project")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "chat_messages",
            filter: `project_id=eq.${projectId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              // For new messages, we'll add them with a temporary sender name
              // The actual name will be fetched separately if needed
              const messageWithSenderName: Message = {
                id: payload.new.id,
                sender_id: payload.new.sender_id,
                sender_type: payload.new.sender_type,
                message: payload.new.message,
                created_at: payload.new.created_at,
                read_status: payload.new.read_status,
                sender_name: 'Mengambil nama...' // Temporary name
              };
              
              setMessages((prev) => [...prev, messageWithSenderName]);
              
              // Fetch sender name and role separately to avoid blocking the UI
              // We'll update the message with the correct name and type after fetching
              supabase
                .from('profiles')
                .select('full_name, role')
                .eq('id', payload.new.sender_id)
                .single()
                .then(({ data, error }) => {
                  if (!error && data) {
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === payload.new.id 
                          ? { 
                              ...msg, 
                              sender_type: data.role === 'admin' ? 'admin' : 'user',
                              sender_name: data.full_name || 'Pengguna' 
                            } 
                          : msg
                      )
                    );
                  } else {
                    // If we can't get the profile with full details, fetch the role separately to determine sender_type
                    supabase
                      .from('profiles')
                      .select('role')
                      .eq('id', payload.new.sender_id)
                      .single()
                      .then(({ data: roleData, error: roleError }) => {
                        if (!roleError && roleData) {
                          // Update the message with correct sender_type based on role
                          setMessages(prev => 
                            prev.map(msg => 
                              msg.id === payload.new.id 
                                ? { 
                                    ...msg, 
                                    sender_type: roleData.role === 'admin' ? 'admin' : 'user',
                                    sender_name: 'Pengguna' 
                                  } 
                                : msg
                            )
                          );
                        } else {
                          // If we still can't determine the role, keep the original sender_type from payload
                          setMessages(prev => 
                            prev.map(msg => 
                              msg.id === payload.new.id 
                                ? { ...msg, sender_name: 'Pengguna' } 
                                : msg
                            )
                          );
                        }
                      });
                  }
                });
            } else if (payload.eventType === "UPDATE") {
              // For updates, we also need to verify the sender's role if needed
              const updatedMessage = payload.new as Message;
              
              // Check if we need to fetch the sender's role (for cases where sender_type might be incorrect)
              if (!('sender_type' in updatedMessage) || updatedMessage.sender_type === 'admin' && updatedMessage.sender_id !== user?.id) {
                // Fetch the sender's role to confirm if it's actually an admin
                supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', updatedMessage.sender_id)
                  .single()
                  .then(({ data, error }) => {
                    if (!error && data) {
                      // Update the message with correct sender_type
                      setMessages(prev => 
                        prev.map(msg => 
                          msg.id === updatedMessage.id 
                            ? { ...msg, sender_type: data.role === 'admin' ? 'admin' : 'user' } 
                            : msg
                        )
                      );
                    }
                  });
              }
              
              setMessages((prev) =>
                prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
              );
            } else if (payload.eventType === "DELETE") {
              setMessages((prev) => prev.filter(msg => msg.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    } else {
      // For general chat, get conversation ID first
      supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .single()
        .then(({ data: convData, error: convError }) => {
          if (convError) {
            console.error("Error fetching conversation:", convError);
            return;
          }
          
          if (convData?.id) {
            // Subscribe to changes in conversation_messages table for general chat
            channel = supabase
              .channel("realtime-chat-general")
              .on(
                "postgres_changes",
                {
                  event: "*",
                  schema: "public",
                  table: "conversation_messages",
                  filter: `conversation_id=eq.${convData.id}`,
                },
                (payload) => {
                  if (payload.eventType === "INSERT") {
                    // For new messages, we'll add them with a temporary sender name and type
                    // The actual role will be fetched separately if needed
                    const messageWithSenderName: Message = {
                      id: payload.new.id,
                      sender_id: payload.new.sender_id,
                      // Initially set sender_type based on sender_id, will update after role fetch
                      sender_type: payload.new.sender_id === user.id ? "user" : "user", // Default to "user" temporarily until we fetch the actual role
                      message: payload.new.message,
                      linked_project_id: payload.new.linked_project_id,
                      created_at: payload.new.created_at,
                      read_status: payload.new.read_status,
                      sender_name: 'Mengambil nama...' // Temporary name
                    };
                    
                    setMessages((prev) => [...prev, messageWithSenderName]);
                    
                    // Fetch sender's role and name separately to avoid blocking the UI
                    supabase
                      .from('profiles')
                      .select('full_name, role')
                      .eq('id', payload.new.sender_id)
                      .single()
                      .then(({ data, error }) => {
                        if (!error && data) {
                          // Update the message with correct sender_type and name
                          setMessages(prev => 
                            prev.map(msg => 
                              msg.id === payload.new.id 
                                ? { 
                                    ...msg, 
                                    sender_type: data.role === 'admin' ? 'admin' : 'user',
                                    sender_name: data.full_name || 'Pengguna' 
                                  } 
                                : msg
                            )
                          );
                        } else {
                          // If we can't get the profile, fetch the role separately to determine sender_type
                          supabase
                            .from('profiles')
                            .select('role')
                            .eq('id', payload.new.sender_id)
                            .single()
                            .then(({ data: roleData, error: roleError }) => {
                              if (!roleError && roleData) {
                                // Update the message with correct sender_type based on role
                                setMessages(prev => 
                                  prev.map(msg => 
                                    msg.id === payload.new.id 
                                      ? { 
                                          ...msg, 
                                          sender_type: roleData.role === 'admin' ? 'admin' : 'user',
                                          sender_name: payload.new.sender_id === user.id ? 'Anda' : 'Pengguna' 
                                        } 
                                      : msg
                                  )
                                );
                              } else {
                                // If we still can't determine the role, default to user
                                setMessages(prev => 
                                  prev.map(msg => 
                                    msg.id === payload.new.id 
                                      ? { 
                                          ...msg, 
                                          sender_type: payload.new.sender_id === user.id ? 'user' : 'user',
                                          sender_name: payload.new.sender_id === user.id ? 'Anda' : 'Pengguna' 
                                        } 
                                      : msg
                                  )
                                );
                              }
                            });
                        }
                      });
                  } else if (payload.eventType === "UPDATE") {
                    // For updates, we also need to verify the sender's role if it's not already known
                    const updatedMessage = payload.new as Message;
                    
                    // Check if we need to fetch the sender's role (for cases where sender_type might be incorrect)
                    if (!('sender_type' in updatedMessage) || updatedMessage.sender_type === 'admin' && updatedMessage.sender_id !== user?.id) {
                      // Fetch the sender's role to confirm if it's actually an admin
                      supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', updatedMessage.sender_id)
                        .single()
                        .then(({ data, error }) => {
                          if (!error && data) {
                            // Update the message with correct sender_type
                            setMessages(prev => 
                              prev.map(msg => 
                                msg.id === updatedMessage.id 
                                  ? { ...msg, sender_type: data.role === 'admin' ? 'admin' : 'user' } 
                                  : msg
                              )
                            );
                          }
                        });
                    }
                    
                    setMessages((prev) =>
                      prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
                    );
                  } else if (payload.eventType === "DELETE") {
                    setMessages((prev) => prev.filter(msg => msg.id !== payload.old.id));
                  }
                }
              )
              .subscribe();
          }
        });
    }

    // Update connection status
    setIsConnected(true);

    // Cleanup function
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      setIsConnected(false);
    };
  }, [user, projectId, supabase]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    let result;
    
    if (projectId) {
      // Send to project-specific chat
      const messageData = {
        project_id: projectId,
        sender_id: user.id,
        sender_type: isAdmin ? "admin" as const : "user" as const, // Tipe pengirim berdasarkan peran pengguna
        message: newMessage.trim(),
        read_status: false,
      };

      result = await supabase
        .from("chat_messages")
        .insert([messageData])
        .select()
        .single();
    } else {
      // Send to general conversation
      // First get or create conversation
      // eslint-disable-next-line prefer-const
      let { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (convError || !convData) {
        // Create a new conversation if it doesn't exist
        const { data: newConv, error: newConvError } = await supabase
          .from('conversations')
          .insert([{ user_id: user.id }])
          .select('id')
          .single();
          
        if (newConvError) {
          console.error("Error creating conversation:", newConvError);
          return;
        }
        
        convData = newConv;
      }

      const messageData = {
        conversation_id: convData.id,
        sender_id: user.id,
        sender_type: isAdmin ? "admin" as const : "user" as const, // Tipe pengirim berdasarkan peran pengguna
        message: newMessage.trim(),
        linked_project_id: stagedProjectId || null,
        read_status: false,
      };

      result = await supabase
        .from("conversation_messages")
        .insert([messageData])
        .select()
        .single();
    }

    const { data, error } = result;

    if (error) {
      console.error("Error sending message:", error);
    } else if (data) {
      // Normalize the response to match our Message interface
      const normalizedMessage: Message = {
        id: data.id,
        sender_id: data.sender_id,
        sender_type: data.sender_type, // Gunakan tipe pengirim dari data asli
        message: data.message,
        linked_project_id: data.linked_project_id,
        created_at: data.created_at,
        read_status: data.read_status,
        sender_name: 'Anda' // Will be updated via realtime
      };
      setMessages((prev) => [...prev, normalizedMessage]);
      setNewMessage("");
      setStagedProjectId(null); // Clear staged project after sending
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;

    try {
      // Hapus pesan dari state terlebih dahulu untuk pengalaman pengguna yang lebih cepat
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      const response = await fetch('/api/chat/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_id: messageId,
          project_id: projectId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Jika penghapusan gagal, kembalikan pesan ke state
        console.error("Error deleting message:", data.error || 'Failed to delete message');
        alert('Gagal menghapus pesan. Silakan coba lagi.');
        
        // Ambil kembali pesan dari database jika penghapusan gagal
        let restoredMessage;
        let error;
        
        if (projectId) {
          // Project-specific chat
          const result = await supabase
            .from('chat_messages')
            .select(`
              id,
              sender_id,
              sender_type,
              message,
              created_at,
              read_status,
              profiles!sender_id (full_name, role)
            `)
            .eq('id', messageId)
            .single();
            
          restoredMessage = result.data;
          error = result.error;
        } else {
          // General conversation chat
          const result = await supabase
            .from('conversation_messages')
            .select(`
              id,
              sender_id,
              message,
              linked_project_id,
              created_at,
              read_status,
              profiles!sender_id (full_name, role)
            `)
            .eq('id', messageId)
            .single();
            
          restoredMessage = result.data;
          error = result.error;
        }
        
        if (!error && restoredMessage) {
          const profile = Array.isArray(restoredMessage.profiles) ? restoredMessage.profiles[0] : restoredMessage.profiles;
          let messageWithSenderName;
          
          if (projectId) {
            // For project-specific chat - type assertion for project messages
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const projectMessage = restoredMessage as any;
            messageWithSenderName = {
              id: restoredMessage.id,
              sender_id: restoredMessage.sender_id,
              sender_type: projectMessage.sender_type, // Safe to assume sender_type exists for project messages
              message: restoredMessage.message,
              created_at: restoredMessage.created_at,
              read_status: restoredMessage.read_status,
              sender_name: profile?.full_name || 'Pengguna'
            };
          } else {
            // For general conversation
            // Determine sender_type based on user's role in profiles table
            const senderType: "user" | "admin" = profile?.role === 'admin' ? 'admin' : 'user';
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const conversationMessage = restoredMessage as any;
            messageWithSenderName = {
              id: restoredMessage.id,
              sender_id: restoredMessage.sender_id,
              sender_type: senderType,
              message: restoredMessage.message,
              linked_project_id: conversationMessage.linked_project_id,
              created_at: restoredMessage.created_at,
              read_status: restoredMessage.read_status,
              sender_name: profile?.full_name || 'Pengguna'
            };
          }
          
          setMessages(prev => [...prev, messageWithSenderName as Message]);
        }
      }

      // Pastikan untuk menutup menu konteks
      setContextMenu({ visible: false, message: null, x: 0, y: 0 });
      setMobileContextMenu({ visible: false, message: null });
    } catch (error) {
      console.error("Error deleting message:", error);
      alert('Gagal menghapus pesan. Silakan coba lagi.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContextMenu = (e: React.MouseEvent, message: Message) => {
    e.preventDefault();
    
    // Only show context menu if the message was sent by the current user
    if (message.sender_id === user?.id) {
      setContextMenu({
        visible: true,
        message,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleLongPress = (message: Message) => {
    if (message.sender_id === user?.id) {
      setMobileContextMenu({
        visible: true,
        message,
      });
    }
  };

  const handleStartLongPress = (message: Message) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
    
    const timer = setTimeout(() => {
      handleLongPress(message);
    }, 500); // 500ms untuk mendeteksi tekanan lama
    
    setLongPressTimer(timer);
  };

  const handleEndLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!(e.target as Element).closest('.context-menu')) {
      setContextMenu({ visible: false, message: null, x: 0, y: 0 });
    }
    if (!(e.target as Element).closest('.mobile-context-menu')) {
      setMobileContextMenu({ visible: false, message: null });
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [handleClickOutside, longPressTimer]);



  const handleRemoveProject = () => {
    setStagedProjectId(null);
  };

  const handleProjectLinkClick = (projectId: string) => {
    // Navigate to the project page
    window.open(`/dashboard/projects/${projectId}`, '_blank');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {projectId ? "Chat Proyek" : "Chat Umum"}
          <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] w-full p-4">
          <div ref={scrollAreaRef} className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-500">
                <Bot className="w-12 h-12 mb-3 text-gray-400" />
                <p>Belum ada pesan. Kirim pesan pertama Anda!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_type === "user" ? "justify-end" : "justify-start"} relative group`}
                  onContextMenu={(e) => handleContextMenu(e, message)}
                  onTouchStart={() => handleStartLongPress(message)}
                  onTouchEnd={handleEndLongPress}
                  onTouchMove={handleEndLongPress}
                  onMouseDown={() => handleStartLongPress(message)}
                  onMouseUp={handleEndLongPress}
                  onMouseLeave={handleEndLongPress}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_type === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    } ${message.sender_id === user?.id ? 'cursor-pointer hover:opacity-90' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {message.sender_type === "user" ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Bot className="w-3 h-3" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">
                        {message.sender_type === "user" 
                          ? (message.sender_id === user?.id ? "Anda" : (message.sender_name || "Pengguna")) 
                          : "Admin"}
                      </span>
                      {message.sender_id === user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMessage(message.id);
                              }}
                              className="text-red-600"
                            >
                              Hapus Pesan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <p className="text-sm">{message.message}</p>
                    
                    {/* Project Link Preview */}
                    {message.linked_project_id && (
                      <div 
                        className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleProjectLinkClick(message.linked_project_id!)}
                      >
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-4 h-4" />
                          <span className="text-xs underline">Proyek Terkait</span>
                        </div>
                      </div>
                    )}
                    
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
        {contextMenu.visible && contextMenu.message && (
          <div
            className="context-menu fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 py-1"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleDeleteMessage(contextMenu.message!.id)}
            >
              Hapus Pesan
            </button>
          </div>
        )}
        {mobileContextMenu.visible && mobileContextMenu.message && (
          <div className="mobile-context-menu fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white">Opsi Pesan</h3>
              </div>
              <div className="p-2">
                <button
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => {
                    handleDeleteMessage(mobileContextMenu.message!.id);
                    setMobileContextMenu({ visible: false, message: null });
                  }}
                >
                  Hapus Pesan
                </button>
                <button
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMobileContextMenu({ visible: false, message: null })}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col">
        {/* Project Preview (when a project is selected) */}
        {stagedProjectId && (
          <div className="w-full mb-2 flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span className="text-sm">
                {projects.find(p => p.id === stagedProjectId)?.title || 'Proyek Terpilih'}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveProject}
              className="h-6 w-6 p-1"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
        
        <div className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan Anda..."
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