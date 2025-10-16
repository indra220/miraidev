// src/app/dashboard/projects/[id]/updates/page.tsx

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ProjectUpdate } from '@/lib/types';

export default function ProjectUpdatesPage() {
  const { id } = useParams<{ id: string }>();
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
        .eq('project_id', id)
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
  }, [id]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUpdates();
    }
  }, [fetchUpdates]);

  // Tambahkan event listener untuk visibilitychange
  useEffect(() => {
    const handleVisibilityChange = () => {
      // Jika halaman tidak tersembunyi dan data belum pernah diambil, ambil data
      if (!document.hidden && !hasFetched.current) {
        fetchUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchUpdates]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" asChild className="mb-4">
          <Link href={`/dashboard/projects/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Detail Proyek
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Update Proyek</h1>
        <p className="text-muted-foreground">
          Semua laporan dan update terkait proyek
        </p>
      </div>

      {updates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Update Proyek</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Belum ada update untuk proyek ini.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{update.title}</CardTitle>
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Isi Update</Label>
                    <div className="mt-1 p-4 bg-muted rounded-md">
                      <p>{update.content}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}