"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  timestamp: string;
  read: boolean;
  link?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Pembayaran Diterima",
      message: "Pembayaran untuk proyek Website Kedai Kopi telah diterima.",
      type: "success",
      timestamp: "2 menit yang lalu",
      read: false
    },
    {
      id: 2,
      title: "Deadline Mendekati",
      message: "Deadline proyek Portofolio Fotografer dalam 3 hari.",
      type: "warning",
      timestamp: "1 jam yang lalu",
      read: false
    },
    {
      id: 3,
      title: "Revisi Selesai",
      message: "Revisi untuk proyek Website Salon Kecantikan telah selesai.",
      type: "info",
      timestamp: "3 jam yang lalu",
      read: true
    },
    {
      id: 4,
      title: "Pembayaran Jatuh Tempo",
      message: "Pembayaran untuk proyek Website PPDB Sekolah akan jatuh tempo dalam 5 hari.",
      type: "warning",
      timestamp: "1 hari yang lalu",
      read: true
    },
    {
      id: 5,
      title: "Proyek Selesai",
      message: "Proyek Website Kedai Kopi telah selesai dan siap untuk diluncurkan.",
      type: "success",
      timestamp: "2 hari yang lalu",
      read: true
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === "all" || 
      (filter === "unread" && !notification.read) ||
      (filter === "read" && notification.read);
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning": return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error": return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: string, read: boolean) => {
    if (read) return "bg-gray-50";
    
    switch (type) {
      case "success": return "bg-green-50";
      case "warning": return "bg-yellow-50";
      case "error": return "bg-red-50";
      default: return "bg-blue-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
          <p className="text-gray-600 mt-2">Kelola semua notifikasi Anda</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari notifikasi..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary and Actions */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Anda memiliki <span className="font-bold">{notifications.filter(n => !n.read).length}</span> notifikasi belum dibaca
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={notifications.filter(n => !n.read).length === 0}
            >
              Tandai semua dibaca
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Filter className="h-4 w-4 mr-1" />
            Semua
          </Button>
          <Button 
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Bell className="h-4 w-4 mr-1" />
            Belum Dibaca
          </Button>
          <Button 
            variant={filter === "read" ? "default" : "outline"}
            onClick={() => setFilter("read")}
            className={filter === "read" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Sudah Dibaca
          </Button>
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada notifikasi</h3>
              <p className="mt-1 text-gray-500">
                Tidak ada notifikasi yang sesuai dengan kriteria pencarian Anda.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-6 hover:bg-gray-50 ${getBackgroundColor(notification.type, notification.read)}`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {notification.timestamp}
                    </p>
                    {notification.link && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 mt-2 text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          // Navigate to link
                          console.log("Navigate to:", notification.link);
                        }}
                      >
                        Lihat detail
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {!notification.read && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Tandai dibaca
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}