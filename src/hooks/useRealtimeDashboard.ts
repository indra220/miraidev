import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PortfolioItem } from '@/lib/types';

interface DashboardStats {
  totalProjects: number;
  totalPortfolios: number;
  activeClients: number;
  totalViews: number;
  unreadMessages: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string;
  status: string;
  join_date: string;
  project_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export const useRealtimeDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalPortfolios: 0,
    activeClients: 0,
    totalViews: 0,
    unreadMessages: 0
  });
  
  const [recentProjects, setRecentProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const [portfolioData, projectsData, clientsData, contactData] = await Promise.all([
          supabase.from('portfolio').select(`
            id,
            title,
            category,
            created_at,
            date,
            views,
            updated_at,
            tags,
            description,
            preview_url,
            price,
            use_url
          `).order('created_at', { ascending: false }),
          supabase.from('projects').select('*', { count: 'exact' }),
          supabase.from('clients').select('*'),
          supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
        ]);

        if (portfolioData.error) throw portfolioData.error;
        if (projectsData.error) throw projectsData.error;
        if (clientsData.error) throw clientsData.error;
        if (contactData.error) throw contactData.error;

        const totalPortfolios = portfolioData.data.length;
        const totalProjects = projectsData.count || 0;
        const activeClients = clientsData.data.filter((client: Client) => client.status === 'aktif').length;
        const totalViews = portfolioData.data.reduce((sum: number, project: { views?: number | null }) => sum + (project.views || 0), 0);
        const unreadMessages = contactData.data.filter((message: ContactSubmission) => message.status !== 'diarsipkan').length;

        setStats({
          totalProjects,
          totalPortfolios,
          activeClients,
          totalViews,
          unreadMessages
        });

        const recent = portfolioData.data.slice(0, 4);
        setRecentProjects(recent as PortfolioItem[]);
      } catch (err) {
        console.error('Error fetching initial dashboard data:', err);
        setError((err as Error).message || 'Gagal mengambil data dashboard');
      } finally {
        setLoading(false);
      }
    };

    const updateStats = async () => {
      try {
        const [totalProjects, totalPortfolios, activeClients, totalViews, unreadMessages] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact' }).then(res => res.count || 0),
          supabase.from('portfolio').select('*', { count: 'exact' }).then(res => res.count || 0),
          supabase.from('clients').select('*', { count: 'exact' }).eq('status', 'aktif').then(res => res.count || 0),
          supabase.from('portfolio').select('views').then(res => {
            if (res.data) {
              return res.data.reduce((sum: number, project: { views?: number | null }) => sum + (project.views || 0), 0);
            }
            return 0;
          }),
          supabase.from('contact_submissions').select('*', { count: 'exact' }).neq('status', 'diarsipkan').then(res => res.count || 0)
        ]);

        setStats({
          totalProjects,
          totalPortfolios,
          activeClients,
          totalViews,
          unreadMessages
        });
      } catch (err) {
        console.error('Error updating stats:', err);
        setError((err as Error).message || 'Gagal memperbarui statistik');
      }
    };

    fetchInitialData();

    const portfolioChannel = supabase
      .channel('portfolio-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio' }, () => {
        updateStats();
        fetchInitialData();
      })
      .subscribe();

    const projectsChannel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        updateStats();
      })
      .subscribe();

    const clientsChannel = supabase
      .channel('clients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, () => {
        updateStats();
      })
      .subscribe();

    const contactChannel = supabase
      .channel('contact-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, () => {
        updateStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(portfolioChannel);
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(clientsChannel);
      supabase.removeChannel(contactChannel);
    };
  }, []);

  return {
    stats,
    recentProjects,
    loading,
    error
  };
};