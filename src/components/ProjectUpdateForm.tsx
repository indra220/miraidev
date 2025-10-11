'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { ProjectUpdate } from '@/lib/types';

interface ProjectUpdateFormProps {
  projectId: string;
  onNewUpdate?: (update: ProjectUpdate) => void;
}

export default function ProjectUpdateForm({ projectId, onNewUpdate }: ProjectUpdateFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      // Dapatkan user ID dari session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User tidak terautentikasi');
      }

      const { data, error } = await supabase
        .from('project_updates')
        .insert([{
          project_id: projectId,
          user_id: session.user.id,
          title,
          content
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Laporan proyek berhasil ditambahkan!');
      
      // Reset form
      setTitle('');
      setContent('');
      
      // Panggil callback jika tersedia
      if (onNewUpdate && data) {
        onNewUpdate(data);
      }
    } catch (error: unknown) {
      console.error('Error submitting project update:', error);
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: string }).message);
      }
      toast.error('Gagal menambahkan laporan proyek', {
        description: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [projectId, title, content, onNewUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambahkan Laporan Proyek</CardTitle>
        <CardDescription>
          Berikan informasi terbaru tentang perkembangan proyek
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Laporan</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pengerjaan modul login selesai"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content">Isi Laporan</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Deskripsikan perkembangan proyek secara rinci..."
              rows={4}
              required
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}