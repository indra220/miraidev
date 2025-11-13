// src/components/dashboard/ProjectSubmission.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  SearchIcon,
  CalendarIcon,
  PlusIcon,
  DollarSignIcon,
  InfoIcon,
  PackageIcon,
  CheckIcon,
  LayersIcon,
  XCircle
} from "lucide-react";
import DynamicPriceCalculator from "@/components/DynamicPriceCalculator";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  dashboardService, 
  DashboardProjectSubmission
} from "@/lib/dashboard-service";
import { createClient } from "@/lib/supabase/client";
import { PricingPackage, FeaturePrice, ComplexityPrice, TimelinePrice, Project, ProjectType } from "@/lib/types";
import { toast } from "sonner";
import Link from "next/link";

interface EnhancedPricingPackage extends PricingPackage {
  packageFeatures?: string[];
}

export function ProjectSubmission() {
  const [projects, setProjects] = useState<DashboardProjectSubmission[]>([]);
  const [pricingPackages, setPricingPackages] = useState<EnhancedPricingPackage[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    type: "",
    requirements: ""
  });

  const [selectedPackageDetail, setSelectedPackageDetail] = useState<EnhancedPricingPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'paket' | 'custom'>('paket');
  
  interface CalculatorResult {
    projectTypeId: string;
    pages: number;
    featureIds: string[];
    complexityId: string;
    timelineId: string;
    estimatedPrice: number;
  }

  const [calculatorResult, setCalculatorResult] = useState<CalculatorResult | null>(null);
  const [showCalculatorForm, setShowCalculatorForm] = useState(false);
  const [featurePrices, setFeaturePrices] = useState<FeaturePrice[]>([]);
  const [complexityPrices, setComplexityPrices] = useState<ComplexityPrice[]>([]);
  const [timelinePrices, setTimelinePrices] = useState<TimelinePrice[]>([]);

  useEffect(() => {
    if (authLoading) return;
    
    const fetchProjects = async () => {
      if (user) {
        try {
          const projectsData = await dashboardService.getDashboardData(user.id);
          setProjects(projectsData.projectSubmissions);
        } catch (error) {
          console.error("Error fetching project submissions:", error);
          const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui saat mengambil data proyek.";
          toast.error("Gagal Mengambil Data Proyek", {
            description: errorMessage
          });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    const fetchPricingData = async () => {
      try {
        const supabase = createClient();
        
        const [
          { data: packagesData, error: packagesError },
          { data: featurePricesData, error: featurePricesError },
          { data: complexityPricesData, error: complexityPricesError },
          { data: timelinePricesData, error: timelinePricesError },
          { data: projectTypesData, error: projectTypesError }
        ] = await Promise.all([
          supabase.from('pricing_packages').select('*').eq('is_active', true),
          supabase.from('feature_prices').select('*'),
          supabase.from('complexity_prices').select('*'),
          supabase.from('timeline_prices').select('*'),
          supabase.from('project_types').select('*')
        ]);
        
        if (packagesError) {
          console.error('Error fetching pricing packages:', {
            error: packagesError,
            message: packagesError.message,
            details: packagesError.details,
            hint: packagesError.hint,
            code: packagesError.code
          });
          throw new Error(`Gagal mengambil data paket harga: ${packagesError.message || 'Terjadi kesalahan tidak diketahui'}`);
        }
        if (featurePricesError) {
          console.error('Error fetching feature prices:', {
            error: featurePricesError,
            message: featurePricesError.message,
            details: featurePricesError.details,
            hint: featurePricesError.hint,
            code: featurePricesError.code
          });
          throw new Error(`Gagal mengambil data harga fitur: ${featurePricesError.message || 'Terjadi kesalahan tidak diketahui'}`);
        }
        if (complexityPricesError) {
          console.error('Error fetching complexity prices:', {
            error: complexityPricesError,
            message: complexityPricesError.message,
            details: complexityPricesError.details,
            hint: complexityPricesError.hint,
            code: complexityPricesError.code
          });
          throw new Error(`Gagal mengambil data harga kompleksitas: ${complexityPricesError.message || 'Terjadi kesalahan tidak diketahui'}`);
        }
        if (timelinePricesError) {
          console.error('Error fetching timeline prices:', {
            error: timelinePricesError,
            message: timelinePricesError.message,
            details: timelinePricesError.details,
            hint: timelinePricesError.hint,
            code: timelinePricesError.code
          });
          throw new Error(`Gagal mengambil data harga jangka waktu: ${timelinePricesError.message || 'Terjadi kesalahan tidak diketahui'}`);
        }
        if (projectTypesError) {
          console.error('Error fetching project types:', {
            error: projectTypesError,
            message: projectTypesError.message,
            details: projectTypesError.details,
            hint: projectTypesError.hint,
            code: projectTypesError.code
          });
          throw new Error(`Gagal mengambil data jenis proyek: ${projectTypesError.message || 'Terjadi kesalahan tidak diketahui'}`);
        }

        const { data: packageFeaturesData, error: featuresError } = await supabase
          .from('package_features')
          .select('*')
          .eq('is_included', true);
        
        if (featuresError) {
          console.error("Error fetching package features:", {
            error: featuresError,
            message: featuresError.message,
            details: featuresError.details,
            hint: featuresError.hint,
            code: featuresError.code
          });
        }

        const packagesWithFeatures = (packagesData || []).map(pkg => {
          const featuresForThisPackage = packageFeaturesData 
            ? packageFeaturesData
                .filter(pf => pf.package_id === pkg.id)
                .map(pf => {
                  const featureName = featurePricesData 
                    ? featurePricesData.find(fp => fp.id === pf.feature_id)?.name_key 
                    : undefined;
                  return featureName || pf.feature_id;
                })
            : [];
          
          return {
            ...pkg,
            packageFeatures: featuresForThisPackage
          };
        });

        setPricingPackages(packagesWithFeatures);
        setFeaturePrices(featurePricesData || []);
        setComplexityPrices(complexityPricesData || []);
        setTimelinePrices(timelinePricesData || []);
        setProjectTypes(projectTypesData || []);
      } catch (error) {
        console.error("Error in fetchPricingData:", error);
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui saat mengambil data harga.";
        toast.error("Gagal Mengambil Data Harga", {
          description: errorMessage
        });
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchProjects();
    fetchPricingData();
  }, [user, authLoading]);



  const getProjectTypeNameById = useCallback((id: string) => {
    const projectType = projectTypes.find(pt => pt.id === id);
    return projectType?.name_key || 'Jenis Proyek Tidak Ditemukan';
  }, [projectTypes]);

  const getFeatureNameById = useCallback((id: string) => {
    const feature = featurePrices.find(fp => fp.id === id)?.name_key;
    return feature || id;
  }, [featurePrices]);

  const getComplexityNameById = useCallback((id: string) => {
    return complexityPrices.find(cp => cp.id === id)?.label_key || id;
  }, [complexityPrices]);

  const getTimelineNameById = useCallback((id: string) => {
    return timelinePrices.find(tp => tp.id === id)?.label_key || id;
  }, [timelinePrices]);

  const ensureClientRecordExists = async () => {
      if (!user?.id || !user.email) {
          throw new Error('Informasi pengguna tidak lengkap. Silakan login kembali.');
      }

      const supabase = createClient();

      // 1. Cek apakah record klien sudah ada
      const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('user_id')
          .eq('user_id', user.id)
          .single();

      // 2. Jika tidak ada (error "PGRST116: No rows found"), buat record baru
      if (!clientData && clientError && clientError.code === 'PGRST116') {
          const { error: insertClientError } = await supabase.from('clients').insert({
              user_id: user.id,
              status: 'aktif',
              role: 'klien',
              join_date: new Date().toISOString()
          });

          if (insertClientError) {
              console.error("Gagal membuat data klien:", {
                error: insertClientError,
                message: insertClientError.message,
                details: insertClientError.details,
                hint: insertClientError.hint,
                code: insertClientError.code
              });
              throw new Error(`Gagal membuat profil klien Anda sebelum mengajukan proyek: ${insertClientError.message || 'Terjadi kesalahan tidak diketahui'}`);
          }
      } else if (clientError) {
          // Jika terjadi error lain saat pengecekan
          console.error("Gagal memeriksa data klien:", {
            error: clientError,
            message: clientError.message,
            details: clientError.details,
            hint: clientError.hint,
            code: clientError.code
          });
          throw new Error(`Gagal memverifikasi profil klien Anda: ${clientError.message || 'Terjadi kesalahan tidak diketahui'}`);
      }
      // 3. Jika data sudah ada atau berhasil dibuat, lanjutkan
  };

  const handleProjectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTypeId = e.target.value;
    setNewProject({...newProject, type: selectedTypeId});
    
    if (selectedTypeId) {
      const selectedPackage = pricingPackages.find(pkg => pkg.id === selectedTypeId);
      setSelectedPackageDetail(selectedPackage || null);
    } else {
      setSelectedPackageDetail(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      try {
        await ensureClientRecordExists();
        
        let projectPrice: number | null = null;
        let categoryName: string | null = newProject.type;
        
        if (newProject.type) {
          const selectedPackage = pricingPackages.find(pkg => pkg.id === newProject.type);
          if (selectedPackage) {
            projectPrice = selectedPackage.price;
            categoryName = selectedPackage.name_key;
          }
        }
        
        const projectData = {
          user_id: user.id,
          title: newProject.name.trim() || 'Proyek Baru',
          description: newProject.description,
          category: categoryName,
          additional_requirements: newProject.requirements,
          status: 'terkirim',
          price: projectPrice,
          timeline_estimate: calculatorResult ? getTimelineNameById(calculatorResult.timelineId) : null,
          progress: 0,
        };
        
        const supabase = createClient();
        const { data, error: insertError } = await supabase
          .from('projects')
          .insert([projectData])
          .select();
          
        if (insertError) {
          console.error('Error creating project submission:', {
            error: insertError,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          });
          throw new Error(`Gagal membuat pengajuan proyek: ${insertError.message || 'Terjadi kesalahan tidak diketahui'}`);
        }
        
        toast.success("Pengajuan Proyek Berhasil", {
          description: "Proyek Anda telah berhasil diajukan. Tim kami akan segera meninjaunya."
        });

        if (data && data.length > 0) {
          const { data: updatedProjects, error: fetchError } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (fetchError) {
            console.error('Error fetching updated projects:', {
              error: fetchError,
              message: fetchError.message,
              details: fetchError.details,
              hint: fetchError.hint,
              code: fetchError.code
            });
            throw new Error(`Gagal mengambil data proyek terbaru: ${fetchError.message || 'Terjadi kesalahan tidak diketahui'}`);
          }

          const formattedProjects = updatedProjects.map((project: Project) => ({
            id: project.id || '',
            name: project.title || 'Proyek tanpa nama',
            status: project.status || 'planning',
            type: project.category || 'website',
            date: project.created_at || new Date().toISOString(),
            progress: project.progress || 0
          }));

          setProjects(formattedProjects);
        }
        
        setNewProject({ name: "", description: "", type: "", requirements: "" });
        setSelectedPackageDetail(null);
      } catch (error: unknown) {
        console.error("Error creating project submission:", error);
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
        toast.error("Gagal Mengajukan Proyek", {
          description: errorMessage
        });
      }
    }
  };

  const handleCalculatorResult = (result: CalculatorResult) => {
    setCalculatorResult(result);
    setNewProject(prev => ({
      ...prev,
      type: result.projectTypeId
    }));
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user) {
      try {
        await ensureClientRecordExists();
        
        let projectPrice: number | null = null;
        let categoryName: string | null = null;

        if (calculatorResult) {
          projectPrice = calculatorResult.estimatedPrice;
          
          const projectTypeDetail = projectTypes.find(pt => pt.id === calculatorResult.projectTypeId);
          if (projectTypeDetail) {
            categoryName = projectTypeDetail.name_key;
          }
        }
        
        // --- PERBAIKAN: Menambahkan complexity dan features ---
        const projectData = {
          user_id: user.id,
          title: newProject.name.trim() || 'Proyek Baru',
          description: newProject.description,
          category: categoryName,
          additional_requirements: newProject.requirements,
          status: 'terkirim',
          price: projectPrice,
          timeline_estimate: calculatorResult ? getTimelineNameById(calculatorResult.timelineId) : null,
          progress: 0,
          complexity: calculatorResult ? getComplexityNameById(calculatorResult.complexityId) : null,
          features: calculatorResult ? calculatorResult.featureIds.map(id => getFeatureNameById(id)) : null,
        };
        // --- AKHIR PERBAIKAN ---
        
        const supabase = createClient();
        const { data, error: insertError } = await supabase
          .from('projects')
          .insert([projectData])
          .select();
          
        if (insertError) {
          console.error('Error creating custom project submission:', {
            error: insertError,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          });
          throw new Error(`Gagal membuat pengajuan proyek kustom: ${insertError.message || 'Terjadi kesalahan tidak diketahui'}`);
        }

        toast.success("Pengajuan Proyek Berhasil", {
          description: "Proyek kustom Anda telah berhasil diajukan. Tim kami akan segera meninjaunya."
        });
        
        if (data && data.length > 0) {
          const { data: updatedProjects, error: fetchError } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (fetchError) {
            console.error('Error fetching updated projects:', {
              error: fetchError,
              message: fetchError.message,
              details: fetchError.details,
              hint: fetchError.hint,
              code: fetchError.code
            });
            throw new Error(`Gagal mengambil data proyek terbaru: ${fetchError.message || 'Terjadi kesalahan tidak diketahui'}`);
          }

          const formattedProjects = updatedProjects.map((project: Project) => ({
            id: project.id || '',
            name: project.title || 'Proyek tanpa nama',
            status: project.status || 'planning',
            type: project.category || 'website',
            date: project.created_at || new Date().toISOString(),
            progress: project.progress || 0
          }));

          setProjects(formattedProjects);
        }
        
        setNewProject({ name: "", description: "", type: "", requirements: "" });
        setCalculatorResult(null);
        setShowCalculatorForm(false);
      } catch (error: unknown) {
        console.error("Error creating custom project submission:", error);
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
        toast.error("Gagal Mengajukan Proyek", {
          description: errorMessage
        });
      }
    }
  };

  const cancelProject = async (projectId: string) => {
    if (!user) {
      toast.error("Anda harus login untuk membatalkan proyek");
      return;
    }

    if (!window.confirm("Apakah Anda yakin ingin membatalkan proyek ini? Aksi ini tidak dapat dibatalkan.")) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('projects')
        .update({ status: 'dibatalkan', progress: 0 })
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error cancelling project:', {
          error: error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Gagal membatalkan proyek: ${error.message || 'Terjadi kesalahan tidak diketahui'}`);
      }

      const { data: updatedProjects, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching updated projects:', {
          error: fetchError,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          code: fetchError.code
        });
        throw new Error(`Gagal mengambil data proyek terbaru: ${fetchError.message || 'Terjadi kesalahan tidak diketahui'}`);
      }

      const formattedProjects = updatedProjects.map((project: Project) => ({
        id: project.id || '',
        name: project.title || 'Proyek tanpa nama',
        status: project.status || 'planning',
        type: project.category || 'website',
        date: project.created_at || new Date().toISOString(),
        progress: project.progress || 0
      }));

      setProjects(formattedProjects);

      toast.success("Proyek Berhasil Dibatalkan", {
        description: "Proyek telah dibatalkan dan statusnya telah diperbarui."
      });
    } catch (error: unknown) {
      console.error("Error cancelling project:", error);
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
      toast.error("Gagal Membatalkan Proyek", {
        description: errorMessage
      });
    }
  };

  if (loading || authLoading || loadingPackages) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data pengajuan proyek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Ajukan Proyek Baru</h2>
        <p className="text-sm text-muted-foreground">Kirimkan permintaan proyek website Anda</p>
      </div>

      <div className="flex border-b border-gray-700">
        <button
          className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'paket' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('paket')}
        >
          <PackageIcon className="h-4 w-4 mr-2" />
          Paket
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm flex items-center ${activeTab === 'custom' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('custom')}
        >
          <LayersIcon className="h-4 w-4 mr-2" />
          Custom
        </button>
      </div>

      {activeTab === 'paket' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileTextIcon className="h-4 w-4 mr-2" />
              Formulir Pengajuan Proyek
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nama Proyek</label>
                <Input
                  placeholder="Contoh: Website Company Profile PT. Maju Jaya"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Jenis Proyek</label>
                <select
                  value={newProject.type}
                  onChange={handleProjectTypeChange}
                  className="w-full border rounded px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                  required
                >
                  <option value="">Pilih jenis proyek...</option>
                  {pricingPackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name_key}
                    </option>
                  ))}
                </select>
                
                {selectedPackageDetail && (
                  <div className="mt-4 p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                    <div className="flex items-center mb-4">
                      <PackageIcon className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="text-lg font-bold text-blue-400">{selectedPackageDetail.name_key}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <DollarSignIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Harga</p>
                            <p className="font-semibold text-white">
                              {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR'
                              }).format(selectedPackageDetail.price || 0)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <ClockIcon className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Durasi Estimasi</p>
                            <p className="font-semibold text-white">
                              Akan didiskusikan
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        {selectedPackageDetail.description_key && (
                          <div className="flex items-start">
                            <InfoIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide">Deskripsi</p>
                              <p className="font-semibold text-white">
                                {selectedPackageDetail.description_key}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedPackageDetail.packageFeatures && selectedPackageDetail.packageFeatures.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <div className="flex items-center mb-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          <p className="font-bold text-white">Fitur-Fitur Utama</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedPackageDetail.packageFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Deskripsi Singkat</label>
                <Textarea
                  placeholder="Jelaskan secara singkat proyek yang ingin Anda buat..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Persyaratan/Keinginan Khusus</label>
                <Textarea
                  placeholder="Jelaskan persyaratan teknis atau keinginan khusus Anda..."
                  value={newProject.requirements}
                  onChange={(e) => setNewProject({...newProject, requirements: e.target.value})}
                  rows={4}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Ajukan Proyek
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'custom' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LayersIcon className="h-4 w-4 mr-2" />
              Kalkulator Harga Custom
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showCalculatorForm ? (
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nama Proyek</label>
                  <Input
                    placeholder="Contoh: Website Company Profile PT. Maju Jaya"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    required
                  />
                </div>
                
                {calculatorResult && projectTypes.length > 0 && (
                  <div className="mt-4 p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                    <div className="flex items-center mb-4">
                      <PackageIcon className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="text-lg font-bold text-blue-400">Estimasi Proyek Kustom</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <DollarSignIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Estimasi Harga</p>
                            <p className="font-semibold text-white">
                              {new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR'
                              }).format(calculatorResult.estimatedPrice || 0)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FileTextIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Jenis Proyek</p>
                            <p className="font-semibold text-white">
                              {getProjectTypeNameById(calculatorResult.projectTypeId) || 'Tidak diketahui'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FileTextIcon className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Jumlah Halaman</p>
                            <p className="font-semibold text-white">
                              {calculatorResult.pages} halaman
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-start">
                          <AlertCircleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Tingkat Kompleksitas</p>
                            <p className="font-semibold text-white">
                              {getComplexityNameById(calculatorResult.complexityId) || 'Tidak diketahui'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start mt-4">
                          <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Durasi Estimasi</p>
                            <p className="font-semibold text-white">
                              {getTimelineNameById(calculatorResult.timelineId) || 'Tidak diketahui'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {calculatorResult.featureIds && calculatorResult.featureIds.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <div className="flex items-center mb-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          <p className="font-bold text-white">Fitur-Fitur Tambahan</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {calculatorResult.featureIds.map((featureId: string, index: number) => (
                            <div key={index} className="flex items-center">
                              <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{getFeatureNameById(featureId) || featureId}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Deskripsi Singkat</label>
                  <Textarea
                    placeholder="Jelaskan secara singkat proyek yang ingin Anda buat..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    required
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Persyaratan/Keinginan Khusus</label>
                  <Textarea
                    placeholder="Jelaskan persyaratan teknis atau keinginan khusus Anda..."
                    value={newProject.requirements}
                    onChange={(e) => setNewProject({...newProject, requirements: e.target.value})}
                    rows={4}
                  />
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setShowCalculatorForm(false)}>
                    Kembali ke Kalkulator
                  </Button>
                  <Button type="submit">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Ajukan Proyek
                  </Button>
                </div>
              </form>
            ) : calculatorResult ? (
              <div className="text-center py-8">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Estimasi Harga Proyek Kustom</h3>
                  <div className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(calculatorResult.estimatedPrice)}
                  </div>
                  <p className="text-gray-300 mb-8 max-w-md mx-auto">Ini adalah estimasi awal berdasarkan pilihan Anda. Harga akhir mungkin bervariasi setelah konsultasi mendalam dengan tim kami.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="py-3 px-6 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                      onClick={() => {
                        setCalculatorResult(null);
                        setShowCalculatorForm(false);
                      }}
                    >
                      Hitung Ulang
                    </Button>
                    <Button 
                      type="button" 
                      className="py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
                      onClick={() => {
                        setShowCalculatorForm(true);
                        setNewProject(prev => ({
                          name: prev.name || "",
                          description: "",
                          type: "custom",
                          requirements: ""
                        }));
                      }}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Ajukan Proyek
                    </Button>
                  </div>
                </div>
                
                {projectTypes.length > 0 && (
                  <div className="mt-8 p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
                    <div className="flex items-center mb-4">
                      <PackageIcon className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="text-lg font-bold text-blue-400">Detail Estimasi Proyek</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <FileTextIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Jenis Proyek</p>
                            <p className="font-semibold text-white">
                              {getProjectTypeNameById(calculatorResult.projectTypeId) || 'Tidak diketahui'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <FileTextIcon className="h-5 w-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Jumlah Halaman</p>
                            <p className="font-semibold text-white">
                              {calculatorResult.pages} halaman
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-start">
                          <AlertCircleIcon className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Tingkat Kompleksitas</p>
                            <p className="font-semibold text-white">
                              {getComplexityNameById(calculatorResult.complexityId) || 'Tidak diketahui'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start mt-4">
                          <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Durasi Estimasi</p>
                            <p className="font-semibold text-white">
                              {getTimelineNameById(calculatorResult.timelineId) || 'Tidak diketahui'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {calculatorResult.featureIds && calculatorResult.featureIds.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <div className="flex items-center mb-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          <p className="font-bold text-white">Fitur-Fitur Tambahan</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {calculatorResult.featureIds.map((featureId: string, index: number) => (
                            <div key={index} className="flex items-center">
                              <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{getFeatureNameById(featureId) || featureId}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <DynamicPriceCalculator 
                onCalculate={handleCalculatorResult} 
              />
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Daftar Proyek Saya</span>
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari proyek..." className="pl-8" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <FileTextIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                        <h3 className="font-medium">{project.name}</h3>
                      </div>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          project.status === 'selesai' ? 'bg-green-100 text-green-800' :
                          project.status === 'dibatalkan' ? 'bg-red-100 text-red-800' :
                          project.status === 'dalam proses' ? 'bg-yellow-100 text-yellow-800' :
                          (project.status === 'terkirim' || project.status === 'planning') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status === 'selesai' ? <CheckCircleIcon className="h-3 w-3 mr-1" /> :
                           project.status === 'dibatalkan' ? <XCircle className="h-3 w-3 mr-1" /> :
                           project.status === 'dalam proses' ? <ClockIcon className="h-3 w-3 mr-1" /> :
                           (project.status === 'terkirim' || project.status === 'planning') ? <AlertCircleIcon className="h-3 w-3 mr-1" /> :
                           <ClockIcon className="h-3 w-3 mr-1" />}
                          {project.status}
                        </span>
                        <span className="text-sm text-muted-foreground capitalize">{project.type}</span>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(project.date).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center text-sm">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {project.status === 'planning' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.preventDefault();
                            cancelProject(project.id);
                          }}
                          className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                        >
                          Batalkan
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/projects/${project.id}`}>Lihat Detail</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Tidak ada pengajuan proyek yang terdaftar
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}