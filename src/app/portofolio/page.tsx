"use client";

import { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Globe, 
  Building, 
  ArrowRight,
  Eye,
  Calendar,
  Users
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { getPortfolioProjects, getAllPortfolioCategories } from "@/lib/portfolio";

interface PortfolioProject {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  client: string;
  date: string;
  views: string;
}

  interface Category {
    id: string;
    name: string;
    icon: ReactNode;
  }

export default function PortofolioPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "Semua", icon: <Globe className="w-4 h-4" /> }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        const categoryResult = await getAllPortfolioCategories();
        if (categoryResult.success) {
          const categoryData = categoryResult.data.map(cat => ({
            id: cat.toLowerCase(),
            name: cat,
            icon: <Globe className="w-4 h-4" />
          }));
          
          setCategories([
            { id: "all", name: "Semua", icon: <Globe className="w-4 h-4" /> },
            ...categoryData
          ]);
        }
        
        // Fetch projects
        const projectResult = await getPortfolioProjects();
        if (projectResult.success) {
          // Transform data to match existing structure
          const transformedProjects: PortfolioProject[] = projectResult.data.map((project) => ({
            id: Number(project.id),
            title: project.title,
            category: project.category,
            description: project.description,
            image: project.image_url || `/placeholder-portfolio-${Math.floor(Math.random() * 6) + 1}.jpg`,
            tags: project.tags || [],
            client: project.client,
            date: new Date(project.date).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'long' 
            }),
            views: project.views?.toString() || "0"
          }));
          
          setProjects(transformedProjects);
        } else {
          throw new Error(projectResult.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data portofolio");
        // Fallback to static data if Supabase fetch fails
        setProjects([
          {
            id: 1,
            title: "Website Kedai Kopi Lokal",
            category: "UMKM",
            description: "Website profesional untuk kedai kopi lokal dengan menu online, lokasi, dan informasi kontak.",
            image: "/placeholder-portfolio-1.jpg",
            tags: ["Next.js", "Tailwind CSS", "Vercel"],
            client: "Kedai Kopi Nusantara",
            date: "Maret 2024",
            views: "850"
          },
          {
            id: 2,
            title: "Portofolio Fotografer Freelance",
            category: "Personal Branding",
            description: "Website portofolio yang menampilkan karya fotografer freelance dengan galeri interaktif.",
            image: "/placeholder-portfolio-2.jpg",
            tags: ["React", "Framer Motion", "Cloudinary"],
            client: "Andi Prasetyo Photography",
            date: "Januari 2024",
            views: "1.2K"
          },
          {
            id: 3,
            title: "Website Konsultan Finansial",
            category: "Profesional Jasa",
            description: "Website untuk konsultan finansial independen dengan blog, layanan, dan form booking.",
            image: "/placeholder-portfolio-3.jpg",
            tags: ["Next.js", "MDX", "Formspree"],
            client: "Rina Financial Consultant",
            date: "November 2023",
            views: "950"
          },
          {
            id: 4,
            title: "Website PPDB SD Negeri 01",
            category: "ppdb",
            description: "Website sistem PPDB online untuk SD Negeri 01 dengan form registrasi dan tracking status pendaftaran.",
            image: "/placeholder-portfolio-4.jpg",
            tags: ["Next.js", "Firebase", "Tailwind CSS"],
            client: "SD Negeri 01 Jakarta",
            date: "September 2023",
            views: "2.1K"
          },
          {
            id: 5,
            title: "Portofolio Developer Freelance",
            category: "Personal Branding",
            description: "Website portofolio profesional untuk developer freelance dengan studi kasus proyek.",
            image: "/placeholder-portfolio-5.jpg",
            tags: ["Next.js", "Framer Motion", "MDX"],
            client: "Budi Santoso - Web Developer",
            date: "Juli 2023",
            views: "1.5K"
          },
          {
            id: 6,
            title: "Website PPDB SMA Negeri 5",
            category: "ppdb",
            description: "Website sistem PPDB online untuk SMA Negeri 5 dengan fitur upload berkas dan verifikasi dokumen.",
            image: "/placeholder-portfolio-6.jpg",
            tags: ["React", "Node.js", "MongoDB"],
            client: "SMA Negeri 5 Bandung",
            date: "Mei 2023",
            views: "3.2K"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter projects based on active filter
  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category.toLowerCase().includes(activeFilter));

  const stats = [
    { value: "20+", label: "Proyek Selesai" },
    { value: "15+", label: "Klien Puas" },
    { value: "2+", label: "Tahun Pengalaman" },
    { value: "1", label: "Developer Fokus" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Portofolio <span className="text-blue-400">Kami</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Kumpulan proyek website yang telah membantu UMKM dan profesional lokal membangun kehadiran digital mereka
            </motion.p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-bold text-blue-400 mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <motion.div 
        className="py-8 bg-gray-800/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button 
                key={category.id}
                variant={activeFilter === category.id ? "default" : "outline"}
                className={`${
                  activeFilter === category.id 
                    ? "bg-blue-600 hover:bg-blue-700 border-blue-600" 
                    : "border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                } transition-all duration-300`}
                onClick={() => setActiveFilter(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Portfolio Grid */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Memuat portofolio...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-destructive/20 border border-destructive/30 rounded-md p-4 max-w-md mx-auto">
                <p className="text-destructive">{error}</p>
                <p className="text-gray-400 text-sm mt-2">Menampilkan data statis sebagai gantinya.</p>
              </div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="transition-all duration-300"
                  layout
                >
                  <Card className="bg-gray-800/50 border-gray-700 overflow-hidden group h-full">
                    <div className="h-48 bg-gray-700 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-600 text-xs px-2 py-1 rounded">{project.category}</span>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="flex flex-wrap gap-1">
                          {project.tags.map((tag: string, index: number) => (
                            <span key={index} className="bg-gray-900/50 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <div className="flex gap-2 text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">{project.views}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 mb-4 text-sm">{project.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-xs text-gray-500 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {project.client}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {project.date}
                        </div>
                      </div>
                      <Button variant="link" className="p-0 text-blue-400 hover:text-blue-300 transition-all duration-300">
                        Lihat Studi Kasus
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* Load More Button */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-150 hover:scale-105">
              Muat Lebih Banyak
            </Button>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Punya Website Profesional untuk Bisnis Anda?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Diskusikan kebutuhan Anda dengan developer independen yang fokus pada solusi terjangkau dan berkualitas untuk UMKM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105">
                Konsultasi Gratis Sekarang
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg py-6 px-8 transition-all duration-150">
                Hubungi Kami
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}