"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RealtimeChat from "@/components/realtime-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useChatAuth } from "@/hooks/use-chat-auth";

export default function UserChatPage() {
  const router = useRouter();
  const { user, isLoading } = useChatAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Tunggu sampai auth state diketahui
  if (isLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Jika tidak login, arahkan ke halaman login
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
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
                <CardTitle className="text-2xl">Chat dengan Admin</CardTitle>
                <p className="text-gray-500">Kirim pesan langsung ke tim admin</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RealtimeChat />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}