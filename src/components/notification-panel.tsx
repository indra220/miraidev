'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface NotificationPanelProps {
  initialNotifications?: Notification[];
}

export default function NotificationPanel({ 
  initialNotifications = [] 
}: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  // Menambahkan beberapa notifikasi contoh
  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications([
        {
          id: '1',
          title: 'Proyek Baru Dibuat',
          description: 'Proyek "Website Company Profile" telah dibuat oleh John Doe',
          timestamp: new Date(Date.now() - 3600000),
          read: false,
          type: 'info'
        },
        {
          id: '2',
          title: 'Pembayaran Diterima',
          description: 'Pembayaran untuk proyek "E-commerce Platform" telah diterima',
          timestamp: new Date(Date.now() - 7200000),
          read: false,
          type: 'success'
        },
        {
          id: '3',
          title: 'Tiket Dukungan Baru',
          description: 'Tiket dukungan #TK-2023-001 telah dibuat oleh Jane Smith',
          timestamp: new Date(Date.now() - 10800000),
          read: true,
          type: 'warning'
        }
      ]);
    }
  }, [notifications.length]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Warna berdasarkan tipe notifikasi
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-hidden rounded-md bg-gray-800 border border-gray-700 shadow-lg z-50">
          <Card className="bg-gray-800 border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Notifikasi</CardTitle>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-gray-300 hover:text-white"
                  >
                    Tandai semua sudah dibaca
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-80">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-400 py-4">Tidak ada notifikasi</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.read 
                          ? 'bg-gray-750 border-gray-700' 
                          : 'bg-gray-700 border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <div className={`mt-0.5 h-3 w-3 rounded-full ${getTypeColor(notification.type)}`}></div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{notification.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{notification.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.timestamp.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="mt-2 text-xs text-blue-400 hover:text-blue-300 p-0 h-auto"
                        >
                          Tandai sudah dibaca
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay untuk menutup panel saat klik di luar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}