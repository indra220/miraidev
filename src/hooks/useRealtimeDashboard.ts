import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PortfolioItem } from '@/lib/types';

interface DashboardStats {
  totalProjects: number;
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
    activeClients: 0,
    totalViews: 0,
    unreadMessages: 0
  });
  
  const [recentProjects, setRecentProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Function to fetch initial data
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch all initial data
        const [portfolioData, clientsData, contactData] = await Promise.all([
          supabase.from('portfolio').select(`
            id,
            title,
            client,
            category,
            created_at,
            date,
            views,
            updated_at,
            case_study_url,
            image_url,
            tags,
            description
          `).order('created_at', { ascending: false }),
          supabase.from('clients').select('*'),
          supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
        ]);

        if (portfolioData.error) throw portfolioData.error;
        if (clientsData.error) throw clientsData.error;
        if (contactData.error) throw contactData.error;

        // Calculate initial stats
        const totalProjects = portfolioData.data.length;
        const activeClients = clientsData.data.filter((client: Client) => client.status === 'aktif').length;
        const totalViews = portfolioData.data.reduce((sum: number, project: { views?: number }) => sum + (project.views || 0), 0);
        const unreadMessages = contactData.data.filter((message: ContactSubmission) => message.status !== 'diarsipkan').length;

        setStats({
          totalProjects,
          activeClients,
          totalViews,
          unreadMessages
        });

        // Set recent projects (most recent first, limit to 4)
        const recent = portfolioData.data
          .slice(0, 4);

        setRecentProjects(recent as PortfolioItem[]);
      } catch (err) {
        console.error('Error fetching initial dashboard data:', err);
        setError((err as Error).message || 'Gagal mengambil data dashboard');
      } finally {
        setLoading(false);
      }
    };

    // Function to update stats based on current data
    const updateStats = async () => {
      try {
        // Calculate the stats using individual queries to maintain consistency
        const [totalProjects, activeClients, totalViews, unreadMessages] = await Promise.all([
          // Total projects
          supabase.from('portfolio').select('*', { count: 'exact' }).then(res => res.count || 0),
          // Active clients
          supabase.from('clients').select('*', { count: 'exact' }).eq('status', 'aktif').then(res => res.count || 0),
          // Total views - fetch all portfolio items and sum their views
          supabase.from('portfolio').select('views').then(res => {
            if (res.data) {
              return res.data.reduce((sum: number, project: { views?: number }) => sum + (project.views || 0), 0);
            }
            return 0;
          }),
          // Unread messages
          supabase.from('contact_submissions').select('*', { count: 'exact' }).neq('status', 'diarsipkan').then(res => res.count || 0)
        ]);

        setStats({
          totalProjects,
          activeClients,
          totalViews,
          unreadMessages
        });
      } catch (err) {
        console.error('Error updating stats:', err);
        setError((err as Error).message || 'Gagal memperbarui statistik');
      }
    };

    // Fetch initial data
    fetchInitialData();

    // Set up real-time subscriptions
    const portfolioChannel = supabase
      .channel('portfolio-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio'
        },
        (payload) => {
          console.log('Portfolio change received:', payload);
          updateStats();
          fetchInitialData(); // Refresh recent projects
        }
      )
      .subscribe();

    const clientsChannel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        (payload) => {
          console.log('Clients change received:', payload);
          updateStats();
        }
      )
      .subscribe();

    const contactChannel = supabase
      .channel('contact-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_submissions'
        },
        (payload) => {
          console.log('Contact change received:', payload);
          updateStats();
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(portfolioChannel);
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