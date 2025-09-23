import { supabase } from '@/lib/supabase';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const { error } = await supabase
      .from('contact')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
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