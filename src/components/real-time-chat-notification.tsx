'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Bell, BellOff, Volume2, VolumeX } from 'lucide-react';

interface ChatNotification {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  conversationId: string;
}

interface RealTimeChatNotificationProps {
  userId: string;
  onNewMessage?: (notification: ChatNotification) => void;
  onNotificationClick?: (notification: ChatNotification) => void;
}

export default function RealTimeChatNotification({ 
  userId, 
  onNewMessage,
  onNotificationClick
}: RealTimeChatNotificationProps) {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  // Fungsi untuk memainkan suara notifikasi
  const playNotificationSound = useCallback(() => {
    if (soundEnabled) {
      // Dalam implementasi sebenarnya, kita akan memainkan suara notifikasi
    }
  }, [soundEnabled]);

  // Fungsi untuk menangani pesan baru
  const handleNewMessage = useCallback((data: Record<string, unknown>) => {
    const newNotification: ChatNotification = {
      id: (data.id as string) || Date.now().toString(),
      sender: (data.sender as string) || 'Pengguna',
      message: (data.message as string) || 'Pesan baru',
      timestamp: new Date((data.timestamp as number) || Date.now()),
      isRead: false,
      conversationId: (data.conversationId as string) || 'general'
    };

    setNotifications(prev => [newNotification, ...prev]);
    playNotificationSound();
    
    if (onNewMessage) {
      onNewMessage(newNotification);
    }
  }, [onNewMessage, playNotificationSound]);

  // Fungsi untuk menandai notifikasi sebagai dibaca
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Fungsi untuk menandai semua notifikasi sebagai dibaca
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Fungsi untuk membuka notifikasi
  const openNotification = (notification: ChatNotification) => {
    markAsRead(notification.id);
    setShowPanel(false);
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  // Fungsi untuk menghapus notifikasi
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Aktifkan/mematikan notifikasi
  const toggleNotifications = () => {
    setIsActive(!isActive);
  };

  // Aktifkan/mematikan suara
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Dapatkan jumlah notifikasi belum dibaca
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Simulasi koneksi WebSocket/Server-Sent Events
  useEffect(() => {
    if (isActive) {
      // Dalam implementasi sebenarnya, kita akan menggunakan WebSocket atau Server-Sent Events
      // untuk mendapatkan notifikasi secara real-time
      
      // Simulasi pesan masuk (dalam implementasi sebenarnya ini akan datang dari server)
      const mockMessages = [
        { id: '1', sender: 'John Doe', message: 'Halo, bagaimana proyeknya?', timestamp: Date.now() - 60000, conversationId: '1' },
        { id: '2', sender: 'Jane Smith', message: 'Terima kasih atas bantuannya', timestamp: Date.now() - 120000, conversationId: '2' },
      ];
      
      // Simulasi pesan masuk setiap 10 detik
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance untuk pesan baru
          const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
          handleNewMessage(randomMessage);
        }
      }, 10000);
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [isActive, userId, handleNewMessage]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={() => setShowPanel(!showPanel)}
      >
        <MessageCircle className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-hidden rounded-md bg-gray-800 border border-gray-700 shadow-lg z-50">
          <Card className="bg-gray-800 border-0 shadow-none m-0">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-white flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Notifikasi Chat
              </h3>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSound}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleNotifications}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                >
                  {isActive ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPanel(false)}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="h-10 w-10 mx-auto text-gray-500" />
                  <p className="text-gray-400 mt-2">Tidak ada notifikasi chat</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700 max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 ${!notification.isRead ? 'bg-gray-750' : ''}`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-white flex items-center">
                          {notification.sender}
                          {!notification.isRead && (
                            <Badge variant="secondary" className="ml-2 h-4 text-xs bg-blue-900/50 text-blue-300">
                              Baru
                            </Badge>
                          )}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p 
                        className="text-sm text-gray-300 mt-1 cursor-pointer hover:underline" 
                        onClick={() => openNotification(notification)}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {notifications.length > 0 && (
                <div className="p-2 border-t border-gray-700 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-gray-300 hover:text-white"
                  >
                    Tandai semua sudah dibaca
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay untuk menutup panel saat klik di luar */}
      {showPanel && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowPanel(false)}
        ></div>
      )}
    </div>
  );
}