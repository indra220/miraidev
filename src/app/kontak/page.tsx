"use client";

import React from "react";

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
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { useState } from "react";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: ""
  });

  const [estimation, setEstimation] = useState({
    show: false,
    package: "",
    price: "",
    description: "",
    features: [] as string[]
  });

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-blue-400" />,
      title: "Telepon",
      detail: "+62 812 3456 7890",
      description: "Senin - Jumat, 09:00 - 18:00 WIB"
    },
    {
      icon: <Mail className="w-6 h-6 text-green-400" />,
      title: "Email",
      detail: "hello@miraidev.id",
      description: "Dapatkan respons dalam 24 jam"
    },
    {
      icon: <MapPin className="w-6 h-6 text-yellow-400" />,
      title: "Alamat",
      detail: "Jl. Teknologi No. 123, Jakarta",
      description: "Jakarta Selatan, 12345"
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
        "Website landing page 5 halaman",
        "Desain responsif (mobile-friendly)",
        "Hosting dan domain (1 tahun)",
        "Formulir kontak dasar",
        "Integrasi media sosial",
        "Optimasi SEO dasar"
      ]
    },
    business: {
      name: "Paket Business",
      price: "Rp 7.500.000 - Rp 12.000.000",
      description: "Solusi komprehensif untuk bisnis menengah yang ingin berkembang",
      features: [
        "Website kustom hingga 15 halaman",
        "Desain responsif premium",
        "Hosting dan domain (1 tahun)",
        "Formulir kontak canggih",
        "Integrasi media sosial & blog",
        "Optimasi SEO lanjutan",
        "Google Analytics & Search Console"
      ]
    },
    ecommerce: {
      name: "Paket E-Commerce",
      price: "Rp 15.000.000 - Rp 25.000.000",
      description: "Solusi lengkap untuk toko online dengan fitur e-commerce profesional",
      features: [
        "Website e-commerce lengkap",
        "Desain responsif premium",
        "Hosting dan domain (1 tahun)",
        "Sistem keranjang belanja",
        "Integrasi pembayaran (Bank Transfer, QRIS)",
        "Manajemen produk & inventaris",
        "Sistem pengelolaan pesanan",
        "Optimasi SEO e-commerce"
      ]
    },
    mobile: {
      name: "Paket Mobile",
      price: "Rp 12.000.000 - Rp 20.000.000",
      description: "Aplikasi mobile untuk iOS dan Android dengan fitur lengkap",
      features: [
        "Aplikasi mobile untuk iOS & Android",
        "Desain UI/UX yang menarik",
        "Fitur dasar sesuai kebutuhan",
        "Integrasi dengan sistem backend",
        "Push notifications",
        "Testing dan debugging"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleProjectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      projectType: value
    }));

    // Show estimation when project type is selected
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Terima kasih! Pesan Anda telah dikirim. Kami akan merespons dalam 24 jam kerja.");
    setFormData({
      name: "",
      email: "",
      phone: "",
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Hubungi <span className="text-blue-400">Kami</span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Punya pertanyaan atau ingin membicarakan proyek Anda? Kami siap membantu Anda.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/50 border-gray-700 p-8">
                  <h2 className="text-3xl font-bold mb-6">Konsultasi Gratis</h2>
                  <p className="text-gray-400 mb-8">
                    Ceritakan proyek Anda dan dapatkan estimasi harga yang sesuai dengan kebutuhan Anda.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nama Lengkap
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <Input
                          id="name"
                          placeholder="Nama Anda"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 focus:border-blue-500 pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@contoh.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Telepon
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+62 812 3456 7890"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="projectType" className="block text-sm font-medium mb-2">
                        Jenis Proyek
                      </Label>
                      <select
                        id="projectType"
                        value={formData.projectType}
                        onChange={handleProjectTypeChange}
                        className="w-full bg-gray-700 border border-gray-600 focus:border-blue-500 rounded-md px-3 py-2 text-gray-200"
                        required
                      >
                        <option value="">Pilih jenis proyek</option>
                        {projectTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="budget" className="block text-sm font-medium mb-2">
                          Estimasi Budget
                        </Label>
                        <select
                          id="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          disabled={formData.projectType !== "custom"}
                          className={`w-full bg-gray-700 border border-gray-600 focus:border-blue-500 rounded-md px-3 py-2 text-gray-200 ${formData.projectType !== "custom" ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <option value="">{formData.projectType === "custom" ? "Pilih estimasi budget" : "Pilih jenis proyek 'Solusi Kustom' dulu"}</option>
                          {budgets.map((budget) => (
                            <option key={budget.id} value={budget.value}>
                              {budget.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="timeline" className="block text-sm font-medium mb-2">
                          Timeline Proyek
                        </Label>
                        <select
                          id="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 border border-gray-600 focus:border-blue-500 rounded-md px-3 py-2 text-gray-200"
                        >
                          <option value="">Pilih timeline</option>
                          {timelines.map((timeline) => (
                            <option key={timeline.id} value={timeline.value}>
                              {timeline.name}
                            </option>
                          ))}
                        </select>
                      </div>
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
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 focus:border-blue-500 pl-10"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg transition-all duration-150 hover:scale-105"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Kirim Konsultasi
                    </Button>
                  </form>
                </Card>
              </motion.div>

              {/* Estimation & Contact Info */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
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
                              {estimation.features.slice(0, 4).map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3"></div>
                                  <span className="text-gray-300">{feature}</span>
                                </li>
                              ))}
                              {estimation.features.length > 4 && (
                                <li className="text-gray-400 text-sm">+ {estimation.features.length - 4} fitur lainnya</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-gray-700/50 rounded-xl p-6">
                          <h4 className="font-semibold mb-3">Catatan:</h4>
                          <p className="text-gray-300 text-sm">
                            Harga di atas adalah estimasi awal. Kami akan memberikan penawaran yang lebih akurat setelah 
                            melakukan konsultasi mendalam dengan Anda untuk memahami kebutuhan proyek secara detail.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="bg-gray-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <Globe className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Pilih Jenis Proyek</h3>
                        <p className="text-gray-400">
                          Pilih jenis proyek di form sebelah kiri untuk melihat estimasi harga yang sesuai
                        </p>
                      </div>
                    )}
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
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
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Lokasi Kami
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="transition-all duration-300"
            >
              <Card className="bg-gray-800/50 border-gray-700 h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Peta Lokasi</h3>
                  <p className="text-gray-400">Jl. Teknologi No. 123, Jakarta Selatan, 12345</p>
                  <Button
                    variant="outline"
                    className="mt-4 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-150 hover:scale-105"
                  >
                    Buka di Google Maps
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Get Started CTA Section */}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}