"use client";

import React, { useEffect } from "react";
import DynamicPriceCalculator from "@/components/DynamicPriceCalculator";
import OptimizedMotion from "@/components/OptimizedMotion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Translate from "@/i18n/Translate";
import { useLanguage } from "@/i18n/useLanguage";
import { t } from "@/i18n/t";

export default function PricingPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const setTitle = async () => {
      const title = await t('common.pricing', locale, 'Pricing');
      document.title = `${title} | MiraiDev`;
    };

    setTitle();
  }, [locale]);

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
                <Translate i18nKey="pricing.title" fallback="Price <span class='text-blue-400'>Estimation</span>" component="div" params={{locale}} />
              </h1>
            </OptimizedMotion>
            <OptimizedMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                <Translate i18nKey="pricing.description" fallback="Get real-time project price estimation based on your specific needs" />
              </p>
            </OptimizedMotion>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <DynamicPriceCalculator />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <OptimizedMotion
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <Translate i18nKey="pricing.cta.title" fallback="Ready to Start Your Project?" />
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                <Translate i18nKey="pricing.cta.description" fallback="After getting the price estimate, consult with our team for a more accurate quote" />
              </p>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105"
                onClick={() => router.push('/kontak')}
              >
                <Translate i18nKey="pricing.cta.button" fallback="Consult Now" />
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </OptimizedMotion>
          </div>
        </div>
      </div>
    </div>
  );
}