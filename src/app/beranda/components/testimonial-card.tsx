"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <OptimizedMotion
      key={index}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="bg-gray-800/50 border-gray-700 p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-4">
            <span className="text-lg font-bold">{testimonial.name.charAt(0)}</span>
          </div>
          <div>
            <h4 className="font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-gray-400">{testimonial.role}</p>
          </div>
        </div>
        <p className="text-gray-300 italic">"{testimonial.content}"</p>
        <div className="flex mt-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
        </div>
      </Card>
    </OptimizedMotion>
  );
}