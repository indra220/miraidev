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
  Eye,
  Users,
  FolderOpen,
  X
} from "lucide-react";
import { portfolioAdminService } from "@/lib/admin-service";
import { PortfolioItem } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AlertDialog, AlertDialogResult } from "@/components/AlertDialog";
import { useDialog } from "@/hooks/useDialog";

export default function PortfolioManagement() {
  useEffect(() => {
    document.title = "Manajemen Portofolio | MiraiDev";
  }, []);

  const { 
    alertDialogState, 
    showAlertDialog, 
    closeAlertDialog,
    alertResultState,
    showAlertResult,
    closeAlertResult
  } = useDialog();
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Ambil data portfolio dari API saat komponen dimuat
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        const items = await portfolioAdminService.getAll();
        setPortfolioItems(items);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching portfolio items:', err);
        setError('Gagal mengambil data portofolio. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  // Fungsi untuk menyegarkan data
  const refreshData = async () => {
    try {
      setLoading(true);
      const items = await portfolioAdminService.getAll();
      setPortfolioItems(items);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching portfolio items:', err);
      setError('Gagal mengambil data portofolio. Silakan coba lagi nanti.');
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    showAlertDialog(
      "Konfirmasi Penghapusan",
      "Apakah Anda yakin ingin menghapus item portofolio ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        try {
          await portfolioAdminService.delete(id);
          // Hapus item dari state
          setPortfolioItems(portfolioItems.filter(item => item.id !== id));
          showAlertResult("Berhasil", "Item portofolio telah dihapus.");
        } catch (err) {
          console.error('Error deleting portfolio item:', err);
          showAlertResult("Gagal", "Gagal menghapus item portofolio. Silakan coba lagi.");
        }
      },
      "destructive"
    );
  };

  const handleSave = async (item: PortfolioItem) => {
    try {
      let savedItem: PortfolioItem;
      if (currentItem) {
        // Update existing item
        savedItem = await portfolioAdminService.update(item);
        setPortfolioItems(portfolioItems.map(p => p.id === item.id ? savedItem : p));
        showAlertResult("Berhasil", "Item portofolio berhasil diperbarui.");
      } else {
        // Add new item
        savedItem = await portfolioAdminService.create({
          title: item.title,
          category: item.category,
          description: item.description,
          client: item.client,
          date: item.date,
          views: item.views,
          image_url: item.image_url,
          tags: item.tags,
          case_study_url: item.case_study_url,
        });
        setPortfolioItems([...portfolioItems, savedItem]);
        showAlertResult("Berhasil", "Item portofolio baru berhasil ditambahkan.");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving portfolio item:', err);
      showAlertResult("Gagal", "Gagal menyimpan item portofolio. Silakan coba lagi.");
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
        <h1 className="text-3xl font-bold text-white">Manajemen Portofolio</h1>
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

  const filteredItems = portfolioItems.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.client?.toLowerCase().includes(searchTerm.toLowerCase())
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
                {item.tags?.map((tag, index) => (
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
      
      {/* AlertDialog for confirmations */}
      <AlertDialog
        isOpen={alertDialogState.isOpen}
        title={alertDialogState.title}
        description={alertDialogState.description}
        onConfirm={() => {
          if (alertDialogState.onConfirm) alertDialogState.onConfirm();
          closeAlertDialog();
        }}
        onClose={closeAlertDialog}
        variant={alertDialogState.variant}
      />
      
      {/* AlertDialog for results/notifications */}
      <AlertDialogResult
        isOpen={alertResultState.isOpen}
        title={alertResultState.title}
        description={alertResultState.description}
        onClose={closeAlertResult}
      />
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
      description: null,
      client: null,
      date: null,
      views: 0,
      tags: null,
      image_url: null,
      case_study_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  );

  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value || null });
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = formData.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...currentTags, tagInput.trim()]
        });
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formData.tags || [];
    setFormData({
      ...formData,
      tags: currentTags.filter(tag => tag !== tagToRemove)
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
              <Label htmlFor="client" className="text-gray-300">Klien</Label>
              <Input
                id="client"
                name="client"
                value={formData.client || ""}
                onChange={handleInputChange}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="date" className="text-gray-300">Tanggal</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date || ""}
                onChange={handleInputChange}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="views" className="text-gray-300">Jumlah Views</Label>
              <Input
                id="views"
                name="views"
                type="number"
                value={formData.views || 0}
                onChange={(e) => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="image_url" className="text-gray-300">URL Gambar</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url || ""}
                onChange={handleInputChange}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div>
              <Label htmlFor="case_study_url" className="text-gray-300">URL Studi Kasus</Label>
              <Input
                id="case_study_url"
                name="case_study_url"
                value={formData.case_study_url || ""}
                onChange={handleInputChange}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
              />
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
                {(formData.tags || []).map((tag, index) => (
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