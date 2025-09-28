"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import OptimizedMotion from "@/components/OptimizedMotion";
import { ServiceDetails } from "@/lib/types";
import { 
  Globe, 
  Palette, 
  Rocket, 
  Shield 
} from "lucide-react";

interface ServiceCardProps {
  service: ServiceDetails;
  index: number;
}

const getIconForService = (iconName: string | null | undefined) => {
  switch(iconName) {
    case "Globe": return <Globe className="w-8 h-8" />;
    case "Palette": return <Palette className="w-8 h-8" />;
    case "Rocket": return <Rocket className="w-8 h-8" />;
    case "Shield": return <Shield className="w-8 h-8" />;
    default: return <Globe className="w-8 h-8" />;
  }
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <OptimizedMotion
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="transition-all duration-200"
    >
      <Card className="bg-gray-800/50 border-gray-700 p-6 hover:border-blue-500 transition-all duration-200 h-full cursor-pointer">
        <Link href="/layanan" className="block h-full">
          <div className="text-blue-400 mb-4">
            {getIconForService(service.icon)}
          </div>
          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
          <p className="text-gray-400">{service.description}</p>
        </Link>
      </Card>
    </OptimizedMotion>
  );
}