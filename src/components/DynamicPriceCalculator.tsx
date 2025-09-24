"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  ShoppingCart, 
  Building,
  Calculator,
  CheckCircle
} from "lucide-react";

export default function DynamicPriceCalculator() {
  const [projectType, setProjectType] = useState("");
  const [pages, setPages] = useState(1);
  const [features, setFeatures] = useState<string[]>([]);
  const [complexity, setComplexity] = useState("medium");
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const projectTypes = [
    { id: "landing", name: "Landing Page", icon: <Globe className="w-4 h-4" /> },
    { id: "business", name: "Website Bisnis", icon: <Building className="w-4 h-4" /> },
    { id: "ecommerce", name: "Toko Online", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "custom", name: "Solusi Kustom", icon: <Globe className="w-4 h-4" /> }
  ];

  const featureOptions = [
    { id: "cms", name: "Sistem Manajemen Konten (CMS)" },
    { id: "blog", name: "Blog/Artikel" },
    { id: "gallery", name: "Galeri Foto" },
    { id: "booking", name: "Sistem Booking" },
    { id: "payment", name: "Integrasi Pembayaran" },
    { id: "multilingual", name: "Dukungan Multi Bahasa" },
    { id: "seo", name: "Optimasi SEO" },
    { id: "analytics", name: "Integrasi Analytics" }
  ];

  const complexityOptions = [
    { id: "basic", name: "Dasar", description: "Fungsionalitas terbatas" },
    { id: "medium", name: "Menengah", description: "Fungsionalitas standar" },
    { id: "advanced", name: "Lanjutan", description: "Fungsionalitas kompleks" }
  ];

  const calculatePrice = () => {
    let basePrice = 0;
    
    // Base price based on project type
    switch(projectType) {
      case "landing":
        basePrice = 3000000;
        break;
      case "business":
        basePrice = 7500000;
        break;
      case "ecommerce":
        basePrice = 15000000;
        break;
      case "custom":
        basePrice = 20000000;
        break;
      default:
        basePrice = 0;
    }
    
    // Adjust for number of pages
    if (pages > 5) {
      basePrice += (pages - 5) * 500000;
    }
    
    // Adjust for features
    const featureCost = features.length * 1000000;
    basePrice += featureCost;
    
    // Adjust for complexity
    switch(complexity) {
      case "basic":
        basePrice *= 0.8;
        break;
      case "medium":
        basePrice *= 1;
        break;
      case "advanced":
        basePrice *= 1.5;
        break;
    }
    
    // Ensure minimum price
    basePrice = Math.max(basePrice, 2000000);
    
    setEstimatedPrice(basePrice);
    setShowResult(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const resetCalculator = () => {
    setProjectType("");
    setPages(1);
    setFeatures([]);
    setComplexity("medium");
    setEstimatedPrice(0);
    setShowResult(false);
  };

  const toggleFeature = (featureId: string) => {
    if (features.includes(featureId)) {
      setFeatures(features.filter(id => id !== featureId));
    } else {
      setFeatures([...features, featureId]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <Card className="bg-gray-800/50 border-gray-700 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Kalkulator Harga</h2>
          <p className="text-gray-400">
            Dapatkan estimasi harga untuk proyek Anda berdasarkan kebutuhan spesifik
          </p>
        </div>

        {!showResult ? (
          <div className="space-y-8">
            {/* Project Type */}
            <div>
              <Label className="block text-sm font-medium mb-4">
                Jenis Proyek
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {projectTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={projectType === type.id ? "default" : "outline"}
                    className={`${
                      projectType === type.id
                        ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                        : "border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                    } transition-all duration-300 flex flex-col items-center justify-center h-24`}
                    onClick={() => setProjectType(type.id)}
                  >
                    <span className="mb-2">{type.icon}</span>
                    <span className="text-sm">{type.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Number of Pages */}
            <div>
              <Label className="block text-sm font-medium mb-4">
                Jumlah Halaman
              </Label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                  onClick={() => setPages(Math.max(1, pages - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={pages}
                  onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-gray-700 border-gray-600 focus:border-blue-500 text-center mx-2 w-20"
                />
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                  onClick={() => setPages(pages + 1)}
                >
                  +
                </Button>
                <span className="ml-4 text-gray-400">halaman</span>
              </div>
            </div>

            {/* Features */}
            <div>
              <Label className="block text-sm font-medium mb-4">
                Fitur Tambahan
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {featureOptions.map((feature) => (
                  <Button
                    key={feature.id}
                    variant={features.includes(feature.id) ? "default" : "outline"}
                    className={`${
                      features.includes(feature.id)
                        ? "bg-blue-600 hover:bg-blue-700 border-blue-600 justify-start"
                        : "border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white justify-start"
                    } transition-all duration-300`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <CheckCircle 
                      className={`w-4 h-4 mr-2 ${
                        features.includes(feature.id) 
                          ? "text-white" 
                          : "text-gray-500"
                      }`} 
                    />
                    {feature.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div>
              <Label className="block text-sm font-medium mb-4">
                Tingkat Kompleksitas
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complexityOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={complexity === option.id ? "default" : "outline"}
                    className={`${
                      complexity === option.id
                        ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                        : "border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                    } transition-all duration-300 flex flex-col items-center justify-center h-24`}
                    onClick={() => setComplexity(option.id)}
                  >
                    <span className="font-semibold">{option.name}</span>
                    <span className="text-xs text-gray-400 mt-1">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <div className="text-center pt-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105"
                onClick={calculatePrice}
                disabled={!projectType}
              >
                Hitung Estimasi Harga
              </Button>
            </div>
          </div>
        ) : (
          /* Result */
          <div className="text-center py-8">
            <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-blue-400">Estimasi Harga</h3>
              <div className="text-4xl font-bold mb-6">
                {formatPrice(estimatedPrice)}
              </div>
              <p className="text-gray-300 mb-8">
                Ini adalah estimasi awal berdasarkan pilihan Anda. Harga akhir mungkin bervariasi 
                setelah konsultasi mendalam dengan tim kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105"
                  onClick={resetCalculator}
                >
                  Hitung Ulang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg py-6 px-8 transition-all duration-150"
                  onClick={() => window.location.href = "/kontak"}
                >
                  Konsultasi Sekarang
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}