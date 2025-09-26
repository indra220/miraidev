"use client";

import { useState } from "react";
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
  Eye,
  Users,
  FolderOpen,
  X
} from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  client: string;
  date: string;
  views: string;
  tags: string[];
}

export default function PortfolioManagement() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: 1,
      title: "Website Kedai Kopi Lokal",
      category: "UMKM",
      description: "Website profesional untuk kedai kopi lokal dengan menu online, lokasi, dan informasi kontak.",
      client: "Kedai Kopi Nusantara",
      date: "Maret 2024",
      views: "850",
      tags: ["Next.js", "Tailwind CSS", "Vercel"]
    },
    {
      id: 2,
      title: "Portofolio Fotografer Freelance",
      category: "Personal Branding",
      description: "Website portofolio yang menampilkan karya fotografer freelance dengan galeri interaktif.",
      client: "Andi Prasetyo Photography",
      date: "Januari 2024",
      views: "1.2K",
      tags: ["React", "Framer Motion", "Cloudinary"]
    },
    {
      id: 3,
      title: "Website PPDB SD Negeri 01",
      category: "PPDB",
      description: "Website sistem PPDB online untuk SD Negeri 01 dengan form registrasi dan tracking status pendaftaran.",
      client: "SD Negeri 01 Jakarta",
      date: "September 2023",
      views: "2.1K",
      tags: ["Next.js", "Firebase", "Tailwind CSS"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    }
  };

  const handleSave = (item: PortfolioItem) => {
    if (currentItem) {
      // Update existing item
      setPortfolioItems(portfolioItems.map(p => p.id === item.id ? item : p));
    } else {
      // Add new item
      const newItem = { ...item, id: Date.now() };
      setPortfolioItems([...portfolioItems, newItem]);
    }
    setIsModalOpen(false);
  };

  const filteredItems = portfolioItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-white">Manajemen Portofolio</h1>
          <p className="text-gray-300 mt-2">Kelola proyek portofolio Anda</p>
        </div>
        <Button 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6" 
          onClick={handleAddNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Proyek
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari proyek..."
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Portfolio Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden bg-white/5 backdrop-blur-sm border border-gray-700/50 hover:bg-white/10 transition-all duration-200">
            <div className="h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 relative flex items-center justify-center">
              <div className="absolute top-2 right-2">
                <span className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
              <FolderOpen className="h-10 w-10 text-gray-300/50" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600/30">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {item.client}
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {item.views}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="border-red-600/50 text-red-400 hover:bg-red-600/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for adding/editing portfolio items */}
      {isModalOpen && (
        <PortfolioModal 
          item={currentItem}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onSave: (item: PortfolioItem) => void;
  onClose: () => void;
}

function PortfolioModal({ item, onSave, onClose }: PortfolioModalProps) {
  const [formData, setFormData] = useState<PortfolioItem>(
    item || {
      id: 0,
      title: "",
      category: "",
      description: "",
      client: "",
      date: "",
      views: "",
      tags: []
    }
  );

  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
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
              {item ? "Edit Proyek" : "Tambah Proyek Baru"}
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
              <Label htmlFor="title" className="text-gray-300">Judul Proyek</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
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
                value={formData.category}
                onChange={handleInputChange}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="client" className="text-gray-300">Klien</Label>
              <Input
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="date" className="text-gray-300">Tanggal</Label>
              <Input
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="views" className="text-gray-300">Jumlah Views</Label>
              <Input
                id="views"
                name="views"
                value={formData.views}
                onChange={handleInputChange}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-300">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Tags</Label>
              <div className="flex mt-1">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Tambah tag..."
                  className="flex-1 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  className="ml-2 bg-gray-700 hover:bg-gray-600"
                >
                  Tambah
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-600/30 text-blue-300 text-sm px-2 py-1 rounded flex items-center border border-blue-600/30"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
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