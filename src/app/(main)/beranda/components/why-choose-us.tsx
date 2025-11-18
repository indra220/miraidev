"use client";

import OptimizedMotion from "@/components/OptimizedMotion";
import {
  Zap,
  Shield,
  Database
} from "lucide-react";
import Translate from "@/i18n/Translate";

export function WhyChooseUsSection() {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "home.whyChooseUs.features.technology.title",
      description: "home.whyChooseUs.features.technology.description",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "home.whyChooseUs.features.transparency.title",
      description: "home.whyChooseUs.features.transparency.description",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "home.whyChooseUs.features.support.title",
      description: "home.whyChooseUs.features.support.description",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400"
    }
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <OptimizedMotion 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <Translate i18nKey="home.whyChooseUs.title" fallback="Mengapa Memilih Kami?" component="span" />
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            <Translate
              i18nKey="home.whyChooseUs.description"
              fallback="Alasan mengapa klien memilih MiraiDev sebagai mitra pengembangan digital mereka"
              component="span"
            />
          </p>
        </OptimizedMotion>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <OptimizedMotion 
              key={index}
              className="text-center p-6 transition-all duration-200"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <div className={feature.textColor}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                <Translate i18nKey={feature.title} fallback="" />
              </h3>
              <p className="text-gray-400">
                <Translate i18nKey={feature.description} fallback="" />
              </p>
            </OptimizedMotion>
          ))}
        </div>
      </div>
    </div>
  );
}