import { createClient } from './supabase/client';
import { Project, ServiceItem, ContactSubmission, UserProfile } from './types';

// Interface untuk data proyek yang ditampilkan di dashboard
export interface DashboardProject {
  id: string;
  name: string;
  client: string;
  status: string;
  progress: number;
  timeline: {
    start: string;
    expected: string;
    actual?: string;
  };
  team: string;
  latestUpdate: string;
}

// Interface untuk data layanan yang ditampilkan di dashboard
export interface DashboardService {
  id: number;
  name: string;
  status: string;
  price: number;
  expiry: string;
  type: string;
}

// Interface untuk data pesan/komunikasi
export interface DashboardMessage {
  id: number;
  sender: string;
  subject: string;
  date: string;
  read: boolean;
}

// Interface untuk percakapan
export interface DashboardConversation {
  id: string;
  project: string;
  participants: number;
  lastMessage: string;
  lastActivity: string;
}

// Interface untuk data profil pengguna
export interface DashboardProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  joinDate: string;
  avatar: string;
}

// Interface untuk data laporan
export interface DashboardReport {
  id: number;
  title: string;
  type: string;
  generated_at: string;
  file_url?: string;
  project_id?: string;
}

// Interface untuk data tiket dukungan
export interface DashboardSupportTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  date: string;
}

// Interface untuk data pengajuan proyek
export interface DashboardProjectSubmission {
  id: number;
  name: string;
  status: string;
  type: string;
  date: string;
}

// Interface untuk data analitik laporan
export interface DashboardAnalytics {
  trafficData: Array<{
    date: string;
    visitors_count: number;
    page_views: number;
    avg_session_duration?: number | null;
    bounce_rate?: number | null;
  }>;
  serviceData: Array<{
    name: string;
    usage: number;
  }>;
}

// Service untuk mengambil data proyek pengguna
export const projectDashboardService = {
  // Mendapatkan daftar proyek untuk dashboard pengguna
  async getUserProjects(userId: string): Promise<DashboardProject[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user projects:', error);
      throw new Error(error.message);
    }

    // Konversi data proyek ke format dashboard
    return data.map((project: Project) => ({
      id: project.id || '',
      name: project.title || 'Proyek tanpa judul',
      client: project.user_id || '', // Field ini sebenarnya adalah creator id, bukan client id
      status: project.status || 'baru',
      progress: 30, // Nilai default sementara, nanti bisa dihitung dari tahapan
      timeline: {
        start: project.start_date || new Date().toISOString(),
        expected: project.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 hari dari sekarang
      },
      team: 'Tim Pengembangan',
      latestUpdate: 'Pembaruan terbaru belum tersedia'
    }));
  },

  // Mendapatkan ringkasan proyek (aktif, selesai, ditunda)
  async getProjectSummary(userId: string) {
    const projects = await projectDashboardService.getUserProjects(userId);
    
    return {
      active: projects.filter(p => p.status === 'aktif' || p.status === 'development').length,
      completed: projects.filter(p => p.status === 'completed' || p.status === 'selesai').length,
      onHold: projects.filter(p => p.status === 'on-hold' || p.status === 'ditunda').length,
      total: projects.length
    };
  }
};

// Service untuk mengambil data layanan
export const serviceDashboardService = {
  // Mendapatkan daftar layanan pengguna
  async getUserServices(userId: string): Promise<DashboardService[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user services:', error);
      throw new Error(error.message);
    }

    // Konversi data layanan ke format dashboard
    return data.map((service: ServiceItem) => ({
      id: service.id || 0,
      name: service.title || 'Layanan tanpa nama',
      status: service.is_active ? 'aktif' : 'tidak aktif',
      price: service.price || 0,
      expiry: service.updated_at || new Date().toISOString(),
      type: service.category || 'layanan'
    }));
  }
};

// Service untuk mengambil data komunikasi
export const communicationDashboardService = {
  // Mendapatkan pesan terbaru
  async getLatestMessages(userId: string): Promise<DashboardMessage[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('user_id', userId) 
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching messages:', error);
      throw new Error(error.message);
    }

    // Konversi data pesan ke format dashboard
    return data.map((message: ContactSubmission) => ({
      id: parseInt(message.id || '0'),
      sender: message.name || 'Pengguna',
      subject: message.subject || 'Tanpa subjek',
      date: message.created_at || new Date().toISOString(),
      read: false 
    }));
  },

  // Mendapatkan percakapan proyek
  async getProjectConversations(userId: string): Promise<DashboardConversation[]> {
    const projects = await projectDashboardService.getUserProjects(userId);
    
    return projects.slice(0, 2).map((project, index) => ({
      id: project.id,
      project: project.name,
      participants: 2,
      lastMessage: `Pembaruan untuk proyek ${project.name} telah tersedia`,
      lastActivity: `${index + 1} jam yang lalu`
    }));
  }
};

// Service untuk mengambil data profil
export const profileDashboardService = {
  // Mendapatkan profil pengguna
  async getUserProfile(userId: string): Promise<DashboardProfile> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*, clients(*)') 
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw new Error(error.message);
    }

    const clientData = data.clients && data.clients.length > 0 ? data.clients[0] : null;
    const profile: UserProfile = data;
    
    return {
      name: profile.full_name || profile.email?.split('@')[0] || 'Pengguna',
      email: profile.email || '',
      phone: clientData?.phone || '', 
      company: clientData?.company || '', 
      joinDate: profile.updated_at || new Date().toISOString(),
      avatar: profile.avatar_url || '/placeholder-avatar.jpg'
    };
  }
};

// Service untuk mengambil data laporan
export const reportsDashboardService = {
  // Mendapatkan laporan-laporan pengguna
  async getUserReports(userId: string): Promise<DashboardReport[]> {
    const supabase = createClient();

    try {
      // Mengambil dari tabel 'reports' sesuai dengan struktur database
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('generated_at', { ascending: false });

      if (error) {
        console.error('Error fetching user reports:', error);
        // Jika tabel tidak ditemukan atau terjadi error lain, kembalikan array kosong
        // Kita tidak throw error agar aplikasi tetap berfungsi meskipun tabel reports tidak ada
        return [];
      }

      // Konversi data laporan ke format dashboard
      return data.map(report => ({
        id: report.id || 0,
        title: report.title || 'Laporan tanpa judul',
        type: report.type || 'general',
        generated_at: report.generated_at || new Date().toISOString(),
        file_url: report.file_url,
        project_id: report.project_id
      }));
    } catch (error) {
      console.error('Unexpected error in getUserReports:', error);
      // Jika terjadi error tak terduga, kembalikan array kosong untuk menjaga fungsionalitas
      return [];
    }
  },

  // Mendapatkan data analitik untuk grafik
  async getAnalyticsData(userId: string): Promise<DashboardAnalytics> {
    const supabase = createClient();

    try {
      // Ambil data analitik dari tabel analytics_data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics_data')
        .select('*')
        .order('date', { ascending: true });

      if (analyticsError) {
        console.error('Error fetching analytics data:', analyticsError);
        // Kembalikan data default jika terjadi error
        return {
          trafficData: [
            { date: "2024-07", visitors_count: 4000, page_views: 2400 },
            { date: "2024-08", visitors_count: 3000, page_views: 1398 },
            { date: "2024-09", visitors_count: 2780, page_views: 3800 },
            { date: "2024-10", visitors_count: 1890, page_views: 4800 },
            { date: "2024-11", visitors_count: 2390, page_views: 3800 },
            { date: "2024-12", visitors_count: 3490, page_views: 4300 },
          ],
          serviceData: [
            { name: "Website", usage: 75 },
            { name: "Hosting", usage: 60 },
            { name: "Email", usage: 45 },
            { name: "SSL", usage: 30 },
          ]
        };
      }

      // Konversi data analitik ke format trafficData
      const trafficData = analyticsData.map(analytic => ({
        date: analytic.date,
        visitors_count: analytic.visitors_count || 0,
        page_views: analytic.page_views || 0,
        avg_session_duration: analytic.avg_session_duration || null,
        bounce_rate: analytic.bounce_rate || null
      }));

      // Ambil data proyek untuk membuat data serviceData
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      if (projectsError) {
        console.error('Error fetching projects for service data:', projectsError);
      }

      // Generate service usage data based on project data
      const serviceUsageMap: Record<string, number> = {};

      if (projects && projects.length > 0) {
        projects.forEach(project => {
          const category = project.category || 'Website';
          // Increase usage based on project status (completed projects have higher usage)
          const usageIncrement = (project.status === 'completed' || project.status === 'selesai') ? 25 : 15;

          if (serviceUsageMap[category]) {
            serviceUsageMap[category] += usageIncrement;
          } else {
            serviceUsageMap[category] = usageIncrement;
          }
        });
      } else {
        // If no projects found, add default entries
        serviceUsageMap["Website"] = 75;
        serviceUsageMap["Hosting"] = 60;
        serviceUsageMap["Email"] = 45;
        serviceUsageMap["SSL"] = 30;
      }

      // Convert to array format for charts
      const serviceData = Object.entries(serviceUsageMap).map(([name, usage]) => ({
        name,
        usage: Math.min(usage, 100) // Ensure usage doesn't exceed 100%
      }));

      return {
        trafficData,
        serviceData
      };

    } catch (error) {
      console.error('Error in getAnalyticsData:', error);
      // Kembalikan data default jika error
      return {
        trafficData: [
          { date: "2024-07", visitors_count: 4000, page_views: 2400 },
          { date: "2024-08", visitors_count: 3000, page_views: 1398 },
          { date: "2024-09", visitors_count: 2780, page_views: 3800 },
          { date: "2024-10", visitors_count: 1890, page_views: 4800 },
          { date: "2024-11", visitors_count: 2390, page_views: 3800 },
          { date: "2024-12", visitors_count: 3490, page_views: 4300 },
        ],
        serviceData: [
          { name: "Website", usage: 75 },
          { name: "Hosting", usage: 60 },
          { name: "Email", usage: 45 },
          { name: "SSL", usage: 30 },
        ]
      };
    }
  }
};

// Service untuk mengambil data tiket dukungan
export const supportTicketDashboardService = {
  // Mendapatkan tiket dukungan pengguna
  async getUserSupportTickets(userId: string): Promise<DashboardSupportTicket[]> {
    const supabase = createClient();

    // Assuming we have a support_tickets table in Supabase
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching support tickets:', error);
      // If the table doesn't exist, return empty array
      if (error.code === '42P01') { // Undefined table error code
        return [];
      }
      throw new Error(error.message);
    }

    // Convert support ticket data to dashboard format
    return data.map(ticket => ({
      id: parseInt(ticket.id) || 0,
      subject: ticket.subject || 'Tiket tanpa subjek',
      status: ticket.status || 'terbuka',
      priority: ticket.priority || 'normal',
      date: ticket.created_at || new Date().toISOString()
    }));
  },

  // Mengirim tiket dukungan baru
  async createSupportTicket(userId: string, subject: string, message: string, priority: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('support_tickets')
      .insert([{
        user_id: userId,
        subject: subject,
        message: message,
        priority: priority,
        status: 'terbuka'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating support ticket:', error);
      throw new Error(error.message);
    }

    return data;
  }
};

// Service untuk mengambil data pengajuan proyek
export const projectSubmissionDashboardService = {
  // Mendapatkan pengajuan proyek pengguna
  async getUserProjectSubmissions(userId: string): Promise<DashboardProjectSubmission[]> {
    const supabase = createClient();

    // Using the existing projects table for project submissions
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching project submissions:', error);
      throw new Error(error.message);
    }

    // Convert project data to dashboard format
    return data.map(project => ({
      id: parseInt(project.id) || 0,
      name: project.title || 'Proyek tanpa nama',
      status: project.status || 'terkirim',
      type: project.category || 'website',
      date: project.created_at || new Date().toISOString()
    }));
  },

  // Mengirim pengajuan proyek baru
  async createProjectSubmission(userId: string, name: string, description: string, type: string, requirements: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        title: name,
        description: description,
        category: type,
        additional_requirements: requirements,
        status: 'terkirim' // Initial status for new submissions
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating project submission:', error);
      throw new Error(error.message);
    }

    return data;
  }
};

// Service utama untuk dashboard
export const dashboardService = {
  // Mendapatkan semua data untuk dashboard
  async getDashboardData(userId: string) {
    try {
      const [
        projects,
        services,
        messages,
        conversations,
        profile,
        reports,
        analytics,
        supportTickets,
        projectSubmissions
      ] = await Promise.all([
        projectDashboardService.getUserProjects(userId),
        serviceDashboardService.getUserServices(userId),
        communicationDashboardService.getLatestMessages(userId),
        communicationDashboardService.getProjectConversations(userId),
        profileDashboardService.getUserProfile(userId),
        reportsDashboardService.getUserReports(userId),
        reportsDashboardService.getAnalyticsData(userId),
        supportTicketDashboardService.getUserSupportTickets(userId),
        projectSubmissionDashboardService.getUserProjectSubmissions(userId)
      ]);

      const projectSummary = await projectDashboardService.getProjectSummary(userId);

      return {
        projects,
        services,
        messages,
        conversations,
        profile,
        projectSummary,
        reports,
        analytics,
        supportTickets,
        projectSubmissions
      };
    } catch (error) {
      // PERBAIKAN: Menangani error dengan type-safe
      if (error instanceof Error) {
        console.error('Error fetching dashboard data:', error.message);
        throw new Error(`Failed to fetch dashboard data: ${error.message}`);
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error(`An unexpected error occurred: ${String(error)}`);
      }
    }
  },

  // Wrapper untuk create support ticket
  async createSupportTicket(userId: string, subject: string, message: string, priority: string) {
    return await supportTicketDashboardService.createSupportTicket(userId, subject, message, priority);
  },

  // Wrapper untuk create project submission
  async createProjectSubmission(userId: string, name: string, description: string, type: string, requirements: string) {
    return await projectSubmissionDashboardService.createProjectSubmission(
      userId, 
      name, 
      description, 
      type, 
      requirements
    );
  }
};