import { createClient } from "@supabase/supabase-js";
import { PortfolioItem, ServiceDetails, ClientData, ContactSubmission } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Server-side Supabase client untuk operasi admin
export const createSupabaseAdminClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};

// Service untuk manajemen template
export const portfolioService = {
  // Mendapatkan semua item template
  getAll: async (): Promise<PortfolioItem[]> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching portfolio items:', error);
      throw new Error('Gagal mengambil data template');
    }
    
    // Tambahkan default value untuk is_highlighted karena itu adalah properti tambahan
    return data?.map(item => ({ 
      ...item, 
      is_highlighted: false // default value
    })) as PortfolioItem[];
  },

  // Mendapatkan item template berdasarkan ID
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
      throw new Error('Gagal mengambil data template');
    }
    
    // Tambahkan default value untuk is_highlighted karena itu adalah properti tambahan
    return data ? { ...data, is_highlighted: false } as PortfolioItem : null;
  },

  // Menambahkan atau memperbarui item template
  upsert: async (item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at' | 'is_highlighted'> & { id?: number }): Promise<PortfolioItem> => {
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
        throw new Error('Gagal memperbarui data template');
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
        throw new Error('Gagal menambahkan data template');
      }
      
      result = data;
    }
    
    // Tambahkan default value untuk is_highlighted karena itu adalah properti tambahan
    return { ...result, is_highlighted: false } as PortfolioItem;
  },

  // Menghapus item template
  delete: async (id: number): Promise<void> => {
    const supabase = createSupabaseAdminClient();
    
    const { error } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting portfolio item:', error);
      throw new Error('Gagal menghapus data template');
    }
  }
};

// Service untuk manajemen layanan
export const servicesService = {
  // Mendapatkan semua layanan
  getAll: async (): Promise<ServiceDetails[]> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Error fetching services:', error);
      throw new Error('Gagal mengambil data layanan');
    }
    
    // Tambahkan default value untuk is_featured karena itu adalah properti tambahan
    return data?.map(item => ({ 
      ...item, 
      is_featured: false // default value
    })) as ServiceDetails[];
  },

  // Mendapatkan layanan berdasarkan ID
  getById: async (id: number): Promise<ServiceDetails | null> => {
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
    
    // Tambahkan default value untuk is_featured karena itu adalah properti tambahan
    return data ? { ...data, is_featured: false } as ServiceDetails : null;
  },

  // Menambahkan atau memperbarui layanan
  upsert: async (service: Omit<ServiceDetails, 'id' | 'created_at' | 'updated_at' | 'is_featured'> & { id?: number }): Promise<ServiceDetails> => {
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
    
    // Tambahkan default value untuk is_featured karena itu adalah properti tambahan
    return { ...result, is_featured: false } as ServiceDetails;
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
  getAll: async (): Promise<ClientData[]> => {
    const supabase = createSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching clients:', error);
      throw new Error('Gagal mengambil data klien');
    }
    
    // Tambahkan default value untuk last_contacted karena itu adalah properti tambahan
    return data?.map(item => ({ 
      ...item, 
      last_contacted: null // default value
    })) as ClientData[];
  },

  // Mendapatkan klien berdasarkan ID
  getById: async (id: number): Promise<ClientData | null> => {
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
    
    // Tambahkan default value untuk last_contacted karena itu adalah properti tambahan
    return data ? { ...data, last_contacted: null } as ClientData : null;
  },

  // Menambahkan atau memperbarui klien
  upsert: async (client: Omit<ClientData, 'id' | 'created_at' | 'updated_at' | 'project_count' | 'rating' | 'last_contacted'> & { id?: number }): Promise<ClientData> => {
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
    
    // Tambahkan default value untuk last_contacted karena itu adalah properti tambahan
    return { ...result, last_contacted: null } as ClientData;
  },

  // Mengubah status klien
  updateStatus: async (id: number, status: 'aktif' | 'tidak aktif' | 'pending'): Promise<ClientData> => {
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
    
    // Tambahkan default value untuk last_contacted karena itu adalah properti tambahan
    return { ...data, last_contacted: null } as ClientData;
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

