import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  tags: string[];
  client: string;
  date: string;
  views: number;
  created_at: string;
  updated_at: string;
}

export async function getPortfolioProjects(category?: string) {
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

    return { 
      success: true, 
      data: data as PortfolioProject[] 
    };
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data portofolio',
      data: [] as PortfolioProject[]
    };
  }
}

export async function getAllPortfolioCategories() {
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
    console.error('Error fetching portfolio categories:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil kategori portofolio',
      data: [] as string[]
    };
  }
}