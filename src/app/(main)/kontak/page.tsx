"use client";

import React, { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Send,
  User,
  MessageSquare,
  Globe,
  ShoppingCart,
  Building,
  Smartphone
} from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";
import { useState } from "react";
import { FormError } from "@/components/form-error";
import { LoadingSpinner } from "@/components/loading-spinner";
import { submitContactForm } from "@/lib/contact";

export default function KontakPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    document.title = "Kontak | MiraiDev";
    setIsClient(true);
    // Inisialisasi searchParams di client-side
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  // Helper functions untuk mendapatkan informasi paket
  const getProjectTypeName = useCallback((projectTypeId: string) => {
    const projectTypeNames: Record<string, string> = {
      landing: "Landing Page",
      business: "Website Bisnis",
      ecommerce: "Toko Online",
      custom: "Solusi Kustom"
    };
    return projectTypeNames[projectTypeId] || "Proyek";
  }, []);

  // Fungsi khusus untuk menghasilkan estimasi dari kalkulator harga
  const generateEstimationFromCalculator = useCallback((data: {
    originalProjectType: string;
    pages: string;
    features: string;
    complexity: string;
    estimatedPrice: string;
  }) => {
    const { originalProjectType, pages, features, complexity, estimatedPrice } = data;
    
    // Parse fitur dari string ke array
    const featureArray = features ? features.split(',') : [];
    
    // Hitung harga dalam format IDR
    const price = parseInt(estimatedPrice || '0');
    const formattedPrice = price.toLocaleString('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    // Buat daftar fitur berdasarkan input dari kalkulator
    const baseFeatures = [
      `Jenis Proyek: ${originalProjectType ? getProjectTypeName(originalProjectType) : 'Tidak ditentukan'}`,
      `Jumlah Halaman: ${pages || '1'} halaman`,
      `Tingkat Kompleksitas: ${complexity || 'Menengah'}`,
      "Konsultasi mendalam",
      "Perencanaan proyek",
      "Pengembangan kustom",
      "Testing dan debugging",
      "Dokumentasi lengkap",
      "Dukungan pasca-pengembangan"
    ];
    
    // Tambahkan fitur tambahan yang dipilih di kalkulator
    const additionalFeatures = featureArray.map(featureId => {
      const featureMap: Record<string, string> = {
        cms: "Sistem Manajemen Konten (CMS)",
        blog: "Blog/Artikel",
        gallery: "Galeri Foto",
        booking: "Sistem Booking",
        payment: "Integrasi Pembayaran",
        multilingual: "Dukungan Multi Bahasa",
        seo: "Optimasi SEO",
        analytics: "Integrasi Analytics"
      };
      return featureMap[featureId] || featureId;
    });
    
    const allFeatures = [...baseFeatures, ...additionalFeatures];
    
    return {
      show: true,
      package: `Estimasi ${originalProjectType ? getProjectTypeName(originalProjectType) : 'Proyek Kustom'}`,
      price: formattedPrice,
      description: `Estimasi harga berdasarkan pilihan Anda di kalkulator untuk proyek ${originalProjectType ? getProjectTypeName(originalProjectType) : 'kustom'} dengan ${pages || '1'} halaman dan tingkat kompleksitas ${complexity || 'menengah'}.`,
      features: allFeatures
    };
  }, [getProjectTypeName]);

  const [estimation, setEstimation] = useState({
    show: false,
    package: "",
    price: "",
    description: "",
    features: [] as string[]
  });



  // Fungsi untuk menghasilkan estimasi harga berdasarkan data dari kalkulator
  const generateBudgetEstimation = (estimatedPrice: string) => {
    const price = parseInt(estimatedPrice || '0');
    
    // Tentukan range budget berdasarkan harga estimasi
    if (price <= 3000000) {
      return "small"; // Rp 1.000.000 - Rp 3.000.000
    } else if (price <= 10000000) {
      return "medium"; // Rp 3.000.000 - Rp 10.000.000
    } else if (price <= 50000000) {
      return "large"; // Rp 10.000.000+
    } else {
      return "large"; // Untuk harga di atas 50 juta, tetap kategorikan sebagai large
    }
  };

  // Cek apakah ada data dari kalkulator harga
  useEffect(() => {
    if (searchParams) {
      const fromCalculator = searchParams.get('fromCalculator');
      if (fromCalculator === 'true') {
        const projectTypeParam = searchParams.get('projectType') || '';
        const originalProjectType = searchParams.get('originalProjectType') || '';
        const pages = searchParams.get('pages') || '';
        const features = searchParams.get('features') || '';
        const complexity = searchParams.get('complexity') || '';
        const timeline = searchParams.get('timeline') || ''; // Ambil parameter timeline dari kalkulator
        const estimatedPrice = searchParams.get('estimatedPrice') || '';

        // Simpan data estimasi dari kalkulator
        setCalculatorEstimation({
          fromCalculator: true,
          originalProjectType,
          pages,
          features,
          complexity,
          timeline,
          estimatedPrice
        });

        // Auto-fill form dengan data dari kalkulator
        setFormData(prev => ({
          ...prev,
          projectType: projectTypeParam,
          timeline: timeline, // Isi field timeline dari kalkulator
          budget: generateBudgetEstimation(estimatedPrice), // Set budget berdasarkan estimasi harga
          message: `Saya tertarik dengan estimasi proyek ${originalProjectType ? getProjectTypeName(originalProjectType) : 'custom'} dengan estimasi harga ${parseInt(estimatedPrice || '0').toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}.`
        }));

        // Tampilkan estimasi harga jika ada data
        if (projectTypeParam && estimatedPrice) {
          // Gunakan fungsi khusus untuk menghasilkan estimasi dari kalkulator
          const estimationData = generateEstimationFromCalculator({
            originalProjectType,
            pages,
            features,
            complexity,
            estimatedPrice
          });
          
          setEstimation(estimationData);
        }
      }
    }
  }, [searchParams, generateEstimationFromCalculator, getProjectTypeName]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  
  // State untuk menyimpan data estimasi dari kalkulator (tidak perlu disimpan ke variabel karena tidak digunakan)
  const [, setCalculatorEstimation] = useState<{
    fromCalculator: boolean;
    originalProjectType: string;
    pages: string;
    features: string;
    complexity: string;
    timeline: string;
    estimatedPrice: string;
  } | null>(null);
  


  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-blue-400" />,
      title: "Telepon",
      detail: "+62 812-3456-7890",
      description: "Senin - Jumat, 09:00 - 17:00"
    },
    {
      icon: <Mail className="w-6 h-6 text-blue-400" />,
      title: "Email",
      detail: "hello@mirai.dev",
      description: "Balas dalam 24 jam kerja"
    },
    {
      icon: <MapPin className="w-6 h-6 text-blue-400" />,
      title: "Alamat",
      detail: "Jakarta, Indonesia",
      description: "Remote-first operations"
    }
  ];

  const projectTypes = [
    { id: "landing", name: "Landing Page / Website Sederhana", icon: <Globe className="w-4 h-4" /> },
    { id: "business", name: "Website Bisnis Profesional", icon: <Building className="w-4 h-4" /> },
    { id: "ecommerce", name: "Toko Online (E-Commerce)", icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "mobile", name: "Aplikasi Mobile", icon: <Smartphone className="w-4 h-4" /> },
    { id: "custom", name: "Solusi Kustom", icon: <Globe className="w-4 h-4" /> }
  ];

  const budgets = [
    { id: "small", name: "Rp 1.000.000 - Rp 3.000.000", value: "small" },
    { id: "medium", name: "Rp 3.000.000 - Rp 10.000.000", value: "medium" },
    { id: "large", name: "Rp 10.000.000+", value: "large" },
    { id: "flexible", name: "Fleksibel / Belum Tentu", value: "flexible" }
  ];

  const timelines = [
    { id: "urgent", name: "1-2 Minggu", value: "urgent" },
    { id: "short", name: "1-2 Bulan", value: "short" },
    { id: "medium", name: "3-6 Bulan", value: "medium" },
    { id: "long", name: "6+ Bulan", value: "long" },
    { id: "flexible", name: "Fleksibel", value: "flexible" }
  ];

  const packages: Record<string, { name: string; price: string; description: string; features: string[] }> = {
    landing: {
      name: "Paket Basic",
      price: "Rp 3.000.000 - Rp 5.000.000",
      description: "Solusi ideal untuk bisnis kecil yang baru memulai kehadiran digital",
      features: [
        "Desain responsif untuk semua perangkat",
        "5 halaman website (Beranda, Tentang, Layanan, Kontak, Blog)",
        "Integrasi Google Maps",
        "Formulir kontak dengan notifikasi email",
        "Optimasi SEO dasar",
        "Hosting dan domain (1 tahun)",
        "Dukungan teknis 1 bulan"
      ]
    },
    business: {
      name: "Paket Profesional",
      price: "Rp 7.000.000 - Rp 12.000.000",
      description: "Solusi komprehensif untuk bisnis yang ingin memperkuat kehadiran digital mereka",
      features: [
        "Desain kustom responsif",
        "10-15 halaman website",
        "Sistem manajemen konten (CMS)",
        "Integrasi media sosial",
        "Optimasi SEO lanjutan",
        "Keamanan SSL",
        "Hosting dan domain (1 tahun)",
        "Dukungan teknis 3 bulan",
        "Training dasar pengelolaan konten"
      ]
    },
    ecommerce: {
      name: "Paket E-Commerce",
      price: "Rp 15.000.000 - Rp 25.000.000",
      description: "Solusi e-commerce lengkap untuk toko online yang ingin meningkatkan penjualan",
      features: [
        "Desain toko online responsif",
        "Katalog produk tidak terbatas",
        "Sistem keranjang belanja",
        "Integrasi pembayaran (Midtrans, DOKU, dll)",
        "Sistem manajemen inventaris dasar",
        "Fitur pelanggan (login, riwayat pesanan)",
        "SEO e-commerce",
        "Keamanan SSL",
        "Hosting dan domain (1 tahun)",
        "Dukungan teknis 6 bulan"
      ]
    },
    mobile: {
      name: "Paket Mobile App",
      price: "Custom Pricing",
      description: "Aplikasi mobile kustom untuk Android dan iOS yang terintegrasi dengan website Anda",
      features: [
        "Aplikasi Android dan iOS",
        "Desain UI/UX kustom",
        "Integrasi dengan website/web API",
        "Notifikasi push",
        "Sistem login pengguna",
        "Dashboard admin untuk manajemen konten",
        "Dukungan teknis 6 bulan",
        "Publish ke Play Store/App Store"
      ]
    },
    custom: {
      name: "Solusi Kustom",
      price: "Custom Pricing",
      description: "Solusi yang dirancang khusus sesuai dengan kebutuhan unik bisnis Anda",
      features: [
        "Konsultasi mendalam",
        "Perencanaan proyek",
        "Pengembangan kustom",
        "Testing dan debugging",
        "Dokumentasi lengkap",
        "Dukungan pasca-pengembangan"
      ]
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nama lengkap harus diisi";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor telepon harus diisi";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Format nomor telepon tidak valid";
    }
    
    if (!formData.projectType) {
      newErrors.projectType = "Silakan pilih jenis proyek";
    }
    
    if (!formData.budget) {
      newErrors.budget = "Silakan pilih estimasi anggaran";
    }
    
    if (!formData.timeline) {
      newErrors.timeline = "Silakan pilih estimasi waktu pengerjaan";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Pesan harus diisi";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Pesan minimal 10 karakter";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleProjectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      projectType: value
    }));
    
    if (errors.projectType) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.projectType;
        return newErrors;
      });
    }

    if (value && packages[value]) {
      setEstimation({
        show: true,
        package: packages[value].name,
        price: packages[value].price,
        description: packages[value].description,
        features: packages[value].features
      });
    } else {
      setEstimation({
        show: false,
        package: "",
        price: "",
        description: "",
        features: []
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSuccess("");
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await submitContactForm(formData);
      
      if (result.success) {
        setSuccess("Pesan Anda telah berhasil dikirim! Kami akan segera menghubungi Anda.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          projectType: "",
          budget: "",
          timeline: "",
          message: ""
        });
        setEstimation({
          show: false,
          package: "",
          price: "",
          description: "",
          features: []
        });
      } else {
        setErrors({ general: result.error || "Terjadi kesalahan saat mengirim formulir" });
      }
    } catch (error) {
      setErrors({ 
        general: error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim formulir" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    // Tampilkan placeholder sementara selama proses SSR
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-400">Memuat halaman kontak...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <OptimizedMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hubungi <span className="text-blue-400">Kami</span>
              </h1>
            </OptimizedMotion>
            <OptimizedMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Punya pertanyaan atau ingin diskusi proyek? Kami siap membantu Anda mewujudkan visi digital Anda
              </p>
            </OptimizedMotion>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <OptimizedMotion
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 p-8">
                <h2 className="text-3xl font-bold mb-6">Konsultasi Gratis</h2>
                <p className="text-gray-400 mb-8">
                  Ceritakan proyek Anda dan dapatkan estimasi harga yang sesuai dengan kebutuhan Anda.
                </p>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }} className="space-y-6">
                  {errors.general && (
                    <div className="bg-destructive/20 border border-destructive/30 rounded-md p-3 text-sm text-destructive">
                      {errors.general}
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-md p-3 text-sm text-green-500">
                      {success}
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nama lengkap Anda"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-gray-700/50 border-gray-600 pl-10 focus:border-blue-500 text-white placeholder:text-gray-400 py-6"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                    </div>
                    <FormError id="name-error" error={errors.name} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@contoh.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-gray-700/50 border-gray-600 pl-10 focus:border-blue-500 text-white placeholder:text-gray-400 py-6"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                      </div>
                      <FormError id="email-error" error={errors.email} />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Telepon
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+62 812 3456 7890"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-gray-700/50 border-gray-600 pl-10 focus:border-blue-500 text-white placeholder:text-gray-400 py-6"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "phone-error" : undefined}
                        />
                      </div>
                      <FormError id="phone-error" error={errors.phone} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="block text-sm font-medium mb-2">
                      Nama Perusahaan/Bisnis (Opsional)
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Nama perusahaan atau bisnis Anda"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="bg-gray-700/50 border-gray-600 focus:border-blue-500 text-white placeholder:text-gray-400 py-6"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="projectType" className="block text-sm font-medium mb-2">
                        Jenis Proyek
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                          id="projectType"
                          value={formData.projectType}
                          onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleProjectTypeChange(e);
                          }}
                          className="w-full bg-gray-700/50 border-gray-600 pl-10 pr-10 py-6 rounded-md focus:border-blue-500 text-white appearance-none"
                          aria-invalid={!!errors.projectType}
                          aria-describedby={errors.projectType ? "project-type-error" : undefined}
                        >
                          <option value="">Pilih jenis proyek...</option>
                          {projectTypes.map(type => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                        <ArrowRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90" />
                      </div>
                      <FormError id="project-type-error" error={errors.projectType} />
                    </div>

                    <div>
                      <Label htmlFor="budget" className="block text-sm font-medium mb-2">
                        Estimasi Anggaran
                      </Label>
                      <div className="relative">
                        <ArrowRight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select
                          id="budget"
                          value={formData.budget}
                          onChange={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleInputChange(e);
                          }}
                          className="w-full bg-gray-700/50 border-gray-600 pl-10 pr-10 py-6 rounded-md focus:border-blue-500 text-white appearance-none"
                          aria-invalid={!!errors.budget}
                          aria-describedby={errors.budget ? "budget-error" : undefined}
                        >
                          <option value="">Pilih estimasi anggaran...</option>
                          {budgets.map(budget => (
                            <option key={budget.id} value={budget.value}>
                              {budget.name}
                            </option>
                          ))}
                        </select>
                        <ArrowRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90" />
                      </div>
                      <FormError id="budget-error" error={errors.budget} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timeline" className="block text-sm font-medium mb-2">
                      Estimasi Waktu Pengerjaan
                    </Label>
                    <div className="relative">
                      <ArrowRight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <select
                        id="timeline"
                        value={formData.timeline}
                        onChange={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleInputChange(e);
                        }}
                        className="w-full bg-gray-700/50 border-gray-600 pl-10 pr-10 py-6 rounded-md focus:border-blue-500 text-white appearance-none"
                        aria-invalid={!!errors.timeline}
                        aria-describedby={errors.timeline ? "timeline-error" : undefined}
                      >
                        <option value="">Pilih estimasi waktu pengerjaan...</option>
                        {timelines.map(timeline => (
                          <option key={timeline.id} value={timeline.value}>
                            {timeline.name}
                          </option>
                        ))}
                      </select>
                      <ArrowRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 rotate-90" />
                    </div>
                    <FormError id="timeline-error" error={errors.timeline} />
                  </div>

                  <div>
                    <Label htmlFor="message" className="block text-sm font-medium mb-2">
                      Deskripsi Proyek
                    </Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                      <Textarea
                        id="message"
                        placeholder="Ceritakan detail proyek Anda..."
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="bg-gray-700/50 border-gray-600 pl-10 pt-3 focus:border-blue-500 text-white placeholder:text-gray-400"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                      />
                    </div>
                    <FormError id="message-error" error={errors.message} />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 transition-all duration-150 hover:scale-105"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <LoadingSpinner size="sm" className="mr-2" />
                        Mengirim...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Kirim Pesan
                        <Send className="ml-2 w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </Card>
            </OptimizedMotion>

            {/* Estimation & Contact Info */}
            <div>
              <OptimizedMotion
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <Card className="bg-gray-800/50 border-gray-700 p-8">
                  <h2 className="text-3xl font-bold mb-6">Estimasi Harga</h2>
                  <p className="text-gray-400 mb-8">
                    Berdasarkan jenis proyek yang Anda pilih, berikut estimasi harga kami:
                  </p>

                  {estimation.show ? (
                    <div className="space-y-6">
                      <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-blue-400">{estimation.package}</h3>
                            <p className="text-2xl font-bold mt-2">{estimation.price}</p>
                          </div>
                          <div className="bg-blue-500/10 p-3 rounded-lg">
                            <Globe className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">{estimation.description}</p>
                        <div className="border-t border-gray-700 pt-4">
                          <h4 className="font-semibold mb-2">Fitur Utama:</h4>
                          <ul className="space-y-2">
                            {estimation.features.slice(0, 6).map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3"></div>
                                <span className="text-gray-300">{feature}</span>
                              </li>
                            ))}
                            {estimation.features.length > 6 && (
                              <li className="text-gray-400 text-sm">+ {estimation.features.length - 6} fitur lainnya</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h4 className="font-semibold mb-3">Catatan:</h4>
                        <p className="text-gray-300 text-sm">
                          Harga di atas adalah estimasi dari kalkulator harga berdasarkan pilihan Anda. Kami akan memberikan penawaran yang lebih akurat setelah 
                          melakukan konsultasi mendalam tentang kebutuhan spesifik proyek Anda.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                        <Globe className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Pilih Jenis Proyek</h3>
                      <p className="text-gray-400">
                        Pilih jenis proyek di form sebelah kiri untuk melihat estimasi harga yang sesuai
                      </p>
                    </div>
                  )}
                </Card>
              </OptimizedMotion>

              <OptimizedMotion
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 p-8">
                  <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start">
                        <div className="mt-1 mr-4">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{info.title}</h3>
                          <p className="text-blue-400 font-medium">{info.detail}</p>
                          <p className="text-gray-400 text-sm">{info.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </OptimizedMotion>
            </div>
          </div>

          {/* Map Section */}
          <div className="py-20 bg-gray-800/30 mt-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <OptimizedMotion
                  className="text-3xl font-bold text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Lokasi Kami
                </OptimizedMotion>
                <OptimizedMotion
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
                    <div className="h-64 bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">Peta Interaktif</p>
                      </div>
                    </div>
                  </Card>
                </OptimizedMotion>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <OptimizedMotion
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700 mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Proyek Anda?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Hubungi kami hari ini untuk konsultasi gratis dan penawaran khusus untuk proyek Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105"
              >
                Konsultasi Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg py-6 px-8 transition-all duration-150"
              >
                Hubungi Kami
              </Button>
            </div>
          </OptimizedMotion>
        </div>
      </div>
    </div>
  );
}
