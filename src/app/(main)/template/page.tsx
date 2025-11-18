"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Eye,
  Search,
  FolderOpen
} from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";
import { getTemplateProjects, getAllTemplateCategories } from "@/lib/template";
import { PortfolioItem } from "@/lib/types";
import Link from "next/link";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Translate from "@/i18n/Translate";
import { useLanguage } from "@/i18n/useLanguage";
import { t } from "@/i18n/t";

interface Category {
  id: string;
  name: string;
  icon: ReactNode;
}


export default function TemplatePage() {
  const { locale } = useLanguage();

  useEffect(() => {
    const setTitle = async () => {
      const title = await t('common.template', locale, 'Template');
      document.title = `${title} | MiraiDev`;
    };

    setTitle();

    // Update placeholder untuk input pencarian
    setSearchPlaceholder(locale === 'en'
      ? "Search template (e.g: online store, company profile...)"
      : "Cari template (misal: toko online, company profile...)");
  }, [locale]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "", icon: <Globe className="w-4 h-4" /> } // Will be updated in useEffect
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ambil semua data dalam satu Promise.all untuk mengoptimalkan pemuatan
        const [categoryResult, projectResult] = await Promise.all([
          getAllTemplateCategories(),
          getTemplateProjects()
        ]);

        if (categoryResult.success) {
          const categoryData = categoryResult.data.map(cat => ({
            id: cat.toLowerCase().replace(/\s+/g, '-'),
            name: cat,
            icon: <Globe className="w-4 h-4" />
          }));

          setCategories([
            { id: "all", name: locale === 'en' ? "All" : "Semua", icon: <Globe className="w-4 h-4" /> },
            ...categoryData
          ]);
        }

        if (projectResult.success) {
          setProjects(projectResult.data);
        } else {
          throw new Error(projectResult.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const handlePreviewClick = async (project: PortfolioItem) => {
    if (project.preview_url) {
      window.open(project.preview_url, '_blank');
    }

    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === project.id ? { ...p, views: (p.views || 0) + 1 } : p
      )
    );

    try {
      await fetch(`/api/template/${project.id}/increment-view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error("Failed to increment view count:", error);
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === project.id ? { ...p, views: (p.views || 0) - 1 } : p
        )
      );
    }
  };

  const filteredProjects = projects.filter(project => {
      const matchesCategory = activeFilter === "all" || project.category.toLowerCase().replace(/\s+/g, '-') === activeFilter;
      const matchesSearch = searchTerm === "" ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <div>

      <div className="relative overflow-hidden pt-16">
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <OptimizedMotion
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            >
              <Translate i18nKey="template.title" fallback="Template <span class='text-blue-400'>Gallery</span>" component="div" params={{locale}} />
            </OptimizedMotion>
            <OptimizedMotion
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Translate i18nKey="template.description" fallback="Choose from various professional website templates ready to use to accelerate your business digital presence." />
            </OptimizedMotion>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="sticky top-16 z-40 py-4 bg-gray-900/80 backdrop-blur-md">
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-12 pr-4 py-6 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                <Button
                    key={category.id}
                    variant={activeFilter === category.id ? "default" : "outline"}
                    className={`${
                    activeFilter === category.id
                        ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                        : "border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                    } transition-all duration-300 rounded-full text-sm`}
                    onClick={() => setActiveFilter(category.id)}
                >
                    {category.name}
                </Button>
                ))}
            </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-400">
            <p>{error}</p>
          </div>
        ) : (
          <OptimizedMotion
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredProjects.map((project) => (
              <OptimizedMotion
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden group h-full flex flex-col rounded-xl hover:border-blue-500/50 transition-all duration-300">
                  <div className="overflow-hidden">
                    <Carousel
                      plugins={[plugin.current]}
                      className="w-full"
                      onMouseEnter={plugin.current.stop}
                      onMouseLeave={plugin.current.reset}
                    >
                      <CarouselContent>
                        {project.image_urls && project.image_urls.length > 0 ? (
                          project.image_urls.map((url, index) => (
                            <CarouselItem key={index}>
                              <div className="relative aspect-[4/3]">
                                <Image
                                  src={url}
                                  alt={`${project.title} - preview ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                              </div>
                            </CarouselItem>
                          ))
                        ) : (
                          <CarouselItem>
                            <div className="relative aspect-[4/3] bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                              <FolderOpen className="h-16 w-16 text-gray-600" />
                            </div>
                          </CarouselItem>
                        )}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                        <div className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                            {project.category}
                        </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">{project.description}</p>

                    <div className="flex justify-between items-center mb-4">
                        <div className="text-xl font-bold text-green-400">
                            {project.price === 0 ? (locale === 'en' ? "Free" : "Gratis") : `Rp ${project.price?.toLocaleString(locale === 'en' ? 'en-US' : 'id-ID')}`}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                            <Eye className="h-4 w-4 mr-1"/>
                            {project.views || 0}
                        </div>
                    </div>

                    <div className="flex w-full gap-2">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handlePreviewClick(project)}
                      >
                        <Eye className="w-4 h-4 mr-2"/>
                        <Translate i18nKey="portfolio.preview" fallback="Preview" />
                      </Button>
                      <Button asChild variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Link href={project.use_url || '/kontak'}>
                              <Translate i18nKey="portfolio.use" fallback="Use" />
                          </Link>
                      </Button>
                    </div>

                  </div>
                </Card>
              </OptimizedMotion>
            ))}
          </OptimizedMotion>
        )}
         { !loading && filteredProjects.length === 0 && (
            <div className="text-center col-span-full py-24">
                <p className="text-gray-500">
                    <Translate i18nKey="portfolio.noMatch" fallback="No templates match your search." />
                </p>
            </div>
         )}
      </div>
    </div>
  );
}