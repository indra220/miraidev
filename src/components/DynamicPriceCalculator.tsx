"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  ShoppingCart, 
  Building,
  Calculator,
  CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DynamicPriceCalculator() {
  const [projectType, setProjectType] = useState("");
  const [pages, setPages] = useState(1);
  const [features, setFeatures] = useState<string[]>([]);
  const [complexity, setComplexity] = useState("medium");
  const [timeline, setTimeline] = useState("medium"); // Penambahan state untuk estimasi waktu
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();

  const projectTypes = [
    { id: "landing", name: "Landing Page", icon: <Globe className="w-4 h-4" /> },
    { id: "business", name: "Website Bisnis", icon: <Building className="w-4 h-4" /> },
    { id: "ecommerce", name: "Toko Online", icon: <ShoppingCart className="w-4 h-4" /> }
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

  const timelineOptions = [
    { id: "urgent", name: "Urgent (1-2 Minggu)" },
    { id: "short", name: "1-2 Bulan" },
    { id: "medium", name: "3-6 Bulan" },
    { id: "long", name: "6+ Bulan" }
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

  // Fungsi untuk mengirim data ke halaman kontak
  const redirectToContactWithEstimation = () => {
    // Membuat objek data estimasi
    const estimationData = {
      projectType,
      pages,
      features: features.join(','),
      complexity,
      timeline, // Tambahkan timeline ke data estimasi
      estimatedPrice
    };

    // Membuat query string dari data estimasi
    const queryString = new URLSearchParams({
      fromCalculator: 'true',
      projectType: 'custom', // Selalu set ke 'custom' untuk menyesuaikan dengan kebutuhan
      originalProjectType: estimationData.projectType, // Simpan tipe asli untuk referensi
      pages: estimationData.pages.toString(),
      features: estimationData.features,
      complexity: estimationData.complexity,
      timeline: estimationData.timeline, // Tambahkan timeline ke query parameter
      estimatedPrice: estimationData.estimatedPrice.toString()
    }).toString();

    // Redirect ke halaman kontak dengan data estimasi sebagai query parameters
    router.push(`/kontak?${queryString}`);
  };

  // Menentukan jumlah langkah yang sudah selesai
  const completedSteps = [
    projectType ? 1 : 0,
    features.length > 0 ? 1 : 0,
    pages >= 1 ? 1 : 0,
    timeline ? 1 : 0,
    complexity ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      {/* Card dengan efek glassmorphism yang lebih modern */}
      <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-xl">
        {/* Header dengan ikon dan judul */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="bg-white/20 p-2 rounded-full">
              <Calculator className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Estimasi Harga Proyek
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Dapatkan estimasi harga untuk proyek Anda berdasarkan kebutuhan spesifik
          </p>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${(completedSteps / 5) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{completedSteps}/5 langkah selesai</span>
            </div>
          </div>
        </div>

        {!showResult ? (
          <div className="space-y-10">
            {/* Project Type */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">1</span>
                </div>
                <Label className="text-base font-semibold text-gray-200">
                  Jenis Proyek
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                      projectType === type.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/50"
                    }`}
                    onClick={() => setProjectType(type.id)}
                  >
                    <div className={`p-3 rounded-full mb-3 ${
                      projectType === type.id
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      {type.icon}
                    </div>
                    <span className={`font-medium ${
                      projectType === type.id
                        ? "text-blue-400"
                        : "text-gray-300"
                    }`}>
                      {type.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">2</span>
                </div>
                <Label className="text-base font-semibold text-gray-200">
                  Fitur Tambahan
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {featureOptions.map((feature) => (
                  <div
                    key={feature.id}
                    className={`p-4 rounded-lg border transition-all duration-300 flex items-center ${
                      features.includes(feature.id)
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/30"
                    }`}
                    onClick={() => toggleFeature(feature.id)}
                  >
                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                      features.includes(feature.id)
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-500"
                    }`}>
                      {features.includes(feature.id) && (
                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <span className={`${
                      features.includes(feature.id)
                        ? "text-blue-400"
                        : "text-gray-300"
                    }`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Number of Pages */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">3</span>
                </div>
                <Label className="text-base font-semibold text-gray-200">
                  Jumlah Halaman
                </Label>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="w-12 h-12 rounded-l-lg border border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                  onClick={() => setPages(Math.max(1, pages - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={pages}
                  onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-12 w-24 bg-gray-700 border-y border-gray-600 focus:border-blue-500 text-center text-lg font-medium"
                />
                <button
                  className="w-12 h-12 rounded-r-lg border border-gray-600 text-gray-300 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center"
                  onClick={() => setPages(pages + 1)}
                >
                  +
                </button>
                <span className="ml-4 text-gray-400">halaman</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">4</span>
                </div>
                <Label className="text-base font-semibold text-gray-200">
                  Estimasi Waktu Pengerjaan
                </Label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timelineOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`p-4 rounded-lg border transition-all duration-300 text-center ${
                      timeline === option.id
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : "border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/30 text-gray-300"
                    }`}
                    onClick={() => setTimeline(option.id)}
                  >
                    <span className="text-sm font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">5</span>
                </div>
                <Label className="text-base font-semibold text-gray-200">
                  Tingkat Kompleksitas
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {complexityOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                      complexity === option.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 hover:border-blue-500/50 hover:bg-gray-700/50"
                    }`}
                    onClick={() => setComplexity(option.id)}
                  >
                    <span className={`font-semibold block mb-1 ${
                      complexity === option.id
                        ? "text-blue-400"
                        : "text-gray-300"
                    }`}>
                      {option.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Calculate Button */}
            <div className="text-center pt-6">
              <button
                className={`py-4 px-10 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  projectType 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                onClick={calculatePrice}
                disabled={!projectType}
              >
                Hitung Estimasi Harga
              </button>
            </div>
          </div>
        ) : (
          /* Result */
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Estimasi Harga
              </h3>
              <div className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {formatPrice(estimatedPrice)}
              </div>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Ini adalah estimasi awal berdasarkan pilihan Anda. Harga akhir mungkin bervariasi 
                setelah konsultasi mendalam dengan tim kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="py-4 px-8 rounded-xl font-medium bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                  onClick={resetCalculator}
                >
                  Hitung Ulang
                </button>
                <button
                  className="py-4 px-8 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                  onClick={redirectToContactWithEstimation}
                >
                  Konsultasi Sekarang
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}