"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";
import { PortfolioItem } from "@/lib/types";
import { PortfolioCard } from "./portfolio-card";
import Translate from "@/i18n/Translate";

interface FeaturedPortfolioProps {
  portfolio: PortfolioItem[];
}

export function FeaturedPortfolio({ portfolio }: FeaturedPortfolioProps) {
  return (
    <div className="py-20 bg-gray-800/30">
      <div className="container mx-auto px-4">
        <OptimizedMotion 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <Translate i18nKey="home.featuredPortfolio.title" fallback="Portofolio Unggulan" component="span" />
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            <Translate
              i18nKey="home.featuredPortfolio.description"
              fallback="Proyek-proyek terbaik kami yang telah membantu klien mencapai kesuksesan"
              component="span"
            />
          </p>
        </OptimizedMotion>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolio.map((item, index) => (
            <PortfolioCard key={item.id} item={item} index={index} />
          ))}
        </div>
        
        <OptimizedMotion 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <Button asChild size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-150">
            <Link href="/template">
              <Translate i18nKey="home.featuredPortfolio.viewAll" fallback="Lihat Semua Portofolio" />
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </OptimizedMotion>
      </div>
    </div>
  );
}