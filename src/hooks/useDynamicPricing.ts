import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  ProjectType, 
  FeaturePrice, 
  PagePrice, 
  TimelinePrice, 
  ComplexityPrice, 
  PricingPackage 
} from '@/lib/types';

interface DynamicPricingData {
  projectTypes: ProjectType[];
  featurePrices: FeaturePrice[];
  pagePrices: PagePrice[];
  timelinePrices: TimelinePrice[];
  complexityPrices: ComplexityPrice[];
  pricingPackages: PricingPackage[];
  loading: boolean;
  error: string | null;
}

export const useDynamicPricing = (): DynamicPricingData & { 
  calculatePrice: (projectTypeId: string, pages: number, featureIds: string[], complexityId: string, timelineId: string) => number;
  getPricingPackage: (packageId: string) => PricingPackage | undefined;
} => {
  const [data, setData] = useState<DynamicPricingData>({
    projectTypes: [],
    featurePrices: [],
    pagePrices: [],
    timelinePrices: [],
    complexityPrices: [],
    pricingPackages: [],
    loading: true,
    error: null
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all pricing data
        const [
          projectTypesRes,
          featurePricesRes,
          pagePricesRes,
          timelinePricesRes,
          complexityPricesRes,
          pricingPackagesRes
        ] = await Promise.all([
          supabase.from('project_types').select('*').eq('is_active', true),
          supabase.from('feature_prices').select('*').eq('is_active', true),
          supabase.from('page_prices').select('*').eq('is_active', true).order('page_count', { ascending: true }),
          supabase.from('timeline_prices').select('*').eq('is_active', true),
          supabase.from('complexity_prices').select('*').eq('is_active', true),
          supabase.from('pricing_packages').select('*').eq('is_active', true)
        ]);

        // Check for errors
        const errors = [
          projectTypesRes.error,
          featurePricesRes.error,
          pagePricesRes.error,
          timelinePricesRes.error,
          complexityPricesRes.error,
          pricingPackagesRes.error
        ].filter(Boolean);

        if (errors.length > 0) {
          throw new Error(errors[0]?.message || 'Error mengambil data harga');
        }

        setData({
          projectTypes: projectTypesRes.data || [],
          featurePrices: featurePricesRes.data || [],
          pagePrices: pagePricesRes.data || [],
          timelinePrices: timelinePricesRes.data || [],
          complexityPrices: complexityPricesRes.data || [],
          pricingPackages: pricingPackagesRes.data || [],
          loading: false,
          error: null
        });
      } catch (err) {
        console.error("Error fetching pricing data:", err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: (err as Error).message || "Terjadi kesalahan saat mengambil data harga"
        }));
      }
    };

    fetchData();
  }, [supabase]);

  const calculatePrice = (
    projectTypeId: string, 
    pages: number, 
    featureIds: string[], 
    complexityId: string, 
    timelineId: string
  ): number => {
    // Dapatkan harga dasar proyek
    const projectType = data.projectTypes.find(pt => pt.id === projectTypeId);
    let total = projectType?.base_price || 0;

    // Tambahkan harga berdasarkan jumlah halaman
    if (pages > 0) {
      const applicablePagePrice = [...data.pagePrices]
        .sort((a, b) => (b.page_count || 0) - (a.page_count || 0))
        .find(pp => pages >= (pp.page_count || 0));
      
      if (applicablePagePrice) {
        total += (pages - (applicablePagePrice.page_count || 0)) * (applicablePagePrice.price_per_page || 0);
      }
    }

    // Tambahkan harga fitur-fitur
    featureIds.forEach(featureId => {
      const feature = data.featurePrices.find(fp => fp.id === featureId);
      if (feature) {
        total += feature.price || 0;
      }
    });

    // Terapkan multiplier kompleksitas
    const complexity = data.complexityPrices.find(cp => cp.id === complexityId);
    if (complexity) {
      total *= complexity.multiplier || 1;
    }

    // Terapkan multiplier timeline
    const timeline = data.timelinePrices.find(tp => tp.id === timelineId);
    if (timeline) {
      total *= timeline.multiplier || 1;
    }

    return Math.round(total);
  };

  const getPricingPackage = (packageId: string): PricingPackage | undefined => {
    return data.pricingPackages.find(pkg => pkg.id === packageId);
  };

  return {
    ...data,
    calculatePrice,
    getPricingPackage
  };
};