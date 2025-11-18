"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  X, 
  Globe, 
  FileText, 
  Briefcase,
  ArrowRight
} from "lucide-react";


interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "page" | "template" | "service" | "blog";
  url: string;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle search modal
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  };

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Focus on input when modal opens
      setTimeout(() => {
        const input = document.getElementById("global-search-input");
        if (input) input.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Search function
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real implementation, you would search across multiple tables
      // For now, we'll simulate search results
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "1",
          title: "Layanan Pengembangan Website",
          description: "Solusi pengembangan website kustom untuk bisnis Anda",
          type: "service" as const,
          url: "/layanan"
        },
        {
          id: "2",
          title: "Template Website E-Commerce",
          description: "Website toko online untuk UMKM lokal",
          type: "template" as const,
          url: "/template"
        },
        {
          id: "3",
          title: "Tentang Kami",
          description: "Pelajari lebih lanjut tentang tim dan visi kami",
          type: "page" as const,
          url: "/tentang"
        },
        {
          id: "4",
          title: "Kontak",
          description: "Hubungi kami untuk konsultasi gratis",
          type: "page" as const,
          url: "/kontak"
        }
      ].filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(mockResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  // Get icon for result type
  const getTypeIcon = (type: "page" | "template" | "service" | "blog") => {
    switch (type) {
      case "page": return <Globe className="w-4 h-4" />;
      case "template": return <Briefcase className="w-4 h-4" />;
      case "service": return <Globe className="w-4 h-4" />;
      case "blog": return <FileText className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  // Get type label
  const getTypeLabel = (type: "page" | "template" | "service" | "blog") => {
    switch (type) {
      case "page": return "Halaman";
      case "template": return "Template";
      case "service": return "Layanan";
      case "blog": return "Blog";
      default: return "Halaman";
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleSearch}
        className="text-gray-300 hover:text-white hover:bg-gray-700"
        aria-label="Cari di situs"
      >
        <Search className="w-5 h-5" />
      </Button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          >
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50"
              onClick={toggleSearch}
            />
            
            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full max-w-2xl z-10"
            >
              <Card className="bg-gray-800 border-gray-700 rounded-xl overflow-hidden">
                {/* Search Header */}
                <div className="relative p-4 border-b border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="global-search-input"
                      type="text"
                      placeholder="Cari di situs web..."
                      value={query}
                      onChange={handleInputChange}
                      className="bg-gray-700 border-gray-600 pl-10 pr-10 focus:border-blue-500 text-white"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-400">Mencari...</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="divide-y divide-gray-700">
                      {results.map((result) => (
                        <a
                          key={result.id}
                          href={result.url}
                          className="block p-4 hover:bg-gray-700/50 transition-colors"
                          onClick={toggleSearch}
                        >
                          <div className="flex items-start">
                            <div className="mt-1 mr-3 text-gray-500">
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-1">
                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded mr-2">
                                  {getTypeLabel(result.type)}
                                </span>
                                <h3 className="text-sm font-medium text-white truncate">
                                  {result.title}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {result.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-500 ml-2 flex-shrink-0" />
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : query ? (
                    <div className="p-8 text-center">
                      <div className="bg-gray-700/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1">Tidak ada hasil</h3>
                      <p className="text-gray-400">
                        Tidak ditemukan hasil untuk "{query}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="bg-gray-700/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1">Cari di situs web</h3>
                      <p className="text-gray-400">
                        Masukkan kata kunci untuk mencari konten di situs ini
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}