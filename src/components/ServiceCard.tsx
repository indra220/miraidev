"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  index: number;
}

export default function ServiceCard({ icon, title, description, features, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <Card className="bg-gray-800/50 border-gray-700 p-6 hover:border-blue-500 transition-all duration-300 h-full group">
        <div className="mb-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 mb-5 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
        
        <ul className="space-y-2 mb-6">
          {features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          variant="outline" 
          className="w-full border-gray-600 text-gray-300 group-hover:border-blue-500 group-hover:text-blue-400 transition-all duration-300"
        >
          Pelajari Lebih Lanjut
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </Card>
    </motion.div>
  );
}