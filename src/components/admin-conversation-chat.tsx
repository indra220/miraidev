// src/components/admin-conversation-chat.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, FolderOpen, X, MoreVertical } from "lucide-react";
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
  conversation_id: string;
  sender_id: string;
  message: string;
  linked_project_id?: string | null;
  read_status: boolean;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  name: string;
}

interface AdminConversationChatProps {
  isAdmin?: boolean; // Whether this is being rendered in admin panel
  userId?: string;   // For admin to specify which user's conversation to view
}

export default function AdminConversationChat({ isAdmin = false, userId }: AdminConversationChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stagedProjectId, setStagedProjectId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; message: Message | null; x: number; y: number }>({
    visible: false,
    message: null,
    x: 0,
    y: 0,
  });
  const [mobileContextMenu, setMobileContextMenu] = useState<{ visible: boolean; message: Message | null }>({
    visible: false,
    message: null,
  });
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const userCache = useRef<Record<string, string>>({}); // Cache untuk menyimpan nama pengguna
  const { user, isAdmin: isCurrentUserAdmin } = useChatAuth();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const actualUserId = isAdmin ? userId : user?.id;
  
  const isMessageSender = (messageSenderId: string) => {
    if (isAdmin && userId) {
      return messageSenderId !== userId;
    }
    return messageSenderId === user?.id;
  };

  useEffect(() => {
    if (!actualUserId) return;

    const fetchConversation = async () => {
      setIsLoading(true);
      
      let conv: Conversation | null = null;
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', actualUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newConv, error: createError } = await supabase
            .from('conversations')
            .insert([{ user_id: actualUserId }])
            .select()
            .single();
          
          if (createError) {
            console.error('Error creating conversation:', createError);
            setIsLoading(false);
            return;
          }
          conv = newConv as Conversation;
        } else {
          console.error('Unexpected error fetching conversation:', error);
          setIsLoading(false);
          return;
        }
      } else {
        conv = data as Conversation;
      }

      if (conv) {
        setConversation(conv);
        
        const { data: messagesData, error: messagesError } = await supabase
          .from('conversation_messages')
          .select(`*`)
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true })
          .limit(100);

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
        } else if (messagesData) {
          setMessages(messagesData as Message[]);
          
          const uniqueSenderIds = Array.from(new Set(messagesData.map(m => m.sender_id)));
          const uncachedSenderIds = uniqueSenderIds.filter(id => !userCache.current[id]);
          
          if (uncachedSenderIds.length > 0) {
            const { data: profilesData } = await supabase
              .from('profiles')
              .select('id, full_name')
              .in('id', uncachedSenderIds);
            
            if (profilesData) {
              profilesData.forEach(profile => { userCache.current[profile.id] = profile.full_name || 'Pengguna'; });
            }
          }
          
          if (isAdmin && actualUserId && messagesData.length > 0) {
            const unreadMessages = messagesData.filter(msg => msg.sender_id === actualUserId && !msg.read_status);
            
            if (unreadMessages.length > 0) {
              const messageIds = unreadMessages.map(msg => msg.id);
              await supabase
                .from('conversation_messages')
                .update({ read_status: true })
                .in('id', messageIds);
            }
          }
        }
      }
      
      setIsLoading(false);
    };

    fetchConversation();
  }, [actualUserId, supabase, isAdmin]);

  useEffect(() => {
    if (!conversation) return;

    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversation_messages", filter: `conversation_id=eq.${conversation.id}` },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            const newMessage = payload.new as Message;
            if (!userCache.current[newMessage.sender_id]) {
              const { data, error } = await supabase.from('profiles').select('full_name').eq('id', newMessage.sender_id).single();
              if (!error && data) {
                userCache.current[newMessage.sender_id] = data.full_name || 'Pengguna';
              }
            }
            setMessages((prev) => [...prev, newMessage]);
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) => prev.map((msg) => (msg.id === payload.new.id ? (payload.new as Message) : msg)));
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((msg) => msg.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .subscribe();

    setIsConnected(true);
    return () => {
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [conversation, supabase]);

  useEffect(() => {
    return () => {
      userCache.current = {};
    };
  }, []);

  const handleLongPress = (message: Message) => {
    if (isMessageSender(message.sender_id)) {
      setMobileContextMenu({ visible: true, message });
    }
  };

  const handleStartLongPress = (message: Message) => {
    if (longPressTimer) clearTimeout(longPressTimer);
    const timer = setTimeout(() => handleLongPress(message), 500);
    setLongPressTimer(timer);
  };

  const handleEndLongPress = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!(e.target as Element).closest('.context-menu')) setContextMenu({ visible: false, message: null, x: 0, y: 0 });
    if (!(e.target as Element).closest('.mobile-context-menu')) setMobileContextMenu({ visible: false, message: null });
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      if (longPressTimer) clearTimeout(longPressTimer);
    };
  }, [handleClickOutside, longPressTimer]);

  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    
    const response = await fetch('/api/chat/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id: messageId, project_id: null }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      console.error("Error deleting message:", data.error || 'Failed to delete message');
      alert('Gagal menghapus pesan. Silakan coba lagi.');
      // Re-fetch might be needed here
    }
    setContextMenu({ visible: false, message: null, x: 0, y: 0 });
    setMobileContextMenu({ visible: false, message: null });
  };

  const handleContextMenu = (e: React.MouseEvent, message: Message) => {
    e.preventDefault();
    if (isMessageSender(message.sender_id)) {
      setContextMenu({ visible: true, message, x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    if (!user || isAdmin || !conversation) return;
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (!error && data) setProjects(data as Project[]);
    };
    fetchProjects();
  }, [user, isAdmin, conversation, supabase]);

  useEffect(() => {
    if (!isCurrentUserAdmin || !userId || !conversation) return;
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!error && data) setProjects(data as Project[]);
    };
    fetchProjects();
  }, [isCurrentUserAdmin, userId, conversation, supabase]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }, 100);
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation || !user) return;

    const messageData = {
      conversation_id: conversation.id,
      sender_id: user.id,
      message: newMessage.trim(),
      linked_project_id: stagedProjectId || null,
    };

    const { data, error } = await supabase.from("conversation_messages").insert([messageData]).select().single();

    if (error) {
      console.error("Error sending message:", error);
    } else if (data) {
      setMessages((prev) => [...prev, data as Message]);
      setNewMessage("");
      setStagedProjectId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProjectSelect = (projectId: string) => setStagedProjectId(projectId);
  const handleRemoveProject = () => setStagedProjectId(null);

  const handleProjectLinkClick = (projectId: string) => {
    window.open(isAdmin ? `/admin/chat/project/${projectId}` : `/dashboard/projects/${projectId}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Bot className="w-12 h-12 mb-3 text-gray-400 animate-spin mx-auto" />
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-5xl mx-auto gap-4">
      <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                {isAdmin ? "Percakapan Klien" : "Percakapan Umum"}
                <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col">
            <ScrollArea viewportRef={scrollAreaRef} className="h-[270px] w-full p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isSender = isMessageSender(message.sender_id);
                  let displayName;
                  let avatarIcon;
                  if (isSender) {
                    displayName = isCurrentUserAdmin ? "Admin" : "Anda";
                    avatarIcon = isCurrentUserAdmin ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />;
                  } else {
                    displayName = isCurrentUserAdmin ? (userCache.current[message.sender_id] || "Pengguna") : "Admin";
                    avatarIcon = isCurrentUserAdmin ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />;
                  }

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isSender ? "justify-end" : "justify-start"} relative group`}
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
                          isSender
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                        } ${isSender ? 'cursor-pointer hover:opacity-90' : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-6 h-6"><AvatarFallback className="text-xs">{avatarIcon}</AvatarFallback></Avatar>
                          <span className="text-xs font-medium">{displayName}</span>
                          {isSender && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"><MoreVertical className="h-3 w-3" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteMessage(message.id); }} className="text-red-600">Hapus Pesan</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <p className="text-sm">{message.message}</p>
                        {message.linked_project_id && (
                          <div className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleProjectLinkClick(message.linked_project_id!)}>
                            <div className="flex items-center gap-2"><FolderOpen className="w-4 h-4" /><span className="text-xs underline">Proyek Terkait</span></div>
                          </div>
                        )}
                        <p className="text-xs opacity-70 mt-1 text-right">{new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex flex-col">
            {stagedProjectId && (
              <div className="w-full mb-2 flex items-center justify-between bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{projects.find(p => p.id === stagedProjectId)?.title || 'Proyek Terpilih'}</span>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={handleRemoveProject} className="h-6 w-6 p-1"><X className="w-3 h-3" /></Button>
              </div>
            )}
            <div className="flex w-full gap-2">
              <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ketik pesan Anda..." className="flex-1" />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}><Send className="w-4 h-4" /></Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {contextMenu.visible && contextMenu.message && (
        <div className="context-menu fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 py-1" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => handleDeleteMessage(contextMenu.message!.id)}>Hapus Pesan</button>
        </div>
      )}
      
      {mobileContextMenu.visible && mobileContextMenu.message && (
        <div className="mobile-context-menu fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700"><h3 className="font-medium text-gray-900 dark:text-white">Opsi Pesan</h3></div>
            <div className="p-2">
              <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" onClick={() => { handleDeleteMessage(mobileContextMenu.message!.id); setMobileContextMenu({ visible: false, message: null }); }}>Hapus Pesan</button>
              <button className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" onClick={() => setMobileContextMenu({ visible: false, message: null })}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {(!isAdmin && projects.length > 0) && (
        <div className="w-full lg:w-56 lg:flex-shrink-0 flex flex-col border rounded-lg overflow-hidden">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><FolderOpen className="w-5 h-5" />Proyek Anda</CardTitle></CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="p-2">
                {projects.map((project) => (
                  <div key={project.id} onClick={() => handleProjectSelect(project.id)} className={`p-3 mb-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${stagedProjectId === project.id ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-300" : ""}`}>
                    <h4 className="font-medium text-sm truncate">{project.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{project.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {(isAdmin && projects.length > 0) && (
        <div className="w-full lg:w-56 lg:flex-shrink-0 flex flex-col border rounded-lg overflow-hidden">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><FolderOpen className="w-5 h-5" />Proyek Klien</CardTitle></CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="p-2">
                {projects.map((project) => (
                  <div key={project.id} onClick={() => handleProjectSelect(project.id)} className={`p-3 mb-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${stagedProjectId === project.id ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-300" : ""}`}>
                    <h4 className="font-medium text-sm truncate">{project.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{project.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}