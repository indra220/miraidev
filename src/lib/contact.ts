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
  // Field tambahan untuk data dari kalkulator harga
  calculatorData?: {
    projectTypeId?: string;
    pages?: number;
    featureIds?: string[];
    complexityId?: string;
    timelineId?: string;
    estimatedPrice?: number;
  };
}

export async function submitContactForm(data: ContactFormData) {
  const supabase = createClient(); // Buat client di dalam fungsi
  try {
    // Siapkan data untuk disimpan
    const submissionData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      // subject diisi dari nama proyek atau default
      subject: `Pesan dari ${data.name} tentang ${data.projectType || 'proyek baru'}`,
      project_type: data.projectType,
      budget: data.budget,
      timeline: data.timeline,
      message: data.message,
      // Tambahkan data dari kalkulator harga jika tersedia
      calculator_data: data.calculatorData ? {
        project_type_id: data.calculatorData.projectTypeId,
        pages: data.calculatorData.pages,
        feature_ids: data.calculatorData.featureIds,
        complexity_id: data.calculatorData.complexityId,
        timeline_id: data.calculatorData.timelineId,
        estimated_price: data.calculatorData.estimatedPrice
      } : null
    };

    const { error } = await supabase
      .from('contact_submissions') // Perbaikan: Nama tabel yang benar
      .insert(submissionData);

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