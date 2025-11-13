"use client";

import OptimizedMotion from "@/components/OptimizedMotion";
import { ServiceItem } from "@/lib/types";
import { ServiceCard } from "./service-card";
import Translate from "@/i18n/Translate";

interface ServicesOverviewProps {
  services: ServiceItem[];
}

export function ServicesOverview({ services }: ServicesOverviewProps) {
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
            <Translate i18nKey="services.title" fallback="Layanan Kami" component="span" />
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            <Translate i18nKey="services.description" fallback="Solusi komprehensif untuk kebutuhan digital Anda" component="span" />
          </p>
        </OptimizedMotion>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}