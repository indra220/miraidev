import { PortfolioItem, ServiceItem, Client, ContactSubmission } from "./types";

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
  getAll: async (): Promise<ServiceItem[]> => {
    const response = await makeApiCall('/services');
    return response.data as ServiceItem[];
  },

  // Mendapatkan layanan berdasarkan ID
  getById: async (id: number): Promise<ServiceItem | null> => {
    const allItems = await servicesAdminService.getAll();
    return allItems.find(item => item.id === id) || null;
  },

  // Menambahkan layanan
  create: async (service: Omit<ServiceItem, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceItem> => {
    const response = await makeApiCall('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
    return response.data as ServiceItem;
  },

  // Memperbarui layanan
  update: async (service: ServiceItem): Promise<ServiceItem> => {
    const response = await makeApiCall('/services', {
      method: 'PUT',
      body: JSON.stringify(service),
    });
    return response.data as ServiceItem;
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
  getAll: async (): Promise<Client[]> => {
    const response = await makeApiCall('/clients');
    return response.data as Client[];
  },

  // Mendapatkan klien berdasarkan ID
  getById: async (id: number): Promise<Client | null> => {
    const allItems = await clientsAdminService.getAll();
    return allItems.find(item => item.id === id) || null;
  },

  // Menambahkan klien
  create: async (client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'project_count' | 'rating'>): Promise<Client> => {
    const response = await makeApiCall('/clients', {
      method: 'POST',
      body: JSON.stringify({
        ...client,
        project_count: 0,
        rating: 0
      }),
    });
    return response.data as Client;
  },

  // Memperbarui klien
  update: async (client: Client): Promise<Client> => {
    const response = await makeApiCall('/clients', {
      method: 'PUT',
      body: JSON.stringify(client),
    });
    return response.data as Client;
  },

  // Menghapus klien
  delete: async (id: number): Promise<void> => {
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
  }
};