"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";
import { PortfolioItem } from "@/lib/types";

interface PortfolioCardProps {
  item: PortfolioItem;
  index: number;
}

export function PortfolioCard({ item, index }: PortfolioCardProps) {
  return (
    <OptimizedMotion
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="transition-all duration-200"
    >
      <Card className="bg-gray-800/50 border-gray-700 overflow-hidden group h-full cursor-pointer">
        <Link href={`/portofolio/${item.id}`} className="block h-full">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : "/placeholder-portfolio.jpg"}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80"></div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-blue-600 text-xs px-2 py-1 rounded">{item.category}</span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-400 mb-4 line-clamp-2">{item.description}</p>
            <button className="text-blue-400 hover:text-blue-300 flex items-center text-sm font-medium">
              Lihat Detail
              <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>
        </Link>
      </Card>
    </OptimizedMotion>
  );
}