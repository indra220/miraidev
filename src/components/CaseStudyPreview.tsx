"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Calendar } from "lucide-react";

interface CaseStudy {
  id: number;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  result: string;
  imageUrl: string;
  metrics: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
}

export default function CaseStudyPreview() {
  const caseStudy: CaseStudy = {
    id: 1,
    title: "Transformasi Digital E-Commerce Fashion",
    client: "Fashionista Store",
    industry: "Retail Fashion",
    challenge: "Sebagai pemain lama di industri fashion retail, Fashionista Store menghadapi tantangan penurunan traffic website dan konversi yang rendah akibat UI/UX yang tidak optimal serta kurangnya integrasi sistem.",
    solution: "Kami melakukan redesign komprehensif website dengan pendekatan mobile-first, mengimplementasikan sistem rekomendasi AI berbasis riwayat pembelian, dan mengintegrasikan payment gateway modern serta sistem loyalty program.",
    result: "Dalam waktu 6 bulan setelah launching, Fashionista Store mencatat peningkatan 180% dalam traffic organic, 125% peningkatan konversi, dan 95% peningkatan customer retention.",
    imageUrl: "/case-study-fashionista.jpg",
    metrics: [
      {
        label: "Peningkatan Traffic",
        value: "+180%",
        icon: <TrendingUp className="w-5 h-5" />
      },
      {
        label: "Peningkatan Konversi",
        value: "+125%",
        icon: <Users className="w-5 h-5" />
      },
      {
        label: "Customer Retention",
        value: "+95%",
        icon: <Calendar className="w-5 h-5" />
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="transition-all duration-300"
    >
      <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 h-64 md:h-auto bg-gray-700 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">FS</span>
                </div>
                <p className="text-gray-400">Fashionista Store</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 p-8">
            <div className="mb-4">
              <span className="inline-block bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full mb-2">
                {caseStudy.industry}
              </span>
              <h3 className="text-2xl font-bold mb-2">{caseStudy.title}</h3>
              <p className="text-gray-400 mb-4">{caseStudy.client}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-gray-300">Tantangan</h4>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {caseStudy.challenge}
              </p>
              
              <h4 className="font-semibold mb-2 text-gray-300">Solusi</h4>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {caseStudy.solution}
              </p>
              
              <h4 className="font-semibold mb-2 text-gray-300">Hasil</h4>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {caseStudy.result}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {caseStudy.metrics.map((metric, index) => (
                <div key={index} className="text-center p-3 bg-gray-700/50 rounded-lg">
                  <div className="text-blue-400 mb-1 flex justify-center">
                    {metric.icon}
                  </div>
                  <div className="text-lg font-bold text-white">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-400">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105"
            >
              Lihat Studi Kasus Lengkap
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}