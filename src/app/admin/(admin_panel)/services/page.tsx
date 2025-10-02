"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Palette,
  Code,
  Smartphone,
  ShoppingCart,
  Globe,
  Users,
  Settings
} from "lucide-react";
import { servicesAdminService } from "@/lib/admin-service";
import { ServiceItem } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function ServicesManagement() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data layanan dari API saat komponen dimuat
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const items = await servicesAdminService.getAll();
        setServices(items);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Gagal mengambil data layanan. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fungsi untuk menyegarkan data
  const refreshData = async () => {
    try {
      setLoading(true);
      const items = await servicesAdminService.getAll();
      setServices(items);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Gagal mengambil data layanan. Silakan coba lagi nanti.');
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: ServiceItem) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
      try {
        await servicesAdminService.delete(id);
        // Hapus item dari state
        setServices(services.filter(service => service.id !== id));
      } catch (err) {
        console.error('Error deleting service:', err);
        alert('Gagal menghapus layanan. Silakan coba lagi.');
      }
    }
  };

  const handleSave = async (service: ServiceItem) => {
    try {
      let savedService: ServiceItem;
      if (currentService) {
        // Update existing item
        savedService = await servicesAdminService.update(service);
        setServices(services.map(s => s.id === service.id ? savedService : s));
      } else {
        // Add new item
        savedService = await servicesAdminService.create({
          title: service.title,
          category: service.category,
          description: service.description,
          features: service.features,
          icon: service.icon,
          order: service.order,
          is_active: true, // Tambahkan field is_active
          price: 0, // Tambahkan field price
          user_id: service.user_id || '', // Tambahkan field user_id
        });
        setServices([...services, savedService]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving service:', err);
      alert('Gagal menyimpan layanan. Silakan coba lagi.');
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
        <h1 className="text-3xl font-bold text-white">Manajemen Layanan</h1>
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

  const filteredServices = services.filter(service =>
    service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fungsi untuk mendapatkan ikon berdasarkan nama
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case "Code": return <Code className="h-10 w-10 text-gray-300/50" />;
      case "Palette": return <Palette className="h-10 w-10 text-gray-300/50" />;
      case "Smartphone": return <Smartphone className="h-10 w-10 text-gray-300/50" />;
      case "ShoppingCart": return <ShoppingCart className="h-10 w-10 text-gray-300/50" />;
      case "Globe": return <Globe className="h-10 w-10 text-gray-300/50" />;
      case "Users": return <Users className="h-10 w-10 text-gray-300/50" />;
      case "Settings": return <Settings className="h-10 w-10 text-gray-300/50" />;
      default: return <Code className="h-10 w-10 text-gray-300/50" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-white">Manajemen Layanan</h1>
          <p className="text-gray-300 mt-2">Kelola layanan yang ditawarkan oleh MiraiDev</p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6" 
          onClick={handleAddNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Layanan
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari layanan..."
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="overflow-hidden bg-white/5 backdrop-blur-sm border border-gray-700/50 hover:bg-white/10 transition-all duration-200">
            <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 relative flex items-center justify-center">
              <div className="absolute top-2 right-2">
                <span className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                  {service.category}
                </span>
              </div>
              {getIcon(service.icon || "Code")}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white text-lg">{service.title}</h3>
              <p className="text-sm text-gray-400 mt-2">{service.description}</p>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Fitur:</h4>
                <ul className="space-y-1">
                  {(service.features || []).map((feature, index) => (
                    <li key={index} className="text-xs text-gray-400 flex items-start">
                      <span className="mr-2">•</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(service)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                  className="border-red-600/50 text-red-400 hover:bg-red-600/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for adding/editing services */}
      {isModalOpen && (
        <ServiceModal 
          service={currentService}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

interface ServiceModalProps {
  service: ServiceItem | null;
  onSave: (service: ServiceItem) => void;
  onClose: () => void;
}

function ServiceModal({ service, onSave, onClose }: ServiceModalProps) {
  const [formData, setFormData] = useState<ServiceItem>(
    service || {
      id: 0,
      title: "",
      category: "",
      description: null,
      features: null,
      icon: null,
      order: 0,
      is_active: true,
      price: 0,
      user_id: "", // Tambahkan field user_id
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  );

  const [featureInput, setFeatureInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value || null });
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = formData.features || [];
      if (!currentFeatures.includes(featureInput.trim())) {
        setFormData({
          ...formData,
          features: [...currentFeatures, featureInput.trim()]
        });
        setFeatureInput("");
      }
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    const currentFeatures = formData.features || [];
    setFormData({
      ...formData,
      features: currentFeatures.filter(feature => feature !== featureToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800/90 border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              {service ? "Edit Layanan" : "Tambah Layanan Baru"}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Judul Layanan</Label>
              <Input
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-gray-300">Kategori</Label>
              <Input
                id="category"
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="icon" className="text-gray-300">Ikon</Label>
              <select
                id="icon"
                name="icon"
                value={formData.icon || "Code"}
                onChange={handleInputChange}
                className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 rounded-md px-3 py-2"
              >
                <option value="Code">Code (Pengembangan)</option>
                <option value="Palette">Palette (Desain)</option>
                <option value="Smartphone">Smartphone (Mobile)</option>
                <option value="ShoppingCart">ShoppingCart (E-commerce)</option>
                <option value="Globe">Globe (Web)</option>
                <option value="Users">Users (Konsultasi)</option>
                <option value="Settings">Settings (Pemeliharaan)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="order" className="text-gray-300">Urutan</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order || 0}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Status Aktif</Label>
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active || false}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="is_active" className="ml-2 text-gray-300">
                    Layanan Aktif
                  </Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="price" className="text-gray-300">Harga</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-300">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={3}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Fitur</Label>
              <div className="flex mt-1">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Tambah fitur..."
                  className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddFeature}
                  className="ml-2 bg-gray-700 hover:bg-gray-600"
                >
                  Tambah
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.features || []).map((feature, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-600/30 text-blue-300 text-sm px-2 py-1 rounded flex items-center border border-blue-600/30"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="ml-1 text-blue-200 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Batal
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}