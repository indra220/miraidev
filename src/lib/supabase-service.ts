import { createClient } from "@supabase/supabase-js";
import { PortfolioItem, ServiceItem, Client, ContactSubmission, SeoSetting, AnalyticsData } from "./types";

// Server-side Supabase client untuk operasi admin
export const createSupabaseAdminClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
  }

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};

// Client-side Supabase client untuk operasi user
export const createSupabaseUserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not defined");
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

// Service untuk manajemen portfolio
export const portfolioService = {
  // Mendapatkan semua item portfolio
  getAll: async (): Promise<PortfolioItem[]> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching portfolio items:', error);
      throw new Error('Gagal mengambil data portofolio');
    }
    
    return data as PortfolioItem[];
  },

  // Mendapatkan item portfolio berdasarkan ID
  getById: async (id: number): Promise<PortfolioItem | null> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching portfolio item:', error);
      throw new Error('Gagal mengambil data portofolio');
    }
    
    return data as PortfolioItem;
  },

  // Menambahkan atau memperbarui item portfolio
  upsert: async (item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'> & { id?: number }): Promise<PortfolioItem> => {
    const supabase = createSupabaseAdminClient();
    
    let result;
    if (item.id) {
      // Update existing item
      const { data, error } = await supabase
        .from('portfolio')
        .update({
          ...item,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating portfolio item:', error);
        throw new Error('Gagal memperbarui data portofolio');
      }
      
      result = data;
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('portfolio')
        .insert([{
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting portfolio item:', error);
        throw new Error('Gagal menambahkan data portofolio');
      }
      
      result = data;
    }
    
    return result as PortfolioItem;
  },

  // Menghapus item portfolio
  delete: async (id: number): Promise<void> => {
    const supabase = createSupabaseAdminClient();
    
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting portfolio item:', error);
      throw new Error('Gagal menghapus data portofolio');
    }
  }
};

// Service untuk manajemen layanan
export const servicesService = {
  // Mendapatkan semua layanan
  getAll: async (): Promise<ServiceItem[]> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Error fetching services:', error);
      throw new Error('Gagal mengambil data layanan');
    }
    
    return data as ServiceItem[];
  },

  // Mendapatkan layanan berdasarkan ID
  getById: async (id: number): Promise<ServiceItem | null> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching service:', error);
      throw new Error('Gagal mengambil data layanan');
    }
    
    return data as ServiceItem;
  },

  // Menambahkan atau memperbarui layanan
  upsert: async (service: Omit<ServiceItem, 'id' | 'created_at' | 'updated_at'> & { id?: number }): Promise<ServiceItem> => {
    const supabase = createSupabaseAdminClient();
    
    let result;
    if (service.id) {
      // Update existing service
      const { data, error } = await supabase
        .from('services')
        .update({
          ...service,
          updated_at: new Date().toISOString()
        })
        .eq('id', service.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating service:', error);
        throw new Error('Gagal memperbarui data layanan');
      }
      
      result = data;
    } else {
      // Insert new service
      const { data, error } = await supabase
        .from('services')
        .insert([{
          ...service,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting service:', error);
        throw new Error('Gagal menambahkan data layanan');
      }
      
      result = data;
    }
    
    return result as ServiceItem;
  },

  // Menghapus layanan
  delete: async (id: number): Promise<void> => {
    const supabase = createSupabaseAdminClient();
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service:', error);
      throw new Error('Gagal menghapus data layanan');
    }
  }
};

// Service untuk manajemen klien
export const clientsService = {
  // Mendapatkan semua klien
  getAll: async (): Promise<Client[]> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw new Error('Gagal mengambil data klien');
    }
    
    return data as Client[];
  },

  // Mendapatkan klien berdasarkan ID
  getById: async (id: number): Promise<Client | null> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching client:', error);
      throw new Error('Gagal mengambil data klien');
    }
    
    return data as Client;
  },

  // Menambahkan atau memperbarui klien
  upsert: async (client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'project_count' | 'rating'> & { id?: number }): Promise<Client> => {
    const supabase = createSupabaseAdminClient();
    
    let result;
    if (client.id) {
      // Update existing client
      const { data, error } = await supabase
        .from('clients')
        .update({
          ...client,
          updated_at: new Date().toISOString()
        })
        .eq('id', client.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating client:', error);
        throw new Error('Gagal memperbarui data klien');
      }
      
      result = data;
    } else {
      // Insert new client
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...client,
          project_count: 0,
          rating: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting client:', error);
        throw new Error('Gagal menambahkan data klien');
      }
      
      result = data;
    }
    
    return result as Client;
  },

  // Mengubah status klien
  updateStatus: async (id: number, status: 'aktif' | 'tidak aktif' | 'pending'): Promise<Client> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('clients')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating client status:', error);
      throw new Error('Gagal memperbarui status klien');
    }
    
    return data as Client;
  },

  // Menghapus klien
  delete: async (id: number): Promise<void> => {
    const supabase = createSupabaseAdminClient();
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting client:', error);
      throw new Error('Gagal menghapus data klien');
    }
  }
};

// Service untuk manajemen pesan kontak
export const contactService = {
  // Mendapatkan semua pesan kontak
  getAll: async (): Promise<ContactSubmission[]> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contact submissions:', error);
      throw new Error('Gagal mengambil data pesan kontak');
    }
    
    return data as ContactSubmission[];
  },

  // Mendapatkan pesan kontak berdasarkan ID
  getById: async (id: string): Promise<ContactSubmission | null> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching contact submission:', error);
      throw new Error('Gagal mengambil data pesan kontak');
    }
    
    return data as ContactSubmission;
  },

  // Mengarsipkan pesan kontak
  archive: async (id: string): Promise<ContactSubmission> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({
        status: 'diarsipkan',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error archiving contact submission:', error);
      throw new Error('Gagal mengarsipkan pesan kontak');
    }
    
    return data as ContactSubmission;
  },

  // Mengubah status pesan kontak
  updateStatus: async (id: string, status: 'baru' | 'dibaca' | 'diarsipkan'): Promise<ContactSubmission> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating contact submission status:', error);
      throw new Error('Gagal memperbarui status pesan kontak');
    }
    
    return data as ContactSubmission;
  },

  // Mengubah prioritas pesan kontak
  updatePriority: async (id: string, priority: 'rendah' | 'sedang' | 'tinggi'): Promise<ContactSubmission> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({
        priority,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating contact submission priority:', error);
      throw new Error('Gagal memperbarui prioritas pesan kontak');
    }
    
    return data as ContactSubmission;
  },

  // Menghapus pesan kontak
  delete: async (id: string): Promise<void> => {
    const supabase = createSupabaseAdminClient();
    
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting contact submission:', error);
      throw new Error('Gagal menghapus pesan kontak');
    }
  }
};

// Service untuk manajemen SEO
export const seoService = {
  // Mendapatkan semua pengaturan SEO
  getAll: async (): Promise<SeoSetting[]> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .order('page_path', { ascending: true });
    
    if (error) {
      console.error('Error fetching SEO settings:', error);
      throw new Error('Gagal mengambil data SEO');
    }
    
    return data as SeoSetting[];
  },

  // Mendapatkan pengaturan SEO berdasarkan path halaman
  getByPath: async (path: string): Promise<SeoSetting | null> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_path', path)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching SEO setting:', error);
      throw new Error('Gagal mengambil data SEO');
    }
    
    return data as SeoSetting;
  },

  // Menambahkan atau memperbarui pengaturan SEO
  upsert: async (seo: Omit<SeoSetting, 'id' | 'created_at' | 'updated_at' | 'last_modified'> & { id?: number }): Promise<SeoSetting> => {
    const supabase = createSupabaseAdminClient();
    
    let result;
    if (seo.id) {
      // Update existing SEO setting
      const { data, error } = await supabase
        .from('seo_settings')
        .update({
          ...seo,
          last_modified: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', seo.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating SEO setting:', error);
        throw new Error('Gagal memperbarui data SEO');
      }
      
      result = data;
    } else {
      // Insert new SEO setting
      const { data, error } = await supabase
        .from('seo_settings')
        .insert([{
          ...seo,
          last_modified: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting SEO setting:', error);
        throw new Error('Gagal menambahkan data SEO');
      }
      
      result = data;
    }
    
    return result as SeoSetting;
  },

  // Menghapus pengaturan SEO
  delete: async (id: number): Promise<void> => {
    const supabase = createSupabaseAdminClient();
    
    const { error } = await supabase
      .from('seo_settings')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting SEO setting:', error);
      throw new Error('Gagal menghapus data SEO');
    }
  }
};

// Service untuk manajemen analitik
export const analyticsService = {
  // Mendapatkan semua data analitik
  getAll: async (): Promise<AnalyticsData[]> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching analytics data:', error);
      throw new Error('Gagal mengambil data analitik');
    }
    
    return data as AnalyticsData[];
  },

  // Mendapatkan data analitik berdasarkan tanggal
  getByDate: async (date: string): Promise<AnalyticsData | null> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('date', date)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      console.error('Error fetching analytics data:', error);
      throw new Error('Gagal mengambil data analitik');
    }
    
    return data as AnalyticsData;
  },

  // Menambahkan atau memperbarui data analitik
  upsert: async (analytics: Omit<AnalyticsData, 'id' | 'created_at' | 'updated_at'> & { id?: number }): Promise<AnalyticsData> => {
    const supabase = createSupabaseAdminClient();
    
    let result;
    if (analytics.id) {
      // Update existing analytics data
      const { data, error } = await supabase
        .from('analytics_data')
        .update({
          ...analytics,
          updated_at: new Date().toISOString()
        })
        .eq('id', analytics.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating analytics data:', error);
        throw new Error('Gagal memperbarui data analitik');
      }
      
      result = data;
    } else {
      // Insert new analytics data
      const { data, error } = await supabase
        .from('analytics_data')
        .insert([{
          ...analytics,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting analytics data:', error);
        throw new Error('Gagal menambahkan data analitik');
      }
      
      result = data;
    }
    
    return result as AnalyticsData;
  },

  // Menghapus data analitik
  delete: async (id: number): Promise<void> => {
    const supabase = createSupabaseAdminClient();
    
    const { error } = await supabase
      .from('analytics_data')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting analytics data:', error);
      throw new Error('Gagal menghapus data analitik');
    }
  }
};