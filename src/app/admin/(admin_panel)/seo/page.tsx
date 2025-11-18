"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Globe,
  Image as ImageIcon,
  Calendar,
  BarChart3,
  RotateCcw,
  Save,
  Eye,
  Settings
} from "lucide-react";
import { AlertDialog, AlertDialogResult } from "@/components/AlertDialog";
import { useDialog } from "@/hooks/useDialog";

interface FormSeoSettings {
  id: number;
  page: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  canonicalUrl: string | null;
  robotsIndex: boolean | null;
  robotsFollow: boolean | null;
  sitemapPriority: number | null;
  lastModified: string | null;
}

export default function SeoManagement() {
  useEffect(() => {
    document.title = "Manajemen SEO";
  }, []);

  const { 
    alertDialogState, 
    showAlertDialog, 
    closeAlertDialog,
    alertResultState,
    showAlertResult,
    closeAlertResult
  } = useDialog();
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _showAlertDialog = showAlertDialog; // Gunakan variabel untuk menghindari error ESLint
  
  const [seoData, setSeoData] = useState<FormSeoSettings[]>([
    {
      id: 1,
      page: "/",
      title: "MiraiDev - Agen Web Development Modern",
      description: "Kami menyediakan layanan pembuatan website profesional, e-commerce, dan aplikasi web modern untuk bisnis Anda.",
      keywords: "web development, website design, e-commerce, mirai dev",
      ogTitle: "MiraiDev - Solusi Web Development Terbaik",
      ogDescription: "Wujudkan website masa depan bisnis Anda bersama MiraiDev",
      ogImage: "https://miraidev.id/og-image-home.jpg",
      twitterTitle: "MiraiDev - Web Development Terbaik",
      twitterDescription: "Buat website profesional untuk bisnis Anda",
      twitterImage: "https://miraidev.id/twitter-image-home.jpg",
      canonicalUrl: "https://miraidev.id/",
      robotsIndex: true,
      robotsFollow: true,
      sitemapPriority: 1.0,
      lastModified: "2024-09-25"
    },
    {
      id: 2,
      page: "/layanan",
      title: "Layanan Pengembangan Website - MiraiDev",
      description: "Layanan pengembangan website profesional dari MiraiDev: website kustom, e-commerce, redesign, dan pemeliharaan.",
      keywords: "layanan web, website development, mirai dev",
      ogTitle: "Layanan Web Development Terbaik",
      ogDescription: "Temukan layanan pembuatan website terbaik dari MiraiDev",
      ogImage: "https://miraidev.id/og-image-services.jpg",
      twitterTitle: "Layanan Web Development Terbaik",
      twitterDescription: "Berbagai layanan untuk kebutuhan web Anda",
      twitterImage: "https://miraidev.id/twitter-image-services.jpg",
      canonicalUrl: "https://miraidev.id/layanan",
      robotsIndex: true,
      robotsFollow: true,
      sitemapPriority: 0.9,
      lastModified: "2024-09-20"
    },
    {
      id: 3,
      page: "/template",
      title: "Template Proyek Web - MiraiDev",
      description: "Lihat template proyek web development terbaik kami. Temukan contoh karya dan solusi yang telah kami buat.",
      keywords: "template web, contoh website, proyek web, mirai dev",
      ogTitle: "Template Proyek Web Development",
      ogDescription: "Lihat contoh proyek web yang berhasil kami kerjakan",
      ogImage: "https://miraidev.id/og-image-template.jpg",
      twitterTitle: "Template Proyek Web Development",
      twitterDescription: "Lihat karya terbaik kami",
      twitterImage: "https://miraidev.id/twitter-image-template.jpg",
      canonicalUrl: "https://miraidev.id/template",
      robotsIndex: true,
      robotsFollow: true,
      sitemapPriority: 0.8,
      lastModified: "2024-09-15"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<FormSeoSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (page: FormSeoSettings) => {
    setCurrentPage(page);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (currentPage) {
      setSeoData(seoData.map(p => p.page === currentPage.page ? currentPage : p));
      setIsEditing(false);
      setCurrentPage(null);
      showAlertResult("Berhasil", "SEO settings berhasil disimpan!");
    }
  };

  const handleReset = () => {
    showAlertDialog(
      "Konfirmasi Reset",
      "Apakah Anda yakin ingin mengembalikan ke pengaturan awal? Tindakan ini tidak dapat dibatalkan.",
      () => {
        // Reset ke nilai awal (simulasi)
        showAlertResult("Berhasil", "Pengaturan SEO telah dikembalikan ke nilai awal");
      },
      "destructive"
    );
  };

  const filteredPages = seoData.filter(page =>
    page.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (page.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (page.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold text-white">Manajemen SEO</h1>
          <p className="text-gray-300 mt-2">Atur meta tags dan optimasi SEO untuk halaman website</p>
        </div>

      {!isEditing ? (
        <>
          {/* Search Bar */}
          <Card className="p-4 bg-white/5 backdrop-blur-sm border border-gray-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari halaman, judul, atau deskripsi..."
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </Card>

          {/* SEO Pages List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredPages.map((page, index) => (
              <Card 
                key={index} 
                className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-gray-700/50 p-2 rounded-lg">
                        <Globe className="h-5 w-5 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{page.title || "Untitled"}</h3>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {page.page}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-400 mb-4">{page.description || "No description"}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Meta Keywords</h4>
                        <p className="text-gray-300">{page.keywords || "No keywords"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Canonical URL</h4>
                        <p className="text-blue-400">{page.canonicalUrl || "No canonical URL"}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="secondary" 
                        className={page.robotsIndex ? "bg-green-900/30 text-green-400 border border-green-900/50" : "bg-red-900/30 text-red-400 border border-red-900/50"}
                      >
                        {page.robotsIndex ? "Indexed" : "No Index"}
                      </Badge>
                      <Badge 
                        variant="secondary" 
                        className={page.robotsFollow ? "bg-green-900/30 text-green-400 border border-green-900/50" : "bg-red-900/30 text-red-400 border border-red-900/50"}
                      >
                        {page.robotsFollow ? "Follow" : "No Follow"}
                      </Badge>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        Prioritas: {page.sitemapPriority || 0}
                      </Badge>
                      <Badge variant="outline" className="border-gray-600 text-gray-300 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {page.lastModified || "Not specified"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 min-w-[150px]">
                    <Button 
                      variant="outline" 
                      onClick={() => handleEdit(page)}
                      className="border-blue-600/50 text-blue-400 hover:bg-blue-600/20"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Edit SEO
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat Halaman
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        // Edit SEO Settings Form
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Edit SEO Settings</h2>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              Kembali
            </Button>
          </div>
          
          {currentPage && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Pengaturan Halaman: {currentPage.page}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Judul Halaman (Title)</Label>
                    <Input
                      id="title"
                      value={currentPage.title || ""}
                      onChange={(e) => setCurrentPage({...currentPage, title: e.target.value})}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Idealnya antara 50-60 karakter</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="canonicalUrl" className="text-gray-300">Canonical URL</Label>
                    <Input
                      id="canonicalUrl"
                      value={currentPage.canonicalUrl || ""}
                      onChange={(e) => setCurrentPage({...currentPage, canonicalUrl: e.target.value})}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">URL kanonikal untuk menghindari konten duplikat</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="description" className="text-gray-300">Deskripsi Meta</Label>
                  <Textarea
                    id="description"
                    value={currentPage.description || ""}
                    onChange={(e) => setCurrentPage({...currentPage, description: e.target.value})}
                    rows={3}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Idealnya antara 150-160 karakter</p>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="keywords" className="text-gray-300">Meta Keywords</Label>
                  <Input
                    id="keywords"
                    value={currentPage.keywords || ""}
                    onChange={(e) => setCurrentPage({...currentPage, keywords: e.target.value})}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Open Graph & Twitter Cards
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="ogTitle" className="text-gray-300">OG Title</Label>
                    <Input
                      id="ogTitle"
                      value={currentPage.ogTitle || ""}
                      onChange={(e) => setCurrentPage({...currentPage, ogTitle: e.target.value})}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ogImage" className="text-gray-300">OG Image URL</Label>
                    <Input
                      id="ogImage"
                      value={currentPage.ogImage || ""}
                      onChange={(e) => setCurrentPage({...currentPage, ogImage: e.target.value})}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="ogDescription" className="text-gray-300">OG Description</Label>
                  <Textarea
                    id="ogDescription"
                    value={currentPage.ogDescription || ""}
                    onChange={(e) => setCurrentPage({...currentPage, ogDescription: e.target.value})}
                    rows={2}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <Label htmlFor="twitterTitle" className="text-gray-300">Twitter Title</Label>
                    <Input
                      id="twitterTitle"
                      value={currentPage.twitterTitle || ""}
                      onChange={(e) => setCurrentPage({...currentPage, twitterTitle: e.target.value})}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="twitterImage" className="text-gray-300">Twitter Image URL</Label>
                    <Input
                      id="twitterImage"
                      value={currentPage.twitterImage || ""}
                      onChange={(e) => setCurrentPage({...currentPage, twitterImage: e.target.value})}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="twitterDescription" className="text-gray-300">Twitter Description</Label>
                  <Textarea
                    id="twitterDescription"
                    value={currentPage.twitterDescription || ""}
                    onChange={(e) => setCurrentPage({...currentPage, twitterDescription: e.target.value})}
                    rows={2}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Pengaturan Indexing & Sitemap
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <div>
                      <Label className="text-gray-300">Robots Index</Label>
                      <p className="text-xs text-gray-500">Izinkan mesin pencari mengindeks halaman ini</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!currentPage.robotsIndex}
                      onChange={(e) => setCurrentPage({...currentPage, robotsIndex: e.target.checked})}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-800/50 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <div>
                      <Label className="text-gray-300">Robots Follow</Label>
                      <p className="text-xs text-gray-500">Izinkan mesin pencari mengikuti tautan di halaman ini</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!currentPage.robotsFollow}
                      onChange={(e) => setCurrentPage({...currentPage, robotsFollow: e.target.checked})}
                      className="h-5 w-5 rounded border-gray-600 bg-gray-800/50 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sitemapPriority" className="text-gray-300">Prioritas Sitemap</Label>
                    <Select 
                      value={currentPage.sitemapPriority?.toString() || "0.5"} 
                      onValueChange={(value) => setCurrentPage({...currentPage, sitemapPriority: parseFloat(value)})}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/90 border-gray-700 text-gray-200">
                        <SelectItem value="1.0">1.0 (Tertinggi)</SelectItem>
                        <SelectItem value="0.9">0.9</SelectItem>
                        <SelectItem value="0.8">0.8</SelectItem>
                        <SelectItem value="0.7">0.7</SelectItem>
                        <SelectItem value="0.6">0.6</SelectItem>
                        <SelectItem value="0.5">0.5 (Standar)</SelectItem>
                        <SelectItem value="0.4">0.4</SelectItem>
                        <SelectItem value="0.3">0.3</SelectItem>
                        <SelectItem value="0.2">0.2</SelectItem>
                        <SelectItem value="0.1">0.1 (Terendah)</SelectItem>
                        <SelectItem value="0.0">0.0 (Tidak diindeks)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 flex items-center"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset ke Awal
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          )}
        </Card>
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
  </>
);
}