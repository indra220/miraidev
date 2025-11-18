import { createClient } from '@/lib/supabase/client';
import { PortfolioItem } from './types';
const supabase = createClient();

export async function getTemplateProjects(category?: string) {
  try {
    let query = supabase
      .from('portfolio')
      .select('*')
      .order('date', { ascending: false });

    if (category && category !== 'all') {
      query = query.ilike('category', `%${category}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    // Tambahkan is_highlighted sebagai false secara default karena itu adalah properti tambahan
    const templateItems = data.map(item => ({
      ...item,
      is_highlighted: false
    })) as PortfolioItem[];

    return {
      success: true,
      data: templateItems
    };
  } catch (error) {
    console.error('Error fetching template projects:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data template',
      data: []
    };
  }
}

export async function getAllTemplateCategories() {
  try {
    const { data, error } = await supabase
      .from('portfolio')
      .select('category')
      .order('category');

    if (error) {
      throw new Error(error.message);
    }

    // Get unique categories
    const categories = Array.from(new Set(data.map(item => item.category)));

    return {
      success: true,
      data: categories
    };
  } catch (error) {
    console.error('Error fetching template categories:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil kategori template',
      data: [] as string[]
    };
  }
}