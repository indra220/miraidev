"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  Filter,
  Eye,
  Reply,
  Archive,
  User,
  MessageCircle
} from "lucide-react";
import { contactAdminService } from "@/lib/admin-service";
import { ContactSubmission } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function ContactManagement() {
  useEffect(() => {
    document.title = "Manajemen Pesan Kontak | MiraiDev";
  }, []);

  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [priorityFilter, setPriorityFilter] = useState<string>("semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data pesan kontak dari API saat komponen dimuat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const items = await contactAdminService.getAll();
        setMessages(items);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contact messages:', err);
        setError('Gagal mengambil data pesan kontak. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Fungsi untuk menyegarkan data
  const refreshData = async () => {
    try {
      setLoading(true);
      const items = await contactAdminService.getAll();
      setMessages(items);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
      setError('Gagal mengambil data pesan kontak. Silakan coba lagi nanti.');
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'baru' | 'dibaca' | 'diarsipkan') => {
    try {
      const messageToUpdate = messages.find(msg => msg.id === id);
      if (!messageToUpdate) return;
      
      const updatedMessage = await contactAdminService.update({
        ...messageToUpdate,
        status: newStatus
      });
      // Update item di state
      setMessages(messages.map(msg => 
        msg.id === id ? updatedMessage : msg
      ));
    } catch (err) {
      console.error('Error updating message status:', err);
      alert('Gagal memperbarui status pesan. Silakan coba lagi.');
    }
  };

  const handleArchiveMessage = async (id: string) => {
    try {
      const messageToUpdate = messages.find(msg => msg.id === id);
      if (!messageToUpdate) return;
      
      const updatedMessage = await contactAdminService.update({
        ...messageToUpdate,
        status: 'diarsipkan'
      });
      // Update item di state
      setMessages(messages.map(msg => 
        msg.id === id ? updatedMessage : msg
      ));
    } catch (err) {
      console.error('Error archiving message:', err);
      alert('Gagal mengarsipkan pesan. Silakan coba lagi.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Manajemen Pesan Kontak</h1>
        <div className="mt-6 p-6 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
          <p className="text-red-300">{error}</p>
          <Button 
            className="mt-4 bg-red-700 hover:bg-red-600"
            onClick={refreshData}
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "semua" || message.status === statusFilter;
    const matchesPriority = priorityFilter === "semua" || message.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Manajemen Pesan Kontak</h1>
        <p className="text-gray-300 mt-2">Kelola pesan dari formulir kontak website</p>
      </div>

      {/* Filters and Search */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              placeholder="Cari nama, email, atau pesan..."
              className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 rounded-md px-3 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/90 border-gray-700 text-gray-200">
                <SelectItem value="semua">Semua Status</SelectItem>
                <SelectItem value="baru">Baru</SelectItem>
                <SelectItem value="dibaca">Dibaca</SelectItem>
                <SelectItem value="diarsipkan">Diarsipkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full pl-10 bg-gray-800/50 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/90 border-gray-700 text-gray-200">
                <SelectItem value="semua">Semua Prioritas</SelectItem>
                <SelectItem value="tinggi">Tinggi</SelectItem>
                <SelectItem value="sedang">Sedang</SelectItem>
                <SelectItem value="rendah">Rendah</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card className="p-8 text-center bg-white/5 backdrop-blur-sm border border-gray-700/50">
            <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300">Tidak ada pesan</h3>
            <p className="text-gray-500">Tidak ditemukan pesan yang sesuai dengan filter Anda.</p>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50 hover:bg-white/10 transition-all duration-200 ${
                message.status === "baru" ? "border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-700/50 p-2 rounded-lg">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{message.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        message.priority === "tinggi" 
                          ? "bg-red-900/30 text-red-400 border border-red-900/50" 
                          : message.priority === "sedang" 
                            ? "bg-yellow-900/30 text-yellow-400 border border-yellow-900/50" 
                            : "bg-green-900/30 text-green-400 border border-green-900/50"
                      }`}
                    >
                      {message.priority}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center text-gray-400">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{message.email}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{message.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{message.created_at.split('T')[0]}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-1">Subjek:</h4>
                    <p className="text-white">{message.subject}</p>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-300 mb-1">Pesan:</h4>
                    <p className="text-gray-300 bg-gray-800/30 p-3 rounded-lg max-w-full overflow-x-auto">
                      {message.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 min-w-[150px]">
                  <Badge 
                    className={`${
                      message.status === "baru" 
                        ? "bg-blue-900/30 text-blue-400 border border-blue-900/50" 
                        : message.status === "dibaca" 
                          ? "bg-green-900/30 text-green-400 border border-green-900/50" 
                          : "bg-gray-700/30 text-gray-400 border border-gray-700/50"
                    }`}
                  >
                    {message.status}
                  </Badge>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Balas
                  </Button>
                  
                  {message.status !== "diarsipkan" ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleArchiveMessage(message.id)}
                      className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
                    >
                      <Archive className="h-4 w-4 mr-1" />
                      Arsipkan
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(message.id, "dibaca")}
                      className="border-green-600/50 text-green-400 hover:bg-green-600/20"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Batal Arsip
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}