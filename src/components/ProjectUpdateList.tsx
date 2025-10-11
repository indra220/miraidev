'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { ProjectUpdate } from '@/lib/types';

interface ProjectUpdateListProps {
  projectId: string;
}

export default function ProjectUpdateList({ projectId }: ProjectUpdateListProps) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // Gunakan ref untuk melacak apakah data sudah diambil

  const fetchUpdates = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from('project_updates')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUpdates(data || []);
      hasFetched.current = true; // Tandai bahwa data sudah diambil
    } catch (error: unknown) {
      console.error('Error fetching project updates:', error);
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: string }).message);
      }
      toast.error('Gagal memuat laporan proyek', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUpdates();
    }
  }, [fetchUpdates]);

  // Tambahkan event listener untuk visibilitychange jika ingin memperbarui data saat kembali ke tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && hasFetched.current) {
        // Hanya ambil data lagi jika ingin menyegarkan saat kembali ke tab
        // fetchUpdates(); // Hapus komentar jika ingin menyegarkan data
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchUpdates]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Laporan Proyek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (updates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Laporan Proyek</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Belum ada laporan untuk proyek ini.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan Proyek</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {updates.map((update) => (
          <div key={update.id} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{update.title}</h3>
              <Badge variant="outline" className="text-xs">
                {new Date(update.created_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Badge>
            </div>
            <div className="mt-2">
              <Label>Isi Laporan</Label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <p>{update.content}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}