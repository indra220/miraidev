"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, FolderOpen, X } from "lucide-react";
import { useChatAuth } from "@/hooks/use-chat-auth";
import { createBrowserClient } from "@supabase/ssr";

interface User {
  id: string;
  name: string;
}

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

interface ProjectConversationChatProps {
  projectId: string; // Specific project ID for this chat
  isAdmin?: boolean; // Whether this is being rendered in admin panel
  userId?: string;   // For admin to specify which user's conversation to view
}

export default function ProjectConversationChat({ projectId, isAdmin = false, userId }: ProjectConversationChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [stagedProjectId, setStagedProjectId] = useState<string | null>(projectId); // Pre-select current project
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState<User[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useChatAuth();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Determine the actual user ID to use
  const actualUserId = isAdmin ? userId : user?.id;

  // Fetch conversation and messages
  useEffect(() => {
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
        setConversation(conv);
        
        // Fetch messages for this conversation that are linked to this project
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
          .or(`linked_project_id.is.null,linked_project_id.eq.${projectId}`)
          .order('created_at', { ascending: true });

        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
        } else if (messagesData) {
          setMessages(messagesData as Message[]);
          
          // Fetch user names separately
          const uniqueSenderIds = Array.from(
            new Set(messagesData.map(m => m.sender_id))
          );
          
          const userNames = await Promise.all(
            uniqueSenderIds.map(async (senderId) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', senderId)
                .single();
              
              return {
                id: senderId,
                name: profileData?.full_name || 'Pengguna'
              };
            })
          );
          
          setUserList(userNames);
        }
      }
      
      setIsLoading(false);
    };

    fetchConversation();
  }, [actualUserId, projectId, supabase]);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
      } else if (data) {
        setProject(data as Project);
      }
    };

    fetchProject();
  }, [projectId, supabase]);

  // Set up realtime listener for conversation messages
  useEffect(() => {
    if (!conversation) return;

    // Subscribe to changes in conversation_messages table
    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversation_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          // Only add message if it's related to this project or is a general message
          if (!payload.new.linked_project_id || payload.new.linked_project_id === projectId) {
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
            
            // Update user list if sender is not already in the list
            if (!userList.some(u => u.id === payload.new.sender_id)) {
              // We need to fetch the user's name separately
              const fetchSenderName = async () => {
                const { data, error } = await supabase
                  .from('profiles')
                  .select('full_name')
                  .eq('id', payload.new.sender_id)
                  .single();
                
                if (!error && data) {
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
              };
              
              fetchSenderName();
            }
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
  }, [conversation, supabase, projectId, userList]);

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
      // Don't clear stagedProjectId so the project remains linked to the conversation
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            {project ? `Chat Proyek: ${project.title}` : "Chat Proyek"}
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center py-12 text-gray-500">
            <Bot className="w-12 h-12 mb-3 text-gray-400" />
            <p>Belum ada pesan untuk proyek ini. Kirim pesan pertama Anda!</p>
          </div>
        ) : (
          <ScrollArea ref={scrollAreaRef} className="h-[300px] w-full p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {message.sender_id === user?.id ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Bot className="w-3 h-3" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium">
                        {message.sender_id === user?.id ? "Anda" : 
                          (isAdmin ? "Admin" : 
                            (userList.find(u => u.id === message.sender_id)?.name || "Pengguna"))}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                    
                    {/* Project Link Preview */}
                    {message.linked_project_id && (
                      <div 
                        className="mt-2 p-2 bg-blue-100 dark:bg-blue-900 rounded cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProjectLinkClick(message.linked_project_id!);
                        }}
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
                {project?.title || 'Proyek Terpilih'}
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
  );
}