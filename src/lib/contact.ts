import { createClient } from './supabase/client'; // Menggunakan client-side client

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string; // Tambahkan field company
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  const supabase = createClient(); // Buat client di dalam fungsi
  try {
    const { error } = await supabase
      .from('contact_submissions') // Perbaikan: Nama tabel yang benar
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        // subject diisi dari nama proyek atau default
        subject: `Pesan dari ${data.name} tentang ${data.projectType || 'proyek baru'}`,
        project_type: data.projectType,
        budget: data.budget,
        timeline: data.timeline,
        message: data.message
      });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim pesan' 
    };
  }
}