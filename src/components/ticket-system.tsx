import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  User, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  Globe,
  CheckCircle,
  Circle,
  AlertCircle,
  ArrowUpDown,
  Search,
  Plus,
  Filter
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  updatedAt: Date;
  assignee?: string;
  category: string;
  contactMethod: 'email' | 'phone' | 'web';
  tags?: string[];
}

interface TicketSystemProps {
  initialTickets: Ticket[];
  agents: { id: string; name: string }[];
  categories: string[];
  onTicketUpdate: (ticket: Ticket) => void;
  onTicketCreate: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
}

export default function TicketSystem({ 
  initialTickets, 
  agents, 
  categories,
  onTicketCreate
}: TicketSystemProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form untuk tiket baru
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: categories[0] || '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    contactMethod: 'web' as 'email' | 'phone' | 'web',
    tags: [] as string[]
  });

  // Filter tiket berdasarkan status, prioritas, dan penugasan
  const applyFilters = () => {
    let result = [...tickets];
    
    if (filterStatus !== 'all') {
      result = result.filter(ticket => ticket.status === filterStatus);
    }
    
    if (filterPriority !== 'all') {
      result = result.filter(ticket => ticket.priority === filterPriority);
    }
    
    if (filterAssignee !== 'all') {
      result = result.filter(ticket => ticket.assignee === filterAssignee);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(term) || 
        ticket.description.toLowerCase().includes(term) ||
        ticket.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredTickets(result);
  };

  // Terapkan filter setiap kali filter berubah
  useState(() => {
    applyFilters();
  });

  // Fungsi untuk memperbarui status tiket
  const updateTicketStatus = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(prev => {
      const updated = prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, updatedAt: new Date() } 
          : ticket
      );
      applyFilters();
      return updated;
    });
    
    // Update juga tiket yang sedang dipilih jika sesuai
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        updatedAt: new Date()
      });
    }
  };

  // Fungsi untuk menetapkan agen ke tiket
  const assignTicket = (ticketId: string, assigneeId: string) => {
    setTickets(prev => {
      const updated = prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, assignee: assigneeId, updatedAt: new Date() } 
          : ticket
      );
      applyFilters();
      return updated;
    });
    
    // Update juga tiket yang sedang dipilih jika sesuai
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        assignee: assigneeId,
        updatedAt: new Date()
      });
    }
  };

  // Fungsi untuk membuat tiket baru
  const handleCreateTicket = () => {
    const ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
      ...newTicket,
      tags: newTicket.tags
    };
    
    onTicketCreate(ticket);
    
    // Reset form
    setNewTicket({
      title: '',
      description: '',
      category: categories[0] || '',
      priority: 'medium',
      contactMethod: 'web',
      tags: []
    });
    setShowCreateForm(false);
  };

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-900/30 text-green-400 border border-green-900/50';
      case 'in-progress': return 'bg-blue-900/30 text-blue-400 border border-blue-900/50';
      case 'on-hold': return 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  // Fungsi untuk mendapatkan ikon status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'closed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Circle className="h-4 w-4 animate-pulse" />;
      case 'on-hold': return <AlertCircle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  // Fungsi untuk mendapatkan warna prioritas
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-900/30 text-red-400 border border-red-900/50';
      case 'high': return 'bg-orange-900/30 text-orange-400 border border-orange-900/50';
      case 'medium': return 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  // Fungsi untuk mendapatkan ikon metode kontak
  const getContactIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
              <CardTitle className="text-white">Sistem Tiket Dukungan</CardTitle>
            </div>
            <CardDescription className="text-gray-400 mt-1">
              Kelola dan pantau tiket dukungan pelanggan
            </CardDescription>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Buat Tiket Baru
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Form untuk membuat tiket baru */}
        {showCreateForm && (
          <Card className="mb-6 bg-gray-750 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Buat Tiket Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketTitle" className="text-gray-200">
                    Judul Tiket
                  </Label>
                  <Input
                    id="ticketTitle"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    placeholder="Deskripsikan masalah secara singkat..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticketCategory" className="text-gray-200">
                    Kategori
                  </Label>
                  <Select 
                    value={newTicket.category} 
                    onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="ticketDescription" className="text-gray-200">
                  Deskripsi
                </Label>
                <Textarea
                  id="ticketDescription"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                  placeholder="Jelaskan masalah secara rinci..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketPriority" className="text-gray-200">
                    Prioritas
                  </Label>
                  <Select 
                    value={newTicket.priority} 
                    onValueChange={(value: string) => {
                      const priority = value as 'low' | 'medium' | 'high' | 'critical';
                      setNewTicket({...newTicket, priority});
                    }}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="low">Rendah</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="high">Tinggi</SelectItem>
                      <SelectItem value="critical">Kritis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactMethod" className="text-gray-200">
                    Metode Kontak
                  </Label>
                  <Select 
                    value={newTicket.contactMethod} 
                    onValueChange={(value: 'email' | 'phone' | 'web') => setNewTicket({...newTicket, contactMethod: value})}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Telepon</SelectItem>
                      <SelectItem value="web">Website</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-gray-600 text-gray-300 hover:text-white"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleCreateTicket}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Buat Tiket
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter dan Pencarian */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari tiket..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                applyFilters();
              }}
              className="pl-10 bg-gray-750 border-gray-600 text-white"
            />
          </div>
          <Select value={filterStatus} onValueChange={(value) => {
            setFilterStatus(value);
            applyFilters();
          }}>
            <SelectTrigger className="bg-gray-750 border-gray-600 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="open">Terbuka</SelectItem>
              <SelectItem value="in-progress">Dalam Proses</SelectItem>
              <SelectItem value="closed">Selesai</SelectItem>
              <SelectItem value="on-hold">Ditahan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={(value) => {
            setFilterPriority(value);
            applyFilters();
          }}>
            <SelectTrigger className="bg-gray-750 border-gray-600 text-white">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Prioritas" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Semua Prioritas</SelectItem>
              <SelectItem value="low">Rendah</SelectItem>
              <SelectItem value="medium">Sedang</SelectItem>
              <SelectItem value="high">Tinggi</SelectItem>
              <SelectItem value="critical">Kritis</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAssignee} onValueChange={(value) => {
            setFilterAssignee(value);
            applyFilters();
          }}>
            <SelectTrigger className="bg-gray-750 border-gray-600 text-white">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Agen" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="all">Semua Agen</SelectItem>
              {agents.map(agent => (
                <SelectItem key={agent.id} value={agent.name}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar Tiket */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-medium text-white mb-3">Daftar Tiket</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-10 w-10 mx-auto text-gray-600" />
                  <p className="mt-2">Tidak ada tiket yang ditemukan</p>
                </div>
              ) : (
                filteredTickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id
                        ? 'bg-blue-900/20 border-blue-700'
                        : 'bg-gray-750 border-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white line-clamp-1">{ticket.title}</h4>
                      <div className="flex space-x-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1 capitalize">{ticket.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{ticket.createdAt.toLocaleDateString('id-ID')}</span>
                      <span className="mx-1">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{ticket.priority}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      {getContactIcon(ticket.contactMethod)}
                      <span className="ml-1 capitalize">{ticket.contactMethod}</span>
                      {ticket.assignee && (
                        <>
                          <span className="mx-1">•</span>
                          <User className="h-3 w-3 mr-1" />
                          <span>{ticket.assignee}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detail Tiket */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <Card className="bg-gray-750 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-white">{selectedTicket.title}</h3>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                          {getStatusIcon(selectedTicket.status)}
                          <span className="ml-1 capitalize">{selectedTicket.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                          <Circle className="h-3 w-3 mr-1" />
                          {selectedTicket.priority}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          {getContactIcon(selectedTicket.contactMethod)}
                          <span className="ml-1 capitalize">{selectedTicket.contactMethod}</span>
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {selectedTicket.createdAt.toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Select 
                        value={selectedTicket.status} 
                        onValueChange={(value: Ticket['status']) => updateTicketStatus(selectedTicket.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="open">Terbuka</SelectItem>
                          <SelectItem value="in-progress">Dalam Proses</SelectItem>
                          <SelectItem value="closed">Selesai</SelectItem>
                          <SelectItem value="on-hold">Ditahan</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select 
                        value={selectedTicket.assignee || ''} 
                        onValueChange={(value) => assignTicket(selectedTicket.id, value)}
                      >
                        <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                          <User className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Agen" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="">Tidak Ditugaskan</SelectItem>
                          {agents.map(agent => (
                            <SelectItem key={agent.id} value={agent.name}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none mb-4">
                    <p className="text-gray-300">{selectedTicket.description}</p>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="font-medium text-white mb-2">Detail Tiket</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Kategori</p>
                        <p className="text-white">{selectedTicket.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Dibuat</p>
                        <p className="text-white">{selectedTicket.createdAt.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Diperbarui</p>
                        <p className="text-white">{selectedTicket.updatedAt.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Ditugaskan ke</p>
                        <p className="text-white">{selectedTicket.assignee || 'Belum ditugaskan'}</p>
                      </div>
                    </div>
                    
                    {selectedTicket.tags && selectedTicket.tags.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm">Tag</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedTicket.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-900/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-750 border-gray-700 h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-600" />
                  <h3 className="text-lg font-medium text-white mt-4">Pilih Tiket</h3>
                  <p className="text-gray-400 mt-2">
                    Pilih tiket dari daftar untuk melihat detail dan mengelolanya
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}