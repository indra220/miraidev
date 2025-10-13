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

interface ConversationChatProps {
  isAdmin?: boolean; // Whether this is being rendered in admin panel
  userId?: string;   // For admin to specify which user's conversation to view
}

export default function ConversationChat({ isAdmin = false, userId }: ConversationChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stagedProjectId, setStagedProjectId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState<User[]>([]);
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
  const conversationCache = useRef<Record<string, Conversation>>({}); // Cache untuk menyimpan data percakapan
  const { user, isAdmin: isCurrentUserAdmin } = useChatAuth();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Determine the actual user ID to use
  const actualUserId = isAdmin ? userId : user?.id;
  
  // Determine if current user is the sender of a message
  const isMessageSender = (messageSenderId: string) => {
    console.warn('isMessageSender check:', { 
      messageSenderId, 
      isAdmin, 
      userId, 
      currentUserId: user?.id,
      result: isAdmin && userId ? messageSenderId !== userId : messageSenderId === user?.id
    });
    
    if (isAdmin && userId) {
      // In admin view, current user is admin, so any message not from target user is from admin
      // messageSenderId !== userId means it's from admin (current user)
      // messageSenderId === userId means it's from the target user
      const result = messageSenderId !== userId;
      console.warn('Admin view result:', { result, messageSenderId, userId });
      return result;
    }
    // In user view, current user is the logged-in user
    const result = messageSenderId === user?.id;
    console.warn('User view result:', { result, messageSenderId, currentUserId: user?.id });
    return result;
  };

  // Fetch conversation and messages
  useEffect(() => {
    console.warn('ConversationChat useEffect triggered', { actualUserId, isAdmin });
    
    if (!actualUserId) return;

    const fetchConversation = async () => {
      setIsLoading(true);
      
      // Get or create conversation for this user
      let conv: Conversation | null = null;
      const { data: data, error: error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', actualUserId)
        .single();

      if (error) {
        console.error('Error fetching conversation:', error);
        // Create new conversation if it doesn't exist
        if (error.code === 'PGRST116') { // Record not found
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
          // Jika error bukan karena record tidak ditemukan, tampilkan error dan hentikan
          console.error('Unexpected error fetching conversation:', error);
          setIsLoading(false);
          return;
        }
      } else {
        conv = data as Conversation;
      }

      if (conv) {
        // Simpan ke cache
        conversationCache.current[conv.id] = conv;
        setConversation(conv);
        
        // Cek apakah pesan sudah di-cache
        // Fetch messages for this conversation (batasi jumlah pesan untuk performa)
        const { data: messagesData, error: messagesError } = await supabase
          .from('conversation_messages')
          .select(`
            id,
            conversation_id,
            sender_id,
            message,
            linked_project_id,
            read_status,
            created_at
          `)
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true })
          .limit(100); // Batasi jumlah pesan yang diambil

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
        } else if (messagesData) {
          setMessages(messagesData as Message[]);
          
          // Fetch user names - cek cache dulu untuk pengguna yang sudah ada
          const uniqueSenderIds = Array.from(
            new Set(messagesData.map(m => m.sender_id))
          );
          
          // Filter hanya pengguna yang belum ada di cache
          const uncachedSenderIds = uniqueSenderIds.filter(id => !userCache.current[id]);
          
          // Jika ada pengguna yang belum di-cache, ambil dari database
          if (uncachedSenderIds.length > 0) {
            const { data: profilesData, error: profilesError } = await supabase
              .from('profiles')
              .select('id, full_name')
              .in('id', uncachedSenderIds);
            
            if (profilesError) {
              console.error('Error fetching user profiles:', profilesError);
            } else if (profilesData) {
              // Simpan ke cache
              profilesData.forEach(profile => {
                userCache.current[profile.id] = profile.full_name || 'Pengguna';
              });
            }
          }
          
          // Buat daftar pengguna dengan nama dari cache
          const userNames = uniqueSenderIds.map(id => ({
            id,
            name: userCache.current[id] || 'Pengguna'
          }));
          
          setUserList(userNames);
          
          // Jika ini adalah admin yang membuka percakapan, tandai pesan sebagai telah dibaca
          if (isAdmin && actualUserId && messagesData.length > 0) {
            console.warn('Admin opening conversation, checking for unread messages...', { 
              isAdmin, 
              actualUserId, 
              totalMessages: messagesData.length,
              // Tampilkan detail pesan untuk debugging
              messages: messagesData.map(m => ({
                id: m.id,
                sender_id: m.sender_id,
                read_status: m.read_status,
                created_at: m.created_at
              }))
            });
            
            // Temukan pesan-pesan yang belum dibaca dari user (bukan dari admin)
            const unreadMessages = messagesData.filter(
              msg => {
                // Log detail setiap pesan untuk debugging
                // Ketika admin membuka chat pengguna:
                // - actualUserId adalah ID pengguna yang sedang dilihat chat-nya
                // - Pesan dari pengguna tersebut (sender_id === actualUserId) adalah pesan dari user
                // - Pesan dari admin (sender_id !== actualUserId) adalah pesan dari admin
                const isFromUser = msg.sender_id === actualUserId;
                const isUnread = !msg.read_status;
                console.warn('Checking message:', { 
                  id: msg.id, 
                  sender_id: msg.sender_id, 
                  actualUserId, 
                  isFromUser, 
                  read_status: msg.read_status, 
                  isUnread,
                  // Tambahkan informasi tambahan untuk debugging
                  senderMatchesUser: msg.sender_id === actualUserId,
                  senderNotMatchesUser: msg.sender_id !== actualUserId
                });
                return isFromUser && isUnread;
              }
            );
            
            console.warn('Unread messages found:', unreadMessages.length);
            if (unreadMessages.length > 0) {
              console.warn('Unread messages details:', unreadMessages.map(m => ({
                id: m.id,
                sender_id: m.sender_id,
                read_status: m.read_status
              })));
              
              // Update status read untuk semua pesan yang belum dibaca
              const messageIds = unreadMessages.map(msg => msg.id);
              console.warn('Updating read status for message IDs:', messageIds);
              
              const { error: updateError } = await supabase
                .from('conversation_messages')
                .update({ read_status: true })
                .in('id', messageIds);
                
              if (updateError) {
                console.error('Error updating read status:', updateError);
              } else {
                console.warn('Successfully updated read status for messages:', messageIds);
                
                // Update status di state lokal juga
                setMessages(prev => 
                  prev.map(msg => 
                    messageIds.includes(msg.id) 
                      ? { ...msg, read_status: true } 
                      : msg
                  )
                );
              }
            } else {
              console.warn('No unread messages to update');
              // Log semua pesan untuk melihat status mereka
              console.warn('All messages status:', messagesData.map(m => ({
                id: m.id,
                sender_id: m.sender_id,
                read_status: m.read_status,
                senderMatchesUser: m.sender_id === actualUserId
              })));
            }
          }
        }
      }
      
      setIsLoading(false);
    };

    fetchConversation();
  }, [actualUserId, supabase, isAdmin]);

  // Cleanup cache ketika komponen di-unmount
  useEffect(() => {
    return () => {
      // Kosongkan cache ketika komponen di-unmount
      userCache.current = {};
    };
  }, []);

  const handleLongPress = (message: Message) => {
    if (isMessageSender(message.sender_id)) {
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
          project_id: null, // null karena ini adalah percakapan umum
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Jika penghapusan gagal, kembalikan pesan ke state
        console.error("Error deleting message:", data.error || 'Failed to delete message');
        alert('Gagal menghapus pesan. Silakan coba lagi.');
        
        // Ambil kembali pesan dari database jika penghapusan gagal
        const { data: restoredMessage, error } = await supabase
          .from('conversation_messages')
          .select(`
            id,
            conversation_id,
            sender_id,
            message,
            linked_project_id,
            created_at,
            read_status,
            profiles!sender_id (full_name)
          `)
          .eq('id', messageId)
          .single();
          
        if (!error && restoredMessage) {
          const profile = Array.isArray(restoredMessage.profiles) ? restoredMessage.profiles[0] : restoredMessage.profiles;
          const messageWithSenderName = {
            id: restoredMessage.id,
            conversation_id: restoredMessage.conversation_id, // Kolom ini ada di tabel conversation_messages
            sender_id: restoredMessage.sender_id,
            message: restoredMessage.message,
            linked_project_id: restoredMessage.linked_project_id,
            read_status: restoredMessage.read_status,
            created_at: restoredMessage.created_at,
            sender_name: profile?.full_name || 'Pengguna'
          };
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

  const handleContextMenu = (e: React.MouseEvent, message: Message) => {
    e.preventDefault();
    
    // Only show context menu if the message was sent by the current user
    if (isMessageSender(message.sender_id)) {
      setContextMenu({
        visible: true,
        message,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  // Fetch user's projects
  useEffect(() => {
    if (!user || isAdmin || !conversation) return;

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
  }, [user, isAdmin, conversation, supabase]);

  // For admin, fetch projects for the selected user
  useEffect(() => {
    if (!isCurrentUserAdmin || !userId || !conversation) return;

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects for user:', error);
      } else if (data) {
        setProjects(data as Project[]);
      }
    };

    fetchProjects();
  }, [isCurrentUserAdmin, userId, conversation, supabase]);

  // Set up realtime listener for conversation messages
  useEffect(() => {
    if (!conversation) {
      console.warn('Skipping conversation chat listener setup - no conversation');
      return;
    }

    let isSubscribed = true;
    const channelName = `conversation-${conversation.id}`;
    console.warn('Setting up conversation chat listener', { channelName, conversationId: conversation.id });

    // Subscribe to changes in conversation_messages table
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversation_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        async (payload) => {
          if (!isSubscribed) {
            console.warn('Ignoring message event, component unsubscribed', { eventType: payload.eventType });
            return;
          }
          
          console.warn('Received conversation message event', { 
            eventType: payload.eventType, 
            channelId: channelName,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            payloadId: (payload.new as any)?.id || (payload.old as any)?.id
          });
          
          if (payload.eventType === "INSERT") {
            // Add the new message to the list
            const newMessage = {
              id: payload.new.id,
              conversation_id: payload.new.conversation_id,
              sender_id: payload.new.sender_id,
              message: payload.new.message,
              linked_project_id: payload.new.linked_project_id,
              read_status: payload.new.read_status,
              created_at: payload.new.created_at
            };
            
            setMessages((prev) => [...prev, newMessage]);
            
            // Check if sender is already in user list
            const senderExists = userList.some(u => u.id === payload.new.sender_id);
            if (!senderExists) {
              // Fetch the user's name and add to user list
              const { data, error } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', payload.new.sender_id)
                .single();
              
              if (!isSubscribed) return;
              
              if (!error && data) {
                // Simpan ke cache juga
                userCache.current[payload.new.sender_id] = data.full_name || 'Pengguna';
                
                setUserList(prev => [
                  ...prev,
                  { id: payload.new.sender_id, name: data.full_name || 'Pengguna' }
                ]);
              } else {
                setUserList(prev => [
                  ...prev,
                  { id: payload.new.sender_id, name: 'Pengguna' }
                ]);
              }
            }
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.new.id ? payload.new as Message : msg))
            );
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // Update connection status
    setIsConnected(true);

    // Cleanup function
    return () => {
      console.warn('Cleaning up conversation chat listener', { conversationId: conversation?.id });
      isSubscribed = false;
      supabase.removeChannel(channel);
      setIsConnected(false);
      console.warn('Finished cleaning up conversation chat listener');
    };
  }, [conversation, supabase, userList]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation || !user) return;

    // Prepare the new message
    const messageData = {
      conversation_id: conversation.id,
      sender_id: user.id,
      message: newMessage.trim(),
      linked_project_id: stagedProjectId || null,
    };

    // Insert message to database
    const { data, error } = await supabase
      .from("conversation_messages")
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
    } else if (data) {
      setMessages((prev) => [...prev, data as Message]);
      setNewMessage("");
      setStagedProjectId(null); // Clear staged project after sending
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setStagedProjectId(projectId);
  };

  const handleRemoveProject = () => {
    setStagedProjectId(null);
  };

  const handleProjectLinkClick = (projectId: string) => {
    // Navigate to the project page based on user role
    if (isAdmin) {
      // Admin goes to admin project page
      window.open(`/admin/chat/project/${projectId}`, '_blank');
    } else {
      // Regular user goes to their project page
      window.open(`/dashboard/projects/${projectId}`, '_blank');
    }
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
    <div className="flex h-full w-full max-w-6xl mx-auto">
      {/* Main Chat Area */}
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
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-500">
                <Bot className="w-12 h-12 mb-3 text-gray-400" />
                <p>Belum ada pesan. Kirim pesan pertama Anda!</p>
              </div>
            ) : (
              <ScrollArea ref={scrollAreaRef} className="h-[500px] w-full p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${isMessageSender(message.sender_id) ? "justify-end" : "justify-start"} relative group`}
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
                          isMessageSender(message.sender_id)
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                        } ${isMessageSender(message.sender_id) ? 'cursor-pointer hover:opacity-90' : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {isMessageSender(message.sender_id) ? (
                                <User className="w-3 h-3" />
                              ) : (
                                <Bot className="w-3 h-3" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">
                            {(() => {
                              const isSender = isMessageSender(message.sender_id);
                              const displayName = isSender ? 
                                (isAdmin ? "Admin" : "Anda") : 
                                (userList.find(u => u.id === message.sender_id)?.name || "Pengguna");
                              console.warn('Display name calculation:', { 
                                messageId: message.id,
                                senderId: message.sender_id,
                                isSender,
                                isAdmin,
                                displayName
                              });
                              return displayName;
                            })()}
                          </span>
                          {isMessageSender(message.sender_id) && (
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
                  ))}
                </div>
              </ScrollArea>
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
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Context menu for desktop */}
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
      
      {/* Context menu for mobile */}
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

      {/* Projects Sidebar (for user) */}
      {!isAdmin && projects.length > 0 && (
        <div className="w-64 ml-4 flex flex-col border rounded-lg overflow-hidden">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Proyek Anda
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="p-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectSelect(project.id)}
                    className={`p-3 mb-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      stagedProjectId === project.id ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-300" : ""
                    }`}
                  >
                    <h4 className="font-medium text-sm truncate">{project.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{project.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Projects Sidebar (for admin) */}
      {isAdmin && projects.length > 0 && (
        <div className="w-64 ml-4 flex flex-col border rounded-lg overflow-hidden">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Proyek Klien
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="p-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectSelect(project.id)}
                    className={`p-3 mb-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                      stagedProjectId === project.id ? "bg-blue-100 dark:bg-blue-900/50 border border-blue-300" : ""
                    }`}
                  >
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