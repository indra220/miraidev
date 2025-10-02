"use client";

import OptimizedMotion from "@/components/OptimizedMotion";
import { ServiceItem } from "@/lib/types";
import { ServiceCard } from "./service-card";

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Layanan Kami</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Solusi komprehensif untuk kebutuhan digital Anda
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