// src/hooks/usePricingData.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
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

export const usePricingData = () => {
  const [data, setData] = useState<PricingData>({
    projectTypes: [],
    featurePrices: [],
    pagePrices: [],
    timelinePrices: [],
    complexityPrices: [],
    pricingPackages: [],
    packageFeatures: [],
    pricingLogs: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        { data: projectTypes, error: projectTypesError },
        { data: featurePrices, error: featurePricesError },
        { data: pagePrices, error: pagePricesError },
        { data: timelinePrices, error: timelinePricesError },
        { data: complexityPrices, error: complexityPricesError },
        { data: pricingPackages, error: pricingPackagesError },
        { data: packageFeatures, error: packageFeaturesError },
        { data: pricingLogs, error: pricingLogsError }
      ] = await Promise.all([
        supabase.from('project_types').select('*').order('created_at', { ascending: false }),
        supabase.from('feature_prices').select('*').order('created_at', { ascending: false }),
        supabase.from('page_prices').select('*').order('page_count', { ascending: true }),
        supabase.from('timeline_prices').select('*').order('created_at', { ascending: false }),
        supabase.from('complexity_prices').select('*').order('created_at', { ascending: false }),
        supabase.from('pricing_packages').select('*').order('created_at', { ascending: false }),
        supabase.from('package_features').select('*').order('created_at', { ascending: false }),
        supabase.from('pricing_logs').select('*').order('changed_at', { ascending: false }).limit(50)
      ]);
      
      if (projectTypesError) throw projectTypesError;
      if (featurePricesError) throw featurePricesError;
      if (pagePricesError) throw pagePricesError;
      if (timelinePricesError) throw timelinePricesError;
      if (complexityPricesError) throw complexityPricesError;
      if (pricingPackagesError) throw pricingPackagesError;
      if (packageFeaturesError) throw packageFeaturesError;
      if (pricingLogsError) throw pricingLogsError;

      setData({
        projectTypes: projectTypes || [],
        featurePrices: featurePrices || [],
        pagePrices: pagePrices || [],
        timelinePrices: timelinePrices || [],
        complexityPrices: complexityPrices || [],
        pricingPackages: pricingPackages || [],
        packageFeatures: packageFeatures || [],
        pricingLogs: pricingLogs || []
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching pricing data:", err);
      setError((err as Error).message || "Terjadi kesalahan saat mengambil data harga");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const validateAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Pengguna tidak terotentikasi");
    }
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (error) {
      throw new Error("Tidak dapat memverifikasi role pengguna");
    }
    if (profile.role !== 'admin') {
      throw new Error("Akses ditolak: Hanya admin yang dapat melakukan aksi ini");
    }
    return user;
  };
  
  const logPricingChange = async (
    tableName: string, 
    recordId: string, 
    actionType: 'INSERT' | 'UPDATE' | 'DELETE', 
    newValue: Record<string, unknown> | null
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pricing_logs')
        .insert({
          table_name: tableName,
          record_id: recordId,
          action_type: actionType,
          new_values: newValue,
          changed_by: user.id,
          changed_at: new Date().toISOString(),
        });
      if (error) throw error;
    } catch (err) {
      console.error("Error logging pricing change:", err);
    }
  };

  const reconcilePackageFeatures = async (packageId: string, selectedFeatureIds: string[]) => {
    try {
      await validateAdminAccess();

      const { data: existingFeatures, error: fetchError } = await supabase
        .from('package_features')
        .select('feature_id')
        .eq('package_id', packageId);

      if (fetchError) throw fetchError;

      const existingFeatureIds = existingFeatures.map(f => f.feature_id);
      
      const featuresToAdd = selectedFeatureIds.filter(id => !existingFeatureIds.includes(id));
      const featuresToRemove = existingFeatureIds.filter(id => !selectedFeatureIds.includes(id));

      if (featuresToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('package_features')
          .delete()
          .eq('package_id', packageId)
          .in('feature_id', featuresToRemove);
        if (deleteError) throw deleteError;
      }

      if (featuresToAdd.length > 0) {
        const newRelations = featuresToAdd.map(feature_id => ({
          package_id: packageId,
          feature_id: feature_id,
          is_included: true,
        }));
        const { error: insertError } = await supabase.from('package_features').insert(newRelations);
        if (insertError) throw insertError;
      }

      await fetchData();
      
      return { success: true };
    } catch (err) {
      console.error("Error reconciling package features:", err);
      return { success: false, error: (err as Error).message };
    }
  };

  const updateProjectType = async (id: string, updates: Partial<ProjectType>) => {
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('project_types').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, projectTypes: prev.projectTypes.map(t => t.id === id ? data : t) }));
      await logPricingChange('project_types', id, 'UPDATE', updates);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const insertProjectType = async (projectType: Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('project_types').insert([{ ...projectType }]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, projectTypes: [data, ...prev.projectTypes] }));
      await logPricingChange('project_types', data.id, 'INSERT', data);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const deleteProjectType = async (id: string) => {
    try {
      await validateAdminAccess();
      const { error } = await supabase.from('project_types').delete().eq('id', id);
      if (error) throw error;
      setData(prev => ({ ...prev, projectTypes: prev.projectTypes.filter(t => t.id !== id) }));
      await logPricingChange('project_types', id, 'DELETE', null);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const updateFeaturePrice = async (id: string, updates: Partial<FeaturePrice>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('feature_prices').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, featurePrices: prev.featurePrices.map(f => f.id === id ? data : f) }));
      await logPricingChange('feature_prices', id, 'UPDATE', updates);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const insertFeaturePrice = async (featurePrice: Omit<FeaturePrice, 'id' | 'created_at' | 'updated_at'>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('feature_prices').insert([{ ...featurePrice }]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, featurePrices: [data, ...prev.featurePrices] }));
      await logPricingChange('feature_prices', data.id, 'INSERT', data);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const updatePagePrice = async (id: string, updates: Partial<PagePrice>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('page_prices').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, pagePrices: prev.pagePrices.map(p => p.id === id ? data : p) }));
      await logPricingChange('page_prices', id, 'UPDATE', updates);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const insertPagePrice = async (pagePrice: Omit<PagePrice, 'id' | 'created_at' | 'updated_at'>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('page_prices').insert([{ ...pagePrice }]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, pagePrices: [data, ...prev.pagePrices] }));
      await logPricingChange('page_prices', data.id, 'INSERT', data);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const updateTimelinePrice = async (id: string, updates: Partial<TimelinePrice>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('timeline_prices').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, timelinePrices: prev.timelinePrices.map(t => t.id === id ? data : t) }));
      await logPricingChange('timeline_prices', id, 'UPDATE', updates);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const insertTimelinePrice = async (timelinePrice: Omit<TimelinePrice, 'id' | 'created_at' | 'updated_at'>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('timeline_prices').insert([{ ...timelinePrice }]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, timelinePrices: [data, ...prev.timelinePrices] }));
      await logPricingChange('timeline_prices', data.id, 'INSERT', data);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const updateComplexityPrice = async (id: string, updates: Partial<ComplexityPrice>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('complexity_prices').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, complexityPrices: prev.complexityPrices.map(c => c.id === id ? data : c) }));
      await logPricingChange('complexity_prices', id, 'UPDATE', updates);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const insertComplexityPrice = async (complexityPrice: Omit<ComplexityPrice, 'id' | 'created_at' | 'updated_at'>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('complexity_prices').insert([{ ...complexityPrice }]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, complexityPrices: [data, ...prev.complexityPrices] }));
      await logPricingChange('complexity_prices', data.id, 'INSERT', data);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const updatePricingPackage = async (id: string, updates: Partial<PricingPackage>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('pricing_packages').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, pricingPackages: prev.pricingPackages.map(p => p.id === id ? data : p) }));
      await logPricingChange('pricing_packages', id, 'UPDATE', updates);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const insertPricingPackage = async (pricingPackage: Omit<PricingPackage, 'id' | 'created_at' | 'updated_at'>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('pricing_packages').insert([{ ...pricingPackage }]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, pricingPackages: [data, ...prev.pricingPackages] }));
      await logPricingChange('pricing_packages', data.id, 'INSERT', data);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const updatePackageFeature = async (id: string, updates: Partial<PackageFeature>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('package_features').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, packageFeatures: prev.packageFeatures.map(pf => pf.id === id ? data : pf) }));
      await logPricingChange('package_features', id, 'UPDATE', updates);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const insertPackageFeature = async (packageFeature: Omit<PackageFeature, 'id' | 'created_at' | 'updated_at'>) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { data, error } = await supabase.from('package_features').insert([{ ...packageFeature }]).select().single();
      if (error) throw error;
      setData(prev => ({ ...prev, packageFeatures: [data, ...prev.packageFeatures] }));
      await logPricingChange('package_features', data.id, 'INSERT', data);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  const deletePackageFeature = async (id: string) => {
    // Implementasi lengkap
    try {
      await validateAdminAccess();
      const { error } = await supabase.from('package_features').delete().eq('id', id);
      if (error) throw error;
      setData(prev => ({ ...prev, packageFeatures: prev.packageFeatures.filter(pf => pf.id !== id) }));
      await logPricingChange('package_features', id, 'DELETE', null);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data, loading, error, fetchData,
    updateProjectType, insertProjectType, deleteProjectType,
    updateFeaturePrice, insertFeaturePrice,
    updatePagePrice, insertPagePrice,
    updateTimelinePrice, insertTimelinePrice,
    updateComplexityPrice, insertComplexityPrice,
    updatePricingPackage, insertPricingPackage,
    updatePackageFeature, insertPackageFeature, deletePackageFeature,
    reconcilePackageFeatures
  };
};