import { PortfolioItem, ServiceDetails, ClientData, ContactSubmission } from "./types";
import type { Database } from './supabase-types/supabase';
import { createClient } from './supabase/client';

// Interface untuk riwayat percakapan
interface MessageThreadItem {
  id: string;
  message: string;
  sender_type: string;
  created_at: string;
  name?: string;
  email?: string;
}

interface ReplyResponse {
  message: string;
  originalMessage: ContactSubmission;
}

// Fungsi untuk membuat panggilan API ke endpoint admin
const makeApiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`/api/admin${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
};

// Service untuk manajemen portfolio
export const portfolioAdminService = {
  // Mendapatkan semua item portfolio
  getAll: async (): Promise<PortfolioItem[]> => {
    const response = await makeApiCall('/portfolio');
    return response.data as PortfolioItem[];
  },

  // Mendapatkan item portfolio berdasarkan ID
  getById: async (id: number): Promise<PortfolioItem | null> => {
    const allItems = await portfolioAdminService.getAll();
    return allItems.find(item => item.id === id) || null;
  },

  // Menambahkan item portfolio
  create: async (item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioItem> => {
    const response = await makeApiCall('/portfolio', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response.data as PortfolioItem;
  },

  // Memperbarui item portfolio
  update: async (item: PortfolioItem): Promise<PortfolioItem> => {
    const response = await makeApiCall('/portfolio', {
      method: 'PUT',
      body: JSON.stringify(item),
    });
    return response.data as PortfolioItem;
  },

  // Menghapus item portfolio
  delete: async (id: number): Promise<void> => {
    await makeApiCall(`/portfolio?id=${id}`, {
      method: 'DELETE',
    });
  }
};

// Service untuk manajemen layanan
export const servicesAdminService = {
  // Mendapatkan semua layanan
  getAll: async (): Promise<ServiceDetails[]> => {
    const response = await makeApiCall('/services');
    // Tambahkan default value untuk is_featured karena itu adalah properti tambahan
    return (response.data || []).map((item: Database['public']['Tables']['services']['Row']) => ({ 
      ...item, 
      is_featured: false // default value
    })) as ServiceDetails[];
  },

  // Mendapatkan layanan berdasarkan ID
  getById: async (id: number): Promise<ServiceDetails | null> => {
    const allItems = await servicesAdminService.getAll();
    const item = allItems.find(item => item.id === id) || null;
    // Tambahkan default value untuk is_featured karena itu adalah properti tambahan
    return item ? { ...item, is_featured: false } as ServiceDetails : null;
  },

  // Menambahkan layanan
  create: async (service: Omit<ServiceDetails, 'id' | 'created_at' | 'updated_at' | 'is_featured'>): Promise<ServiceDetails> => {
    const response = await makeApiCall('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
    // Tambahkan default value untuk is_featured karena itu adalah properti tambahan
    return { ...response.data, is_featured: false } as ServiceDetails;
  },

  // Memperbarui layanan
  update: async (service: ServiceDetails): Promise<ServiceDetails> => {
    const response = await makeApiCall('/services', {
      method: 'PUT',
      body: JSON.stringify(service),
    });
    // Tambahkan default value untuk is_featured karena itu adalah properti tambahan
    return { ...response.data, is_featured: false } as ServiceDetails;
  },

  // Menghapus layanan
  delete: async (id: number): Promise<void> => {
    await makeApiCall(`/services?id=${id}`, {
      method: 'DELETE',
    });
  }
};

// Service untuk manajemen klien
export const clientsAdminService = {
  // Mendapatkan semua klien
  getAll: async (): Promise<ClientData[]> => {
    const response = await makeApiCall('/clients');
    // Tambahkan default value untuk last_contacted karena itu adalah properti tambahan
    return (response.data || []).map((item: Database['public']['Tables']['clients']['Row']) => ({ 
      ...item, 
      last_contacted: null // default value
    })) as ClientData[];
  },

  // Mendapatkan klien berdasarkan ID
  getById: async (id: string): Promise<ClientData | null> => {
    const allItems = await clientsAdminService.getAll();
    const item = allItems.find(item => item.id === id) || null;
    // Tambahkan default value untuk last_contacted karena itu adalah properti tambahan
    return item ? { ...item, last_contacted: null } as ClientData : null;
  },

  // Menambahkan klien
  create: async (client: Omit<ClientData, 'id' | 'created_at' | 'updated_at' | 'last_contacted'>): Promise<ClientData> => {
    const response = await makeApiCall('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
    // Tambahkan default value untuk last_contacted karena itu adalah properti tambahan
    return { ...response.data, last_contacted: null } as ClientData;
  },

  // Memperbarui klien
  update: async (client: ClientData): Promise<ClientData> => {
    const response = await makeApiCall('/clients', {
      method: 'PUT',
      body: JSON.stringify(client),
    });
    // Tambahkan default value untuk last_contacted karena itu adalah properti tambahan
    return { ...response.data, last_contacted: null } as ClientData;
  },

  // Menghapus klien
  delete: async (id: string): Promise<void> => {
    await makeApiCall(`/clients?id=${id}`, {
      method: 'DELETE',
    });
  }
};

// Service untuk manajemen pesan kontak
export const contactAdminService = {
  // Mendapatkan semua pesan kontak
  getAll: async (): Promise<ContactSubmission[]> => {
    const response = await makeApiCall('/contact');
    return response.data as ContactSubmission[];
  },

  // Mendapatkan pesan kontak berdasarkan ID
  getById: async (id: string): Promise<ContactSubmission | null> => {
    const allItems = await contactAdminService.getAll();
    return allItems.find(item => item.id === id) || null;
  },

  // Memperbarui pesan kontak (status, priority, dll.)
  update: async (message: ContactSubmission): Promise<ContactSubmission> => {
    const response = await makeApiCall('/contact', {
      method: 'PUT',
      body: JSON.stringify(message),
    });
    return response.data as ContactSubmission;
  },

  // Menghapus pesan kontak
  delete: async (id: string): Promise<void> => {
    await makeApiCall(`/contact?id=${id}`, {
      method: 'DELETE',
    });
  },

  // Mengirim balasan pesan
  sendReply: async (messageId: string, reply: string): Promise<ReplyResponse> => {
    const response = await makeApiCall('/pesan', {
      method: 'POST',
      body: JSON.stringify({ messageId, reply }),
    });
    return response.data as ReplyResponse;
  },

  // Mengambil riwayat percakapan pesan kontak
  getMessageThread: async (messageId: string): Promise<MessageThreadItem[]> => {
    const supabase = createClient();
    
    // Ambil pesan asli
    const { data: originalMessage, error: originalError } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('id', messageId)
      .single();
    
    if (originalError) {
      console.error('Error fetching original message:', originalError);
      throw new Error('Original message not found');
    }
    
    // Ambil riwayat percakapan
    const { data: threadMessages, error: threadError } = await supabase
      .from('contact_message_threads')
      .select('*')
      .eq('contact_submission_id', messageId)
      .order('created_at', { ascending: true });
    
    if (threadError) {
      console.error('Error fetching message thread:', threadError);
      throw new Error('Failed to fetch message thread');
    }
    
    // Gabungkan pesan asli dengan riwayat percakapan
    const fullThread: MessageThreadItem[] = [
      {
        id: originalMessage.id,
        message: originalMessage.message,
        sender_type: 'user',
        created_at: originalMessage.created_at,
        name: originalMessage.name,
        email: originalMessage.email
      },
      ...(threadMessages || []).map((msg) => ({
        id: msg.id,
        message: msg.message,
        sender_type: msg.sender_type,
        created_at: msg.created_at
      }))
    ];
    
    return fullThread;
  },

  // Mengambil pesan untuk proyek tertentu
  getProjectMessages: async (projectId: string) => {
    const response = await makeApiCall(`/pesan/project/${projectId}`);
    return response.data;
  },

  // Mengirim pesan untuk proyek tertentu
  sendProjectMessage: async (projectId: string, message: string, senderId: string) => {
    const response = await makeApiCall(`/pesan/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({ message, senderId }),
    });
    return response.data;
  }
};