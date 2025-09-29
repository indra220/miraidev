"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  UserIcon,
  CalendarIcon 
} from "lucide-react";
import { useState } from "react";

export function Communication() {
  // Data contoh - nanti akan diganti dengan data dari API
  const [messages] = useState([
    { id: 1, sender: "Admin", subject: "Pertanyaan tentang fitur login", date: "2024-10-25", read: true },
    { id: 2, sender: "Admin", subject: "Update status proyek Anda", date: "2024-10-20", read: false },
    { id: 3, sender: "Admin", subject: "Permintaan revisi desain", date: "2024-10-18", read: true },
    { id: 4, sender: "Admin", subject: "Konfirmasi pembayaran selesai", date: "2024-10-15", read: false },
  ]);

  const [conversations] = useState([
    { id: 1, project: "Website E-commerce", participants: 2, lastMessage: "Apakah Anda puas dengan hasilnya?", lastActivity: "2 jam yang lalu" },
    { id: 2, project: "Aplikasi Mobile", participants: 2, lastMessage: "Revisi UI telah selesai", lastActivity: "1 hari yang lalu" },
  ]);

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
            {messages.map((message) => (
              <div key={message.id} className={`p-3 rounded-lg ${!message.read ? 'bg-blue-50 dark:bg-blue-950' : 'bg-muted'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{message.sender}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {message.date}
                  </div>
                </div>
                <h3 className="font-medium mt-2">{message.subject}</h3>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Forum Diskusi Proyek</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversations.map((conversation) => (
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
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}