"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { 
  Database, 
  Package,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle
} from "lucide-react";
import { usePricingData } from "@/hooks/usePricingData";
import { toast } from "sonner";
import { 
  ProjectType, 
  FeaturePrice, 
  PagePrice, 
  TimelinePrice, 
  ComplexityPrice, 
  PricingPackage, 
  PackageFeature, 
  PricingLog 
} from '@/lib/types';

export default function PricingAdmin() {
  const [activeTab, setActiveTab] = useState<'base' | 'packages'>('base');
  const {
    data,
    loading,
    error,
    updateProjectType,
    insertProjectType,
    deleteProjectType,
    updateFeaturePrice,
    insertFeaturePrice,
    updatePagePrice,
    insertPagePrice,
    updateTimelinePrice,
    insertTimelinePrice,
    updateComplexityPrice,
    insertComplexityPrice,
    updatePricingPackage,
    insertPricingPackage,
    updatePackageFeature,
    insertPackageFeature,
    deletePackageFeature
  } = usePricingData();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Manajemen Harga</h1>
            <p className="text-gray-400 mt-2">
              Kelola harga dinamis untuk proyek, fitur, paket, dan komponen lainnya
            </p>
          </div>

          {/* Tab Navigation */}
          <Card className="p-1 bg-gray-800/50 border-gray-700 mb-8">
            <div className="flex space-x-1">
              <button
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'base'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveTab('base')}
              >
                <Database className="h-4 w-4 mr-2" />
                Harga Dasar
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'packages'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveTab('packages')}
              >
                <Package className="h-4 w-4 mr-2" />
                Paket Harga
              </button>
            </div>
          </Card>

          {/* Tab Content */}
          {activeTab === 'base' && (
            <BasePricingTab 
              data={data} 
              loading={loading}
              error={error}
              updateProjectType={updateProjectType}
              insertProjectType={insertProjectType}
              deleteProjectType={deleteProjectType}
              updateFeaturePrice={updateFeaturePrice}
              insertFeaturePrice={insertFeaturePrice}
              updatePagePrice={updatePagePrice}
              insertPagePrice={insertPagePrice}
              updateTimelinePrice={updateTimelinePrice}
              insertTimelinePrice={insertTimelinePrice}
              updateComplexityPrice={updateComplexityPrice}
              insertComplexityPrice={insertComplexityPrice}
            />
          )}
          {activeTab === 'packages' && (
            <PackagePricingTab 
              data={data} 
              loading={loading}
              error={error}
              updatePricingPackage={updatePricingPackage}
              insertPricingPackage={insertPricingPackage}
              updatePackageFeature={updatePackageFeature}
              insertPackageFeature={insertPackageFeature}
              deletePackageFeature={deletePackageFeature}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Interface untuk data pricing
interface PricingData {
  projectTypes: ProjectType[];
  featurePrices: FeaturePrice[];
  pagePrices: PagePrice[];
  timelinePrices: TimelinePrice[];
  complexityPrices: ComplexityPrice[];
  pricingPackages: PricingPackage[];
  packageFeatures: PackageFeature[];
  pricingLogs: PricingLog[];
}

// Props untuk BasePricingTab
interface BasePricingTabProps {
  data: PricingData;
  loading: boolean;
  error: string | null;
  updateProjectType: (id: string, updates: Partial<ProjectType>) => Promise<{ success: boolean; data?: ProjectType; error?: string }>;
  insertProjectType: (projectType: Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: ProjectType; error?: string }>;
  deleteProjectType: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateFeaturePrice: (id: string, updates: Partial<FeaturePrice>) => Promise<{ success: boolean; data?: FeaturePrice; error?: string }>;
  insertFeaturePrice: (featurePrice: Omit<FeaturePrice, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: FeaturePrice; error?: string }>;
  updatePagePrice: (id: string, updates: Partial<PagePrice>) => Promise<{ success: boolean; data?: PagePrice; error?: string }>;
  insertPagePrice: (pagePrice: Omit<PagePrice, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: PagePrice; error?: string }>;
  updateTimelinePrice: (id: string, updates: Partial<TimelinePrice>) => Promise<{ success: boolean; data?: TimelinePrice; error?: string }>;
  insertTimelinePrice: (timelinePrice: Omit<TimelinePrice, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: TimelinePrice; error?: string }>;
  updateComplexityPrice: (id: string, updates: Partial<ComplexityPrice>) => Promise<{ success: boolean; data?: ComplexityPrice; error?: string }>;
  insertComplexityPrice: (complexityPrice: Omit<ComplexityPrice, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: ComplexityPrice; error?: string }>;
}

// Props untuk PackagePricingTab
interface PackagePricingTabProps {
  data: PricingData;
  loading: boolean;
  error: string | null;
  updatePricingPackage: (id: string, updates: Partial<PricingPackage>) => Promise<{ success: boolean; data?: PricingPackage; error?: string }>;
  insertPricingPackage: (pricingPackage: Omit<PricingPackage, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: PricingPackage; error?: string }>;
  updatePackageFeature: (id: string, updates: Partial<PackageFeature>) => Promise<{ success: boolean; data?: PackageFeature; error?: string }>;
  insertPackageFeature: (packageFeature: Omit<PackageFeature, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; data?: PackageFeature; error?: string }>;
  deletePackageFeature: (id: string) => Promise<{ success: boolean; error?: string }>;
}

// Komponen untuk tab harga dasar
function BasePricingTab({ 
  data,
  loading,
  error,
  updateProjectType,
  insertProjectType,
  deleteProjectType,
  updateFeaturePrice,
  insertFeaturePrice,
  updatePagePrice,
  insertPagePrice,
  updateTimelinePrice,
  insertTimelinePrice,
  updateComplexityPrice,
  insertComplexityPrice
}: BasePricingTabProps) {
  const [showProjectTypeForm, setShowProjectTypeForm] = useState(false);
  const [showFeaturePriceForm, setShowFeaturePriceForm] = useState(false);
  const [showPagePriceForm, setShowPagePriceForm] = useState(false);
  const [showTimelinePriceForm, setShowTimelinePriceForm] = useState(false);
  const [showComplexityPriceForm, setShowComplexityPriceForm] = useState(false);
  

  
  const [projectTypeForm, setProjectTypeForm] = useState({
    id: '',
    name: '',
    description: '',
    basePrice: 0,
    price: 0,
    category: '',
    pageCount: 0,
    pricePerPage: 0,
    timelineLabel: '',
    timelineType: '',
    multiplier: 1.0,
    complexityLabel: '',
    complexityType: '',
    isActive: true,
    isPopular: false
  });
  
  const [featurePriceForm, setFeaturePriceForm] = useState({
    id: '',
    name: '',
    description: '',
    basePrice: 0,
    price: 0,
    category: '',
    pageCount: 0,
    pricePerPage: 0,
    timelineLabel: '',
    timelineType: '',
    multiplier: 1.0,
    complexityLabel: '',
    complexityType: '',
    isActive: true,
    isPopular: false
  });
  
  const [pagePriceForm, setPagePriceForm] = useState({
    id: '',
    name: '',
    description: '',
    basePrice: 0,
    price: 0,
    category: '',
    pageCount: 1,
    pricePerPage: 0,
    timelineLabel: '',
    timelineType: '',
    multiplier: 1.0,
    complexityLabel: '',
    complexityType: '',
    isActive: true,
    isPopular: false
  });
  
  const [timelinePriceForm, setTimelinePriceForm] = useState({
    id: '',
    name: '',
    description: '',
    basePrice: 0,
    price: 0,
    category: '',
    pageCount: 0,
    pricePerPage: 0,
    timelineLabel: '',
    timelineType: '',
    multiplier: 1.0,
    complexityLabel: '',
    complexityType: '',
    isActive: true,
    isPopular: false
  });
  
  const [complexityPriceForm, setComplexityPriceForm] = useState({
    id: '',
    name: '',
    description: '',
    basePrice: 0,
    price: 0,
    category: '',
    pageCount: 0,
    pricePerPage: 0,
    timelineLabel: '',
    timelineType: '',
    multiplier: 1.0,
    complexityLabel: '',
    complexityType: '',
    isActive: true,
    isPopular: false
  });

  const handleUpdateProjectType = async () => {
    try {
      const result = await updateProjectType(projectTypeForm.id!, {
        name: projectTypeForm.name,
        description: projectTypeForm.description,
        base_price: projectTypeForm.basePrice,
        is_active: projectTypeForm.isActive,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Jenis proyek berhasil diperbarui");
        setProjectTypeForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowProjectTypeForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal memperbarui jenis proyek", {
        description: (err as Error).message
      });
    }
  };

  const handleInsertProjectType = async () => {
    try {
      const result = await insertProjectType({
        name: projectTypeForm.name,
        description: projectTypeForm.description,
        base_price: projectTypeForm.basePrice,
        is_active: projectTypeForm.isActive,
        created_by: null,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Jenis proyek berhasil ditambahkan");
        setProjectTypeForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowProjectTypeForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal menambahkan jenis proyek", {
        description: (err as Error).message
      });
    }
  };

  const handleUpdateFeaturePrice = async () => {
    try {
      const result = await updateFeaturePrice(featurePriceForm.id!, {
        name: featurePriceForm.name,
        description: featurePriceForm.description,
        price: featurePriceForm.price,
        category: featurePriceForm.category,
        is_active: featurePriceForm.isActive,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Harga fitur berhasil diperbarui");
        setFeaturePriceForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowFeaturePriceForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal memperbarui harga fitur", {
        description: (err as Error).message
      });
    }
  };

  const handleInsertFeaturePrice = async () => {
    try {
      const result = await insertFeaturePrice({
        name: featurePriceForm.name,
        description: featurePriceForm.description,
        price: featurePriceForm.price,
        category: featurePriceForm.category,
        is_active: featurePriceForm.isActive,
        created_by: null,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Harga fitur berhasil ditambahkan");
        setFeaturePriceForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowFeaturePriceForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal menambahkan harga fitur", {
        description: (err as Error).message
      });
    }
  };

  const handleUpdatePagePrice = async () => {
    try {
      const result = await updatePagePrice(pagePriceForm.id!, {
        page_count: pagePriceForm.pageCount,
        price_per_page: pagePriceForm.pricePerPage,
        is_active: pagePriceForm.isActive,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Harga per halaman berhasil diperbarui");
        setPagePriceForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 1,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowPagePriceForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal memperbarui harga per halaman", {
        description: (err as Error).message
      });
    }
  };

  const handleInsertPagePrice = async () => {
    try {
      const result = await insertPagePrice({
        page_count: pagePriceForm.pageCount,
        price_per_page: pagePriceForm.pricePerPage,
        is_active: pagePriceForm.isActive,
        created_by: null,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Harga per halaman berhasil ditambahkan");
        setPagePriceForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 1,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowPagePriceForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal menambahkan harga per halaman", {
        description: (err as Error).message
      });
    }
  };

  const handleUpdateTimelinePrice = async () => {
    try {
      const result = await updateTimelinePrice(timelinePriceForm.id!, {
        timeline_label: timelinePriceForm.timelineLabel,
        timeline_type: timelinePriceForm.timelineType,
        description: timelinePriceForm.description,
        multiplier: timelinePriceForm.multiplier,
        is_active: timelinePriceForm.isActive,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Harga per waktu pengerjaan berhasil diperbarui");
        setTimelinePriceForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowTimelinePriceForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal memperbarui harga per waktu pengerjaan", {
        description: (err as Error).message
      });
    }
  };

  const handleInsertTimelinePrice = async () => {
    try {
      const result = await insertTimelinePrice({
        timeline_label: timelinePriceForm.timelineLabel,
        timeline_type: timelinePriceForm.timelineType,
        description: timelinePriceForm.description,
        multiplier: timelinePriceForm.multiplier,
        is_active: timelinePriceForm.isActive,
        created_by: null,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Harga per waktu pengerjaan berhasil ditambahkan");
        setTimelinePriceForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowTimelinePriceForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal menambahkan harga per waktu pengerjaan", {
        description: (err as Error).message
      });
    }
  };

  const handleUpdateComplexityPrice = async () => {
    try {
      const result = await updateComplexityPrice(complexityPriceForm.id!, {
        complexity_label: complexityPriceForm.complexityLabel,
        complexity_type: complexityPriceForm.complexityType,
        description: complexityPriceForm.description,
        multiplier: complexityPriceForm.multiplier,
        is_active: complexityPriceForm.isActive,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Harga per kompleksitas berhasil diperbarui");
        setComplexityPriceForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowComplexityPriceForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal memperbarui harga per kompleksitas", {
        description: (err as Error).message
      });
    }
  };

  const handleInsertComplexityPrice = async () => {
    try {
      const result = await insertComplexityPrice({
        complexity_label: complexityPriceForm.complexityLabel,
        complexity_type: complexityPriceForm.complexityType,
        description: complexityPriceForm.description,
        multiplier: complexityPriceForm.multiplier,
        is_active: complexityPriceForm.isActive,
        created_by: null,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Harga per kompleksitas berhasil ditambahkan");
        setComplexityPriceForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowComplexityPriceForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal menambahkan harga per kompleksitas", {
        description: (err as Error).message
      });
    }
  };

  const handleDeleteProjectType = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jenis proyek ini?")) {
      try {
        const result = await deleteProjectType(id);
        if (result.success) {
          toast.success("Jenis proyek berhasil dihapus");
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        toast.error("Gagal menghapus jenis proyek", {
          description: (err as Error).message
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold text-white">Pengaturan Harga</h1>
          <p className="text-gray-400 mt-2">
            Kelola harga dinamis untuk proyek, fitur, dan paket layanan
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-lg">Memuat data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold text-white">Pengaturan Harga</h1>
          <p className="text-gray-400 mt-2">
            Kelola harga dinamis untuk proyek, fitur, dan paket layanan
          </p>
        </div>
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center text-red-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error: {error}</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Types Section */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Jenis Proyek
            </h2>
            <p className="text-gray-400">Atur jenis proyek dan harga dasar</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={() => setShowProjectTypeForm(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah
          </button>
        </div>
        
        {showProjectTypeForm && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              {projectTypeForm.name ? "Edit" : "Tambah"} Jenis Proyek
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nama</label>
                <input
                  type="text"
                  value={projectTypeForm.name}
                  onChange={(e) => setProjectTypeForm({...projectTypeForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Nama jenis proyek"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Harga Dasar</label>
                <input
                  type="number"
                  value={projectTypeForm.basePrice}
                  onChange={(e) => setProjectTypeForm({...projectTypeForm, basePrice: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Harga dasar"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
                <textarea
                  value={projectTypeForm.description}
                  onChange={(e) => setProjectTypeForm({...projectTypeForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Deskripsi jenis proyek"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={projectTypeForm.isActive ? "true" : "false"}
                  onChange={(e) => setProjectTypeForm({...projectTypeForm, isActive: e.target.value === "true"})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Tidak Aktif</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={projectTypeForm.id ? handleUpdateProjectType : handleInsertProjectType}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <Save className="h-4 w-4 mr-1" />
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowProjectTypeForm(false);
                  setProjectTypeForm({
                    id: '',
                    name: '',
                    description: '',
                    basePrice: 0,
                    price: 0,
                    category: '',
                    pageCount: 0,
                    pricePerPage: 0,
                    timelineLabel: '',
                    timelineType: '',
                    multiplier: 1.0,
                    complexityLabel: '',
                    complexityType: '',
                    isActive: true,
                    isPopular: false
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Nama</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Deskripsi</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Harga Dasar</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.projectTypes.map((type) => (
                <tr key={type.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-white font-medium">{type.name}</td>
                  <td className="py-3 px-4 text-gray-300">{type.description}</td>
                  <td className="py-3 px-4 text-white">Rp {type.base_price?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      type.is_active 
                        ? 'bg-green-900/30 text-green-400 border border-green-900/50' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {type.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1.5 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
                        onClick={() => {
                          setProjectTypeForm({
                            id: type.id,
                            name: type.name,
                            description: type.description || '',
                            basePrice: type.base_price || 0,
                            price: 0,
                            category: '',
                            pageCount: 0,
                            pricePerPage: 0,
                            timelineLabel: '',
                            timelineType: '',
                            multiplier: 1.0,
                            complexityLabel: '',
                            complexityType: '',
                            isActive: type.is_active || false,
                            isPopular: false
                          });
                          setShowProjectTypeForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1.5 rounded-md bg-red-600/20 hover:bg-red-600/30 text-red-400"
                        onClick={() => handleDeleteProjectType(type.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Feature Prices Section */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Harga per Fitur
            </h2>
            <p className="text-gray-400">Atur harga untuk fitur-fitur tambahan</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={() => setShowFeaturePriceForm(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah
          </button>
        </div>
        
        {showFeaturePriceForm && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              {featurePriceForm.name ? "Edit" : "Tambah"} Harga Fitur
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nama</label>
                <input
                  type="text"
                  value={featurePriceForm.name}
                  onChange={(e) => setFeaturePriceForm({...featurePriceForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Nama fitur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Harga</label>
                <input
                  type="number"
                  value={featurePriceForm.price}
                  onChange={(e) => setFeaturePriceForm({...featurePriceForm, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Harga fitur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Kategori</label>
                <input
                  type="text"
                  value={featurePriceForm.category}
                  onChange={(e) => setFeaturePriceForm({...featurePriceForm, category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Kategori fitur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={featurePriceForm.isActive ? "true" : "false"}
                  onChange={(e) => setFeaturePriceForm({...featurePriceForm, isActive: e.target.value === "true"})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Tidak Aktif</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
                <textarea
                  value={featurePriceForm.description}
                  onChange={(e) => setFeaturePriceForm({...featurePriceForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Deskripsi fitur"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={featurePriceForm.id ? handleUpdateFeaturePrice : handleInsertFeaturePrice}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <Save className="h-4 w-4 mr-1" />
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowFeaturePriceForm(false);
                  setFeaturePriceForm({
                    id: '',
                    name: '',
                    description: '',
                    basePrice: 0,
                    price: 0,
                    category: '',
                    pageCount: 0,
                    pricePerPage: 0,
                    timelineLabel: '',
                    timelineType: '',
                    multiplier: 1.0,
                    complexityLabel: '',
                    complexityType: '',
                    isActive: true,
                    isPopular: false
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Nama</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Deskripsi</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Kategori</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Harga</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.featurePrices.map((feature) => (
                <tr key={feature.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-white font-medium">{feature.name}</td>
                  <td className="py-3 px-4 text-gray-300">{feature.description}</td>
                  <td className="py-3 px-4 text-gray-300">{feature.category}</td>
                  <td className="py-3 px-4 text-white">Rp {feature.price?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      feature.is_active 
                        ? 'bg-green-900/30 text-green-400 border border-green-900/50' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {feature.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1.5 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
                        onClick={() => {
                          setFeaturePriceForm({
                            id: feature.id,
                            name: feature.name,
                            description: feature.description || '',
                            basePrice: 0,
                            price: feature.price || 0,
                            category: feature.category || '',
                            pageCount: 0,
                            pricePerPage: 0,
                            timelineLabel: '',
                            timelineType: '',
                            multiplier: 1.0,
                            complexityLabel: '',
                            complexityType: '',
                            isActive: feature.is_active || false,
                            isPopular: false
                          });
                          setShowFeaturePriceForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-md bg-red-600/20 hover:bg-red-600/30 text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Page Prices Section */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Harga per Halaman
            </h2>
            <p className="text-gray-400">Atur harga tambahan per halaman</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={() => setShowPagePriceForm(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah
          </button>
        </div>
        
        {showPagePriceForm && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              {pagePriceForm.pageCount ? "Edit" : "Tambah"} Harga per Halaman
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Jumlah Halaman</label>
                <input
                  type="number"
                  value={pagePriceForm.pageCount}
                  onChange={(e) => setPagePriceForm({...pagePriceForm, pageCount: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Jumlah halaman"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Harga per Halaman</label>
                <input
                  type="number"
                  value={pagePriceForm.pricePerPage}
                  onChange={(e) => setPagePriceForm({...pagePriceForm, pricePerPage: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Harga per halaman"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={pagePriceForm.isActive ? "true" : "false"}
                  onChange={(e) => setPagePriceForm({...pagePriceForm, isActive: e.target.value === "true"})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Tidak Aktif</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={pagePriceForm.id ? handleUpdatePagePrice : handleInsertPagePrice}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <Save className="h-4 w-4 mr-1" />
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowPagePriceForm(false);
                  setPagePriceForm({
                    id: '',
                    name: '',
                    description: '',
                    basePrice: 0,
                    price: 0,
                    category: '',
                    pageCount: 1,
                    pricePerPage: 0,
                    timelineLabel: '',
                    timelineType: '',
                    multiplier: 1.0,
                    complexityLabel: '',
                    complexityType: '',
                    isActive: true,
                    isPopular: false
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Jumlah Halaman</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Harga per Halaman</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.pagePrices.map((pagePrice) => (
                <tr key={pagePrice.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-white font-medium">{pagePrice.page_count}+ halaman</td>
                  <td className="py-3 px-4 text-white">Rp {pagePrice.price_per_page?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pagePrice.is_active 
                        ? 'bg-green-900/30 text-green-400 border border-green-900/50' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {pagePrice.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1.5 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
                        onClick={() => {
                          setPagePriceForm({
                            id: pagePrice.id,
                            name: '',
                            description: '',
                            basePrice: 0,
                            price: 0,
                            category: '',
                            pageCount: pagePrice.page_count || 0,
                            pricePerPage: pagePrice.price_per_page || 0,
                            timelineLabel: '',
                            timelineType: '',
                            multiplier: 1.0,
                            complexityLabel: '',
                            complexityType: '',
                            isActive: pagePrice.is_active || false,
                            isPopular: false
                          });
                          setShowPagePriceForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-md bg-red-600/20 hover:bg-red-600/30 text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Timeline Prices Section */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Harga per Waktu Pengerjaan
            </h2>
            <p className="text-gray-400">Atur harga berdasarkan waktu pengerjaan</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={() => setShowTimelinePriceForm(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah
          </button>
        </div>
        
        {showTimelinePriceForm && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              {timelinePriceForm.timelineLabel ? "Edit" : "Tambah"} Harga per Waktu Pengerjaan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Label Waktu</label>
                <input
                  type="text"
                  value={timelinePriceForm.timelineLabel}
                  onChange={(e) => setTimelinePriceForm({...timelinePriceForm, timelineLabel: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Label waktu pengerjaan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tipe Waktu</label>
                <input
                  type="text"
                  value={timelinePriceForm.timelineType}
                  onChange={(e) => setTimelinePriceForm({...timelinePriceForm, timelineType: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Tipe waktu pengerjaan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
                <input
                  type="text"
                  value={timelinePriceForm.description}
                  onChange={(e) => setTimelinePriceForm({...timelinePriceForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Deskripsi waktu pengerjaan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={timelinePriceForm.multiplier}
                  onChange={(e) => setTimelinePriceForm({...timelinePriceForm, multiplier: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Multiplier harga"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={timelinePriceForm.isActive ? "true" : "false"}
                  onChange={(e) => setTimelinePriceForm({...timelinePriceForm, isActive: e.target.value === "true"})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Tidak Aktif</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={timelinePriceForm.id ? handleUpdateTimelinePrice : handleInsertTimelinePrice}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <Save className="h-4 w-4 mr-1" />
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowTimelinePriceForm(false);
                  setTimelinePriceForm({
                    id: '',
                    name: '',
                    description: '',
                    basePrice: 0,
                    price: 0,
                    category: '',
                    pageCount: 0,
                    pricePerPage: 0,
                    timelineLabel: '',
                    timelineType: '',
                    multiplier: 1.0,
                    complexityLabel: '',
                    complexityType: '',
                    isActive: true,
                    isPopular: false
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Label</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Tipe</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Deskripsi</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Multiplier</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.timelinePrices.map((timelinePrice) => (
                <tr key={timelinePrice.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-white font-medium">{timelinePrice.timeline_label}</td>
                  <td className="py-3 px-4 text-gray-300">{timelinePrice.timeline_type}</td>
                  <td className="py-3 px-4 text-gray-300">{timelinePrice.description}</td>
                  <td className="py-3 px-4 text-white">x{timelinePrice.multiplier}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      timelinePrice.is_active 
                        ? 'bg-green-900/30 text-green-400 border border-green-900/50' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {timelinePrice.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1.5 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
                        onClick={() => {
                          setTimelinePriceForm({
                            id: timelinePrice.id,
                            name: '',
                            description: timelinePrice.description || '',
                            basePrice: 0,
                            price: 0,
                            category: '',
                            pageCount: 0,
                            pricePerPage: 0,
                            timelineLabel: timelinePrice.timeline_label || '',
                            timelineType: timelinePrice.timeline_type || '',
                            multiplier: timelinePrice.multiplier || 1.0,
                            complexityLabel: '',
                            complexityType: '',
                            isActive: timelinePrice.is_active || false,
                            isPopular: false
                          });
                          setShowTimelinePriceForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-md bg-red-600/20 hover:bg-red-600/30 text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Complexity Prices Section */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Harga per Kompleksitas
            </h2>
            <p className="text-gray-400">Atur harga berdasarkan tingkat kompleksitas</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={() => setShowComplexityPriceForm(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah
          </button>
        </div>
        
        {showComplexityPriceForm && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              {complexityPriceForm.complexityLabel ? "Edit" : "Tambah"} Harga per Kompleksitas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Label Kompleksitas</label>
                <input
                  type="text"
                  value={complexityPriceForm.complexityLabel}
                  onChange={(e) => setComplexityPriceForm({...complexityPriceForm, complexityLabel: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Label kompleksitas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tipe Kompleksitas</label>
                <input
                  type="text"
                  value={complexityPriceForm.complexityType}
                  onChange={(e) => setComplexityPriceForm({...complexityPriceForm, complexityType: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Tipe kompleksitas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
                <input
                  type="text"
                  value={complexityPriceForm.description}
                  onChange={(e) => setComplexityPriceForm({...complexityPriceForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Deskripsi kompleksitas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Multiplier</label>
                <input
                  type="number"
                  step="0.1"
                  value={complexityPriceForm.multiplier}
                  onChange={(e) => setComplexityPriceForm({...complexityPriceForm, multiplier: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Multiplier harga"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={complexityPriceForm.isActive ? "true" : "false"}
                  onChange={(e) => setComplexityPriceForm({...complexityPriceForm, isActive: e.target.value === "true"})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Tidak Aktif</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={complexityPriceForm.id ? handleUpdateComplexityPrice : handleInsertComplexityPrice}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <Save className="h-4 w-4 mr-1" />
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowComplexityPriceForm(false);
                  setComplexityPriceForm({
                    id: '',
                    name: '',
                    description: '',
                    basePrice: 0,
                    price: 0,
                    category: '',
                    pageCount: 0,
                    pricePerPage: 0,
                    timelineLabel: '',
                    timelineType: '',
                    multiplier: 1.0,
                    complexityLabel: '',
                    complexityType: '',
                    isActive: true,
                    isPopular: false
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Label</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Tipe</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Deskripsi</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Multiplier</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.complexityPrices.map((complexityPrice) => (
                <tr key={complexityPrice.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-white font-medium">{complexityPrice.complexity_label}</td>
                  <td className="py-3 px-4 text-gray-300">{complexityPrice.complexity_type}</td>
                  <td className="py-3 px-4 text-gray-300">{complexityPrice.description}</td>
                  <td className="py-3 px-4 text-white">x{complexityPrice.multiplier}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      complexityPrice.is_active 
                        ? 'bg-green-900/30 text-green-400 border border-green-900/50' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {complexityPrice.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1.5 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
                        onClick={() => {
                          setComplexityPriceForm({
                            id: complexityPrice.id,
                            name: '',
                            description: complexityPrice.description || '',
                            basePrice: 0,
                            price: 0,
                            category: '',
                            pageCount: 0,
                            pricePerPage: 0,
                            timelineLabel: '',
                            timelineType: '',
                            multiplier: complexityPrice.multiplier || 1.0,
                            complexityLabel: complexityPrice.complexity_label || '',
                            complexityType: complexityPrice.complexity_type || '',
                            isActive: complexityPrice.is_active || false,
                            isPopular: false
                          });
                          setShowComplexityPriceForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-md bg-red-600/20 hover:bg-red-600/30 text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Komponen untuk tab paket harga
function PackagePricingTab({ 
  data, 
  loading,
  error,
  updatePricingPackage,
  insertPricingPackage,
  updatePackageFeature,
  insertPackageFeature,
  deletePackageFeature
}: PackagePricingTabProps) {
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showPackageFeatureForm, setShowPackageFeatureForm] = useState(false);
  
  const [packageForm, setPackageForm] = useState({
    id: '',
    name: '',
    description: '',
    basePrice: 0,
    price: 0,
    category: '',
    pageCount: 0,
    pricePerPage: 0,
    timelineLabel: '',
    timelineType: '',
    multiplier: 1.0,
    complexityLabel: '',
    complexityType: '',
    isActive: true,
    isPopular: false
  });
  
  const [packageFeatureForm, setPackageFeatureForm] = useState({
    id: '',
    packageId: '',
    featureId: '',
    is_included: true
  });

  const handleUpdatePricingPackage = async () => {
    try {
      const result = await updatePricingPackage(packageForm.id!, {
        name: packageForm.name,
        description: packageForm.description,
        price: packageForm.price,
        is_active: packageForm.isActive,
        is_popular: packageForm.isPopular,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Paket harga berhasil diperbarui");
        setPackageForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowPackageForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal memperbarui paket harga", {
        description: (err as Error).message
      });
    }
  };

  const handleInsertPricingPackage = async () => {
    try {
      const result = await insertPricingPackage({
        name: packageForm.name,
        description: packageForm.description,
        price: packageForm.price,
        is_active: packageForm.isActive,
        is_popular: packageForm.isPopular,
        created_by: null,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Paket harga berhasil ditambahkan");
        setPackageForm({
          id: '',
          name: '',
          description: '',
          basePrice: 0,
          price: 0,
          category: '',
          pageCount: 0,
          pricePerPage: 0,
          timelineLabel: '',
          timelineType: '',
          multiplier: 1.0,
          complexityLabel: '',
          complexityType: '',
          isActive: true,
          isPopular: false
        });
        setShowPackageForm(false);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal menambahkan paket harga", {
        description: (err as Error).message
      });
    }
  };

  const handleUpdatePackageFeature = async (id: string, updates: Partial<PackageFeature>) => {
    try {
      const result = await updatePackageFeature(id, {
        ...updates,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Fitur dalam paket berhasil diperbarui");
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal memperbarui fitur dalam paket", {
        description: (err as Error).message
      });
    }
  };

  const handleInsertPackageFeatureToPackage = async (packageId: string, featureId: string, isIncluded: boolean) => {
    try {
      const result = await insertPackageFeature({
        package_id: packageId,
        feature_id: featureId,
        is_included: isIncluded,
        created_by: null,
        updated_by: null,
      });
      if (result.success) {
        toast.success("Fitur berhasil ditambahkan ke paket");
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      toast.error("Gagal menambahkan fitur ke paket", {
        description: (err as Error).message
      });
    }
  };

  const handleDeletePackageFeature = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus fitur dari paket ini?")) {
      try {
        const result = await deletePackageFeature(id);
        if (result.success) {
          toast.success("Fitur berhasil dihapus dari paket");
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        toast.error("Gagal menghapus fitur dari paket", {
          description: (err as Error).message
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold text-white">Pengaturan Harga</h1>
          <p className="text-gray-400 mt-2">
            Kelola harga dinamis untuk proyek, fitur, dan paket layanan
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-lg">Memuat data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
          <h1 className="text-3xl font-bold text-white">Pengaturan Harga</h1>
          <p className="text-gray-400 mt-2">
            Kelola harga dinamis untuk proyek, fitur, dan paket layanan
          </p>
        </div>
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center text-red-400">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error: {error}</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pricing Packages Section */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Paket Harga
            </h2>
            <p className="text-gray-400">Atur paket harga dan fitur yang termasuk</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={() => setShowPackageForm(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah Paket
          </button>
        </div>
        
        {showPackageForm && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              {packageForm.name ? "Edit" : "Tambah"} Paket Harga
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nama</label>
                <input
                  type="text"
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({...packageForm, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Nama paket"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Harga</label>
                <input
                  type="number"
                  value={packageForm.price}
                  onChange={(e) => setPackageForm({...packageForm, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Harga paket"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
                <textarea
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({...packageForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Deskripsi paket"
                  rows={2}
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={packageForm.isActive}
                    onChange={(e) => setPackageForm({...packageForm, isActive: e.target.checked})}
                    className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Aktif</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={packageForm.isPopular}
                    onChange={(e) => setPackageForm({...packageForm, isPopular: e.target.checked})}
                    className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Populer</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={packageForm.id ? handleUpdatePricingPackage : handleInsertPricingPackage}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <Save className="h-4 w-4 mr-1" />
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowPackageForm(false);
                  setPackageForm({
                    id: '',
                    name: '',
                    description: '',
                    basePrice: 0,
                    price: 0,
                    category: '',
                    pageCount: 0,
                    pricePerPage: 0,
                    timelineLabel: '',
                    timelineType: '',
                    multiplier: 1.0,
                    complexityLabel: '',
                    complexityType: '',
                    isActive: true,
                    isPopular: false
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Nama</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Deskripsi</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Harga</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Status</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Populer</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.pricingPackages.map((pkg) => (
                <tr key={pkg.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-3 px-4 text-white font-medium">{pkg.name}</td>
                  <td className="py-3 px-4 text-gray-300">{pkg.description}</td>
                  <td className="py-3 px-4 text-white">Rp {pkg.price?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pkg.is_active 
                        ? 'bg-green-900/30 text-green-400 border border-green-900/50' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {pkg.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pkg.is_popular 
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-900/50' 
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {pkg.is_popular ? 'Populer' : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1.5 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-400"
                        onClick={() => {
                          setPackageForm({
                            id: pkg.id,
                            name: pkg.name,
                            description: pkg.description || '',
                            basePrice: 0,
                            price: pkg.price || 0,
                            category: '',
                            pageCount: 0,
                            pricePerPage: 0,
                            timelineLabel: '',
                            timelineType: '',
                            multiplier: 1.0,
                            complexityLabel: '',
                            complexityType: '',
                            isActive: pkg.is_active || false,
                            isPopular: pkg.is_popular || false
                          });
                          
                          setShowPackageForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded-md bg-red-600/20 hover:bg-red-600/30 text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Package Features Section */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Fitur dalam Paket
            </h2>
            <p className="text-gray-400">Atur fitur-fitur yang termasuk dalam setiap paket</p>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={() => setShowPackageFeatureForm(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah Fitur ke Paket
          </button>
        </div>
        
        {showPackageFeatureForm && (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-white mb-4">
              Tambah/Ubah Fitur untuk Paket
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Pilih Paket</label>
                <select
                  value={packageFeatureForm.packageId}
                  onChange={(e) => {
                    setPackageFeatureForm({
                      ...packageFeatureForm, 
                      packageId: e.target.value,
                      featureId: '' // Reset fitur saat paket dipilih
                    });
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                >
                  <option value="">Pilih paket</option>
                  {data.pricingPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                  ))}
                </select>
              </div>
              
              {packageFeatureForm.packageId && (
                <div>
                  <h4 className="text-md font-medium text-white mb-2">Pilih Fitur untuk Paket "{data.pricingPackages.find(p => p.id === packageFeatureForm.packageId)?.name}"</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border border-gray-600 rounded-md bg-gray-700/30">
                    {data.featurePrices.map((feature) => {
                      // Periksa apakah fitur ini sudah termasuk dalam paket ini
                      const existingPkgFeature = data.packageFeatures.find(pf => 
                        pf.package_id === packageFeatureForm.packageId && 
                        pf.feature_id === feature.id
                      );
                      
                      const isChecked = existingPkgFeature ? Boolean(existingPkgFeature.is_included) : false;
                      
                      return (
                        <label key={feature.id} className="flex items-center p-2 hover:bg-gray-700/50 rounded-md cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Jika diceklis dan belum ada, tambahkan ke paket
                                if (!existingPkgFeature) {
                                  handleInsertPackageFeatureToPackage(packageFeatureForm.packageId, feature.id, true);
                                } else {
                                  // Jika sudah ada tapi tidak diinclude, update menjadi diinclude
                                  handleUpdatePackageFeature(existingPkgFeature.id, { is_included: true });
                                }
                              } else {
                                // Jika tidak diceklis, hapus dari paket atau tanda tidak diinclude
                                if (existingPkgFeature) {
                                  handleUpdatePackageFeature(existingPkgFeature.id, { is_included: false });
                                }
                              }
                            }}
                            className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-200">{feature.name} (Rp {feature.price?.toLocaleString()})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => {
                  setShowPackageFeatureForm(false);
                  setPackageFeatureForm({
                    id: '',
                    packageId: '',
                    featureId: '',
                    is_included: true
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Paket</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Fitur</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Termasuk</th>
                <th className="py-3 px-4 text-left text-gray-400 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.packageFeatures.map((pkgFeature) => {
                const pkg = data.pricingPackages.find(p => p.id === pkgFeature.package_id);
                const feature = data.featurePrices.find(f => f.id === pkgFeature.feature_id);
                
                return (
                  <tr key={pkgFeature.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-3 px-4 text-white font-medium">{pkg?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-300">{feature?.name || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        pkgFeature.is_included 
                          ? 'bg-green-900/30 text-green-400 border border-green-900/50' 
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {pkgFeature.is_included ? 'Termasuk' : 'Tidak Termasuk'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="p-1.5 rounded-md bg-red-600/20 hover:bg-red-600/30 text-red-400"
                          onClick={() => handleDeletePackageFeature(pkgFeature.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}