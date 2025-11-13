// src/components/DynamicPriceCalculator.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  ShoppingCart, 
  Building,
  Calculator,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from '@/lib/supabase/client';
import { 
  ProjectType, 
  FeaturePrice, 
  PagePrice, 
  TimelinePrice, 
  ComplexityPrice 
} from '@/lib/types';
import { useLanguage } from '@/i18n/useLanguage';
import { t } from '@/i18n/t';

export default function DynamicPriceCalculator({ 
  onCalculate,
  projectType: initialProjectType = "",
  pages: initialPages = 1,
  features: initialFeatures = [],
  complexity: initialComplexity = "",
  timeline: initialTimeline = ""
}: {
  onCalculate?: (result: {
    projectTypeId: string;
    pages: number;
    featureIds: string[];
    complexityId: string;
    timelineId: string;
    estimatedPrice: number;
  }) => void;
  projectType?: string;
  pages?: number;
  features?: string[];
  complexity?: string;
  timeline?: string;
}) {
  const { locale } = useLanguage();
  const [projectType, setProjectType] = useState(initialProjectType);
  const [pages, setPages] = useState(initialPages);
  const [features, setFeatures] = useState<string[]>(initialFeatures || []);
  const [complexity, setComplexity] = useState(initialComplexity);
  const [timeline, setTimeline] = useState(initialTimeline); 
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();
  
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [featurePrices, setFeaturePrices] = useState<FeaturePrice[]>([]);
  const [pagePrices, setPagePrices] = useState<PagePrice[]>([]);
  const [timelinePrices, setTimelinePrices] = useState<TimelinePrice[]>([]);
  const [complexityPrices, setComplexityPrices] = useState<ComplexityPrice[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        
        const [
          { data: projectTypesData, error: projectTypesError },
          { data: featurePricesData, error: featurePricesError },
          { data: pagePricesData, error: pagePricesError },
          { data: timelinePricesData, error: timelinePricesError },
          { data: complexityPricesData, error: complexityPricesError }
        ] = await Promise.all([
          supabase.from('project_types').select('*').eq('is_active', true).order('created_at'),
          supabase.from('feature_prices').select('*').eq('is_active', true).order('created_at'),
          supabase.from('page_prices').select('*').eq('is_active', true).order('page_count'),
          supabase.from('timeline_prices').select('*').eq('is_active', true),
          supabase.from('complexity_prices').select('*').eq('is_active', true).order('created_at')
        ]);
        
        if (projectTypesError) throw projectTypesError;
        if (featurePricesError) throw featurePricesError;
        if (pagePricesError) throw pagePricesError;
        if (timelinePricesError) throw timelinePricesError;
        if (complexityPricesError) throw complexityPricesError;
        
        // --- LOGIKA PENGURUTAN DISESUAIKAN DENGAN BAHASA INDONESIA ---
        const timelineOrder: { [key: string]: number } = {
          'Mendesak': 1, // Sesuai database Anda
          'Pendek': 2,   // Sesuai database Anda
          'Sedang': 3,   // Sesuai database Anda
          'Panjang': 4,  // Sesuai database Anda
          'Fleksibel': 5
        };
        
        const sortedTimelinePrices = (timelinePricesData || []).sort((a, b) => {
          const orderA = timelineOrder[a.timeline_type] || 99;
          const orderB = timelineOrder[b.timeline_type] || 99;
          return orderA - orderB;
        });
        
        setProjectTypes(projectTypesData || []);
        setFeaturePrices(featurePricesData || []);
        setPagePrices(pagePricesData || []);
        setTimelinePrices(sortedTimelinePrices);
        setComplexityPrices(complexityPricesData || []);
        
        setError(null);
      } catch (err) {
        const errorMsg = await t('pricingCalculator.errorDesc', locale, 'Failed to load price data. Please try again later.');
        setError((err as Error).message || "Terjadi kesalahan saat mengambil data harga");
        toast.error("Error", {
          description: errorMsg
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [locale]);

  const calculateEstimate = async () => {
    if (!projectType || !timeline || !complexity) {
      const missingFieldsMsg = await t('pricingCalculator.missingFields', locale, 'Please complete all selections.');
      toast.error(missingFieldsMsg);
      return;
    }

    const selectedProjectType = projectTypes.find(pt => pt.id === projectType);
    const selectedComplexity = complexityPrices.find(cp => cp.id === complexity);
    const selectedTimeline = timelinePrices.find(tp => tp.id === timeline);
    
    if (!selectedProjectType || !selectedComplexity || !selectedTimeline) {
      const invalidSelectionMsg = await t('pricingCalculator.invalidSelection', locale, 'Invalid selection.');
      toast.error(invalidSelectionMsg);
      return;
    }

    let price = selectedProjectType.base_price || 0;

    let pageCost = 0;
    if (pages > 0 && pagePrices.length > 0) {
      const applicablePagePrice = pagePrices[0]; 
      pageCost = pages * (applicablePagePrice.price_per_page || 0);
    }
    price += pageCost;

    let featureCost = 0;
    features.forEach(featureId => {
      const feature = featurePrices.find(fp => fp.id === featureId);
      if (feature) {
        featureCost += feature.price || 0;
      }
    });
    price += featureCost;

    const complexityMultiplier = selectedComplexity.multiplier || 1;
    price *= complexityMultiplier;

    const timelineMultiplier = selectedTimeline.multiplier || 1;
    price *= timelineMultiplier;

    const finalPrice = Math.round(price);
    setEstimatedPrice(finalPrice);
    setShowResult(true);
    const estimateSuccessMsg = await t('pricingCalculator.estimateSuccess', locale, 'Price estimate calculated successfully');
    toast.success(estimateSuccessMsg);

    if (onCalculate) {
      onCalculate({
        projectTypeId: projectType,
        pages,
        featureIds: features,
        complexityId: complexity,
        timelineId: timeline,
        estimatedPrice: finalPrice
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const resetCalculator = () => {
    setProjectType("");
    setPages(1);
    setFeatures([]);
    setComplexity("");
    setTimeline("");
    setEstimatedPrice(0);
    setShowResult(false);
  };

  const toggleFeature = (featureId: string) => {
    if (features.includes(featureId)) {
      setFeatures(features.filter(id => id !== featureId));
    } else {
      setFeatures([...features, featureId]);
    }
  };

  const redirectToContactWithEstimation = async () => {
    const selectedProjectType = projectTypes.find(p => p.id === projectType);
    const selectedComplexity = complexityPrices.find(c => c.id === complexity);
    const selectedTimeline = timelinePrices.find(t => t.id === timeline);
    const selectedFeatures = features.map(fId => featurePrices.find(f => f.id === fId)?.name_key).filter(Boolean);

    const queryString = new URLSearchParams({
      fromCalculator: 'true',
      projectType: 'custom',
      projectTypeName: selectedProjectType?.name_key || await t('common.undetermined', locale, 'Undetermined'),
      pages: pages.toString(),
      features: selectedFeatures.join(','),
      complexityLabel: selectedComplexity?.label_key || await t('common.undetermined', locale, 'Undetermined'),
      timelineLabel: selectedTimeline?.label_key || await t('common.undetermined', locale, 'Undetermined'),
      estimatedPrice: estimatedPrice.toString()
    }).toString();

    router.push(`/kontak?${queryString}`);
  };

  const completedSteps = [
    projectType ? 1 : 0,
    features.length > 0 ? 1 : 0,
    pages >= 1 ? 1 : 0,
    timeline ? 1 : 0,
    complexity ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-8">
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">{locale === 'en' ? "Loading price data..." : "Memuat data harga..."}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-8">
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{locale === 'en' ? "Error Loading Data" : "Error Memuat Data"}</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium" onClick={() => window.location.reload()}>
              {locale === 'en' ? "Try Again" : "Coba Lagi"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (!loading && (projectTypes.length === 0 || timelinePrices.length === 0 || complexityPrices.length === 0 || pagePrices.length === 0)) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-8">
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{locale === 'en' ? "Price Data Not Complete" : "Data Harga Belum Lengkap"}</h3>
            <p className="text-gray-400 mb-4">{locale === 'en' ? "Some price components have not been set by admin. Ensure all price types have been filled." : "Beberapa komponen harga belum diatur oleh admin. Pastikan semua jenis harga telah diisi."}</p>
            <p className="text-sm text-gray-500 mt-2">{locale === 'en' ? "Admin needs to fill prices for Project Types, Pages, Timeline, and Complexity." : "Admin perlu mengisi harga untuk Jenis Proyek, Halaman, Waktu, dan Kompleksitas."}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="mb-8">
      <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-xl">
        <div className="mt-6">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${(completedSteps / 5) * 100}%` }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{completedSteps}/5 {locale === 'en' ? "steps completed" : "langkah selesai"}</span>
          </div>
        </div>
        
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="bg-white/20 p-2 rounded-full">
              <Calculator className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {locale === 'en' ? "Project Price Estimation" : "Estimasi Harga Proyek"}
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            {locale === 'en' ? "Get project price estimation based on your specific needs" : "Dapatkan estimasi harga untuk proyek Anda berdasarkan kebutuhan spesifik"}
          </p>
        </div>

        {!showResult ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="text-blue-400 text-xs font-bold">1</span></div><Label className="text-base font-semibold text-gray-200">{locale === 'en' ? "Project Type" : "Jenis Proyek"}</Label></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectTypes.map((type) => {
                  let iconComponent = <Globe className="w-5 h-5" />;
                  if (type.name_key?.toLowerCase().includes('toko') || type.name_key?.toLowerCase().includes('ecommerce')) iconComponent = <ShoppingCart className="w-5 h-5" />;
                  if (type.name_key?.toLowerCase().includes('bisnis') || type.name_key?.toLowerCase().includes('business')) iconComponent = <Building className="w-5 h-5" />;
                  return <button key={type.id} className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${projectType === type.id ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/50"}`} onClick={() => setProjectType(type.id)}><div className={`p-3 rounded-full mb-2 ${projectType === type.id ? "bg-blue-500/20 text-blue-400" : "bg-gray-700 text-gray-400"}`}>{iconComponent}</div><span className={`font-medium ${projectType === type.id ? "text-blue-400" : "text-gray-300"}`}>{type.name_key}</span></button>;
                })}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="text-blue-400 text-xs font-bold">2</span></div><Label className="text-base font-semibold text-gray-200">{locale === 'en' ? "Additional Features" : "Fitur Tambahan"}</Label></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {featurePrices.map((feature) => <div key={feature.id} className={`p-4 rounded-lg border transition-all duration-300 flex items-center ${features.includes(feature.id) ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/30"}`} onClick={() => toggleFeature(feature.id)}><div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${features.includes(feature.id) ? "bg-blue-500 border-blue-500" : "border-gray-500"}`}>{features.includes(feature.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}</div><div className="flex-1"><span className={`${features.includes(feature.id) ? "text-blue-400" : "text-gray-300"}`}>{feature.name_key}</span></div></div>)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="text-blue-400 text-xs font-bold">3</span></div><Label className="text-base font-semibold text-gray-200">{locale === 'en' ? "Number of Pages" : "Jumlah Halaman"}</Label></div>
              <div className="flex items-center justify-center"><button className="w-12 h-12 rounded-l-lg border border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center" onClick={() => setPages(Math.max(1, pages - 1))}>-</button><input type="number" min="1" value={pages} onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 1))} className="h-12 w-24 bg-gray-700 border-y border-gray-600 focus:border-blue-500 text-center text-lg font-medium" /><button className="w-12 h-12 rounded-r-lg border border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center" onClick={() => setPages(pages + 1)}>+</button><span className="ml-4 text-gray-400">{locale === 'en' ? "pages" : "halaman"}</span></div>
              <div className="text-center text-sm text-gray-500 h-4"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="text-blue-400 text-xs font-bold">4</span></div><Label className="text-base font-semibold text-gray-200">{locale === 'en' ? "Project Timeline" : "Estimasi Waktu Pengerjaan"}</Label></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timelinePrices.map((option) => <button key={option.id} className={`p-4 rounded-lg border transition-all duration-300 text-center ${timeline === option.id ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/30 text-gray-300"}`} onClick={() => setTimeline(option.id)}><span className="text-sm font-medium">{option.label_key}</span></button>)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><span className="text-blue-400 text-xs font-bold">5</span></div><Label className="text-base font-semibold text-gray-200">{locale === 'en' ? "Complexity Level" : "Tingkat Kompleksitas"}</Label></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complexityPrices.map((option) => <button key={option.id} className={`p-5 rounded-xl border-2 transition-all duration-300 ${complexity === option.id ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/50"}`} onClick={() => setComplexity(option.id)}><span className={`font-semibold block mb-1 ${complexity === option.id ? "text-blue-400" : "text-gray-300"}`}>{option.label_key}</span><span className="text-xs text-gray-500">{option.description_key}</span></button>)}
              </div>
            </div>
            <div className="text-center pt-6"><button className={`py-3 px-8 rounded-xl text-base font-semibold transition-all duration-300 ${projectType && timeline && complexity ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`} onClick={calculateEstimate} disabled={!projectType || !timeline || !complexity}>{locale === 'en' ? "Calculate Price Estimate" : "Hitung Estimasi Harga"}</button></div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">{locale === 'en' ? "Price Estimate" : "Estimasi Harga"}</h3>
              <div className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{formatPrice(estimatedPrice)}</div>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">{locale === 'en' ? "This is an initial estimate based on your selections. Final price may vary after consultation with our team." : "Ini adalah estimasi awal berdasarkan pilihan Anda. Harga akhir mungkin bervariasi setelah konsultasi mendalam dengan tim kami."}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105" onClick={resetCalculator}>{locale === 'en' ? "Recalculate" : "Hitung Ulang"}</button>
                <button className="py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105" onClick={redirectToContactWithEstimation}>{locale === 'en' ? "Consult Now" : "Konsultasi Sekarang"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}