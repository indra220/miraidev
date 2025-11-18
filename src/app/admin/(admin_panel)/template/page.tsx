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
  FolderOpen,
  X,
  Github,
  Link2,
  DollarSign,
  ImageIcon,
} from "lucide-react";
import { portfolioAdminService } from "@/lib/admin-service";
import { PortfolioItem } from "@/lib/types";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AlertDialog, AlertDialogResult } from "@/components/AlertDialog";
import { useDialog } from "@/hooks/useDialog";
import Image from "next/image";

export default function TemplateManagement() {
  useEffect(() => {
    document.title = "Manajemen Template";
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

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await portfolioAdminService.getAll();
      setPortfolioItems(items);
    } catch (err) {
      console.error('Error fetching portfolio items:', err);
      setError('Gagal mengambil data template. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

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
      "Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.",
      async () => {
        try {
          await portfolioAdminService.delete(id);
          setPortfolioItems(portfolioItems.filter(item => item.id !== id));
          showAlertResult("Berhasil", "Item telah dihapus.");
        } catch (err) {
          console.error('Error deleting template item:', err);
          showAlertResult("Gagal", "Gagal menghapus item. Silakan coba lagi.");
        }
      },
      "destructive"
    );
  };

  const handleSave = async (item: PortfolioItem) => {
    try {
      let savedItem: PortfolioItem;
      const itemData = {
        title: item.title,
        category: item.category,
        description: item.description,
        date: item.date,
        views: item.views,
        tags: item.tags,
        preview_url: item.preview_url,
        price: item.price,
        use_url: item.use_url,
        image_urls: item.image_urls,
      };

      if (!item.id || item.id === 0) {
        savedItem = await portfolioAdminService.create(itemData);
        setPortfolioItems([savedItem, ...portfolioItems]);
        showAlertResult("Berhasil", "Item baru berhasil ditambahkan.");
      } else {
        savedItem = await portfolioAdminService.update({ ...item, ...itemData });
        setPortfolioItems(portfolioItems.map(p => p.id === item.id ? savedItem : p));
        showAlertResult("Berhasil", "Item berhasil diperbarui.");
      }
      setIsModalOpen(false);
      setCurrentItem(null);
    } catch (err) {
      console.error('Error saving template item:', err);
      showAlertResult("Gagal", "Gagal menyimpan item. Silakan coba lagi.");
    }
  };

  const filteredItems = portfolioItems.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
          <div>
            <h1 className="text-3xl font-bold text-white">Manajemen Template</h1>
            <p className="text-gray-300 mt-2">Kelola template yang ditampilkan di situs Anda</p>
          </div>
          <Button 
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 px-6" 
            onClick={handleAddNew}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Template
          </Button>
        </div>

      <Card className="p-4 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari template..."
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="mt-6 p-6 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
          <p className="text-red-300">{error}</p>
          <Button className="mt-4 bg-red-700 hover:bg-red-600" onClick={fetchPortfolioItems}>
            Coba Lagi
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-white/5 backdrop-blur-sm border border-gray-700/50 hover:bg-white/10 transition-all duration-200">
              <div className="h-48 bg-gray-800 relative flex items-center justify-center">
                 {item.image_urls && item.image_urls.length > 0 ? (
                    <Image src={item.image_urls[0]} alt={item.title} width={400} height={300} className="w-full h-full object-cover" />
                 ) : (
                    <FolderOpen className="h-16 w-16 text-gray-600" />
                 )}
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                  <div className="flex items-center font-bold text-green-400">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {item.price === 0 ? 'Gratis' : `Rp ${item.price?.toLocaleString('id-ID')}`}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {item.views || 0} views
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)} className="border-gray-600 text-gray-300 hover:bg-gray-700/50">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="border-red-600/50 text-red-400 hover:bg-red-600/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <TemplateModal
          item={currentItem}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentItem(null);
          }}
        />
      )}
      
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
      
      <AlertDialogResult
        isOpen={alertResultState.isOpen}
        title={alertResultState.title}
        description={alertResultState.description}
        onClose={closeAlertResult}
      />
    </div>
  </>
);
}

interface TemplateModalProps {
  item: PortfolioItem | null;
  onSave: (item: PortfolioItem) => void;
  onClose: () => void;
}

function TemplateModal({ item, onSave, onClose }: TemplateModalProps) {
  const [formData, setFormData] = useState<PortfolioItem>(
    item || {
      id: 0,
      title: "",
      category: "",
      description: null,
      date: null,
      views: 0,
      tags: [],
      preview_url: null,
      price: 0,
      use_url: null,
      image_urls: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  );

  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === 'number' ? (parseInt(value) || 0) : (value || null) });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...(formData.image_urls || [])];
    newImageUrls[index] = value;
    setFormData({ ...formData, image_urls: newImageUrls });
  };

  const addImageUrl = () => {
    const newImageUrls = [...(formData.image_urls || []), ""];
    setFormData({ ...formData, image_urls: newImageUrls });
  };

  const removeImageUrl = (index: number) => {
    const newImageUrls = (formData.image_urls || []).filter((_, i) => i !== index);
    setFormData({ ...formData, image_urls: newImageUrls });
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = formData.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...currentTags, tagInput.trim()] });
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: (formData.tags || []).filter(tag => tag !== tagToRemove) });
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
              {item && item.id !== 0 ? "Edit Template" : "Tambah Template Baru"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Judul Template</Label>
              <Input id="title" name="title" value={formData.title || ""} onChange={handleInputChange} required className="bg-gray-700/50 border-gray-600 text-white"/>
            </div>

            <div>
              <Label className="text-gray-300 flex items-center mb-2">
                <ImageIcon className="w-4 h-4 mr-2" />
                URL Gambar
              </Label>
              <div className="space-y-2">
                {(formData.image_urls || []).map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder={`URL Gambar ${index + 1}`}
                      value={url}
                      onChange={(e) => handleImageUrlChange(index, e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => removeImageUrl(index)} className="border-red-600/50 text-red-400 hover:bg-red-600/20">
                      Hapus
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addImageUrl} className="border-gray-600 text-gray-300 hover:bg-gray-700/50">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah URL Gambar
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-gray-300">Kategori</Label>
                <Input id="category" name="category" value={formData.category || ""} onChange={handleInputChange} required className="bg-gray-700/50 border-gray-600 text-white"/>
              </div>
              <div>
                <Label htmlFor="price" className="text-gray-300 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Harga (Rp)
                </Label>
                <Input id="price" name="price" type="number" value={formData.price || 0} onChange={handleInputChange} className="bg-gray-700/50 border-gray-600 text-white"/>
                <p className="text-xs text-gray-500 mt-1">Isi 0 jika gratis.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preview_url" className="text-gray-300 flex items-center">
                  <Link2 className="w-4 h-4 mr-2" /> URL Preview
                </Label>
                <Input id="preview_url" name="preview_url" value={formData.preview_url || ""} onChange={handleInputChange} className="bg-gray-700/50 border-gray-600 text-white"/>
              </div>
              <div>
                <Label htmlFor="use_url" className="text-gray-300 flex items-center">
                  <Github className="w-4 h-4 mr-2" /> URL "Gunakan"
                </Label>
                <Input id="use_url" name="use_url" value={formData.use_url || ""} onChange={handleInputChange} className="bg-gray-700/50 border-gray-600 text-white"/>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-300">Deskripsi</Label>
              <Textarea id="description" name="description" value={formData.description || ""} onChange={handleInputChange} rows={3} className="bg-gray-700/50 border-gray-600 text-white"/>
            </div>
            
            <div>
              <Label className="text-gray-300">Tags</Label>
              <div className="flex mt-1">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Tambah tag..." className="flex-1 bg-gray-700/50 border-gray-600 text-white" onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} />
                <Button type="button" onClick={handleAddTag} className="ml-2 bg-gray-700 hover:bg-gray-600">
                  Tambah
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.tags || []).map((tag, index) => (
                  <span key={index} className="bg-blue-600/30 text-blue-300 text-sm px-2 py-1 rounded flex items-center border border-blue-600/30">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-blue-200 hover:text-white">×</button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-700">Batal</Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">Simpan</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}