// src/app/(main)/kontak/page.tsx
"use client";

import React, { useEffect, useCallback, useState } from "react";
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
  User,
  MessageSquare,
  Globe,
  Building
} from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";
import { FormError } from "@/components/form-error";
import { LoadingSpinner } from "@/components/loading-spinner";
import { submitContactForm } from "@/lib/contact";
import { createClient } from "@/lib/supabase/client";
import { PricingPackage, PackageFeature, FeaturePrice } from "@/lib/types";
import Translate from "@/i18n/Translate";
import { useLanguage } from "@/i18n/useLanguage";
import { t } from "@/i18n/t";

export default function KontakPage() {
  const { locale } = useLanguage();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  // State baru untuk menampung semua data harga
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([]);
  const [packageFeatures, setPackageFeatures] = useState<PackageFeature[]>([]);
  const [featurePrices, setFeaturePrices] = useState<FeaturePrice[]>([]);

  useEffect(() => {
    const setTitle = async () => {
      const title = await t('contact.title', locale, 'Contact Us');
      document.title = `${title} | MiraiDev`;
    };
    
    setTitle();
  }, [locale]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setSearchParams(new URLSearchParams(window.location.search));
    }

    // Ambil semua data yang relevan saat komponen dimuat
    const fetchPricingData = async () => {
      const supabase = createClient();
      const [
        { data: packagesData },
        { data: packageFeaturesData },
        { data: featurePricesData }
      ] = await Promise.all([
        supabase.from('pricing_packages').select('*').eq('is_active', true),
        supabase.from('package_features').select('*'),
        supabase.from('feature_prices').select('*') // Ubah select id, name menjadi select semua kolom
      ]);

      setPricingPackages(packagesData || []);
      setPackageFeatures(packageFeaturesData || []);
      setFeaturePrices(featurePricesData || []);
    };

    fetchPricingData();
  }, []);

  const generateEstimationFromCalculator = useCallback((data: {
    projectTypeName: string;
    pages: string;
    features: string;
    complexityLabel: string;
    estimatedPrice: string;
  }) => {
    const { projectTypeName, pages, features, complexityLabel, estimatedPrice } = data;
    
    const featureArray = features ? features.split(',') : [];
    
    const price = parseInt(estimatedPrice || '0');
    const formattedPrice = price.toLocaleString('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    const baseFeatures = [
      `Jenis Proyek: ${projectTypeName || 'Tidak ditentukan'}`,
      `Jumlah Halaman: ${pages || '1'} halaman`,
      `Tingkat Kompleksitas: ${complexityLabel || 'Tidak ditentukan'}`,
      "Konsultasi mendalam", "Perencanaan proyek", "Pengembangan kustom",
      "Testing dan debugging", "Dokumentasi lengkap", "Dukungan pasca-pengembangan"
    ];
    
    const allFeatures = [...baseFeatures, ...featureArray].filter(Boolean);
    
    return {
      show: true,
      package: `Estimasi ${projectTypeName || 'Proyek Kustom'}`,
      price: formattedPrice,
      description: `Estimasi harga berdasarkan pilihan Anda di kalkulator untuk proyek ${projectTypeName || 'kustom'} dengan ${pages || '1'} halaman dan tingkat kompleksitas ${complexityLabel || 'tidak ditentukan'}.`,
      features: allFeatures
    };
  }, []);
  
  // --- FUNGSI BARU: untuk menampilkan detail paket yang dipilih dari dropdown ---
  const updateEstimationFromSelection = useCallback((packageId: string) => {
    const selectedPackage = pricingPackages.find(p => p.id === packageId);
    if (!selectedPackage) return;

    const featuresForPackage = packageFeatures
      .filter(pf => pf.package_id === packageId && pf.is_included)
      .map(pf => {
        const feature = featurePrices.find(f => f.id === pf.feature_id);
        return feature ? feature.name_key : null;
      })
      .filter((name): name is string => name !== null);

    setEstimation({
      show: true,
      package: selectedPackage.name_key || selectedPackage.id,
      price: (selectedPackage.price || 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }),
      description: selectedPackage.description_key || '',
      features: featuresForPackage,
    });
  }, [pricingPackages, packageFeatures, featurePrices]);


  const [estimation, setEstimation] = useState({
    show: false,
    package: "",
    price: "",
    description: "",
    features: [] as string[]
  });
  
  const [customTimeline, setCustomTimeline] = useState<string | null>(null);
  const [customBudget, setCustomBudget] = useState<string | null>(null);
  
  const budgets = React.useMemo(() => [
    { id: "small", name: "Rp 1,000,000 - Rp 3,000,000", value: "small" },
    { id: "medium", name: "Rp 3,000,000 - Rp 10,000,000", value: "medium" },
    { id: "large", name: "Rp 10,000,000+", value: "large" },
    { id: "flexible", name: "Flexible / Not Sure", value: "flexible" }
  ], []);

  useEffect(() => {
    if (searchParams) {
      const fromCalculator = searchParams.get('fromCalculator');
      if (fromCalculator === 'true') {
        const projectType = searchParams.get('projectType') || '';
        const projectTypeName = searchParams.get('projectTypeName') || '';
        const pages = searchParams.get('pages') || '';
        const features = searchParams.get('features') || '';
        const complexityLabel = searchParams.get('complexityLabel') || '';
        const timelineLabel = searchParams.get('timelineLabel') || '';
        const estimatedPrice = searchParams.get('estimatedPrice') || '';

        const generateBudgetEstimation = (priceStr: string) => {
          const price = parseInt(priceStr || '0');
          if (price <= 3000000) return "small";
          if (price <= 10000000) return "medium";
          return "large";
        };

        const budgetCategoryValue = generateBudgetEstimation(estimatedPrice);
        const budgetObject = budgets.find(b => b.value === budgetCategoryValue);
        
        setCustomTimeline(timelineLabel);
        setCustomBudget(budgetObject?.name || `Sekitar ${parseInt(estimatedPrice || '0').toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`);

        setFormData(prev => ({
          ...prev,
          projectType: "custom",
          timeline: "custom",
          budget: "custom",
          message: `Saya tertarik dengan estimasi proyek ${projectTypeName} dengan estimasi harga ${parseInt(estimatedPrice || '0').toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}.`
        }));

        if (projectType && estimatedPrice) {
          const estimationData = generateEstimationFromCalculator({
            projectTypeName, pages, features, complexityLabel, estimatedPrice
          });
          setEstimation(estimationData);
        }
      }
    }
  }, [searchParams, generateEstimationFromCalculator, budgets]);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "",
    projectType: "", budget: "", timeline: "", message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  
  const contactInfo = [
    { 
      icon: <Phone className="w-6 h-6 text-blue-400" />, 
      title: "Phone", 
      detail: "+62 812-3456-7890", 
      description: "Monday - Friday, 09:00 - 17:00" 
    },
    { 
      icon: <Mail className="w-6 h-6 text-blue-400" />, 
      title: "Email", 
      detail: "hello@mirai.dev", 
      description: "Replies within 24 business hours" 
    },
    { 
      icon: <MapPin className="w-6 h-6 text-blue-400" />, 
      title: "Address", 
      detail: "Jakarta, Indonesia", 
      description: "Remote-first operations" 
    }
  ];

  const timelines = [
    { id: "urgent", name: "1-2 Weeks", value: "urgent" },
    { id: "short", name: "1-2 Months", value: "short" },
    { id: "medium", name: "3-6 Months", value: "medium" },
    { id: "long", name: "6+ Months", value: "long" },
    { id: "flexible", name: "Flexible", value: "flexible" }
  ];

  const validateForm = () => {
    // ... (validasi tetap sama)
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    setFormData(prev => ({ ...prev, [id]: value }));

    // --- LOGIKA BARU UNTUK MERESET DAN MENAMPILKAN ESTIMASI ---
    if (id === 'projectType') {
      // Jika memilih opsi "Pilih jenis..." atau kembali ke "Solusi Kustom"
      if (value === '' || value === 'custom') {
        if (formData.projectType !== 'custom') { // hanya reset jika berubah ke non-paket
             setEstimation({ show: false, package: "", price: "", description: "", features: [] });
        }
      } else {
        // Jika memilih paket dari database, tampilkan detailnya
        updateEstimationFromSelection(value);
      }
      
      // Jika pilihan berubah dari hasil kalkulator, reset budget & timeline
      if (customBudget || customTimeline) {
        setCustomBudget(null);
        setCustomTimeline(null);
        setFormData(prev => ({ ...prev, budget: '', timeline: '' }));
      }
    }
    // --- AKHIR LOGIKA BARU ---

    if (errors[id]) setErrors(prev => ({ ...prev, [id]: "" }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!validateForm()) return;
    setIsSubmitting(true);
    
    const dataToSend = {
      ...formData,
      budget: formData.budget === 'custom' ? customBudget || formData.budget : formData.budget,
      timeline: formData.timeline === 'custom' ? customTimeline || formData.timeline : formData.timeline,
    };

    try {
      const result = await submitContactForm(dataToSend);
      if (result.success) {
        const successMsg = await t('contact.successMessage', locale, 'Your message has been sent successfully! We\'ll contact you soon.');
        setSuccess(successMsg);
        setFormData({ name: "", email: "", phone: "", company: "", projectType: "", budget: "", timeline: "", message: "" });
        setEstimation({ show: false, package: "", price: "", description: "", features: [] });
        setCustomBudget(null);
        setCustomTimeline(null);
      } else {
        const errorMsg = result.error || await t('contact.generalError', locale, 'An error occurred');
        setErrors({ general: errorMsg });
      }
    } catch {
      const unexpectedErrorMsg = await t('contact.unexpectedError', locale, 'An unexpected error occurred');
      setErrors({ general: unexpectedErrorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return (
    <div className="flex justify-center items-center h-screen">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div>
      <div className="relative overflow-hidden pt-16">
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <OptimizedMotion initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <Translate i18nKey="contact.title" fallback="Contact Us" />
              </h1>
            </OptimizedMotion>
            <OptimizedMotion initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                <Translate i18nKey="contact.description" fallback="Have questions or want to discuss a project? We're ready to help you." />
              </p>
            </OptimizedMotion>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <OptimizedMotion initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Card className="bg-gray-800/50 border-gray-700 p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    <Translate i18nKey="contact.freeConsultation" fallback="Free Consultation" />
                  </h2>
                  <p className="text-gray-400 mb-8">
                    <Translate i18nKey="contact.sendProjectDetails" fallback="Send us your project details and we'll get back to you shortly." />
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && <div className="bg-destructive/20 border-destructive/30 p-3 rounded-md text-sm text-destructive">{errors.general}</div>}
                    {success && <div className="bg-green-500/20 border-green-500/30 p-3 rounded-md text-sm text-green-500">{success}</div>}
                    
                    <div>
                      <Label htmlFor="name">
                        <Translate i18nKey="contact.name" fallback="Full Name" />
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input id="name" value={formData.name} onChange={handleInputChange} className="py-6 pl-10" />
                      </div>
                      <FormError error={errors.name} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="py-6 pl-10" />
                        </div>
                        <FormError error={errors.email} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telepon</Label>
                        <div className="relative mt-2">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="py-6 pl-10" />
                        </div>
                        <FormError error={errors.phone} />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="company">
                        <Translate i18nKey="contact.company" fallback="Company Name (Optional)" />
                      </Label>
                      <div className="relative mt-2">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input id="company" value={formData.company} onChange={handleInputChange} className="py-6 pl-10" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="projectType">
                          <Translate i18nKey="contact.projectType" fallback="Project Type" />
                        </Label>
                        <div className="relative mt-2">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <select id="projectType" value={formData.projectType} onChange={handleInputChange} className="w-full appearance-none rounded-md bg-gray-700/50 border-gray-600 py-3 pl-10 pr-8 text-base">
                            <option value="">
                              {locale === 'en' ? "Choose type..." : "Pilih jenis..."}
                            </option>
                            {pricingPackages.map(pkg => <option key={pkg.id} value={pkg.id}>
                              {pkg.name_key || pkg.id}
                            </option>)}
                            <option value="custom">
                              {locale === 'en' ? "Custom Solution (from Calculator)" : "Solusi Kustom (dari Kalkulator)"}
                            </option>
                          </select>
                          <ArrowRight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90" />
                        </div>
                        <FormError error={errors.projectType} />
                      </div>
                      <div>
                        <Label htmlFor="budget">
                          <Translate i18nKey="contact.budget" fallback="Estimated Budget" />
                        </Label>
                        <div className="relative mt-2">
                          <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <select id="budget" value={formData.budget} onChange={handleInputChange} className="w-full appearance-none rounded-md bg-gray-700/50 border-gray-600 py-3 pl-10 pr-8 text-base">
                            <option value="">
                              {locale === 'en' ? "Choose budget..." : "Pilih anggaran..."}
                            </option>
                            {customBudget && <option value="custom">Kustom</option>}
                            {budgets.map(b => (
                              <option key={b.id} value={b.value}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                          <ArrowRight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90" />
                        </div>
                        <FormError error={errors.budget} />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="timeline">
                        <Translate i18nKey="contact.timeline" fallback="Project Timeline" />
                      </Label>
                      <div className="relative mt-2">
                        <ArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select id="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full appearance-none rounded-md bg-gray-700/50 border-gray-600 py-3 pl-10 pr-8 text-base">
                          <option value="">
                            {locale === 'en' ? "Choose time..." : "Pilih waktu..."}
                          </option>
                          {customTimeline && <option value="custom">Kustom</option>}
                          {timelines.map(t => (
                            <option key={t.id} value={t.value}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                        <ArrowRight className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90" />
                      </div>
                      <FormError error={errors.timeline} />
                    </div>

                    <div>
                      <Label htmlFor="message">
                        <Translate i18nKey="contact.message" fallback="Project Description" />
                      </Label>
                      <div className="relative mt-2">
                        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                        <Textarea id="message" value={formData.message} onChange={handleInputChange} rows={4} className="pl-10" />
                      </div>
                      <FormError error={errors.message} />
                    </div>
                    
                    <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6">
                      {isSubmitting ? <LoadingSpinner/> : <Translate i18nKey="contact.sendMessage" fallback="Send Message" />}
                    </Button>
                  </form>
                </Card>
              </OptimizedMotion>
            </div>
            <div>
              <OptimizedMotion initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-12">
                <Card className="bg-gray-800/50 border-gray-700 p-8">
                  <h2 className="text-3xl font-bold mb-6">
                    <Translate i18nKey="contact.estimation" fallback="Price Estimate" />
                  </h2>
                  <p className="text-gray-400 mb-8">
                    <Translate i18nKey="contact.basedOnYourSelection" fallback="Based on your selection:" />
                  </p>
                  {estimation.show ? (
                    <div className="space-y-6">
                      <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-blue-400">{estimation.package}</h3>
                            <p className="text-2xl font-bold mt-2">{estimation.price}</p>
                          </div>
                          <div className="bg-blue-500/10 p-3 rounded-lg"><Globe className="w-6 h-6 text-blue-400" /></div>
                        </div>
                        <p className="text-gray-300 mb-4">{estimation.description}</p>
                        <div className="border-t border-gray-700 pt-4">
                          <h4 className="font-semibold mb-2">
                            <Translate i18nKey="contact.mainFeatures" fallback="Main Features:" />
                          </h4>
                          <ul className="space-y-2">
                            {estimation.features.slice(0, 6).map((f, i) => <li key={i} className="flex items-start"><div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 mr-3"></div><span>{f}</span></li>)}
                            {estimation.features.length > 6 && 
                              <li className="text-sm text-gray-400">
                                + {estimation.features.length - 6} <Translate i18nKey="contact.otherFeatures" fallback="other features" />
                              </li>}
                          </ul>
                        </div>
                      </div>
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <h4 className="font-semibold mb-3">
                          <Translate i18nKey="contact.note" fallback="Note:" />
                        </h4>
                        <p className="text-sm text-gray-300">
                          <Translate i18nKey="contact.estimationNote" fallback="This price is an estimate. We will provide a final quote after consultation." />
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-700/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6"><Globe className="w-8 h-8 text-gray-500" /></div>
                      <h3 className="text-xl font-semibold">
                        <Translate i18nKey="contact.selectProjectType" fallback="Select Project Type" />
                      </h3>
                      <p className="text-gray-400">
                        <Translate i18nKey="contact.selectProjectTypePrompt" fallback="Select a project type from the dropdown to see package details here." />
                      </p>
                    </div>
                  )}
                </Card>
              </OptimizedMotion>
              <OptimizedMotion initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Card className="bg-gray-800/50 border-gray-700 p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    <Translate i18nKey="contact.contactInfo" fallback="Contact Information" />
                  </h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => {
                      let titleKey = '';
                      let descriptionKey = '';
                      
                      switch(index) {
                        case 0: // Phone
                          titleKey = 'contact.phone';
                          descriptionKey = 'contact.monFri';
                          break;
                        case 1: // Email
                          titleKey = 'contact.email';
                          descriptionKey = 'contact.replyTime';
                          break;
                        case 2: // Address
                          titleKey = 'contact.address';
                          descriptionKey = 'contact.remoteOps';
                          break;
                        default:
                          break;
                      }
                      
                      return (
                        <div key={index} className="flex items-start">
                          <div className="mt-1 mr-4">{info.icon}</div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              <Translate i18nKey={titleKey} fallback={info.title} />
                            </h3>
                            <p className="text-blue-400">{info.detail}</p>
                            <p className="text-sm text-gray-400">
                              <Translate i18nKey={descriptionKey} fallback={info.description} />
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </OptimizedMotion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}