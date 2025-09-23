"use client";

import { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  timestamp: string;
  read: boolean;
  link?: string;
}

export default function NotificationBell() {
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
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Count unread notifications
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

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
    <div className="relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-500 hover:text-gray-700 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Notifikasi</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="link" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-800 p-0 mt-1"
              >
                Tandai semua dibaca
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Tidak ada notifikasi
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${getBackgroundColor(notification.type, notification.read)}`}
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
                            setIsOpen(false);
                          }}
                        >
                          Lihat detail
                        </Button>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {!notification.read && (
                    <div className="mt-2 flex">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 text-xs text-blue-600 hover:text-blue-800"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Tandai dibaca
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-gray-200 text-center">
            <Button 
              variant="link" 
              size="sm" 
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {
                // Navigate to notifications page
                console.log("Navigate to notifications page");
                setIsOpen(false);
              }}
            >
              Lihat semua notifikasi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}