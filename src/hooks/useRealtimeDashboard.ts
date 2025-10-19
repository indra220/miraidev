// src/hooks/useRealtimeDashboard.ts
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
        
        const [portfolioData, projectsData, clientsData] = await Promise.all([
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
          supabase.from('clients').select('*')
        ]);

        if (portfolioData.error) throw portfolioData.error;
        if (projectsData.error) throw projectsData.error;
        if (clientsData.error) throw clientsData.error;

        const totalPortfolios = portfolioData.data.length;
        const totalProjects = projectsData.count || 0;
        const activeClients = clientsData.data.filter((client: Client) => client.status === 'aktif').length;
        const totalViews = portfolioData.data.reduce((sum: number, project: { views?: number | null }) => sum + (project.views || 0), 0);
        
        // Hitung pesan unread dari sistem chat umum (conversation_messages) yang dikirim oleh pengguna (bukan admin yang sedang login)
        // Dapatkan ID user yang sedang login
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;

        let unreadMessages; // Deklarasikan variabel di sini

        if (!currentUserId) {
          // Jika tidak ada user yang login, kita kembali ke perhitungan umum pesan dari non-admin
          const { data: adminProfile, error: adminProfileError } = await supabase
            .from('profiles')
            .select('id')
            .or('role.eq.admin,role.eq.super_admin');

          if (adminProfileError) {
            // Jika gagal mengambil profil admin, kita tetap lanjutkan dengan menghitung semua pesan unread
            try {
              const { count: unreadMessagesAll } = await supabase
                .from('conversation_messages')
                .select('*', { count: 'exact' })
                .eq('read_status', false);

              unreadMessages = unreadMessagesAll || 0;
            } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
              // Jika tetap gagal, kembalikan 0 sebagai fallback
              unreadMessages = 0;
            }
          } else {
            // Pastikan adminProfile tidak null dan berisi data sebelum mengaksesnya
            const adminIds = adminProfile && Array.isArray(adminProfile) 
              ? adminProfile.map(profile => profile.id) 
              : [];
            
            // Jika tidak ada admin, ambil semua pesan unread
            if (adminIds.length === 0) {
              try {
                const { count: unreadMessagesAll } = await supabase
                  .from('conversation_messages')
                  .select('*', { count: 'exact' })
                  .eq('read_status', false);

                unreadMessages = unreadMessagesAll || 0;
              } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
                // Jika gagal, kembalikan 0 sebagai fallback
                unreadMessages = 0;
              }
            } else {
              try {
                // Hitung pesan unread yang dikirim oleh non-admin
                const { count: unreadMessagesFromUsers } = await supabase
                  .from('conversation_messages')
                  .select('*', { count: 'exact' })
                  .eq('read_status', false)
                  .not('sender_id', 'in', adminIds); // Tidak termasuk ID admin

                unreadMessages = unreadMessagesFromUsers || 0;
              } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
                // Jika gagal, kembalikan 0 sebagai fallback
                unreadMessages = 0;
              }
            }
          }
        } else {
          // Jika ada user yang login, hitung pesan unread yang bukan dikirim oleh user tersebut
          try {
            const { count: unreadMessagesForCurrentUser } = await supabase
              .from('conversation_messages')
              .select('*', { count: 'exact' })
              .eq('read_status', false)
              .neq('sender_id', currentUserId); // Bukan dikirim oleh user saat ini (admin)

            unreadMessages = unreadMessagesForCurrentUser || 0;
          } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
            // Jika gagal, kembalikan 0 sebagai fallback
            unreadMessages = 0;
          }
        }

        setStats({
          totalProjects,
          totalPortfolios,
          activeClients,
          totalViews,
          unreadMessages: unreadMessages || 0
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
          // Ambil jumlah pesan unread dari pengguna (bukan admin)
          (async () => {
            try {
              // Dapatkan ID user yang sedang login
              const { data: { session } } = await supabase.auth.getSession();
              const currentUserId = session?.user?.id;
              
              if (!currentUserId) {
                // Jika tidak ada user yang login, kita tidak bisa menghitung pesan unread spesifik
                // Kita kembali ke perhitungan umum pesan dari non-admin
                const { data: adminProfile, error: adminProfileError } = await supabase
                  .from('profiles')
                  .select('id')
                  .or('role.eq.admin,role.eq.super_admin');
                
                if (adminProfileError) {
                  // Jika gagal mengambil profil admin, hitung semua pesan unread
                  const { count } = await supabase
                    .from('conversation_messages')
                    .select('*', { count: 'exact' })
                    .eq('read_status', false);
                  
                  return count || 0;
                }
                
                const adminIds = adminProfile && Array.isArray(adminProfile) 
                  ? adminProfile.map(profile => profile.id) 
                  : [];
                
                if (adminIds.length === 0) {
                  // Jika tidak ada admin, hitung semua pesan unread
                  const { count } = await supabase
                    .from('conversation_messages')
                    .select('*', { count: 'exact' })
                    .eq('read_status', false);
                  
                  return count || 0;
                }
                
                // Hitung pesan unread yang dikirim oleh non-admin (pengguna)
                const { count } = await supabase
                  .from('conversation_messages')
                  .select('*', { count: 'exact' })
                  .eq('read_status', false)
                  .not('sender_id', 'in', adminIds); // Tidak termasuk ID admin

                return count || 0;
              }
              
              // Jika ada user yang login, hitung pesan unread yang bukan dikirim oleh user tersebut
              const { count } = await supabase
                .from('conversation_messages')
                .select('*', { count: 'exact' })
                .eq('read_status', false)
                .neq('sender_id', currentUserId); // Bukan dikirim oleh user saat ini (admin)

              return count || 0;
            } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
              // Jika terjadi error umum, kembalikan 0 sebagai fallback
              return 0;
            }
          })()
        ]);

        setStats({
          totalProjects,
          totalPortfolios,
          activeClients,
          totalViews,
          unreadMessages: unreadMessages || 0
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
    
    const conversationMessagesChannel = supabase
      .channel('conversation-messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_messages' }, () => {
        updateStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(portfolioChannel);
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(clientsChannel);
      supabase.removeChannel(contactChannel);
      supabase.removeChannel(conversationMessagesChannel);
    };
  }, []);

  return {
    stats,
    recentProjects,
    loading,
    error
  };
};